import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() ?? "";
  const supabase = createSupabaseAdminClient();

  const [customersResult, casesResult, documentsResult] = query
    ? await Promise.all([
        supabase
          .from("customers")
          .select("id,full_name,email,status")
          .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
          .limit(10),
        supabase
          .from("cases")
          .select("id,title,status,customers(full_name)")
          .ilike("title", `%${query}%`)
          .limit(10),
        supabase
          .from("identity_documents")
          .select("id,doc_type,country,status,customers(full_name)")
          .or(`doc_type.ilike.%${query}%,country.ilike.%${query}%`)
          .limit(10)
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const customers = customersResult.data ?? [];
  const cases = casesResult.data ?? [];
  const documents = documentsResult.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Search</p>
        <h1 className="text-3xl font-semibold text-frost">Global lookup</h1>
        <p className="max-w-xl text-haze">
          Search customers, cases, and documents from one place.
        </p>
      </header>

      <form className="gradient-border glass rounded-3xl p-6" action="/dashboard/search" method="get">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search by name, email, case title, or document"
          className="w-full rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
        />
      </form>

      {query && (
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="gradient-border glass rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-frost">Customers</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
              {customers.length ? (
                customers.map((customer) => (
                  <Link
                    key={customer.id ?? customer.email}
                    href={`/dashboard/customers/${customer.id}`}
                    className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 transition hover:border-white/30"
                  >
                    <p className="font-semibold text-frost">{customer.full_name}</p>
                    <p className="mt-1 text-xs text-haze">{customer.email ?? "No email"}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                      {customer.status}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-haze">No customer results.</p>
              )}
            </div>
          </div>

          <div className="gradient-border glass rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-frost">Cases</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
              {cases.length ? (
                cases.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/cases/${item.id}`}
                    className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 transition hover:border-white/30"
                  >
                    <p className="font-semibold text-frost">{item.title}</p>
                    <p className="mt-1 text-xs text-haze">
                      {(item.customers as { full_name?: string } | null)?.full_name ??
                        "No customer linked"}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                      {item.status}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-haze">No case results.</p>
              )}
            </div>
          </div>

          <div className="gradient-border glass rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-frost">Documents</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
              {documents.length ? (
                documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/dashboard/documents/${doc.id}`}
                    className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 transition hover:border-white/30"
                  >
                    <p className="font-semibold text-frost">{doc.doc_type ?? "Document"}</p>
                    <p className="mt-1 text-xs text-haze">
                      {(doc.customers as { full_name?: string } | null)?.full_name ??
                        "No customer linked"}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                      {doc.country ?? "Unknown"} · {doc.status}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-haze">No document results.</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
