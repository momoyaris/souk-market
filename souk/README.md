# Souk — Marketplace Frontend

Frontend React production-ready pour une marketplace. Stack : **React 18 · Vite · Tailwind CSS · Zustand · React Router · Framer Motion · Axios**.

---

## 🚀 Démarrage rapide

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and configure
cp .env.example .env

# 3. Start dev server
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173)

---

## 📁 Structure du projet

```
src/
├── assets/               # Images, icons, fonts
├── components/
│   ├── ui/               # Button, Input, Badge, Toast, Skeleton, SearchBar
│   ├── layout/           # Navbar, Footer
│   └── cards/            # ListingCard
├── pages/
│   ├── Home/             # HomePage — grille + hero + filtres catégories
│   ├── Search/           # SearchPage — recherche + filtres prix/tri
│   ├── Listing/          # ListingPage — détail annonce
│   ├── Auth/             # LoginPage, RegisterPage
│   ├── Publish/          # PublishPage — formulaire multi-étapes
│   ├── Messages/         # MessagesPage — chat temps réel
│   ├── Profile/          # ProfilePage — dashboard vendeur
│   ├── Favorites/        # FavoritesPage
│   ├── Admin/            # AdminPage — panel admin
│   └── NotFound/         # 404
├── routes/               # ProtectedRoute
├── services/api/         # client.js (Axios) · listings.js · auth.js · messages.js
├── store/                # authStore · favoritesStore · uiStore (Zustand)
├── hooks/                # useListings · useToast
├── utils/                # helpers · mockData
├── layouts/              # MainLayout
├── App.jsx               # Routes React Router
└── main.jsx
```

---

## 🔗 Connecter au backend Laravel

### 1. Configurer l'URL API

```env
# .env
VITE_API_URL=http://localhost:8000/api
```

### 2. Remplacer les données mockées

Dans `src/hooks/useListings.js`, remplace le mock par :

```js
import { listingsService } from '@/services/api/listings'

const { data } = await listingsService.getAll(filters)
setListings(data.data)
```

### 3. Auth avec Laravel Sanctum

Dans `src/pages/Auth/LoginPage.jsx`, remplace le mock par :

```js
import { authService } from '@/services/api/auth'

const { data } = await authService.login(form)
login(data.user, data.token)
```

Le token est automatiquement attaché à toutes les requêtes via `src/services/api/client.js`.

---

## 📦 Build production

```bash
npm run build
# Output: dist/
```

## 🚀 Déploiement Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## ✅ Pages & Features

| Page | Route | Auth requise |
|------|-------|-------------|
| Home | `/` | ❌ |
| Recherche | `/search` | ❌ |
| Annonce détail | `/listing/:id` | ❌ |
| Connexion | `/login` | ❌ |
| Inscription | `/register` | ❌ |
| Publier | `/publish` | ✅ |
| Messages | `/messages` | ✅ |
| Profil | `/profile` | ✅ |
| Favoris | `/favorites` | ✅ |
| Admin | `/admin` | ✅ |

---

## 🛠️ Prochaines étapes backend

1. **Laravel API** — `laravel new souk-api` + Laravel Sanctum
2. **Tables** — `users`, `listings`, `messages`, `conversations`, `favorites`
3. **Storage** — S3 ou Cloudflare R2 pour les images
4. **WebSocket** — Laravel Echo + Pusher pour messagerie temps réel
5. **Stripe** — paiements sécurisés pour annonces premium
