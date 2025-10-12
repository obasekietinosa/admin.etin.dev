# admin.etin.dev

Administrative dashboard for the [api.etin.dev](https://github.com/obasekietinosa/api.etin.dev) platform. The project is bootstrapped with [Vite](https://vitejs.dev/) and combines **React**, **TypeScript**, **React Router**, and **TanStack Query** to deliver a fast, type-safe foundation for future features.

## Getting started

```bash
npm install
npm run dev
```

The development server runs on [http://localhost:5173](http://localhost:5173) by default.

## Available scripts

- `npm run dev` – start the Vite development server with hot module reloading.
- `npm run build` – type-check the project and build a production bundle.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint using the TypeScript-aware configuration bundled with Vite.

## Project structure

```
src/
├── main.tsx          # Query client + router providers
├── router.tsx        # Route configuration for React Router
├── App.tsx           # Root layout shell with navigation
└── routes/           # Feature routes (dashboard, about, not-found)
```

## Next steps

- Replace the placeholder dashboard query with real API integrations.
- Define shared layout primitives (navigation, theming, error boundaries).
- Integrate authentication and authorization aligned with the backend.
