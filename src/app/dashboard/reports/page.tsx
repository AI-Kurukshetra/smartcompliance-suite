import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createReport } from "./actions";

interface ReportsPageProps {
  searchParams: { success?: string; error?: string };
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const supabase = createSupabaseAdminClient();
  const { data: reports } = await supabase
    .from("reports")
    .select("id,report_type,period_start,period_end,status,created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  const errorMessage =
    searchParams.error === "missing-type"
      ? "Report type is required."
      : searchParams.error
        ? decodeURIComponent(searchParams.error)
        : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Reports</p>
        <h1 className="text-3xl font-semibold text-frost">Regulatory reports</h1>
        <p className="max-w-xl text-haze">
          Generate SAR, CTR, and internal compliance summaries.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Create report</h2>
          <form action={createReport} className="mt-4 flex flex-col gap-4">
            <input
              name="report_type"
              placeholder="Report type (SAR, CTR)"
              required
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="period_start"
                type="date"
                className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
              />
              <input
                name="period_end"
                type="date"
                className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Create report
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Recent reports</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {reports?.length ? (
              reports.map((report) => (
                <div key={report.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-frost">{report.report_type}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-haze">
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-haze">
                    {report.period_start ?? "N/A"} → {report.period_end ?? "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No reports generated.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
