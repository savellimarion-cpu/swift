import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const clients = await prisma.client.findMany({
    where: { accountId: user.accountId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="min-h-screen flex">
      <Sidebar accountName={user.account.name} clients={clients} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
