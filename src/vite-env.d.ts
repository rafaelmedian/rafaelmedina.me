/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_APPLE_MAPS_SNAPSHOT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
