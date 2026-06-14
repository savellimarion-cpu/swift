import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AGENTS, ACCENT_SOFT_BG, ACCENT_TEXT, ACCENT_BORDER, ACCENT_GLOW, type AgentType } from "@/lib/agents";
import { PLANS } from "@/lib/plans";
import Reveal from "@/components/Reveal";
import AgentIllustration from "@/components/AgentIllustration";

const AGENCY_NAME = "Swiftflow";
const CONTACT_EMAIL = "contact@swiftflow.agency";

const CLIENT_PITCH: Record<AgentType, string> = {
  strategiste:
    "Définit la direction de votre communication : positionnement, cible, angles éditoriaux du mois.",
  "createur-contenu":
    "Rédige vos posts, carrousels, scripts de Reels et emails — dans le ton de votre marque.",
  designer:
    "Génère directement vos visuels prêts à poster, cohérents avec votre identité graphique.",
  analyste:
    "Lit vos résultats et propose un plan d'action concret pour le mois suivant.",
  presentateur:
    "Synthétise le travail du mois dans un compte-rendu clair, prêt à présenter.",
};

/** Mini-échange illustratif affiché sur chaque carte agent (exemples, pas des retours clients réels). */
const AGENT_DEMO: Record<AgentType, { prompt: string; reply: string }> = {
  strategiste: {
    prompt: "On lance une nouvelle gamme en mars, aide-moi à cadrer la campagne.",
    reply: "Voici le brief : positionnement, cible prioritaire et 3 angles éditoriaux pour le mois.",
  },
  "createur-contenu": {
    prompt: "Un post LinkedIn pour annoncer notre nouvelle fonctionnalité.",
    reply: "3 accroches + le post complet (framework AIDA), prêt à publier.",
  },
  designer: {
    prompt: "Un visuel pour la story Instagram de ce post.",
    reply: "Visuel généré en 9:16, cohérent avec votre palette — prêt à télécharger.",
  },
  analyste: {
    prompt: "Comment se sont comportés nos contenus le mois dernier ?",
    reply: "Rapport détaillé + un plan d'action concret pour le mois prochain.",
  },
  presentateur: {
    prompt: "Prépare une synthèse du mois pour notre prochain point.",
    reply: "Deck de 8 slides, structure claire, prêt à présenter.",
  },
};

export default function LandingPage() {
  return (
    <div>
      <Header />
      <Hero />
      <AgentsSection />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/75 backdrop-blur-md">
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
            className="bg-ink text-paper px-3.5 py-1.5 rounded-sm hover:bg-ink/85 hover:scale-105 transition-all"
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
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="animate-drift absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-turquoise/20 blur-[90px]" />
        <div className="animate-drift-slow absolute top-10 right-0 w-[24rem] h-[24rem] rounded-full bg-violet-500/15 blur-[90px]" />
        <div className="animate-drift absolute bottom-0 left-1/3 w-[20rem] h-[20rem] rounded-full bg-pink-500/10 blur-[90px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="font-mono text-xs uppercase tracking-widest text-turquoise mb-4">
            {AGENCY_NAME} · agents IA dédiés à votre marque
          </div>
          <h1 className="text-3xl md:text-4xl leading-tight mb-5">
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
              className="bg-ink text-paper px-5 py-2.5 rounded-sm hover:bg-ink/85 hover:scale-105 transition-all font-medium"
            >
              Voir les offres
            </a>
            <a href="#agents" className="text-ink/60 hover:text-ink hover:translate-x-0.5 transition-all text-sm inline-block">
              Découvrir les agents →
            </a>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <HeroPreview />
        </Reveal>
      </div>
    </section>
  );
}

function HeroPreview() {
  const margaux = AGENTS.find((a) => a.id === "createur-contenu")!;
  const Icon = margaux.icon;

  return (
    <div className="bg-white border border-line rounded-sm p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-line">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center animate-float ${ACCENT_SOFT_BG[margaux.accent]}`}>
          <Icon size={18} className={ACCENT_TEXT[margaux.accent]} aria-hidden="true" />
        </div>
        <div>
          <div className="text-sm font-medium text-ink">{margaux.name}</div>
          <div className="font-mono text-[11px] text-ink/40">{margaux.role}</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full animate-soft-pulse ${ACCENT_SOFT_BG[margaux.accent].replace("/10", "")}`} />
          <span className="font-mono text-[10px] text-ink/40">en ligne</span>
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
      <Reveal>
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">
          L&apos;équipe
        </h2>
        <h3 className="text-2xl mb-3 max-w-lg">
          5 agents spécialisés, à votre service.
        </h3>
        <p className="text-ink/60 leading-relaxed mb-8 max-w-2xl">
          Chaque agent a un rôle précis et connaît déjà votre marque — ton,
          vocabulaire, identité visuelle, cible. Selon votre formule, vous
          choisissez ceux qui rejoignent votre équipe.
        </p>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AGENTS.map((agent, i) => {
          const Icon = agent.icon;
          const demo = AGENT_DEMO[agent.id];
          return (
            <Reveal key={agent.id} delay={i * 80}>
              <div
                className={`group bg-white border border-line ${ACCENT_BORDER[agent.accent]} border-l-[3px] rounded-sm p-5 hover:-translate-y-1 transition-all ${ACCENT_GLOW[agent.accent]}`}
              >
                <div className={`w-16 h-16 mb-3 ${ACCENT_TEXT[agent.accent]} transition-transform group-hover:scale-105`}>
                  <AgentIllustration agentId={agent.id} />
                </div>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-3 ${ACCENT_SOFT_BG[agent.accent]}`}>
                  <Icon size={18} className={ACCENT_TEXT[agent.accent]} aria-hidden="true" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold">{agent.name}</div>
                  <span className={`font-mono text-[11px] uppercase tracking-widest ${ACCENT_TEXT[agent.accent]}`}>
                    {agent.role}
                  </span>
                </div>
                <p className="text-sm text-ink/60 leading-relaxed mb-4">{CLIENT_PITCH[agent.id]}</p>

                <div className="border-t border-line pt-3 space-y-1.5">
                  <div className="flex justify-end">
                    <div className="bg-paper border border-line rounded-sm px-2.5 py-1.5 text-xs text-ink/70 max-w-[88%]">
                      {demo.prompt}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className={`${ACCENT_SOFT_BG[agent.accent]} rounded-sm px-2.5 py-1.5 text-xs ${ACCENT_TEXT[agent.accent]} max-w-[88%]`}>
                      {demo.reply}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
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
      body: "Content, Marketing ou Équipe Complète — selon vos besoins du moment. Vous pouvez évoluer à tout moment.",
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
      <Reveal>
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">
          Comment ça marche
        </h2>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 100}>
            <div className="font-mono text-2xl text-turquoise mb-3">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-ink/60 leading-relaxed">{step.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="offres" className="max-w-5xl mx-auto px-6 md:px-10 py-16 border-t border-line">
      <Reveal>
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">
          Tarifs
        </h2>
        <h3 className="text-2xl mb-8 max-w-lg">
          Trois formules, selon votre besoin.
        </h3>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => {
          const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
            `Offre ${plan.name} — ${AGENCY_NAME}`
          )}`;
          return (
            <Reveal key={plan.name} delay={i * 100}>
              <div
                className={`relative bg-white rounded-sm p-6 md:p-8 h-full transition-all ${
                  plan.featured
                    ? "border-2 border-turquoise hover:-translate-y-1 hover:shadow-sm"
                    : "border border-line"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 bg-turquoise text-white font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm">
                    Plus populaire
                  </span>
                )}
                <div
                  className={`font-mono text-xs uppercase tracking-widest mb-2 ${
                    plan.featured ? "text-turquoise" : "text-ink/40"
                  }`}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-semibold">{plan.price} €</span>
                  <span className="text-ink/50 text-sm">/ mois</span>
                </div>
                <p className="text-sm text-ink/60 leading-relaxed mb-5">{plan.subtitle}</p>

                <div className="font-mono text-[11px] uppercase tracking-widest text-ink/40 mb-2">
                  Inclus
                </div>
                <ul className="text-sm text-ink/70 space-y-2 mb-6">
                  {plan.agentIds.map((id) => {
                    const a = AGENTS.find((x) => x.id === id)!;
                    return (
                      <li key={id}>
                        • {a.name} ({a.role})
                      </li>
                    );
                  })}
                  <li>• Conversations illimitées</li>
                  <li>• Mémoire de marque</li>
                  <li>• {plan.credits} crédits de génération / mois</li>
                  {plan.extras.map((extra) => (
                    <li key={extra}>• {extra}</li>
                  ))}
                </ul>

                <p className="text-sm text-ink/60 leading-relaxed mb-6">
                  <span className="font-medium text-ink">Résultat : </span>
                  {plan.result}
                </p>

                <a
                  href={href}
                  className={`block text-center px-5 py-2.5 rounded-sm font-medium transition-all ${
                    plan.featured
                      ? "bg-ink text-paper hover:bg-ink/85 hover:scale-[1.02]"
                      : "border border-ink text-ink hover:bg-ink hover:text-paper"
                  }`}
                >
                  Demander cette offre
                </a>
              </div>
            </Reveal>
          );
        })}
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

const FAQ_ITEMS = [
  {
    q: "Comment se passe la mise en place ?",
    a: "Votre agence configure la mémoire de marque de chaque agent (ton, vocabulaire, identité visuelle, cible) avant de vous donner accès à votre espace — vous n'avez rien à paramétrer.",
  },
  {
    q: "Puis-je changer d'offre à tout moment ?",
    a: "Oui — écrivez-nous et nous ajustons votre offre, votre quota de crédits et les agents disponibles dans votre espace dès le mois suivant.",
  },
  {
    q: "Que se passe-t-il si j'atteins mon quota de crédits ?",
    a: "Chaque génération (post, visuel, rapport, deck...) consomme 1 crédit. Une fois le quota mensuel atteint, l'agent vous l'indique directement dans le chat — le quota se réinitialise au début du mois suivant.",
  },
  {
    q: "Les agents connaissent-ils déjà ma marque ?",
    a: "Oui : ton, vocabulaire, identité visuelle et profil de cible sont configurés en amont par votre agence et pris en compte à chaque génération.",
  },
  {
    q: "Puis-je demander des retouches sur un livrable ?",
    a: "Bien sûr — décrivez ce que vous voulez ajuster directement dans le chat de l'agent concerné, comme pour toute autre demande.",
  },
];

function FAQ() {
  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 border-t border-line">
      <Reveal>
        <h2 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">FAQ</h2>
        <h3 className="text-2xl mb-8 max-w-lg">Les questions fréquentes.</h3>
      </Reveal>
      <div className="max-w-2xl space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <Reveal key={item.q} delay={i * 60}>
            <details className="group bg-white border border-line rounded-sm px-4 py-3">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-sm font-medium text-ink">
                {item.q}
                <ChevronDown
                  size={16}
                  className="text-ink/40 shrink-0 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="text-sm text-ink/60 leading-relaxed mt-3 pt-3 border-t border-line">
                {item.a}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
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
