Back office — Nexaa Market Admin
Interface d'administration de la plateforme, réservée aux comptes ayant le rôle admin. Développée avec React + TypeScript + Vite.
Stack
React 18 · TypeScript · Vite · TailwindCSS · Axios · React Router · Recharts · Lucide React.
Structure
src/
├── api/
│   ├── client.ts        Client Axios (stockage de session dédié à l'admin)
│   └── admin.ts         Appels aux endpoints d'administration
├── context/             AuthContext (la connexion refuse les non-admins)
├── pages/
│   ├── Login.tsx        Connexion administrateur
│   ├── Dashboard.tsx    KPI globaux + graphique catégories
│   ├── UsersPage.tsx    Gestion des utilisateurs
│   └── ProductsPage.tsx Modération des produits
├── components/
│   ├── Layout.tsx       Sidebar (desktop) + navigation (mobile)
│   ├── ProtectedRoute.tsx  Accès réservé au rôle admin
│   └── Spinner.tsx
├── types/
└── utils/
Contrôle d'accès
L'accès est protégé à deux niveaux :

Frontend : la connexion refuse les comptes non-admin, et ProtectedRoute empêche l'affichage des pages sans le rôle admin.
Backend : les endpoints /admin/* et /stats/admin exigent le rôle admin, vérifié côté serveur. C'est le verrou réel.

Lancer en local
bashnpm install
npm run dev
# http://localhost:5180

Nécessite un compte avec le rôle admin. Pour promouvoir un compte :
sqlUPDATE users SET role = 'ADMIN' WHERE email = 'mon-email';

Variables d'environnement
env# .env.development
VITE_API_URL=http://localhost:8003/api/v1

# .env.production
VITE_API_URL=https://api.godwin-messanhdovon.espl-angers.yt/api/v1
Build de production
bashnpm run build
Déployé sur le sous-domaine admin, avec un .htaccess de routage monopage.
Fonctionnalités

Tableau de bord des statistiques globales (utilisateurs, produits, commandes, revenu)
Gestion des comptes : activation/désactivation, attribution du rôle admin
Modération des produits : masquer/publier, supprimer