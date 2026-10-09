/**
 * Instant-navigation fallback for detail pages. Matches the PageHero layout so the
 * page does not jump when the real content streams in.
 */
export function DetailSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading page…</span>
      <div className="surface-dark relative overflow-hidden bg-forest-950">
        <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-40 mask-fade-b" />
        <div
          className={
            compact
              ? "container-site relative flex min-h-[24rem] flex-col justify-end pb-14 pt-40 md:min-h-[26rem]"
              : "container-site relative flex min-h-[32rem] flex-col justify-end pb-16 pt-40 md:min-h-[36rem] md:pb-20 lg:min-h-[40rem]"
          }
        >
          <div className="animate-pulse space-y-5">
            <div className="h-3.5 w-48 rounded-full bg-white/10" />
            <div className="h-3 w-24 rounded-full bg-sun-400/30" />
            <div className="h-12 w-full max-w-3xl rounded-2xl bg-white/12 sm:h-16" />
            <div className="h-12 w-2/3 max-w-xl rounded-2xl bg-white/12 sm:h-16" />
            <div className="h-4 w-full max-w-2xl rounded-full bg-white/8" />
            <div className="h-4 w-1/2 max-w-md rounded-full bg-white/8" />
          </div>
        </div>
      </div>
      <div className="section-y bg-white">
        <div className="container-site grid animate-pulse gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="h-8 w-2/3 rounded-xl bg-mist-200" />
            <div className="h-4 w-full rounded-full bg-mist-100" />
            <div className="h-4 w-11/12 rounded-full bg-mist-100" />
            <div className="h-4 w-4/5 rounded-full bg-mist-100" />
          </div>
          <div className="h-72 rounded-[1.5rem] bg-mist-100 lg:col-span-5" />
        </div>
      </div>
    </div>
  );
}
