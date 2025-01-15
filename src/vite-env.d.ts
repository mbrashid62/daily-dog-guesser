/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string; // For Vite setup
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
