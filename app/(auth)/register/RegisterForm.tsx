"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthFormState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";

const initialState: AuthFormState = {};

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="accountName">
          Nom de votre activité *
        </label>
        <input
          id="accountName"
          name="accountName"
          type="text"
          required
          placeholder="ex. Studio Lumen, Agence Atlas…"
          className="w-full border border-line rounded-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ochre/40"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Votre nom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full border border-line rounded-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ochre/40"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-line rounded-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ochre/40"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Mot de passe * <span className="text-ink/40">(8 caractères min.)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full border border-line rounded-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ochre/40"
        />
      </div>

      {state.error && <p className="text-sm text-clay">{state.error}</p>}

      <SubmitButton pendingLabel="Création…" className="w-full">
        Créer mon espace
      </SubmitButton>

      <p className="text-sm text-ink/50 text-center">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-ochre hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
