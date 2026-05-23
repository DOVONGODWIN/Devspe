Front office — Nexaa Market
Interface destinée aux acheteurs et vendeurs, développée avec React + TypeScript + Vite.
Stack
React 18 · TypeScript · Vite · TailwindCSS · Axios · React Router · Recharts · Lucide React.
Structure
src/
├── api/client.ts        Client Axios + rafraîchissement automatique des jetons
├── context/             AuthContext et CartContext (état global)
├── pages/
│   ├── auth/            Connexion, inscription
│   ├── catalog/         Accueil (catalogue), fiche produit
│   ├── cart/            Panier, succès/annulation de paiement
│   ├── profile/         Profil, mes commandes
│   └── seller/          Publication, mes produits, tableau de bord ventes
├── components/          Header, BottomNav, AppShell, composants UI
├── hooks/               Hooks personnalisés (ex : nav cachée au scroll)
├── types/               Types TypeScript partagés
└── utils/               Formatage prix, URL d'images
Lancer en local
bashnpm install
npm run dev
# http://localhost:5173

Nécessite que l'API tourne (voir le README du backend).

Variables d'environnement
env# .env.development
VITE_API_URL=http://localhost:8003/api/v1

# .env.production
VITE_API_URL=https://api.godwin-messanhdovon.espl-angers.yt/api/v1
Build de production
bashnpm run build      # génère le dossier dist/
npm run preview    # prévisualise le build localement
Le contenu de dist/ est ensuite déployé sur le sous-domaine app, avec un fichier .htaccess redirigeant toutes les routes vers index.html (application monopage).
Fonctionnalités

Catalogue avec recherche et filtres (catégorie, prix)
Fiche produit détaillée
Panier et tunnel de commande
Paiement en ligne via Stripe
Espace vendeur : publication de produits avec photo, gestion du catalogue, tableau de bord des ventes
Interface responsive desktop et mobile