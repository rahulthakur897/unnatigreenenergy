import { credentials, trustHighlights } from "@/content/company";

/** Overlaps the hero. Uses a CSS entrance (not scroll reveal) because it is above the fold. */
export function TrustBar() {
  return (
    <section aria-labelledby="trust-title" className="relative z-10 -mt-24 sm:-mt-28">
      <div className="container-site">
        <div className="animate-fade-up rounded-[1.75rem] border border-mist-200 bg-white p-6 shadow-lift [animation-delay:640ms] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
            <h2
              id="trust-title"
              className="font-display text-xl font-bold leading-snug tracking-tight text-ink-950 lg:col-span-3 xl:text-[1.375rem]"
            >
              Trusted Approach. Responsible Energy. <span className="text-leaf-600">Sustainable Future.</span>
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-mist-200">
              {trustHighlights.map(({ label, icon: Icon }) => (
                <li key={label} className="group flex flex-col items-start gap-3 lg:items-center lg:px-4 lg:text-center">
                  <span className="grid size-12 place-items-center rounded-2xl bg-leaf-50 text-forest-700 ring-1 ring-leaf-100 transition-colors duration-500 group-hover:bg-forest-700 group-hover:text-sun-300">
                    <Icon className="size-[1.375rem]" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-ink-900">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Renders only when verified credentials are added in content/company.ts */}
          {credentials.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3 border-t border-mist-200 pt-6">
              {credentials.map((credential) => (
                <li key={credential.label} className="rounded-full border border-mist-200 bg-mist-50 px-4 py-2 text-sm">
                  <span className="font-semibold text-ink-900">{credential.label}</span>
                  <span className="text-ink-500"> · {credential.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
