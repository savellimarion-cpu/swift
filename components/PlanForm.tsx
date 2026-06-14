"use client";

import { PLANS } from "@/lib/plans";
import { updatePlanAction } from "@/app/actions/clients";

export default function PlanForm({ clientId, plan }: { clientId: string; plan: string | null }) {
  return (
    <form action={updatePlanAction}>
      <input type="hidden" name="clientId" value={clientId} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <label
          className={`flex flex-col gap-0.5 border rounded-sm px-3 py-2 bg-white cursor-pointer hover:border-ink/30 transition-colors ${
            !plan ? "border-ink" : "border-line"
          }`}
        >
          <input
            type="radio"
            name="plan"
            value=""
            defaultChecked={!plan}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="accent-ink w-4 h-4 mb-1"
          />
          <div className="text-sm font-medium text-ink">Aucune offre</div>
          <div className="text-xs text-ink/50">Pas de quota de crédits</div>
        </label>

        {PLANS.map((p) => (
          <label
            key={p.id}
            className={`flex flex-col gap-0.5 border rounded-sm px-3 py-2 bg-white cursor-pointer hover:border-ink/30 transition-colors ${
              plan === p.id ? "border-ink" : "border-line"
            }`}
          >
            <input
              type="radio"
              name="plan"
              value={p.id}
              defaultChecked={plan === p.id}
              onChange={(e) => e.currentTarget.form?.requestSubmit()}
              className="accent-ink w-4 h-4 mb-1"
            />
            <div className="text-sm font-medium text-ink">{p.name}</div>
            <div className="text-xs text-ink/50">
              {p.price} €/mois · {p.credits} crédits/mois
            </div>
          </label>
        ))}
      </div>
    </form>
  );
}
