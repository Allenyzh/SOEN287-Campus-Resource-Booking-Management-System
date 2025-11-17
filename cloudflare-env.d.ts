// Cloudflare environment types
declare global {
  interface CloudflareEnv {
    // D1 Database binding
    DB: D1Database;
  }
}

export {};
