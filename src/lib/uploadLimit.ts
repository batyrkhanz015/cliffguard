/** Largest notice upload, kept under Vercel's 4.5 MB request-body limit. Shared by the form and the server. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_UPLOAD_MB = MAX_UPLOAD_BYTES / (1024 * 1024);
