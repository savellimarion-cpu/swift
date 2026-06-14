import Link from "next/link";
import { AGENTS, ACCENT_BG, ACCENT_BORDER, ACCENT_TEXT } from "@/lib/agents";

export default function LandingPage() {
  return (
    <div>
      <Header />
      <Hero />
      <AgentsSection />
      <HowItWorks />
      <PortalSection />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-sm font-semibold tracking-tight">
            Swiftflow<span className="text-ochre">.</span>
          </span>
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-widest text-ink/40">
            multi-agent marketing
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-ink/60 hover:text-ink">
            Connexion
          </Link>
          <Link
            href="/register"
            className="bg-ink text-paper px-3.5 py-1.5 rounded-sm hover:bg-ink/85 transition-colors"
          >
            Essayer gratuitement
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-ochre mb-4">
          5 agents · 1 plateforme
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight mb-5">
          Votre équipe marketing IA, prête en un brief.
        </h1>
        <p className="text-ink/65 leading-relaxed mb-8 max-w-md">
          Décrivez votre client une fois — ton de marque, cible, historique —
          puis générez briefs, posts, prompts visuels, rapports et decks avec
          des agents spécialisés qui respectent vos règles de marque. Partagez
          le résultat avec vos clients via un lien, sans qu&apos;ils aient
          besoin de créer un compte.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-ink/85 transition-colors font-medium"
          >
            Créer mon espace
          </Link>
          <Link href="/login" className="text-ink/60 hover:text-ink text-sm">
            J&apos;ai déjà un compte →
          </Link>
        </div>
      </div>

      <DeliverablePreview />
    </section>
  );
}

function DeliverablePreview() {
  return (
    <div className="bg-white border border-line border-l-[3px] border-l-clay rounded-sm p-5 shadow-sm">
      <div className="font-mono text-[11px] text-ink/40 mb-3">
        client: studio-lumen · agent: strategiste · statut: validé
      </div>
      <div className="font-semibold text-ink mb-2">
        Brief — Campagne &quot;Lancement Printemps&quot;
      </div>
      <div className="text-sm text-ink/60 leading-relaxed space-y-2">
        <p>
          <span className="text-ink font-medium">Positionnement :</span> le
          studio qui transforme un Pinterest en plan exécutable, sans y passer
          ses week-ends.
        </p>
        <p>
          <span className="text-ink font-medium">Angles :</span> Avant/Après
          réels · Pinterest vs Réalité · Coulisses du rendez-vous découverte.
        </p>
        <p>
          <span className="text-ink font-medium">Cadence :</span> 3
          pièces/semaine sur 4 semaines.
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-line flex items-center gap-2">
        {AGENTS.map((a) => (
          <span
            key={a.id}
            className={`inline-block w-2 h-2 rounded-full ${ACCENT_BG[a.accent]}`}
            title={a.label}
          />
        ))}
        <span className="font-mono text-[11px] text-ink/40 ml-1">
          → généré, prêt pour le créateur de contenu
        </span>
      </div>
    </div>
  );
}

function AgentsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 border-t border-line">
      <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">
        L&apos;équipe
      </h2>
      <h3 className="text-2xl font-semibold mb-8 max-w-lg">
        Cinq agents spécialisés, plutôt qu&apos;un généraliste qui dérive.
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className={`bg-white border border-line ${ACCENT_BORDER[agent.accent]} border-l-[3px] rounded-sm p-5`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="font-semibold">{agent.label}</div>
              <span className={`font-mono text-[11px] border rounded-sm px-1.5 py-0.5 ${ACCENT_TEXT[agent.accent]} ${ACCENT_BORDER[agent.accent]}`}>
                {agent.model}
              </span>
            </div>
            <p className="text-sm text-ink/60">{agent.role}</p>
          </div>
        ))}
        <div className="bg-paper border border-dashed border-line rounded-sm p-5 flex items-center justify-center text-center">
          <p className="text-sm text-ink/45">
            + agents support (boîte mail, calls, recrutement) — en feuille de
            route
          </p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Configurez votre client",
      body: "Ton de marque, vocabulaire interdit, identité visuelle, ICP, historique des campagnes — une fois rempli, chaque agent en tient compte automatiquement.",
    },
    {
      title: "Générez avec l'agent qu'il vous faut",
      body: "Brief, post, pack de prompts images, rapport + plan 30 jours, ou deck — chaque génération s'appuie sur les livrables précédents pour rester cohérente.",
    },
    {
      title: "Validez, ajustez, partagez",
      body: "Chaque livrable est éditable. Une fois prêt, partagez-le — ou l'ensemble du dossier client — via un lien de portail en lecture, sans compte à créer pour votre client.",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 border-t border-line">
      <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">
        Comment ça marche
      </h2>
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {steps.map((step, i) => (
          <div key={step.title}>
            <div className="font-mono text-2xl text-ochre mb-3">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PortalSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 border-t border-line">
      <div className="bg-white border border-line rounded-sm p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-forest mb-2">
            Portail client
          </h2>
          <h3 className="text-2xl font-semibold mb-3">
            Vos clients voient le travail, pas l&apos;outil.
          </h3>
          <p className="text-ink/60 leading-relaxed">
            Chaque client dispose d&apos;un lien de consultation en lecture
            seule : briefs, posts, visuels, rapports et decks, présentés
            proprement — sans qu&apos;ils aient besoin de créer un compte ni
            de comprendre comment fonctionne la génération.
          </p>
        </div>
        <div className="font-mono text-xs bg-paper border border-dashed border-line rounded-sm p-4 text-ink/50">
          swiftflow.app/portail/<span className="text-ochre">a1b2c3d4e5f6...</span>
          <div className="mt-3 space-y-1.5 text-ink/40">
            <div>→ briefs/lancement-printemps</div>
            <div>→ content/3 pièces</div>
            <div>→ decks/restitution</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-ink/40">
        <span className="font-mono">
          Swiftflow<span className="text-ochre">.</span>{" "}
          <span className="text-ink/30">— multi-agent marketing</span>
        </span>
        <span>Le moteur, ce sont les agents.</span>
      </div>
    </footer>
  );
}
