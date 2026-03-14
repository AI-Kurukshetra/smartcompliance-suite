import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const TABLES = [
  "customers",
  "cases",
  "identity_documents",
  "alerts",
  "transactions",
  "risk_profiles",
  "verification_sessions",
  "watchlist_matches",
  "biometric_templates",
  "device_fingerprints",
  "customer_relationships",
  "regulatory_frameworks"
];

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const results = await Promise.all(
    TABLES.map((table) =>
      supabase.from(table).select("*", { count: "exact", head: true })
    )
  );

  const counts: Record<string, number> = {};
  let failedTable: string | null = null;

  results.forEach((result, idx) => {
    if (result.error) {
      failedTable = TABLES[idx];
    } else {
      counts[TABLES[idx]] = result.count ?? 0;
    }
  });

  if (failedTable) {
    return NextResponse.json(
      { error: `Unable to read ${failedTable}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ counts, synced_at: new Date().toISOString() });
}
