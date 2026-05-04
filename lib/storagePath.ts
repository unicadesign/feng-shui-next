/**
 * Normalize a Supabase Storage object key.
 *
 * Accepts:
 *   - A bare object key like `1.1.UVOD U FENG SHUI.mp4` (returned unchanged)
 *   - A folder/file key like `course-1/lekcija-1.mp4` (returned unchanged)
 *   - A full Supabase signed URL or public URL — extracts the key, decodes %xx escapes,
 *     and strips any `?token=...` query string.
 *
 * Returns an empty string for falsy input.
 */
export function normalizeStoragePath(input: string | null | undefined): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  // Match either a relative or absolute Supabase storage URL.
  // Examples:
  //   https://<project>.supabase.co/storage/v1/object/sign/<bucket>/<key>?token=...
  //   https://<project>.supabase.co/storage/v1/object/public/<bucket>/<key>
  //   /storage/v1/object/(sign|public)/<bucket>/<key>
  const match = trimmed.match(/\/storage\/v1\/object\/(?:sign|public)\/[^/]+\/(.+?)(?:\?|$)/);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  return trimmed;
}
