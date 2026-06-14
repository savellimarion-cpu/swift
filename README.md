# Swiftflow — multi-agent marketing (application web SaaS)

Application web complète : chaque compte (une agence/freelance) gère ses
clients marketing, génère des livrables via 5 agents IA spécialisés (appels
directs à l'API Claude), et donne à ses propres clients un accès self-service
à ces agents via un portail dédié, sans compte requis côté client.

> Cette application est la version "web vendable" du projet. La version
> précédente (basée sur Claude Code en local, fichiers markdown) reste
> utilisable séparément si tu préfères un usage personnel sans
> infrastructure — voir l'autre dossier livré.

---

## 1. Vue d'ensemble

- **Frontend + backend** : une seule application Next.js (App Router,
  Server Actions — pas d'API REST séparée à maintenir).
- **Base de données** : Prisma ORM + Postgres (un projet gratuit Neon/Supabase
  fonctionne aussi bien en local qu'en production — voir section 7,
  Déploiement).
- **IA** : chaque génération appelle directement
  `https://api.anthropic.com/v1/messages` avec la clé définie dans
  `ANTHROPIC_API_KEY`. Les "personnalités" des 5 agents (Stratège, Créateur
  de Contenu, Designer, Analyste, Présentateur) sont définies dans
  `lib/agents/*.ts`.
- **Multi-compte** : un `Account` = une agence/freelance. Chaque `Account` a
  ses `User`s (connexion par email/mot de passe) et ses `Client`s.
- **Portail client** : chaque `Client` peut avoir un `portalToken` — un lien
  `/portal/{token}` en lecture, sans authentification, qui liste ses
  livrables.

---

## 2. Installation locale

### Prérequis

- Node.js 18 ou plus récent.
- Une base Postgres — la plus simple : un projet gratuit sur
  [neon.tech](https://neon.tech) (1 minute, sans carte bancaire). Tu peux
  utiliser la même base en local et en production (voir section 7,
  Déploiement).
- Une clé API Anthropic (sur [console.anthropic.com](https://console.anthropic.com)).

### Étapes

```bash
npm install
cp .env.example .env
```

Édite `.env` avec la chaîne de connexion fournie par Neon (ou un autre
Postgres) et ta clé Anthropic :

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
ANTHROPIC_API_KEY="sk-ant-..."
```

Crée les tables (lit `prisma/schema.prisma` et synchronise la base) :

```bash
npm run db:push
```

Lance le serveur de développement :

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). Crée ton premier
compte via "Essayer gratuitement" → tu arrives sur `/dashboard`.

> `npm run db:studio` ouvre Prisma Studio (interface graphique sur la base
> de données) — utile pour inspecter/modifier les données pendant le
> développement.

---

## 3. Utilisation

1. **Crée un client** depuis `/dashboard` (nom seulement — le reste se
   remplit ensuite).
2. **Remplis son profil** (page du client) : ton de marque, vocabulaire
   interdit/privilégié, identité visuelle, ICP, historique. Ces champs sont
   inclus dans **chaque** prompt envoyé à l'IA — c'est l'équivalent des
   fichiers `brand.md`/`icp.md`/`historique.md` de la version Claude Code,
   mais éditables via formulaire.
3. **Active les agents souscrits** : section "Accès aux agents" sur la page
   du client — coche les agents correspondant à l'offre choisie (voir
   section 4, "Page d'accueil & offres"). Décoché = invisible et
   inaccessible dans l'espace de ce client.
4. **Génère** : choisis un agent dans le panneau "Générer un livrable",
   remplis les champs spécifiques (objectif, format, période, sujet...), et
   valide. La génération appelle l'API Claude — ça prend de quelques
   secondes à ~1 minute selon l'agent et la longueur du livrable.
5. **Consulte / modifie le statut** : chaque livrable a un statut
   (brouillon / validé / publié), modifiable depuis sa page de détail.
6. **Partage** : depuis la page du client, génère un lien de portail et
   envoie-le à ton client. Il arrive sur un hub listant les agents activés —
   voir section 5.

### Ordre recommandé pour une campagne

Les agents s'appuient automatiquement sur les livrables précédents du même
client (le plus récent de chaque type) :

```
Stratège (brief)
   ↓
Créateur de Contenu (3-5 pièces, lit le brief)
   ↓
Designer (pack visuels, lit le brief + le contenu)
   ↓
Présentateur (deck, lit brief + contenu + visuels + rapport analytics)
```

L'Analyste est indépendant (tu lui donnes une période + des données brutes
que tu colles toi-même — il ne va chercher aucune donnée automatiquement).

### Export PDF des decks

Le Présentateur produit un deck slide par slide, affiché directement dans
l'app. Le bouton **"Imprimer / exporter en PDF"** utilise la fonction
d'impression du navigateur (chaque slide = une page) — pas de dépendance
serveur (Puppeteer, etc.), donc ça fonctionne aussi bien en local qu'une
fois déployé.

---

## 4. Page d'accueil & offres

La page `/` (racine du site) est **votre tunnel de vente**, adressé à vos
clients (les clients de votre agence Swiftflow — swiftflow.agency). Elle
présente les 5 agents et trois formules (constante `PLANS` dans
`lib/plans.ts`, partagée avec le dashboard) :

- **Content — 79 €/mois — 40 crédits/mois** : Margaux (Créateur de Contenu)
  + Romy (Designer).
- **Marketing — 149 €/mois — 60 crédits/mois** (mise en avant "Plus
  populaire") : + Adèle (Stratège).
- **Équipe Complète — 249 €/mois — 100 crédits/mois** : les 5 agents, avec
  en plus rapports mensuels, analyse des performances, plan d'action mensuel
  et présentations synthétiques (Sacha + Élio).

Les boutons "Demander cette offre" ouvrent un email pré-rempli vers
`CONTACT_EMAIL` (constante en haut de `app/page.tsx`, actuellement
`contact@swiftflow.agency`) — il n'y a pas encore de paiement en ligne
(Stripe), voir Roadmap. Le nom affiché ("Swiftflow") est une constante
`AGENCY_NAME` dans le même fichier.

### Activer/désactiver des agents par client

Une fois qu'un client a choisi son offre, ouvre sa page dans `/dashboard` →
section **"Offre"** → sélectionne sa formule (Content / Marketing / Équipe
Complète, cf. `PLANS` ci-dessus). Ça fixe `Client.plan` (quota de crédits,
voir ci-dessous) et pré-remplit automatiquement la section **"Accès aux
agents"** juste en dessous avec les agents de cette offre — que tu peux
ensuite ajuster finement si besoin. C'est stocké dans `Client.enabledAgents`
(liste d'IDs séparés par des virgules ; vide ou non renseigné = tous
activés, pour rester compatible avec les clients existants).

Effet côté portail client :
- Le hub (`/portal/{token}`) n'affiche que les agents activés.
- Dans l'espace de chaque agent, un petit menu en haut de page (juste sous
  le logo) permet de passer directement à un autre agent activé — sans
  repasser par le hub.
- Ouvrir directement l'URL d'un agent désactivé renvoie une page 404.
- Envoyer un message à un agent désactivé (chat) renvoie une erreur.

### Système de crédits & limites anti-abus

Chaque offre (`lib/plans.ts`) inclut un quota mensuel de **crédits** — 1
crédit = 1 génération, tous agents confondus (un post, un visuel, un brief,
un rapport, un deck...) :

- **Content — 40 crédits/mois**
- **Marketing — 60 crédits/mois**
- **Équipe Complète — 100 crédits/mois**

Assigne l'offre d'un client dans `/dashboard` → section **"Offre"** : ça
fixe `Client.plan` (et pré-remplit "Accès aux agents" avec les agents de
l'offre, ajustable ensuite). Un client sans offre assignée n'a **aucun
quota** (rétro-compatible avec les clients existants).

Le quota se réinitialise le 1er de chaque mois (compte les `Deliverable`
créés depuis le début du mois, `lib/limits.ts`). Le client voit sa jauge
dans l'onglet Chat de chaque agent ("Crédits ce mois-ci : X / Y") ; au-delà,
le formulaire se désactive avec un message d'explication. La même limite
s'applique au panneau "Générer un livrable" côté agence.

En plus de ce quota global, **les carrousels (Margaux/Créateur de Contenu)
sont plafonnés à 5 slides** — règle dans le prompt système
(`lib/agents/createur-contenu.ts`), pas une contrainte technique : si
l'agent dérive, ajuste le prompt plutôt que d'ajouter une validation a
posteriori.

Le lien `/login` (accès agence) n'est plus mis en avant sur la page
d'accueil — il reste accessible via le petit lien "Espace agence" en bas de
page.

---

## 5. Le portail client — un espace par agent

Depuis cette version, le lien de portail (`/portal/{token}`) n'ouvre plus une
simple liste de livrables : c'est un **hub** présentant les 5 agents comme une
équipe, chacun avec un prénom :

| Agent (rôle)        | Prénom   | Sortie spécifique     |
| -------------------- | -------- | ---------------------- |
| Stratège (Opus)      | Adèle    | Briefs                  |
| Créateur de Contenu (Sonnet) | Margaux | Posts & carrousels |
| Designer (Sonnet)    | Romy     | Visuels                 |
| Analyste (Opus)       | Sacha    | Rapports                |
| Présentateur (Sonnet) | Élio    | Decks                   |

> Les prénoms et taglines sont définis dans `lib/agents/index.ts` —
> change-les librement, ils ne sont utilisés que côté affichage (les clés
> internes `strategiste`/`createur-contenu`/etc. ne changent pas).

En cliquant sur un agent, le client arrive dans son **espace de travail** :
une fiche de présentation (statut, rôle, nombre de livrables produits,
dernière activité), puis 5 onglets — **Chat**, un onglet de sortie propre à
l'agent (Briefs / Posts & carrousels / Visuels / Rapports / Decks),
**Analytics**, **Fichiers** et **Historique**.

### Chat (v1)

Le client peut écrire une demande en langage libre ("écris-moi un carrousel
sur notre nouvelle collection"). L'agent répond en s'appuyant sur le profil
du client et ses 2 derniers livrables, et le résultat est enregistré comme un
nouveau livrable (statut "brouillon") — visible immédiatement dans Fichiers et
Historique.

**Limite connue (v1)** : chaque message est traité indépendamment — il n'y a
pas encore d'historique de conversation persistant avec mémoire des échanges
précédents dans le même fil. C'est la prochaine étape (voir Roadmap).

**Coût** : chaque message envoyé par un client déclenche un appel à l'API
Anthropic, facturé sur ta clé. Il n'y a pas encore de limite de générations
par client/mois — à mettre en place avant un usage en production avec des
clients externes (voir Roadmap).

### Analytics (v1)

Affiche pour l'instant le nombre de livrables produits, validés, publiés et
la dernière activité — calculés depuis les données réelles. Le suivi détaillé
(tokens, coût, latence, taux de succès par agent) nécessite d'enregistrer ces
métriques à chaque appel `callClaude` ; ce n'est pas encore fait (voir
Roadmap).

---

### Routes du portail

Les onglets de chaque agent correspondent à ces routes :

```
/portal/{token}                              → hub (liste des agents)
/portal/{token}/agents/{agentId}/chat        → conversation
/portal/{token}/agents/{agentId}/{sortie}    → posts | visuels | briefs | rapports | decks
/portal/{token}/agents/{agentId}/analytics   → statistiques d'usage
/portal/{token}/agents/{agentId}/fichiers    → tous les livrables (liste plate)
/portal/{token}/agents/{agentId}/historique  → activité dans l'ordre chronologique
/portal/{token}/{deliverableId}              → un livrable (rendu markdown ou deck)
```

---

## 6. Coûts à anticiper

Chaque génération consomme des tokens de l'API Anthropic, facturés par
Anthropic à l'usage (modèles Opus pour Stratège/Analyste, Sonnet pour les
3 autres). Pense à intégrer ce coût variable dans ton prix de vente —
par exemple en limitant le nombre de générations par mois selon le plan de
l'`Account`, ou en facturant à l'usage. Ce n'est pas implémenté ici (voir
roadmap), mais le modèle de données (`Account` → `Client` →
`Deliverable`) permet de compter facilement les générations par compte et
par période.

### Génération d'images (Romy / Designer)

Chaque visuel = 1 appel Claude (le "brief" — léger) + 1 appel OpenAI
gpt-image-1 (génération de l'image — c'est le coût principal, de l'ordre de
quelques centimes par image en qualité "medium"). La limite de
`MONTHLY_VISUAL_LIMIT` (40/mois/client, `lib/limits.ts`) plafonne ce coût.

**Accès gpt-image-1** : ce modèle nécessite parfois une vérification
d'organisation sur la plateforme OpenAI (Settings → Organization →
Verification) avant de pouvoir l'utiliser via l'API — si tu obtiens une
erreur 403 "organization not verified" au premier essai, c'est cette étape
qu'il faut faire.

**Stockage** : les images sont stockées en base (data URL base64 dans
`Deliverable.content`) — simple, aucun service supplémentaire à configurer,
mais ça fait grossir la base Postgres (~200-600 Ko par image en JPEG
qualité moyenne). Pour un usage avec plusieurs clients actifs sur la durée,
prévoir de migrer vers un stockage de fichiers (Vercel Blob, S3...) — voir
roadmap.

---

## 7. Déploiement

### Base de données : Postgres (déjà configuré)

Le schéma (`prisma/schema.prisma`) cible déjà Postgres — pas de changement à
faire. Utilise un projet gratuit [Neon](https://neon.tech) ou
[Supabase](https://supabase.com) (la même base que celle utilisée en local
fonctionne très bien en production pour un usage agence/petite équipe).

1. Récupère la chaîne de connexion fournie par Neon/Supabase.
2. Renseigne-la comme `DATABASE_URL` côté Vercel (étape suivante).
3. Pas besoin de lancer `prisma db push` toi-même : le script `build`
   (`package.json`) l'exécute automatiquement à chaque déploiement, donc les
   tables sont créées/synchronisées dès le premier build sur Vercel.
   > Pour un changement de schéma plus tard qui supprimerait des données
   > (colonne renommée/supprimée), `prisma db push` s'arrêtera par sécurité —
   > il faudra alors l'exécuter une fois depuis ton poste avec
   > `--accept-data-loss` pour confirmer.

### Hébergement de l'application : Vercel

1. Pousse le projet sur GitHub (un nouveau repo, public ou privé — Vercel
   peut importer les deux).
2. Sur [vercel.com](https://vercel.com), "Add New… → Project" et importe ce
   repo.
3. Renseigne les variables d'environnement (`DATABASE_URL`,
   `ANTHROPIC_API_KEY`) dans les paramètres du projet Vercel — onglet
   "Environment Variables", avant ou après le premier déploiement.
4. Déploie. Vercel te donne une URL `https://....vercel.app` — c'est ton
   dashboard agence ET la base de tes liens de portail client.

> **Timeouts** : la génération via l'agent Stratège ou Analyste (modèle
> Opus, livrables longs) peut prendre 30-60 secondes. Vérifie la limite de
> durée des fonctions serverless de ton plan Vercel et augmente-la si besoin
> (`maxDuration` dans la config de route, ou plan supérieur).

---

## 8. Sécurité — points à connaître

- Les mots de passe sont hashés avec bcrypt.
- Les sessions sont des tokens opaques stockés en base (`Session`), posés en
  cookie `httpOnly`. Pas de JWT à gérer.
- Le lien de portail (`portalToken`) donne un accès en **lecture** à tous
  les livrables d'un client, à quiconque possède le lien — traite-le comme
  un secret partagé. La fonction "Révoquer ce lien" génère un nouveau token
  au prochain accès.
- Toutes les actions sur un `Client` vérifient que ce client appartient bien
  au compte de l'utilisateur connecté (`requireClient` dans `lib/auth.ts`).

---

## 9. Roadmap (non inclus dans cette version)

- **Chat multi-tours persistant** (phase suivante de l'espace agent) :
  conserver l'historique des échanges par agent/client (modèle
  `Conversation`/`Message`), pour que l'agent garde le contexte d'un message
  à l'autre au lieu de traiter chaque demande indépendamment.
- **Limite de générations par client** : avant un usage en production avec
  des clients externes, plafonner le nombre de messages/générations par
  client et par période — sinon chaque message du portail consomme des
  tokens facturés sur ta clé sans contrôle.
- **Analytics détaillées par agent** (tokens, coût, latence, taux de succès,
  appels d'outils) : nécessite d'enregistrer ces métriques à chaque appel
  `callClaude` (actuellement seul le contenu généré est stocké).
- **Facturation** (Stripe) : checkout en ligne pour les offres Essentiel/
  Premium de la page d'accueil (actuellement : demande par email, activation
  manuelle via "Accès aux agents"), abonnements par `Account`/`Client`.
- **Rôles multi-utilisateurs** : actuellement chaque `User` créé via
  l'inscription est `owner` ; inviter des collègues (`role: "member"`) sur
  le même `Account` est prévu par le modèle de données mais pas encore
  exposé dans l'interface.
- **Agents support** (Gmail, Fireflies, recrutement) : nécessitent des
  connexions OAuth tierces — volontairement hors scope de cette version pour
  rester simple à déployer.
- **Historique structuré** : actuellement un champ texte libre ; pourrait
  devenir un modèle dédié (campagnes, métriques baseline) si tu veux des
  graphiques d'évolution.
- **Agents supplémentaires** (5 → 8) : si tu veux te rapprocher du guide à
  9 agents (1 chef d'orchestre + 8 spécialistes), les nouveaux rôles
  (assistant email, analyste de calls, recrutement...) s'ajoutent dans
  `lib/agents/index.ts` (`AGENTS`) + un module `lib/agents/<id>.ts` par
  agent — la structure (espace, onglets, accès par client) s'applique sans
  changement.
- **Stockage des visuels** : actuellement en base (data URL). Migrer vers
  Vercel Blob (ou S3/Cloudinary) une fois le volume significatif —
  `lib/openai.ts` (renvoie la data URL) et `lib/image-deliverable.ts`
  (format stocké) sont les deux points à adapter ; `dataUrl` deviendrait une
  URL externe, le reste (affichage, téléchargement) ne change pas.
