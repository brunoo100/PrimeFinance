# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
# PrimeFinance

- Overview: React + TypeScript + Vite finance app with Supabase auth.
- Tech: `react`, `react-router-dom`, `react-hook-form`, `zod`, `@supabase/supabase-js`, `vite`, `typescript`.
- Status: Basic auth, private routes, and layout are set up.

## Getting Started

- Prerequisites: Node.js 18+, npm.
- Install deps: `npm install`
- Configure env: copy `.env.example` to `.env` and fill keys.
- Run dev: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint`

## Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key.
- Place them in `.env` at the project root.

## Project Structure

- `src/Components/Layout`: App shell (`MainLayout`) wrapping routes.
- `src/context/AuthContext.tsx`: Supabase auth provider (`user`, `login`, `register`, `logout`, `loading`).
- `src/Routes/routes.tsx`: Router config, protects `/` and `/dashboard` via `PrivateRoutes`.
- `src/Routes/PrivateRoutes.tsx`: Redirects unauthenticated users to `/login`.
- `src/Pages/Login`: Login form with `react-hook-form` + `zod` using `AuthContext`.
- `src/lib/supabaseClient.ts`: Supabase client using Vite env vars.

## Routing

- Public: `/login`, error `*`.
- Private: `/` (Home), `/dashboard` (Dashboard).
- Behavior: Unauthenticated access redirects to `/login`. After login, navigates back to the requested page.

## Authentication

- Provider: Wrap the app with `AuthProvider` (see `main.tsx`).
- Methods: `login(email, password)`, `register(name, email, password)`, `logout()`.
- Session: Listens to Supabase auth state and hydrates `user`.

## Development Notes

- Forms: Validation via `zod` schema and `zodResolver`.
- Styling: CSS Modules under each page/component folder.
- Type-check: TypeScript project split `tsconfig.app.json` and `tsconfig.node.json`.

## Scripts

- `npm run dev`: Start Vite dev server.
- `npm run build`: Type-check and build production assets.
- `npm run preview`: Preview built app.
- `npm run lint`: Run ESLint.

## Setup Supabase

- Create a Supabase project and retrieve the URL and anon key.
- Add email/password auth in Supabase Auth settings.
- Optionally add `name` to `user_metadata` during sign up (already handled).

## Folder Tree (key parts)

- `src/`

## Try It

- Start dev server:

```sh
npm install
cp .env.example .env # then fill values
npm run dev
```

- Build and preview:

```sh
npm run build
npm run preview
```

## License

- This project is private; no license specified.
