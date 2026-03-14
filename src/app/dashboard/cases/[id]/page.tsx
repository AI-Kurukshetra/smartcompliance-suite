import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuickUpdate from "@/components/QuickUpdate";
import { updateCasePriority, updateCaseStatus } from "./actions";

interface CaseDetailPageProps {
  params: { id: string };
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const supabase = createSupabaseAdminClient();
  const { data: caseItem } = await supabase
    .from("cases")
    .select(
      "id,title,priority,status,created_at,customers(id,full_name,email),case_files(id,notes,identity_documents(id,doc_type,country))"
    )
    .eq("id", params.id)
    .single();

  if (!caseItem) {
    notFound();
  }

  const { data: alerts } = await supabase
    .from("alerts")
    .select("id,message,severity,status,created_at")
    .eq("case_id", caseItem.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Cases", href: "/dashboard/cases" },
            { label: caseItem.title }
          ]}
        />
        <h1 className="text-3xl font-semibold text-frost">{caseItem.title}</h1>
        <p className="text-sm text-haze">
          {caseItem.priority} priority · {caseItem.status}
        </p>
        {(caseItem.customers as { id?: string } | null)?.id ? (
          <Link
            href={`/dashboard/customers/${(caseItem.customers as { id?: string } | null)?.id}`}
            className="text-sm text-neon"
          >
            View customer
          </Link>
        ) : (
          <p className="text-sm text-haze">Customer link unavailable.</p>
        )}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Customer</h2>
          <p className="mt-4 text-sm text-frost">
            {(caseItem.customers as { full_name?: string } | null)?.full_name ?? "Unknown"}
          </p>
          <p className="mt-2 text-xs text-haze">
            {(caseItem.customers as { email?: string } | null)?.email ?? "No email"}
          </p>
          <div className="mt-6 space-y-4">
            <QuickUpdate
              action={updateCaseStatus}
              label="Update status"
              name="status"
              options={["open", "in_review", "closed"]}
              defaultValue={caseItem.status}
              hiddenFields={[{ name: "id", value: caseItem.id }]}
            />
            <QuickUpdate
              action={updateCasePriority}
              label="Update priority"
              name="priority"
              options={["low", "medium", "high", "critical"]}
              defaultValue={caseItem.priority}
              hiddenFields={[{ name: "id", value: caseItem.id }]}
            />
          </div>
        </div>
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Case files</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {caseItem.case_files?.length ? (
              caseItem.case_files.map((file) => (
                <div key={file.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <p className="font-semibold text-frost">{file.notes ?? "No notes"}</p>
                  <p className="mt-2 text-xs text-haze">
                    {(file.identity_documents as { doc_type?: string } | null)?.doc_type ??
                      "No document"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No files attached.</p>
            )}
          </div>
        </div>
      </section>

      <section className="gradient-border glass rounded-3xl p-6">
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
            <p className="text-sm text-haze">No alerts for this case.</p>
          )}
        </div>
      </section>
    </div>
  );
}
