import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const SESSION_COOKIE = "session";
const SESSION_DURATION_DAYS = 30;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Crée une session en base et pose le cookie httpOnly correspondant. */
export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({
    data: { userId, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

/** Supprime la session courante (DB + cookie). */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** Récupère l'utilisateur connecté (avec son Account) ou `null`. */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: { include: { account: true } } },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}

/** Génère un token opaque (ex: pour les liens de portail client). */
export function generateToken(): string {
  return randomBytes(24).toString("hex");
}

/** Redirige vers /login si non connecté ; renvoie l'utilisateur sinon. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Vérifie que le client appartient bien à l'Account de l'utilisateur
 * connecté. 404 sinon (on ne distingue pas "inexistant" de "pas le tien").
 */
export async function requireClient(clientId: string) {
  const user = await requireUser();
  const client = await prisma.client.findFirst({
    where: { id: clientId, accountId: user.accountId },
  });
  if (!client) notFound();
  return { user, client };
}
