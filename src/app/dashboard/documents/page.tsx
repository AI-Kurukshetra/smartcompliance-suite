import Link from "next/link";
import QuickUpdate from "@/components/QuickUpdate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { updateDocumentStatusFromList } from "./update";
import { updateDocumentsBulk } from "./bulk";
import { createDocument } from "./actions";

interface DocumentsPageProps {
  searchParams: { success?: string; error?: string };
}

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const supabase = createSupabaseAdminClient();
  const { data: documents } = await supabase
    .from("identity_documents")
    .select("id,doc_type,status,country,created_at,customers(full_name)")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: customers } = await supabase
    .from("customers")
    .select("id,full_name")
    .order("full_name", { ascending: true });

  const errorMessage =
    searchParams.error === "missing-type"
      ? "Document type is required."
      : searchParams.error === "no-selection"
        ? "Select at least one document for bulk actions."
        : searchParams.error === "no-bulk-update"
          ? "Choose a status to update."
          : searchParams.error
            ? decodeURIComponent(searchParams.error)
            : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Documents</p>
        <h1 className="text-3xl font-semibold text-frost">Identity documents</h1>
        <p className="max-w-xl text-haze">
          Track OCR ingestion, verification status, and jurisdictional metadata.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Add document</h2>
          <form action={createDocument} className="mt-4 flex flex-col gap-4">
            <input
              name="doc_type"
              placeholder="Document type (Passport, ID Card)"
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
              name="country"
              placeholder="Country"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <select
              name="status"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              {"pending,verified,rejected".split(",").map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Add document
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Recent documents</h2>
          {documents?.length ? (
            <form
              id="bulk-documents-form"
              action={updateDocumentsBulk}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              <select
                name="bulk_status"
                className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-2 text-xs text-frost focus:border-neon focus:outline-none"
                defaultValue=""
              >
                <option value="">Bulk status</option>
                {["pending", "verified", "rejected"].map((status) => (
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
            {documents?.length ? (
              documents.map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="document_ids"
                      value={doc.id}
                      form="bulk-documents-form"
                      className="mt-1 h-4 w-4 rounded border-white/30 bg-ink/80 text-neon focus:ring-neon"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/dashboard/documents/${doc.id}`}
                          className="font-semibold text-frost transition hover:text-neon"
                        >
                          {doc.doc_type ?? "Document"}
                        </Link>
                        <span className="text-xs uppercase tracking-[0.2em] text-haze">
                          {doc.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-haze">
                        {(doc.customers as { full_name?: string } | null)?.full_name ??
                          "No customer linked"}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                        {doc.country ?? "Unknown jurisdiction"}
                      </p>
                      <div className="mt-3">
                        <QuickUpdate
                          action={updateDocumentStatusFromList}
                          label="Update status"
                          name="status"
                          options={["pending", "verified", "rejected"]}
                          defaultValue={doc.status}
                          hiddenFields={[{ name: "id", value: doc.id }]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No documents yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
