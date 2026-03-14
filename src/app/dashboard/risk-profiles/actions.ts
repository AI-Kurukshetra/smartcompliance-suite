"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function upsertRiskProfile(formData: FormData) {
  const customerId = formData.get("customer_id");
  const score = formData.get("score");
  const level = formData.get("level");
  const factors = formData.get("factors");

  if (!customerId || typeof customerId !== "string") {
    redirect("/dashboard/risk-profiles?error=missing-customer");
  }

  let parsedFactors: Record<string, unknown> = {};
  if (typeof factors === "string" && factors.trim()) {
    try {
      parsedFactors = JSON.parse(factors);
    } catch (error) {
      redirect("/dashboard/risk-profiles?error=invalid-json");
    }
  }

  const numericScore = typeof score === "string" && score ? Number(score) : null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("risk_profiles")
    .upsert(
      {
        customer_id: customerId,
        score: Number.isFinite(numericScore) ? numericScore : null,
        level: typeof level === "string" ? level : null,
        factors: parsedFactors,
        last_assessed_at: new Date().toISOString()
      },
      { onConflict: "customer_id" }
    )
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/risk-profiles?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "risk_profile.upserted",
    entity: "risk_profiles",
    entity_id: data?.id,
    metadata: { customer_id: customerId }
  });

  redirect("/dashboard/risk-profiles?success=saved");
}
