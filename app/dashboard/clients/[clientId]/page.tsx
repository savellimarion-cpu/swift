import Link from "next/link";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ClientProfileForm from "@/components/ClientProfileForm";
import GeneratePanel from "@/components/GeneratePanel";
import PortalLinkSection from "@/components/PortalLinkSection";
import AgentAccessForm from "@/components/AgentAccessForm";
import PlanForm from "@/components/PlanForm";
import { AGENTS, ACCENT_BORDER, ACCENT_TEXT } from "@/lib/agents";
import { getPlan } from "@/lib/plans";
import { creditsUsedThisMonth } from "@/lib/limits";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const { client } = await requireClient(clientId);

  const deliverables = await prisma.deliverable.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: "desc" },
  });

  const plan = getPlan(client.plan);
  const creditsUsed = plan ? await creditsUsedThisMonth(client.id) : null;

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-2">
        <Link href="/dashboard" className="font-mono text-xs text-ink/40 hover:text-ink/70">
          ← Tous les clients
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-8">{client.name}</h1>

      <section className="bg-white border border-line rounded-sm p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">Portail client</h2>
        <p className="text-sm text-ink/50 mb-3">
          Partage ce lien avec {client.name} pour qu&apos;ils consultent leurs
          livrables — aucun compte requis de leur côté.
        </p>
        <PortalLinkSection clientId={client.id} portalToken={client.portalToken} />
      </section>

      <section className="bg-white border border-line rounded-sm p-5 mb-6">
        <h2 className="text-sm font-semibold mb-1">Offre</h2>
        <p className="text-sm text-ink/50 mb-3">
          Détermine le quota mensuel de crédits de {client.name} (1 crédit = 1
          génération, tous agents confondus) et pré-remplit ses agents
          activés ci-dessous.
        </p>
        <PlanForm clientId={client.id} plan={client.plan} />
        {plan && creditsUsed !== null && (
          <div className="mt-3 font-mono text-xs text-ink/50">
            Crédits utilisés ce mois-ci : {creditsUsed} / {plan.credits}
          </div>
        )}
      </section>

      <section className="bg-white border border-line rounded-sm p-5 mb-6">
        <h2 className="text-sm font-semibold mb-1">Accès aux agents</h2>
        <p className="text-sm text-ink/50 mb-3">
          Coche les agents accessibles pour {client.name} dans son espace.
          Pré-rempli automatiquement selon l&apos;offre choisie ci-dessus —
          ajustable manuellement si besoin. Les agents décochés disparaissent
          de son portail.
        </p>
        <AgentAccessForm clientId={client.id} enabledAgents={client.enabledAgents} />
      </section>

      <section className="bg-white border border-line rounded-sm p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">Profil du client</h2>
        <ClientProfileForm client={client} />
      </section>

      <section className="bg-white border border-line rounded-sm p-5 mb-8">
        <h2 className="text-sm font-semibold mb-3">Générer un livrable</h2>
        <GeneratePanel clientId={client.id} />
      </section>

      <section>
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-4">
          Livrables ({deliverables.length})
        </h2>

        {deliverables.length === 0 ? (
          <div className="border border-dashed border-line rounded-sm p-8 text-center text-ink/50">
            Aucun livrable encore — utilise le panneau ci-dessus pour générer
            ton premier brief.
          </div>
        ) : (
          <div className="space-y-6">
            {AGENTS.map((agent) => {
              const items = deliverables.filter((d) => d.agent === agent.id);
              if (items.length === 0) return null;
              return (
                <div key={agent.id}>
                  <h3
                    className={`font-mono text-[11px] uppercase tracking-widest mb-2 ${ACCENT_TEXT[agent.accent]}`}
                  >
                    {agent.label}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {items.map((d) => (
                      <Link
                        key={d.id}
                        href={`/dashboard/clients/${client.id}/deliverables/${d.id}`}
                        className={`block bg-white border border-line ${ACCENT_BORDER[agent.accent]} border-l-[3px] rounded-sm p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all`}
                      >
                        <div className="font-medium text-sm mb-1 leading-snug">{d.title}</div>
                        <div className="font-mono text-[11px] text-ink/40">
                          {d.createdAt.toISOString().slice(0, 10)} · {d.status}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
