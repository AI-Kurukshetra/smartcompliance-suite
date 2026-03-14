import Link from "next/link";

const metrics = [
  { label: "Active Experiments", value: "42" },
  { label: "Ops Latency", value: "118ms" },
  { label: "Weekly Uptime", value: "99.98%" }
];

export default function Home() {
  return (
    <main className="noise min-h-screen bg-midnight bg-mesh px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-ink/70 px-4 py-2 text-sm text-haze">
            <span className="h-2 w-2 rounded-full bg-neon shadow-glow" />
            Live systems. Instant signal.
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-frost md:text-6xl">
            SmartCompliance Suite powers KYC decisions with confidence.
          </h1>
          <p className="max-w-2xl text-lg text-haze">
            AI-ready compliance ops with identity verification, case management, and audit trails. Built with Next.js, Tailwind, and Supabase.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-neon px-6 py-3 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Start onboarding
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-frost/90 transition hover:border-white/40"
            >
              Enter command center
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="gradient-border glass rounded-3xl p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-haze/70">
                {metric.label}
              </p>
              <p className="mt-4 text-3xl font-semibold text-frost">{metric.value}</p>
              <p className="mt-6 text-sm text-haze">
                Synthetic baseline for the launch window.
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="gradient-border glass rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-frost">Why it works</h2>
            <p className="mt-3 text-haze">
              Supabase Auth secures your access layer while server components keep the experience fast. Tailwind tokens shape a moody, cinematic space for your analytics.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Server-side sessions",
                "Role-aware routing",
                "Metric-ready layout",
                "Composable cards"
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-ink/60 px-4 py-3 text-sm text-frost/90">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="gradient-border glass rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-frost">Next actions</h2>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-haze">
              <li className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                Connect Supabase keys
              </li>
              <li className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                Invite collaborators
              </li>
              <li className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                Ship your first insight
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
