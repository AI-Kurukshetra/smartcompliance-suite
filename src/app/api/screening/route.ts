import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const [matches, alerts] = await Promise.all([
    supabase
      .from("watchlist_matches")
      .select("id,list_name,match_score,status,customers(id,full_name,email)")
      .order("match_score", { ascending: false })
      .limit(50),
    supabase
      .from("alerts")
      .select("id,severity,status,message,created_at,customers(id,full_name,email),cases(title)")
      .order("created_at", { ascending: false })
      .limit(50)
  ]);

  if (matches.error || alerts.error) {
    return NextResponse.json({ error: matches.error?.message ?? alerts.error?.message }, { status: 500 });
  }

  return NextResponse.json({
    screeningMatches: matches.data ?? [],
    alertHistory: alerts.data ?? []
  });
}
