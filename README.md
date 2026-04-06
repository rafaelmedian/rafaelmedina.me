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
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Mapbox setup

The contact map uses Mapbox when a token is available.

1. Copy `.env.example` to `.env`.
2. Set `VITE_MAPBOX_TOKEN` to your Mapbox public token (`pk...`).
3. Restart the Vite dev server.

If no token is set (or Mapbox fails), the UI falls back to an OpenStreetMap embed.

## Analytics setup

Google Analytics 4 is wired in as an optional client-side integration.

1. Set `VITE_GA_MEASUREMENT_ID` in `.env` or your GitHub Pages build environment.
2. Use your GA4 web stream measurement ID, which looks like `G-XXXXXXXXXX`.
3. Run a production build and deploy as usual.

When the measurement ID is present, the site records:

- initial page views
- browser history/hash page changes
- outbound, `mailto:`, and download link clicks
- work preview opens from the portfolio grid

## Vercel Analytics setup

Vercel Web Analytics is also wired into the app, but it is disabled by default.

1. Set `VITE_ENABLE_VERCEL_ANALYTICS=true` when you are deploying through Vercel, or provide a Vercel observability base path/client config if you are proxying the analytics endpoints.
2. Enable Web Analytics for the project in Vercel.
3. Deploy again.

Notes:

- On GitHub Pages, the GA4 integration above is the working analytics path unless you explicitly provide Vercel analytics endpoints.
- Vercel automatically handles page views through its injected script.
- Custom interaction events are also forwarded to Vercel when the integration is enabled.
