/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_ENABLE_VERCEL_ANALYTICS?: string
  readonly VITE_VERCEL_OBSERVABILITY_BASEPATH?: string
  readonly VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
