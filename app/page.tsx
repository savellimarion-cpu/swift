import Link from "next/link";
import { AGENTS, ACCENT_SOFT_BG, ACCENT_TEXT, ACCENT_BORDER, type AgentType } from "@/lib/agents";

const AGENCY_NAME = "Swiftflow";
const CONTACT_EMAIL = "contact@swiftflow.agency";

const CLIENT_PITCH: Record<AgentType, string> = {
  strategiste:
    "Définit la direction de votre communication : positionnement, cible, angles éditoriaux du mois.",
  "createur-contenu":
    "Rédige vos posts, carrousels, scripts de Reels et emails — dans le ton de votre marque.",
  designer:
    "Prépare les visuels de vos publications, cohérents avec votre identité graphique.",
  analyste:
    "Lit vos résultats et propose un plan d'action concret pour le mois suivant.",
  presentateur:
    "Synthétise le travail du mois dans un compte-rendu clair, prêt à présenter.",
};

export default function LandingPage() {
  return (
    <div>
      <Header />
      <Hero />
      <AgentsSection />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <span className="font-mono text-sm font-semibold tracking-tight">
          Swiftflow<span className="text-turquoise">.</span>
        </span>
        <nav className="flex items-center gap-5 text-sm">
          <a href="#agents" className="hidden sm:inline text-ink/60 hover:text-ink">
            Les agents
          </a>
          <a href="#offres" className="hidden sm:inline text-ink/60 hover:text-ink">
            Tarifs
          </a>
          <a
            href="#offres"
            className="bg-ink text-paper px-3.5 py-1.5 rounded-sm hover:bg-ink/85 transition-colors"
          >
            Démarrer
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-turquoise mb-4">
          {AGENCY_NAME} · agents IA dédiés à votre marque
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight mb-5">
          Une équipe de créateurs IA, prête à travailler pour votre marque.
        </h1>
        <p className="text-ink/65 leading-relaxed mb-8 max-w-md">
          Posts, carrousels, visuels, rapports de performance, présentations
          — choisissez les agents qui rejoignent votre équipe, donnez-leur
          vos consignes par chat, et récupérez des contenus prêts à publier.
          Votre marque, votre ton, votre identité visuelle : tout est déjà
          configuré par notre équipe.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#offres"
            className="bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-ink/85 transition-colors font-medium"
          >
            Voir les offres
          </a>
          <a href="#agents" className="text-ink/60 hover:text-ink text-sm">
            Découvrir les agents →
          </a>
        </div>
      </div>

      <HeroPreview />
    </section>
  );
}

function HeroPreview() {
  const margaux = AGENTS.find((a) => a.id === "createur-contenu")!;
  const Icon = margaux.icon;

  return (
    <div className="bg-white border border-line rounded-sm p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-line">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${ACCENT_SOFT_BG[margaux.accent]}`}>
          <Icon size={18} className={ACCENT_TEXT[margaux.accent]} aria-hidden="true" />
        </div>
        <div>
          <div className="text-sm font-medium text-ink">{margaux.name}</div>
          <div className="font-mono text-[11px] text-ink/40">{margaux.role}</div>
        </div>
      </div>

      <div className="flex justify-end mb-3">
        <div className="bg-ink text-paper rounded-sm px-3 py-2 text-sm max-w-[85%]">
          Crée un carrousel Instagram pour annoncer notre nouvelle collection
        </div>
      </div>

      <div className="text-sm text-ink/70 leading-relaxed mb-4">
        Voici un carrousel de 5 slides (framework Hook-Story-Offer), avec 3
        accroches à tester et un CTA vers la fiche produit...
      </div>

      <div className="pt-3 border-t border-line flex items-center justify-between font-mono text-[11px] text-ink/40">
        <span>carrousel-collection-printemps</span>
        <span className="border border-turquoise/40 text-turquoise rounded-sm px-1.5 py-0.5">brouillon</span>
      </div>
    </div>
  );
}

function AgentsSection() {
  return (
    <section id="agents" className="max-w-5xl mx-auto px-6 md:px-10 py-16 border-t border-line">
      <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">
        L&apos;équipe
      </h2>
      <h3 className="text-2xl font-semibold mb-3 max-w-lg">
        5 agents spécialisés, à votre service.
      </h3>
      <p className="text-ink/60 leading-relaxed mb-8 max-w-2xl">
        Chaque agent a un rôle précis et connaît déjà votre marque — ton,
        vocabulaire, identité visuelle, cible. Selon votre formule, vous
        choisissez ceux qui rejoignent votre équipe.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.id}
              className={`bg-white border border-line ${ACCENT_BORDER[agent.accent]} border-l-[3px] rounded-sm p-5`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${ACCENT_SOFT_BG[agent.accent]}`}>
                <Icon size={18} className={ACCENT_TEXT[agent.accent]} aria-hidden="true" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold">{agent.name}</div>
                <span className={`font-mono text-[11px] uppercase tracking-widest ${ACCENT_TEXT[agent.accent]}`}>
                  {agent.role}
                </span>
              </div>
              <p className="text-sm text-ink/60 leading-relaxed">{CLIENT_PITCH[agent.id]}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Choisissez votre formule",
      body: "Un ou deux agents pour démarrer, ou l'équipe complète — selon vos besoins du moment. Vous pouvez évoluer à tout moment.",
    },
    {
      title: "Briefez vos agents par chat",
      body: "Chaque agent a son espace dédié : décrivez ce qu'il vous faut, il connaît déjà votre marque et vos derniers contenus.",
    },
    {
      title: "Recevez vos contenus",
      body: "Posts, visuels, rapports, présentations — prêts à relire, valider et publier, accessibles à tout moment depuis votre espace.",
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
            <div className="font-mono text-2xl text-turquoise mb-3">
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

function Pricing() {
  const essentielHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Offre Essentiel — " + AGENCY_NAME
  )}`;
  const premiumHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    "Offre Premium — " + AGENCY_NAME
  )}`;

  return (
    <section id="offres" className="max-w-5xl mx-auto px-6 md:px-10 py-16 border-t border-line">
      <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">
        Tarifs
      </h2>
      <h3 className="text-2xl font-semibold mb-8 max-w-lg">
        Deux formules, simples.
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-line rounded-sm p-6 md:p-8">
          <div className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">
            Essentiel
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-semibold">59 €</span>
            <span className="text-ink/50 text-sm">/ mois</span>
          </div>
          <p className="text-sm text-ink/60 leading-relaxed mb-5">
            Choisissez 1 ou 2 agents — par exemple votre créateur de contenu
            et votre designer — pour démarrer simplement.
          </p>
          <ul className="text-sm text-ink/70 space-y-2 mb-6">
            <li>• 1 ou 2 agents au choix</li>
            <li>• Conversations illimitées avec vos agents</li>
            <li>• Mémoire de marque configurée par notre équipe</li>
            <li>• Tous vos contenus accessibles dans votre espace</li>
          </ul>
          <a
            href={essentielHref}
            className="block text-center border border-ink text-ink px-5 py-2.5 rounded-sm hover:bg-ink hover:text-paper transition-colors font-medium"
          >
            Demander cette offre
          </a>
        </div>

        <div className="bg-white border-2 border-turquoise rounded-sm p-6 md:p-8">
          <div className="font-mono text-xs uppercase tracking-widest text-turquoise mb-2">
            Premium
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-semibold">199 €</span>
            <span className="text-ink/50 text-sm">/ mois</span>
          </div>
          <p className="text-sm text-ink/60 leading-relaxed mb-5">
            Toute l&apos;équipe à votre service : stratégie, contenu, visuels,
            analyse et présentations.
          </p>
          <ul className="text-sm text-ink/70 space-y-2 mb-6">
            <li>• Les 5 agents — {AGENTS.map((a) => a.name).join(", ")}</li>
            <li>• Conversations illimitées avec toute l&apos;équipe</li>
            <li>• Rapport mensuel de performance et plan d&apos;action</li>
            <li>• Mémoire de marque configurée et tenue à jour par notre équipe</li>
          </ul>
          <a
            href={premiumHref}
            className="block text-center bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-ink/85 transition-colors font-medium"
          >
            Demander cette offre
          </a>
        </div>
      </div>

      <p className="text-sm text-ink/40 mt-6">
        Une question avant de vous lancer ? Écrivez-nous à{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-turquoise hover:underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-ink/40">
        <span className="font-mono">
          Swiftflow<span className="text-turquoise">.</span>
        </span>
        <Link href="/login" className="font-mono text-xs text-ink/30 hover:text-ink/60">
          Espace agence →
        </Link>
      </div>
    </footer>
  );
}
