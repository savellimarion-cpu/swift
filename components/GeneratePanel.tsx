"use client";

import { useActionState, useState } from "react";
import { generateDeliverableAction, type GenerateFormState } from "@/app/actions/deliverables";
import { AGENTS, ACCENT_BORDER, type AgentType } from "@/lib/agents";
import { CONTENT_FORMATS } from "@/lib/agents/createur-contenu";
import { DECK_STRUCTURES } from "@/lib/agents/presentateur";
import SubmitButton from "@/components/SubmitButton";

const initialState: GenerateFormState = {};

export default function GeneratePanel({ clientId }: { clientId: string }) {
  const [agent, setAgent] = useState<AgentType>("strategiste");
  const [state, formAction] = useActionState(generateDeliverableAction, initialState);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {AGENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAgent(a.id)}
            className={`text-sm rounded-sm border px-3 py-1.5 transition-colors ${
              agent === a.id
                ? `bg-ink text-paper border-ink`
                : `bg-white text-ink/70 border-line hover:${ACCENT_BORDER[a.accent]}`
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="agent" value={agent} />

        {agent === "manager" && (
          <div>
            <p className="text-sm text-ink/50 mb-2">
              Noé fait le point sur les 8 derniers livrables de l&apos;équipe
              (tous agents confondus) et propose des priorités.
            </p>
            <label className="block text-sm font-medium mb-1" htmlFor="demande">
              Demande (optionnel)
            </label>
            <textarea
              id="demande"
              name="demande"
              rows={2}
              placeholder="Laisse vide pour un point d'équipe général"
              className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
            />
          </div>
        )}

        {agent === "strategiste" && (
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="objectif">
              Objectif de la campagne
            </label>
            <textarea
              id="objectif"
              name="objectif"
              rows={2}
              required
              placeholder="ex. Remplir le pipeline de rendez-vous découverte pour la saison printemps"
              className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
            />
          </div>
        )}

        {agent === "createur-contenu" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="format">
                Format
              </label>
              <select
                id="format"
                name="format"
                required
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
              >
                {CONTENT_FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="angle">
                Angle (optionnel)
              </label>
              <input
                id="angle"
                name="angle"
                type="text"
                placeholder="Laisse vide pour utiliser l'angle du brief le plus récent"
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
              />
            </div>
          </>
        )}

        {agent === "designer" && (
          <div>
            <p className="text-sm text-ink/50 mb-2">
              Romy génère directement un visuel prêt à poster (image), en
              s&apos;appuyant sur le brief et la pièce de contenu les plus
              récents de ce client.
            </p>
            <label className="block text-sm font-medium mb-1" htmlFor="instruction">
              Précisions (optionnel)
            </label>
            <textarea
              id="instruction"
              name="instruction"
              rows={2}
              placeholder="Laisse vide pour laisser Romy choisir d'après le contenu le plus récent"
              className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
            />
          </div>
        )}

        {agent === "analyste" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="periode">
                Période analysée
              </label>
              <input
                id="periode"
                name="periode"
                type="text"
                required
                placeholder="ex. 2026-06"
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="donnees">
                Données (colle tes chiffres bruts)
              </label>
              <textarea
                id="donnees"
                name="donnees"
                rows={4}
                placeholder={"ex.\nInstagram — taux d'engagement : 3,5%\nInstagram — saves/post : 52\nLinkedIn — pas encore publié"}
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-turquoise/40"
              />
              <p className="text-xs text-ink/40 mt-1">
                Laisse vide les métriques que tu n&apos;as pas — l&apos;Analyste
                écrira &quot;donnée manquante&quot; plutôt que d&apos;inventer.
              </p>
            </div>
          </>
        )}

        {agent === "presentateur" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="sujet">
                Sujet du deck
              </label>
              <input
                id="sujet"
                name="sujet"
                type="text"
                required
                placeholder="ex. Restitution campagne lancement printemps"
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="structure">
                Structure
              </label>
              <select
                id="structure"
                name="structure"
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
              >
                {DECK_STRUCTURES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-ink/40">
              Le Présentateur s&apos;appuie automatiquement sur le brief, le
              rapport analytics, les pièces de contenu et le pack visuel les
              plus récents de ce client.
            </p>
          </>
        )}

        {state.error && <p className="text-sm text-clay">{state.error}</p>}

        <SubmitButton pendingLabel="Génération en cours… (jusqu'à une minute)">
          Générer
        </SubmitButton>
      </form>
    </div>
  );
}
