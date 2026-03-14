import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const [transactions, riskProfiles] = await Promise.all([
    supabase
      .from("transactions")
      .select("amount,status,currency")
      .order("processed_at", { ascending: false })
      .limit(200),
    supabase
      .from("risk_profiles")
      .select("level,score")
      .order("last_assessed_at", { ascending: false })
  ]);

  if (transactions.error || riskProfiles.error) {
    return NextResponse.json(
      {
        error:
          transactions.error?.message ?? riskProfiles.error?.message ?? "Unknown"
      },
      { status: 500 }
    );
  }

  const totalVolume = (transactions.data ?? []).reduce(
    (sum, tx) => sum + (Number(tx.amount ?? 0) || 0),
    0
  );

  const distribution = (riskProfiles.data ?? []).reduce<Record<string, number>>(
    (acc, profile) => {
      const bucket = profile.level ?? "unscored";
      acc[bucket] = (acc[bucket] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const txnStatus = (transactions.data ?? []).reduce<Record<string, number>>(
    (acc, tx) => {
      const bucket = tx.status ?? "unknown";
      acc[bucket] = (acc[bucket] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return NextResponse.json({
    totalVolume,
    riskDistribution: distribution,
    transactionStatus: txnStatus
  });
}
