import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import NewClientForm from "@/components/NewClientForm";

export default async function DashboardPage() {
  const user = await requireUser();
  const clients = await prisma.client.findMany({
    where: { accountId: user.accountId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { deliverables: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">
      <header className="mb-8">
        <div className="font-mono text-xs uppercase tracking-widest text-ochre mb-2">
          {user.account.name}
        </div>
        <h1 className="text-2xl font-semibold">Vos clients</h1>
      </header>

      <section className="bg-white border border-line rounded-sm p-5 mb-8">
        <h2 className="text-sm font-semibold mb-3">Ajouter un client</h2>
        <NewClientForm />
      </section>

      {clients.length === 0 ? (
        <div className="border border-dashed border-line rounded-sm p-8 text-center text-ink/50">
          Aucun client encore. Ajoute ton premier client ci-dessus pour
          commencer à générer des livrables.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="block bg-white border border-line rounded-sm p-5 hover:shadow-sm hover:-translate-y-0.5 transition-all"
            >
              <div className="font-semibold mb-1">{client.name}</div>
              <div className="font-mono text-xs text-ink/40">
                {client._count.deliverables} livrable
                {client._count.deliverables === 1 ? "" : "s"}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
