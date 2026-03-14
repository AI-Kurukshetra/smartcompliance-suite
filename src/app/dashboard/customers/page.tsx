import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createCustomer } from "./actions";

interface CustomersPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const { error } = await searchParams;
  const supabase = createSupabaseAdminClient();
  const { data: customers } = await supabase
    .from("customers")
    .select(
      "id,full_name,email,status,risk_level,jurisdiction,created_at,risk_profiles(score,level,last_assessed_at)"
    )
    .order("created_at", { ascending: false })
    .limit(20);

  const errorMessage =
    error === "missing-name"
      ? "Customer name is required."
      : error
        ? decodeURIComponent(error)
        : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Customers</p>
        <h1 className="text-3xl font-semibold text-frost">Customer registry</h1>
        <p className="max-w-xl text-haze">
          Track onboarding status, risk levels, and jurisdictional coverage.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Add customer</h2>
          <form action={createCustomer} className="mt-4 flex flex-col gap-4">
            <input
              name="full_name"
              placeholder="Full name"
              required
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <input
              name="jurisdiction"
              placeholder="Jurisdiction (e.g. US, EU)"
              className="rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-neon px-5 py-2 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
            >
              Create customer
            </button>
          </form>
          {errorMessage && (
            <p className="mt-4 text-sm text-ember">{errorMessage}</p>
          )}
        </div>

        <div className="gradient-border glass rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-frost">Recent customers</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
            {customers?.length ? (
              customers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/dashboard/customers/${customer.id}`}
                  className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 transition hover:border-white/30"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-frost">{customer.full_name}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-haze">
                      {customer.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-haze">{customer.email ?? "No email"}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-haze/70">
                    Risk: {customer.risk_level ?? "unknown"} · {customer.jurisdiction ?? "N/A"}
                  </p>
                  <p className="mt-2 text-xs text-haze">
                    Profile:{" "}
                    {(customer.risk_profiles as { level?: string; score?: number } | null)?.level ??
                      "unscored"}{" "}
                    · Score:{" "}
                    {(customer.risk_profiles as { score?: number } | null)?.score ?? "N/A"}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-haze">No customers yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
