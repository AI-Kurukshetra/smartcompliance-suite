import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createRule } from "./actions";

interface RulesPageProps {
  searchParams: { success?: string; error?: string };
}

export default async function RulesPage({ searchParams }: RulesPageProps) {
  const supabase = createSupabaseAdminClient();
  const { data: rules } = await supabase
    .from("compliance_rules")
    .select("id,name,description,is_active,created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  const errorMessage =
    searchParams.error === "missing-name"
      ? "Rule name is required."
      : searchParams.error === "invalid-json"
        ? "Rules JSON is invalid."
        : searchParams.error
          ? decodeURIComponent(searchParams.error)
          : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Rules</p>
        <h1 className="text-3xl font-semibold text-frost">Compliance rules</h1>
        <p className="max-w-xl text-haze">
          Define decisioning logic for risk scoring and onboarding workflows.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Create rule</h2>
          <form action={createRule} className="mt-4 flex flex-col gap-4">
            <input
              name="name"
              placeholder="Rule name"
              required
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <textarea
              name="description"
              placeholder="Description"
              rows={3}
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <textarea
              name="rules"
              placeholder='Rules JSON (e.g. {"risk":"high"})'
              rows={4}
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Create rule
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Active rules</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {rules?.length ? (
              rules.map((rule) => (
                <div key={rule.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-frost">{rule.name}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-haze">
                      {rule.is_active ? "active" : "inactive"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-haze">
                    {rule.description ?? "No description"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No rules yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
