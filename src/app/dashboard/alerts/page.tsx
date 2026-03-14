import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import QuickUpdate from "@/components/QuickUpdate";
import { createAlert } from "./actions";
import { updateAlertStatus } from "./update";
import { updateAlertsBulk } from "./bulk";

interface AlertsPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  const { error } = await searchParams;
  const supabase = createSupabaseAdminClient();
  const { data: alerts } = await supabase
    .from("alerts")
    .select("id,message,severity,status,created_at,customers(full_name)")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: customers } = await supabase
    .from("customers")
    .select("id,full_name")
    .order("full_name", { ascending: true });

  const errorMessage =
    error === "missing-message"
      ? "Alert message is required."
      : error === "no-selection"
        ? "Select at least one alert for bulk actions."
        : error === "no-bulk-update"
          ? "Choose a status to update."
          : error
            ? decodeURIComponent(error)
            : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Alerts</p>
        <h1 className="text-3xl font-semibold text-frost">Monitoring alerts</h1>
        <p className="max-w-xl text-haze">
          Track watchlist hits, suspicious activity, and high-risk events.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Create alert</h2>
          <form action={createAlert} className="mt-4 flex flex-col gap-4">
            <textarea
              name="message"
              placeholder="Alert message"
              required
              rows={4}
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
              name="severity"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              {"low,medium,high,critical".split(",").map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Create alert
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Latest alerts</h2>
          {alerts?.length ? (
            <form
              id="bulk-alerts-form"
              action={updateAlertsBulk}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              <select
                name="bulk_status"
                className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-2 text-xs text-frost focus:border-neon focus:outline-none"
                defaultValue=""
              >
                <option value="">Bulk status</option>
                {["open", "in_review", "closed"].map((status) => (
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
            {alerts?.length ? (
              alerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="alert_ids"
                      value={alert.id}
                      form="bulk-alerts-form"
                      className="mt-1 h-4 w-4 rounded border-white/30 bg-ink/80 text-neon focus:ring-neon"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-frost">{alert.message}</p>
                        <span className="text-xs uppercase tracking-[0.2em] text-haze">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-haze">
                        {(alert.customers as { full_name?: string } | null)?.full_name ??
                          "No customer linked"}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                        {alert.status}
                      </p>
                      <div className="mt-3">
                        <QuickUpdate
                          action={updateAlertStatus}
                          label="Update status"
                          name="status"
                          options={["open", "in_review", "closed"]}
                          defaultValue={alert.status}
                          hiddenFields={[{ name: "id", value: alert.id }]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No alerts yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
