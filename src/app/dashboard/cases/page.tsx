import Link from "next/link";
import QuickUpdate from "@/components/QuickUpdate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createCase } from "./actions";
import {
  updateCasePriorityFromList,
  updateCaseStatusFromList,
  updateCasesBulk
} from "./update";

interface CasesPageProps {
  searchParams: { success?: string; error?: string };
}

export default async function CasesPage({ searchParams }: CasesPageProps) {
  const supabase = createSupabaseAdminClient();
  const { data: cases } = await supabase
    .from("cases")
    .select("id,title,priority,status,created_at,customers(full_name)")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: customers } = await supabase
    .from("customers")
    .select("id,full_name")
    .order("full_name", { ascending: true });

  const errorMessage =
    searchParams.error === "missing-title"
      ? "Case title is required."
      : searchParams.error === "no-selection"
        ? "Select at least one case for bulk actions."
        : searchParams.error === "no-bulk-update"
          ? "Choose a status or priority to update."
          : searchParams.error
            ? decodeURIComponent(searchParams.error)
            : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Cases</p>
        <h1 className="text-3xl font-semibold text-frost">Case management</h1>
        <p className="max-w-xl text-haze">
          Review flagged customers, assign priorities, and document decisions.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Open new case</h2>
          <form action={createCase} className="mt-4 flex flex-col gap-4">
            <input
              name="title"
              placeholder="Case title"
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
              name="priority"
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
              Create case
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Recent cases</h2>
          {cases?.length ? (
            <form
              id="bulk-cases-form"
              action={updateCasesBulk}
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
              <select
                name="bulk_priority"
                className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-2 text-xs text-frost focus:border-neon focus:outline-none"
                defaultValue=""
              >
                <option value="">Bulk priority</option>
                {["low", "medium", "high", "critical"].map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
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
            {cases?.length ? (
              cases.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="case_ids"
                      value={item.id}
                      form="bulk-cases-form"
                      className="mt-1 h-4 w-4 rounded border-white/30 bg-ink/80 text-neon focus:ring-neon"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/dashboard/cases/${item.id}`}
                          className="font-semibold text-frost transition hover:text-neon"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs uppercase tracking-[0.2em] text-haze">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-haze">
                        {(item.customers as { full_name?: string } | null)?.full_name ??
                          "No customer linked"}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                        Priority: {item.priority}
                      </p>
                      <div className="mt-3 space-y-3">
                        <QuickUpdate
                          action={updateCaseStatusFromList}
                          label="Update status"
                          name="status"
                          options={["open", "in_review", "closed"]}
                          defaultValue={item.status}
                          hiddenFields={[{ name: "id", value: item.id }]}
                        />
                        <QuickUpdate
                          action={updateCasePriorityFromList}
                          label="Update priority"
                          name="priority"
                          options={["low", "medium", "high", "critical"]}
                          defaultValue={item.priority}
                          hiddenFields={[{ name: "id", value: item.id }]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No cases yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
