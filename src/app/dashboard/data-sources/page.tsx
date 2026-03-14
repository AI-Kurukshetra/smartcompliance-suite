import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createDataSource } from "./actions";

interface DataSourcesPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function DataSourcesPage({ searchParams }: DataSourcesPageProps) {
  const { error } = await searchParams;
  const supabase = createSupabaseAdminClient();
  const { data: sources } = await supabase
    .from("data_sources")
    .select("id,name,category,status,created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  const errorMessage =
    error === "missing-name"
      ? "Data source name is required."
      : error === "invalid-json"
        ? "Config JSON is invalid."
        : error
          ? decodeURIComponent(error)
          : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Data Sources</p>
        <h1 className="text-3xl font-semibold text-frost">Provider connections</h1>
        <p className="max-w-xl text-haze">
          Manage verification vendors and watchlist feeds.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Add data source</h2>
          <form action={createDataSource} className="mt-4 flex flex-col gap-4">
            <input
              name="name"
              placeholder="Provider name"
              required
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <input
              name="category"
              placeholder="Category (KYC, sanctions, biometrics)"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <textarea
              name="config"
              placeholder='Config JSON (optional)'
              rows={4}
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Save source
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Connected sources</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {sources?.length ? (
              sources.map((source) => (
                <div key={source.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-frost">{source.name}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-haze">
                      {source.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-haze">
                    {source.category ?? "Uncategorized"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No data sources configured.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
