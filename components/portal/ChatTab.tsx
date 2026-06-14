"use client";

import { useActionState, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { sendAgentMessageAction, type PortalChatState } from "@/app/actions/portal";
import { ACCENT_SOFT_BG, ACCENT_TEXT, getAgentMeta, type AgentType } from "@/lib/agents";
import SubmitButton from "@/components/SubmitButton";

const initialState: PortalChatState = {};

export default function ChatTab({ token, agentId }: { token: string; agentId: AgentType }) {
  const agent = getAgentMeta(agentId);
  const [state, formAction] = useActionState(sendAgentMessageAction, initialState);
  const [message, setMessage] = useState("");

  if (!agent) return null;

  return (
    <div>
      <div className="bg-white border border-line rounded-sm p-8 mb-4 flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${ACCENT_SOFT_BG[agent.accent]}`}>
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Demandez à ${agent.name}… (Entrée pour envoyer, Maj+Entrée pour retour à la ligne)`}
          className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-turquoise/40"
        />
        {state.error && <p className="text-sm text-clay">{state.error}</p>}
        <div className="flex justify-end">
          <SubmitButton pendingLabel={`${agent.name} travaille…`} className="flex items-center gap-2">
            <Send size={14} aria-hidden="true" />
            Envoyer
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
