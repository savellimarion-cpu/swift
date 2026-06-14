"use client";

import { useActionState } from "react";
import { createClientAction, type ClientFormState } from "@/app/actions/clients";
import SubmitButton from "@/components/SubmitButton";

const initialState: ClientFormState = {};

export default function NewClientForm() {
  const [state, formAction] = useActionState(createClientAction, initialState);

  return (
    <form action={formAction} className="flex flex-col sm:flex-row gap-3 sm:items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Nom du client
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="ex. Studio Lumen"
          className="w-full border border-line rounded-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ochre/40"
        />
      </div>
      <SubmitButton pendingLabel="Création…">Ajouter le client</SubmitButton>
      {state.error && <p className="text-sm text-clay sm:ml-2">{state.error}</p>}
    </form>
  );
}
