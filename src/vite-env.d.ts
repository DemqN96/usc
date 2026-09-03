/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PHONE_PRIMARY?: string
  readonly VITE_PHONE_SECONDARY?: string
  readonly VITE_EMAIL?: string
  readonly VITE_FACEBOOK_URL?: string
  readonly VITE_INSTAGRAM_URL?: string
  readonly VITE_FORM_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
