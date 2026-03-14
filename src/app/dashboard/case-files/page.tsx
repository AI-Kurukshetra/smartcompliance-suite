import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createCaseFile } from "./actions";

interface CaseFilesPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function CaseFilesPage({ searchParams }: CaseFilesPageProps) {
  const { error, success } = await searchParams;
  const supabase = createSupabaseAdminClient();
  const { data: caseFiles } = await supabase
    .from("case_files")
    .select(
      "id,notes,created_at,cases(title,customers(full_name)),identity_documents(doc_type,country)"
    )
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: cases } = await supabase
    .from("cases")
    .select("id,title,customers(full_name)")
    .order("created_at", { ascending: false });

  const { data: documents } = await supabase
    .from("identity_documents")
    .select("id,doc_type,country,customers(full_name)")
    .order("created_at", { ascending: false });

  const errorMessage =
    error === "missing-case"
      ? "Case selection is required."
      : error
        ? decodeURIComponent(error)
        : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Case Files</p>
        <h1 className="text-3xl font-semibold text-frost">Case documentation</h1>
        <p className="max-w-xl text-haze">
          Attach evidence and notes to active investigations.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Add case file</h2>
          <form action={createCaseFile} className="mt-4 flex flex-col gap-4">
            <select
              name="case_id"
              required
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              <option value="">Select case</option>
              {cases?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} ·
                  {(item.customers as { full_name?: string } | null)?.full_name ?? "Customer"}
                </option>
              ))}
            </select>
            <select
              name="document_id"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost focus:border-neon focus:outline-none"
            >
              <option value="">Attach document (optional)</option>
              {documents?.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.doc_type ?? "Document"} · {doc.country ?? ""} ·
                  {(doc.customers as { full_name?: string } | null)?.full_name ?? "Customer"}
                </option>
              ))}
            </select>
            <textarea
              name="notes"
              placeholder="Notes or evidence summary"
              rows={4}
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Save case file
            </button>
          </form>
          {success && (
            <p className="mt-4 text-sm text-neon">Case file saved.</p>
          )}
          {errorMessage && <p className="mt-4 text-sm text-ember">{errorMessage}</p>}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Recent case files</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {caseFiles?.length ? (
              caseFiles.map((file) => (
                <div key={file.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <p className="font-semibold text-frost">
                    {(file.cases as { title?: string } | null)?.title ?? "Case"}
                  </p>
                  <p className="mt-1 text-xs text-haze">
                    {(file.cases as { customers?: { full_name?: string } | null } | null)?.customers
                      ?.full_name ?? "Customer"}
                  </p>
                  <p className="mt-2 text-xs text-haze">
                    {(file.identity_documents as { doc_type?: string; country?: string } | null)
                      ?.doc_type ?? "No document"}
                  </p>
                  <p className="mt-2 text-xs text-haze/70">
                    {file.notes ?? "No notes"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No case files yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
