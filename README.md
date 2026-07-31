# Atmos — Dashboard qualité de l'air (Next.js + Neon)

Tableau de bord de visualisation (type Power BI / Metabase) pour comparer la
qualité de l'air entre **Antananarivo, Paris, Nairobi, Mumbai et Beijing**,
branché directement sur l'entrepôt Postgres alimenté par le pipeline
[`donnee2-aqi`](https://github.com/haja171106/donnee2-aqi).

Il **ne recrée pas** le pipeline ETL : il se contente de lire le warehouse
existant (`dim_ville`, `dim_temps`, `fact_qualite_air`) déjà chargé dans Neon
par `src/load.py`.

## Ce que montre le dashboard

- **Répartition du temps par catégorie AQI** (élément principal) : une bande
  par ville, segmentée au prorata du temps réellement passé en catégorie
  1 (Bon) à 5 (Très mauvais) — la donnée la plus parlante du jeu de données
  (Beijing y passe ~72 % du temps en catégorie 4-5, Antananarivo/Nairobi n'en
  sortent presque jamais). **Cliquer sur une ville** ouvre un mini-globe
  rotatif (Canvas 2D, aucune dépendance externe type Three.js) centré sur ses
  coordonnées, dans l'esprit du globe qu'affiche l'interface de Neon.
- **Classement en direct** : dernière mesure connue par ville.
- **Tendances journalières** : évolution de chaque polluant, comparée entre
  les 5 villes.
- **Profil polluants** : radar normalisé par ville (PM2.5, PM10, NO₂, O₃,
  SO₂, CO).
- **Cycle horaire** : heatmap jour de semaine × heure UTC, pour repérer les
  effets de trafic ou d'inversion thermique (net à Beijing : pic la nuit,
  creux en journée).

## Stack

- Next.js 16 (App Router, Turbopack, TypeScript), React 19, Server Components
  pour le premier rendu, quelques sections client pour l'interactivité
  (sélecteurs). Nécessite Node.js 20.9+.
- Thème **sombre** façon console de monitoring (Grafana/Datadog) : fond
  anthracite, palette de sévérité AQI et couleurs par ville éclaircies pour
  rester lisibles et contrastées sur fond sombre, indicateur "en direct"
  pulsant, glow discret sur les panneaux actifs (modal, erreurs). Tous les
  tokens de couleur sont centralisés dans `tailwind.config.ts` — pas de dark
  mode togglable, le dashboard est nativement sombre.
- Tailwind CSS pour le style.
- Recharts pour les graphiques (courbes, radar).
- `@neondatabase/serverless` — driver HTTP officiel de Neon, adapté aux
  fonctions serverless/edge des routes API Next.js (pas de pool TCP à gérer).

## Configuration Neon — à faire avant de lancer le projet

### 1. Récupérer la chaîne de connexion

1. Allez sur [console.neon.tech](https://console.neon.tech) et ouvrez le
   projet qui contient déjà le warehouse `donnee2-aqi` (celui utilisé par
   `DATABASE_URL` dans les secrets GitHub Actions du pipeline).
2. **Project → Connect** (ou **Dashboard → Connection Details**).
3. Choisissez la branche (en général `main` / `production`).
4. **Copiez la connection string "pooled"** (le nom d'hôte contient
   `-pooler`, ex. `ep-xxxx-pooler.eu-central-1.aws.neon.tech`). C'est cette
   variante qu'il faut utiliser avec le driver HTTP `@neondatabase/serverless`
   — elle passe par PgBouncer côté Neon et évite de saturer les connexions
   sur un projet à trafic imprévisible (fonctions serverless = beaucoup de
   connexions courtes).
5. Vérifiez que l'URL contient bien `?sslmode=require` (Neon l'exige
   toujours ; le paramètre est ajouté par défaut).

### 2. Configurer le projet en local

```bash
cp .env.example .env.local
```

Dans `.env.local`, collez la chaîne récupérée :

```
DATABASE_URL="postgresql://<user>:<password>@ep-xxxx-pooler.<region>.aws.neon.tech/<database>?sslmode=require"
```

`.env.local` est déjà ignoré par git (`.gitignore`) — ne committez jamais
cette valeur.

### 3. Vérifier que le schéma existe déjà dans cette base

Ce dashboard suppose que `sql/schema.sql` du repo `donnee2-aqi` a déjà été
appliqué et que `src/load.py` a déjà chargé des données. Pour vérifier :

```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM fact_qualite_air;"
```

Si la table n'existe pas encore, appliquez le schéma du repo `donnee2-aqi` :

```bash
psql "$DATABASE_URL" -f /chemin/vers/donnee2-aqi/sql/schema.sql
```

puis lancez au moins un cycle `extract → transform → load` du pipeline pour
peupler les tables (voir le README de `donnee2-aqi`).

### 4. Installer les dépendances et lancer le dashboard

```bash
npm install
npm run dev
```

Le dashboard est servi sur [http://localhost:3000](http://localhost:3000).

### 5. Déploiement (optionnel, ex. Vercel)

1. Poussez ce projet sur un repo GitHub séparé (ou un sous-dossier du repo
   `donnee2-aqi` si vous préférez tout garder ensemble).
2. Sur [Vercel](https://vercel.com), importez le repo.
3. Dans **Project Settings → Environment Variables**, ajoutez `DATABASE_URL`
   avec la même chaîne de connexion Neon (variante `-pooler`).
4. Déployez. Comme les routes API et la page sont forcées en rendu
   dynamique (`export const dynamic = "force-dynamic"`), aucune requête
   Neon n'est exécutée pendant le build — seulement à chaque visite — donc
   pas besoin que `DATABASE_URL` soit disponible au moment du build, mais
   il vous faut malgré tout la définir pour le runtime.

### Notes sur Neon spécifiquement

- **Boucle de panic Turbopack en dev (`FATAL: An unexpected Turbopack error
  occurred`, en boucle, alors que les requêtes renvoient bien `200`)** : bug
  connu de Turbopack avec son watcher de fichiers sur les systèmes de fichiers
  lents ou réseau (partage réseau, montage NFS/VirtualBox/sshfs...). Le script
  `npm run dev` de ce projet utilise déjà `next dev --webpack` (le filet de
  secours officiel de Next 16) pour éviter ce bug. Pour retenter Turbopack
  (plus rapide quand ça fonctionne), utilise `npm run dev:turbopack` — et si
  possible, place le projet sur un disque local plutôt que sur un montage
  réseau.
- **IPv6 non fonctionnel (VM, WSL, certains réseaux d'entreprise)** : si `npm run
  dev` renvoie `NeonDbError: fetch failed` / `ETIMEDOUT` alors que `curl` vers
  le même hôte fonctionne, c'est presque toujours parce que Node.js reste
  bloqué à essayer une adresse IPv6 injoignable avant de retomber sur IPv4
  (contrairement à `curl`, qui fait ce repli en quelques millisecondes). Les
  scripts `dev` et `start` de ce projet forcent déjà
  `NODE_OPTIONS=--dns-result-order=ipv4first` pour éviter ce problème ; si tu
  lances Next.js autrement (PM2, Docker sans ce script, etc.), ajoute ce même
  flag.
- **Scale-to-zero** : si la base Neon est en veille (pas de requête récente),
  la première requête après une période d'inactivité peut prendre 1 à 2
  secondes de plus (réveil du compute). Les requêtes suivantes sont
  normales. C'est attendu et sans configuration à faire.
- **Branches Neon** : si vous utilisez une branche de développement Neon
  distincte de la branche `main` utilisée par le pipeline en production,
  changez simplement l'hôte dans `DATABASE_URL` — le code de ce dashboard
  ne dépend d'aucune branche en particulier.
- **Pourquoi le driver HTTP et pas `pg` classique** : les routes API Next.js
  déployées en serverless (Vercel, etc.) créent une fonction éphémère par
  requête ; un pool de connexions TCP classique (`pg.Pool`) s'épuise vite
  dans ce contexte. Le driver `@neondatabase/serverless` interroge Neon en
  HTTP, une requête = un appel, sans connexion persistante à gérer.

## Structure du projet

```
.
├── app/
│   ├── page.tsx                 # Dashboard principal (Server Component)
│   ├── layout.tsx / globals.css
│   └── api/
│       ├── overview/route.ts    # Moyennes par ville
│       ├── distribution/route.ts# % de temps par catégorie AQI
│       ├── ranking/route.ts     # Dernière mesure par ville
│       ├── timeseries/route.ts  # Série journalière par polluant
│       ├── heatmap/route.ts     # Moyenne jour×heure par ville/polluant
│       └── meta/route.ts        # Liste des villes, plage de dates
├── components/                  # AtmosphereBar, RankingTable, graphiques…
├── lib/
│   ├── db.ts                    # Connexion Neon (@neondatabase/serverless)
│   ├── queries.ts                # Toutes les requêtes SQL
│   ├── constants.ts              # Villes, polluants, couleurs, libellés
│   ├── types.ts
│   └── format.ts
├── .env.example
└── tailwind.config.ts
```

## Sécurité des requêtes dynamiques

Les endpoints `timeseries` et `heatmap` acceptent un nom de polluant en
paramètre d'URL et l'utilisent dans le nom de colonne SQL (`AVG(f.pm2_5)`,
etc.), ce qui empêche de le passer en paramètre lié classique (`$1`). Ce nom
est systématiquement vérifié par `isValidPollutant()` contre une liste
blanche fixe (`lib/constants.ts`) **avant** toute interpolation ; toute
valeur hors de cette liste renvoie une erreur 400 sans jamais atteindre la
base.
