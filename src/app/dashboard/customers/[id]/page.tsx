import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuickUpdate from "@/components/QuickUpdate";
import { updateCustomerRiskLevel, updateCustomerStatus } from "./actions";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: customer } = await supabase
    .from("customers")
    .select(
      "id,full_name,email,status,risk_level,jurisdiction,created_at,risk_profiles(score,level,last_assessed_at)"
    )
    .eq("id", id)
    .single();

  if (!customer) {
    notFound();
  }

  const [{ data: documents }, { data: cases }, { data: alerts }, { data: matches }, { data: sessions }] =
    await Promise.all([
      supabase
        .from("identity_documents")
        .select("id,doc_type,status,country,created_at")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("cases")
        .select("id,title,status,priority,created_at")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("alerts")
        .select("id,message,severity,status,created_at")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("watchlist_matches")
        .select("id,list_name,match_score,status,matched_at")
        .eq("customer_id", customer.id)
        .order("matched_at", { ascending: false }),
      supabase
        .from("verification_sessions")
        .select("id,provider,status,decision,risk_score,started_at")
        .eq("customer_id", customer.id)
        .order("started_at", { ascending: false })
    ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Customers", href: "/dashboard/customers" },
            { label: customer.full_name }
          ]}
        />
        <h1 className="text-3xl font-semibold text-frost">{customer.full_name}</h1>
        <p className="text-sm text-haze">
          {customer.email ?? "No email"} · {customer.jurisdiction ?? "N/A"}
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="gradient-border glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-haze/60">Status</p>
          <p className="mt-2 text-2xl font-semibold text-frost">{customer.status}</p>
          <p className="mt-3 text-sm text-haze">Risk: {customer.risk_level ?? "unknown"}</p>
          <div className="mt-6">
            <QuickUpdate
              action={updateCustomerStatus}
              label="Update status"
              name="status"
              options={["pending", "in_review", "verified", "flagged"]}
              defaultValue={customer.status}
              hiddenFields={[{ name: "id", value: customer.id }]}
            />
          </div>
        </div>
        <div className="gradient-border glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-haze/60">Risk Profile</p>
          <p className="mt-2 text-2xl font-semibold text-frost">
            {(customer.risk_profiles as { level?: string } | null)?.level ?? "unscored"}
          </p>
          <p className="mt-3 text-sm text-haze">
            Score: {(customer.risk_profiles as { score?: number } | null)?.score ?? "N/A"}
          </p>
          <div className="mt-6">
            <QuickUpdate
              action={updateCustomerRiskLevel}
              label="Update risk"
              name="risk_level"
              options={["low", "medium", "high", "critical"]}
              defaultValue={customer.risk_level}
              hiddenFields={[{ name: "id", value: customer.id }]}
            />
          </div>
        </div>
        <div className="gradient-border glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-haze/60">Created</p>
          <p className="mt-2 text-2xl font-semibold text-frost">
            {new Date(customer.created_at).toLocaleDateString()}
          </p>
          <p className="mt-3 text-sm text-haze">Profile timeline ready.</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Documents</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {documents?.length ? (
              documents.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/dashboard/documents/${doc.id}`}
                  className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 transition hover:border-white/30"
                >
                  <p className="font-semibold text-frost">{doc.doc_type ?? "Document"}</p>
                  <p className="mt-1 text-xs text-haze">{doc.country ?? "Unknown"}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                    {doc.status}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-haze">No documents on file.</p>
            )}
          </div>
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Cases</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {cases?.length ? (
              cases.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/cases/${item.id}`}
                  className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 transition hover:border-white/30"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-frost">{item.title}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-haze">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                    Priority: {item.priority}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-haze">No cases yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Alerts</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {alerts?.length ? (
              alerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <p className="font-semibold text-frost">{alert.message}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                    {alert.severity} · {alert.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No alerts.</p>
            )}
          </div>
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Watchlist</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {matches?.length ? (
              matches.map((match) => (
                <div key={match.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <p className="font-semibold text-frost">{match.list_name}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                    Score: {match.match_score ?? "N/A"} · {match.status}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No watchlist matches.</p>
            )}
          </div>
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Sessions</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {sessions?.length ? (
              sessions.map((session) => (
                <div key={session.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <p className="font-semibold text-frost">{session.provider}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                    {session.status} · {session.decision ?? "pending"} · Risk {session.risk_score ?? "N/A"}
                  </p>
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
