import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuickUpdate from "@/components/QuickUpdate";
import { updateDocumentStatus } from "./actions";

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: document } = await supabase
    .from("identity_documents")
    .select(
      "id,doc_type,status,country,created_at,customers(id,full_name,email),case_files(id,notes,cases(id,title))"
    )
    .eq("id", id)
    .single();

  if (!document) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Documents", href: "/dashboard/documents" },
            { label: document.doc_type ?? "Document" }
          ]}
        />
        <h1 className="text-3xl font-semibold text-frost">
          {document.doc_type ?? "Document"}
        </h1>
        <p className="text-sm text-haze">
          {document.country ?? "Unknown"} · {document.status}
        </p>
        {(document.customers as { id?: string } | null)?.id ? (
          <Link
            href={`/dashboard/customers/${(document.customers as { id?: string } | null)?.id}`}
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
            {(document.customers as { full_name?: string } | null)?.full_name ?? "Unknown"}
          </p>
          <p className="mt-2 text-xs text-haze">
            {(document.customers as { email?: string } | null)?.email ?? "No email"}
          </p>
          <div className="mt-6">
            <QuickUpdate
              action={updateDocumentStatus}
              label="Update status"
              name="status"
              options={["pending", "verified", "rejected"]}
              defaultValue={document.status}
              hiddenFields={[{ name: "id", value: document.id }]}
            />
          </div>
        </div>
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Linked cases</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {document.case_files?.length ? (
              document.case_files.map((file) => (
                <Link
                  key={file.id}
                  href={`/dashboard/cases/${(file.cases as { id?: string } | null)?.id ?? ""}`}
                  className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 transition hover:border-white/30"
                >
                  <p className="font-semibold text-frost">
                    {(file.cases as { title?: string } | null)?.title ?? "Case"}
                  </p>
                  <p className="mt-2 text-xs text-haze">{file.notes ?? "No notes"}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-haze">No linked cases.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
