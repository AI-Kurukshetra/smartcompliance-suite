import QuickUpdate from "@/components/QuickUpdate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSession } from "./actions";
import { updateSessionStatus } from "./update";
import { updateSessionsBulk } from "./bulk";

interface SessionsPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function SessionsPage({ searchParams }: SessionsPageProps) {
  const { error } = await searchParams;
  const supabase = createSupabaseAdminClient();
  const { data: sessions } = await supabase
    .from("verification_sessions")
    .select("id,provider,status,decision,risk_score,started_at,customers(full_name)")
    .order("started_at", { ascending: false })
    .limit(20);

  const { data: customers } = await supabase
    .from("customers")
    .select("id,full_name")
    .order("full_name", { ascending: true });

  const errorMessage =
    error === "missing-provider"
      ? "Provider name is required."
      : error === "no-selection"
        ? "Select at least one session for bulk actions."
        : error === "no-bulk-update"
          ? "Choose a status to update."
          : error
            ? decodeURIComponent(error)
            : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Verification Sessions</p>
        <h1 className="text-3xl font-semibold text-frost">Verification pipeline</h1>
        <p className="max-w-xl text-haze">
          Monitor identity verification sessions and decision outcomes.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Start session</h2>
          <form action={createSession} className="mt-4 flex flex-col gap-4">
            <input
              name="provider"
              placeholder="Provider (Alloy, Trulioo)"
              required
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <select
              name="customer_id"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              <option value="">Select customer (optional)</option>
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name}
                </option>
              ))}
            </select>
            <select
              name="status"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              {"in_progress,completed,failed".split(",").map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              name="decision"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              <option value="">Decision (optional)</option>
              {"approved,rejected,manual_review".split(",").map((decision) => (
                <option key={decision} value={decision}>
                  {decision}
                </option>
              ))}
            </select>
            <input
              name="risk_score"
              type="number"
              step="0.1"
              placeholder="Risk score"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Create session
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Latest sessions</h2>
          {sessions?.length ? (
            <form
              id="bulk-sessions-form"
              action={updateSessionsBulk}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              <select
                name="bulk_status"
                className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-2 text-xs text-frost focus:border-neon focus:outline-none"
                defaultValue=""
              >
                <option value="">Bulk status</option>
                {["in_progress", "completed", "failed"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-frost/90 transition hover:border-white/40"
              >
                Apply to selected
              </button>
            </form>
          ) : null}
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {sessions?.length ? (
              sessions.map((session) => (
                <div key={session.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="session_ids"
                      value={session.id}
                      form="bulk-sessions-form"
                      className="mt-1 h-4 w-4 rounded border-white/30 bg-ink/80 text-neon focus:ring-neon"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-frost">{session.provider}</p>
                        <span className="text-xs uppercase tracking-[0.2em] text-haze">
                          {session.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-haze">
                        {(session.customers as { full_name?: string } | null)?.full_name ??
                          "No customer linked"}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                        Decision: {session.decision ?? "pending"} · Risk: {session.risk_score ?? "N/A"}
                      </p>
                      <div className="mt-3">
                        <QuickUpdate
                          action={updateSessionStatus}
                          label="Update status"
                          name="status"
                          options={["in_progress", "completed", "failed"]}
                          defaultValue={session.status}
                          hiddenFields={[{ name: "id", value: session.id }]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No sessions yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
