import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { upsertRiskProfile } from "./actions";

interface RiskProfilesPageProps {
  searchParams: { success?: string; error?: string };
}

export default async function RiskProfilesPage({ searchParams }: RiskProfilesPageProps) {
  const supabase = createSupabaseAdminClient();
  const { data: profiles } = await supabase
    .from("risk_profiles")
    .select("id,score,level,last_assessed_at,customers(full_name)")
    .order("last_assessed_at", { ascending: false })
    .limit(20);

  const { data: customers } = await supabase
    .from("customers")
    .select("id,full_name")
    .order("full_name", { ascending: true });

  const errorMessage =
    searchParams.error === "missing-customer"
      ? "Customer is required."
      : searchParams.error === "invalid-json"
        ? "Factors JSON is invalid."
        : searchParams.error
          ? decodeURIComponent(searchParams.error)
          : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Risk Profiles</p>
        <h1 className="text-3xl font-semibold text-frost">Risk scoring</h1>
        <p className="max-w-xl text-haze">
          Update dynamic risk scores and factors for ongoing monitoring.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Upsert profile</h2>
          <form action={upsertRiskProfile} className="mt-4 flex flex-col gap-4">
            <select
              name="customer_id"
              required
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              <option value="">Select customer</option>
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name}
                </option>
              ))}
            </select>
            <input
              name="score"
              type="number"
              step="0.1"
              placeholder="Risk score (0-100)"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <select
              name="level"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              {"low,medium,high".split(",").map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <textarea
              name="factors"
              placeholder='Factors JSON (optional)'
              rows={4}
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Save risk profile
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Latest profiles</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {profiles?.length ? (
              profiles.map((profile) => (
                <div key={profile.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-frost">
                      {(profile.customers as { full_name?: string } | null)?.full_name ??
                        "Customer"}
                    </p>
                    <span className="text-xs uppercase tracking-[0.2em] text-haze">
                      {profile.level ?? "unscored"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-haze">Score: {profile.score ?? "N/A"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No profiles yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
