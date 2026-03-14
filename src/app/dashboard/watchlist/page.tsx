import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import QuickUpdate from "@/components/QuickUpdate";
import { createCaseFromMatch, createWatchlistMatch } from "./actions";
import { updateWatchlistStatus } from "./update";
import { updateWatchlistBulk } from "./bulk";

interface WatchlistPageProps {
  searchParams: { success?: string; error?: string };
}

export default async function WatchlistPage({ searchParams }: WatchlistPageProps) {
  const supabase = createSupabaseAdminClient();
  const { data: matches } = await supabase
    .from("watchlist_matches")
    .select("id,list_name,match_score,status,matched_at,customers(full_name)")
    .order("matched_at", { ascending: false })
    .limit(20);

  const { data: customers } = await supabase
    .from("customers")
    .select("id,full_name")
    .order("full_name", { ascending: true });

  const errorMessage =
    searchParams.error === "missing-list"
      ? "List name is required."
      : searchParams.error === "missing-match"
        ? "Select a match first."
        : searchParams.error === "match-not-found"
          ? "Match not found."
          : searchParams.error === "no-selection"
            ? "Select at least one match for bulk actions."
            : searchParams.error === "no-bulk-update"
              ? "Choose a status to update."
              : searchParams.error
                ? decodeURIComponent(searchParams.error)
                : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Watchlist</p>
        <h1 className="text-3xl font-semibold text-frost">Screening matches</h1>
        <p className="max-w-xl text-haze">
          Track sanctions, PEP, and adverse media hits.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Log match</h2>
          <form action={createWatchlistMatch} className="mt-4 flex flex-col gap-4">
            <input
              name="list_name"
              placeholder="List name"
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
            <input
              name="match_score"
              type="number"
              step="0.1"
              placeholder="Match score"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <select
              name="status"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              {"open,cleared,escalated".split(",").map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Create match
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Latest matches</h2>
          {matches?.length ? (
            <form
              id="bulk-watchlist-form"
              action={updateWatchlistBulk}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              <select
                name="bulk_status"
                className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-2 text-xs text-frost focus:border-neon focus:outline-none"
                defaultValue=""
              >
                <option value="">Bulk status</option>
                {["open", "cleared", "escalated"].map((status) => (
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
            {matches?.length ? (
              matches.map((match) => (
                <div key={match.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="match_ids"
                      value={match.id}
                      form="bulk-watchlist-form"
                      className="mt-1 h-4 w-4 rounded border-white/30 bg-ink/80 text-neon focus:ring-neon"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-frost">{match.list_name}</p>
                        <span className="text-xs uppercase tracking-[0.2em] text-haze">
                          {match.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-haze">
                        {(match.customers as { full_name?: string } | null)?.full_name ??
                          "No customer linked"}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                        Score: {match.match_score ?? "N/A"}
                      </p>
                      <div className="mt-3">
                        <QuickUpdate
                          action={updateWatchlistStatus}
                          label="Update status"
                          name="status"
                          options={["open", "cleared", "escalated"]}
                          defaultValue={match.status}
                          hiddenFields={[{ name: "id", value: match.id }]}
                        />
                      </div>
                      <form action={createCaseFromMatch} className="mt-3">
                        <input type="hidden" name="match_id" value={match.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-frost/90 transition hover:border-white/40"
                          disabled={match.status === "escalated"}
                        >
                          {match.status === "escalated" ? "Escalated" : "Create case"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No matches logged.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
