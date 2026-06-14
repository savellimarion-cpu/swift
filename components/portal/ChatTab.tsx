"use client";

import type { CSSProperties } from "react";
import { useActionState, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { sendAgentMessageAction, type PortalChatState } from "@/app/actions/portal";
import { ACCENT_BG, ACCENT_SOFT_BG, ACCENT_TEXT, ACCENT_RING, getAgentMeta, type AgentType } from "@/lib/agents";
import SubmitButton from "@/components/SubmitButton";

const initialState: PortalChatState = {};

export default function ChatTab({
  token,
  agentId,
  quota,
}: {
  token: string;
  agentId: AgentType;
  quota?: { used: number; limit: number };
}) {
  const agent = getAgentMeta(agentId);
  const [state, formAction] = useActionState(sendAgentMessageAction, initialState);
  const [message, setMessage] = useState("");

  if (!agent) return null;

  const quotaReached = quota ? quota.used >= quota.limit : false;

  return (
    <div>
      {quota && (
        <div
          className={`mb-4 rounded-sm border p-3 text-xs font-mono ${
            quotaReached ? "border-clay/40 bg-clay/5" : "border-line bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={quotaReached ? "text-clay" : "text-ink/50"}>
              {quotaReached ? "Quota mensuel atteint" : "Crédits ce mois-ci"}
            </span>
            <span className={quotaReached ? "text-clay" : "text-ink/40"}>
              {quota.used} / {quota.limit}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-line overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                quotaReached ? "bg-clay" : ACCENT_BG[agent.accent]
              }`}
              style={{ width: `${Math.min(100, (quota.used / quota.limit) * 100)}%` }}
            />
          </div>
          {quotaReached && (
            <p className="mt-1.5 text-clay">Réinitialisation au début du mois prochain.</p>
          )}
        </div>
      )}

      <div className="bg-white border border-line rounded-sm p-8 mb-4 flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 animate-ring-pulse ${ACCENT_SOFT_BG[agent.accent]}`}
          style={{ "--ring-color": ACCENT_RING[agent.accent] } as CSSProperties}
        >
          <Sparkles size={22} className={ACCENT_TEXT[agent.accent]} aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-ink mb-2">Démarrer une conversation</h2>
        <p className="text-sm text-ink/60 max-w-md mb-5 leading-relaxed">
          {agent.name} connaît votre profil de marque et vos derniers livrables. Décrivez ce
          que vous voulez, ou choisissez un point de départ.
        </p>
        <div className="flex flex-col gap-2 w-full max-w-md">
          {agent.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setMessage(s)}
              className="text-sm text-left border border-line rounded-sm px-3 py-2 bg-paper hover:border-ink/30 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <form action={formAction} className="space-y-2">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="agentId" value={agent.id} />
        <textarea
          name="message"
          rows={3}
          required
          disabled={quotaReached}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Demandez à ${agent.name}… (Entrée pour envoyer, Maj+Entrée pour retour à la ligne)`}
          className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40 disabled:bg-paper disabled:text-ink/40"
        />
        {state.error && <p className="text-sm text-clay">{state.error}</p>}
        <div className="flex justify-end">
          <SubmitButton pendingLabel={`${agent.name} travaille…`} className="flex items-center gap-2" disabled={quotaReached}>
            <Send size={14} aria-hidden="true" />
            Envoyer
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
