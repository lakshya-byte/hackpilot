// Server-only: the Go backend base URL. Never exposed to the client — all
// browser requests go through same-origin /api/* proxy routes instead.
export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";
