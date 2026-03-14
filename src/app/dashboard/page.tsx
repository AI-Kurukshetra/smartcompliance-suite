import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function DashboardPage() {
  const supabase = createSupabaseAdminClient();
  const [
    { count: customerCount },
    { count: caseCount },
    { count: documentCount },
    { count: alertCount },
    { count: lowRiskCount },
    { count: mediumRiskCount },
    { count: highRiskCount },
    { data: topRisk }
  ] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("cases").select("*", { count: "exact", head: true }),
    supabase.from("identity_documents").select("*", { count: "exact", head: true }),
    supabase.from("alerts").select("*", { count: "exact", head: true }),
    supabase.from("risk_profiles").select("*", { count: "exact", head: true }).eq("level", "low"),
    supabase
      .from("risk_profiles")
      .select("*", { count: "exact", head: true })
      .eq("level", "medium"),
    supabase.from("risk_profiles").select("*", { count: "exact", head: true }).eq("level", "high"),
    supabase
      .from("risk_profiles")
      .select("id,score,level,customers(full_name)")
      .order("score", { ascending: false })
      .limit(5)
  ]);

  const { data: recentCases } = await supabase
    .from("cases")
    .select("id,title,priority,status,created_at,customers(full_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentDocuments } = await supabase
    .from("identity_documents")
    .select("id,doc_type,status,country,created_at,customers(full_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Overview</p>
        <h1 className="text-3xl font-semibold text-frost md:text-4xl">
          Compliance command center
        </h1>
        <p className="max-w-xl text-haze">
          Real-time visibility across onboarding, screenings, and case decisions.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Customers", value: customerCount ?? 0 },
          { label: "Open cases", value: caseCount ?? 0 },
          { label: "Documents", value: documentCount ?? 0 },
          { label: "Active alerts", value: alertCount ?? 0 }
        ].map((item) => (
          <div key={item.label} className="gradient-border glass rounded-3xl p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-haze/70">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-frost">{item.value}</p>
            <p className="mt-6 text-sm text-haze">Synced from Supabase.</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="gradient-border glass rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-frost">Risk heatmap</h2>
          <p className="mt-3 text-haze">
            Distribution of customer risk profiles across the portfolio.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Low", value: lowRiskCount ?? 0 },
              { label: "Medium", value: mediumRiskCount ?? 0 },
              { label: "High", value: highRiskCount ?? 0 }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.25em] text-haze/60">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-frost">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="gradient-border glass rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-frost">Top risk customers</h2>
          <div className="mt-5 flex flex-col gap-4">
            {topRisk?.length ? (
              topRisk.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-frost">
                      {(item.customers as { full_name?: string } | null)?.full_name ?? "Customer"}
                    </p>
                    <span className="text-xs uppercase tracking-[0.2em] text-haze">
                      {item.level ?? "unscored"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-haze">Risk score: {item.score ?? "N/A"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No risk profiles yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="gradient-border glass rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-frost">Recent cases</h2>
          <div className="mt-5 flex flex-col gap-4">
            {recentCases?.length ? (
              recentCases.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-center justify-between text-sm text-frost">
                    <span className="font-semibold">{item.title}</span>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs uppercase tracking-[0.2em] text-haze">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-haze">
                    {(item.customers as { full_name?: string } | null)?.full_name ??
                      "Unassigned customer"}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                    Priority: {item.priority}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No cases yet. Create one to see it here.</p>
            )}
          </div>
        </div>

        <div className="gradient-border glass rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-frost">Recent documents</h2>
          <div className="mt-5 flex flex-col gap-4">
            {recentDocuments?.length ? (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-center justify-between text-sm text-frost">
                    <span className="font-semibold">{doc.doc_type ?? "Document"}</span>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs uppercase tracking-[0.2em] text-haze">
                      {doc.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-haze">
                    {(doc.customers as { full_name?: string } | null)?.full_name ??
                      "Unassigned customer"}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                    {doc.country ?? "Unknown jurisdiction"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No documents processed yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
