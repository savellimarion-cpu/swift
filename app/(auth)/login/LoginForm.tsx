"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthFormState } from "@/app/actions/auth";
import SubmitButton from "@/components/SubmitButton";

const initialState: AuthFormState = {};

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
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
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full border border-line rounded-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ochre/40"
        />
      </div>

      {state.error && <p className="text-sm text-clay">{state.error}</p>}

      <SubmitButton pendingLabel="Connexion…" className="w-full">
        Se connecter
      </SubmitButton>

      <p className="text-sm text-ink/50 text-center">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-ochre hover:underline">
          Créer un espace
        </Link>
      </p>
    </form>
  );
}
