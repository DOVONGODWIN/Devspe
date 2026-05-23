🛒 Nexaa Market
SaaS e-commerce de revente d'invendus — Projet de Spécialité Développement Web (Bachelor 2 → B3, ESPL Angers).
Nexaa Market est une plateforme permettant à des entreprises et des particuliers de revendre leurs invendus (fins de série, surplus, articles d'occasion). L'application repose sur une architecture trois tiers découplée, déployée en production sur hébergement mutualisé.

🔗 Démonstration en ligne
ComposantURLFront office (acheteurs / vendeurs)https://app.godwin-messanhdovon.espl-angers.ytAPI RESThttps://api.godwin-messanhdovon.espl-angers.ytBack office (administration)https://admin.godwin-messanhdovon.espl-angers.yt

💳 Paiement en mode test Stripe — carte 4242 4242 4242 4242, date future quelconque, CVC 123.


🏗️ Architecture
┌──────────────────┐      ┌──────────────────┐
│   FRONT OFFICE   │      │   BACK OFFICE    │
│   React + TS     │      │   React + TS     │
│   app.[domaine]  │      │  admin.[domaine] │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         └──────────┬──────────────┘
                    │  HTTPS / JSON (JWT)
           ┌────────▼─────────┐      ┌──────────────┐
           │   API FastAPI    │─────▶│    Stripe    │
           │   api.[domaine]  │      │  (paiement)  │
           │ Passenger+a2wsgi │      └──────────────┘
           └────────┬─────────┘
                    │
           ┌────────▼─────────┐
           │   PostgreSQL     │
           └──────────────────┘

🧰 Stack technique
Backend — Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, PostgreSQL, JWT (python-jose), bcrypt (passlib), Stripe, a2wsgi.
Frontend — React 18, TypeScript, Vite, TailwindCSS, Axios, React Router, Recharts.
Outils — Git/GitHub, Docker Compose (dev local), Swagger (documentation API auto-générée).

📁 Structure du dépôt
.
├── backend/      API REST FastAPI
│   ├── app/
│   │   ├── api/        Endpoints et dépendances
│   │   ├── core/       Configuration et sécurité
│   │   ├── db/         Session et base SQLAlchemy
│   │   ├── models/     Modèles ORM (User, Product, Order…)
│   │   ├── schemas/    Schémas Pydantic
│   │   └── services/   Logique métier
│   ├── alembic/        Migrations de base de données
│   └── requirements.txt
├── frontend/     Front office React (acheteurs / vendeurs)
├── admin/        Back office React (administration)
└── docker-compose.yml

🚀 Installation locale
Prérequis

Docker et Docker Compose
Node.js 18+
Python 3.11+

1. Cloner le dépôt
bashgit clone [À COMPLÉTER : URL du dépôt GitHub]
cd Devspe
2. Backend + base de données (Docker)
bash# Lance l'API et PostgreSQL
docker compose up -d

# L'API est disponible sur http://localhost:8003
# Documentation Swagger : http://localhost:8003/docs

Crée un fichier .env dans backend/ à partir des variables attendues (voir backend/app/core/config.py) : DATABASE_URL, JWT_SECRET_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, CORS_ORIGINS.

3. Migrations de base de données
bashdocker compose exec backend alembic upgrade head
4. Front office
bashcd frontend
npm install
npm run dev
# Disponible sur http://localhost:5173
5. Back office (admin)
bashcd admin
npm install
npm run dev
# Disponible sur http://localhost:5180

🔐 Sécurité

Mots de passe hachés avec bcrypt, jamais stockés en clair.
Authentification par JWT : jeton d'accès court + jeton de rafraîchissement révocable, stocké haché en base.
Contrôle d'accès par rôle vérifié côté serveur (les routes admin exigent le rôle admin).
UUID en clés primaires : aucun identifiant prévisible exposé dans les URL.
CORS restreint aux seuls sous-domaines légitimes.
Validation systématique des entrées via Pydantic.
Webhook Stripe vérifié par signature.
Secrets en variables d'environnement, exclus du dépôt (.gitignore).
HTTPS forcé sur les trois sous-domaines.


✨ Fonctionnalités
Acheteur — catalogue avec recherche et filtres, fiche produit, panier, paiement Stripe, historique de commandes.
Vendeur — publication de produits avec photo, gestion du catalogue, tableau de bord des ventes (KPI).
Administrateur — statistiques globales, gestion des comptes (activation, rôles), modération des produits.

🌿 Workflow Git
Deux branches : developsp (développement) et main (production déployée sur N0C). Le code testé sur developsp est fusionné dans main, puis déployé via git pull sur le serveur.

👤 Auteur
Godwin Messanh Dovon — Bachelor 2 → B3 Développeur Web — ESPL Angers — Mai 2026.