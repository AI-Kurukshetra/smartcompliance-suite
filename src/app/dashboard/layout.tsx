import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Search", href: "/dashboard/search" },
  { label: "Customers", href: "/dashboard/customers" },
  { label: "Cases", href: "/dashboard/cases" },
  { label: "Case Files", href: "/dashboard/case-files" },
  { label: "Documents", href: "/dashboard/documents" },
  { label: "Sessions", href: "/dashboard/sessions" },
  { label: "Risk Profiles", href: "/dashboard/risk-profiles" },
  { label: "Biometrics", href: "/dashboard/biometrics" },
  { label: "Watchlist", href: "/dashboard/watchlist" },
  { label: "Alerts", href: "/dashboard/alerts" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Rules", href: "/dashboard/rules" },
  { label: "Data Sources", href: "/dashboard/data-sources" },
  { label: "Audit Logs", href: "/dashboard/audit" }
];

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="noise min-h-screen bg-midnight bg-mesh text-frost">
      <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row">
        <aside className="hidden w-64 flex-shrink-0 border-r border-white/10 p-8 lg:block">
          <div className="text-sm uppercase tracking-[0.35em] text-haze">SmartCompliance</div>
          <nav className="mt-8 flex flex-col gap-3 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/10 bg-ink/60 px-4 py-3 text-frost/90 transition hover:border-white/30"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-haze">KYC / AML Suite</p>
              <p className="mt-2 text-sm text-frost/80">
                Signed in as {user?.email ?? "Unknown user"}
              </p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-frost/90 transition hover:border-white/40"
              >
                Sign out
              </button>
            </form>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
