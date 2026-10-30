export {};

declare global {
  namespace Cloudflare {
    interface Env {
    NISAB_API_KEY?: string;
    NISAB_API_URL?: string;
    }
  }
}
