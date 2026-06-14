"use client";

import { useActionState } from "react";
import type { Client } from "@prisma/client";
import { updateClientProfileAction, type ClientFormState } from "@/app/actions/clients";
import SubmitButton from "@/components/SubmitButton";

const initialState: ClientFormState = {};

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  locked,
}: {
  name: string;
  label: string;
  defaultValue: string | null;
  placeholder: string;
  locked?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={name}>
        {label} {locked && <span title="Règle bloquante pour les agents">🔒</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
      />
    </div>
  );
}

export default function ClientProfileForm({ client }: { client: Client }) {
  const [state, formAction] = useActionState(updateClientProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="clientId" value={client.id} />

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink/40 mb-2">
          Marque
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            name="brandTone"
            label="Ton de marque"
            defaultValue={client.brandTone}
            placeholder="ex. Vouvoiement, registre chaleureux mais professionnel, jamais luxe inaccessible…"
          />
          <Field
            name="brandVisual"
            label="Identité visuelle"
            defaultValue={client.brandVisual}
            placeholder="ex. Palette beige/sauge, typo serif pour les titres, logo obligatoire en bas à droite…"
            locked
          />
          <Field
            name="brandForbidden"
            label="Vocabulaire / éléments interdits"
            defaultValue={client.brandForbidden}
            placeholder="ex. 'pas cher', emojis dans les titres, jargon marketing…"
            locked
          />
          <Field
            name="brandPreferred"
            label="Vocabulaire à privilégier"
            defaultValue={client.brandPreferred}
            placeholder="ex. toujours écrire le nom de marque en toutes lettres…"
          />
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink/40 mb-2">
          ICP
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            name="icpProfile"
            label="Profil & job to be done"
            defaultValue={client.icpProfile}
            placeholder="ex. Qui est cette personne, qu'est-ce qu'elle essaie d'accomplir ?"
          />
          <Field
            name="icpPains"
            label="Douleurs"
            defaultValue={client.icpPains}
            placeholder="ex. Paralysie devant trop de choix, peur de se tromper…"
          />
          <Field
            name="icpObjections"
            label="Objections fréquentes"
            defaultValue={client.icpObjections}
            placeholder="ex. 'C'est pour les gens qui ont un budget illimité.'"
          />
        </div>
      </div>

      <div>
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-ink/40 mb-2">
          Historique
        </h3>
        <Field
          name="historique"
          label="Campagnes passées, baseline, préférences"
          defaultValue={client.historique}
          placeholder="ex. Campagne de mars : carrousels avant/après, bons saves mais peu de commentaires. Baseline Instagram : 3,2% d'engagement…"
        />
      </div>

      {state.error && <p className="text-sm text-clay">{state.error}</p>}

      <SubmitButton pendingLabel="Enregistrement…">Enregistrer le profil</SubmitButton>
    </form>
  );
}
