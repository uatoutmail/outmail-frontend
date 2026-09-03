/**
 * Shown while this segment streams in.
 *
 * There was no loading.jsx anywhere, so a slow segment rendered nothing at all
 * — an apparently frozen page. A skeleton is not decoration here; it is the
 * difference between "loading" and "broken".
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="h-8 w-8 rounded-full border-2 border-white/15 border-t-primary animate-spin" />
    </div>
  );
}
