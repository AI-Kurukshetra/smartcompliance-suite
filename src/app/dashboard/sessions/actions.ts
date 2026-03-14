"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createSession(formData: FormData) {
  const customerId = formData.get("customer_id");
  const provider = formData.get("provider");
  const status = formData.get("status");
  const decision = formData.get("decision");
  const riskScore = formData.get("risk_score");

  if (!provider || typeof provider !== "string") {
    redirect("/dashboard/sessions?error=missing-provider");
  }

  const numericScore = typeof riskScore === "string" && riskScore ? Number(riskScore) : null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("verification_sessions")
    .insert({
      customer_id: typeof customerId === "string" && customerId.length > 0 ? customerId : null,
      provider,
      status: typeof status === "string" ? status : "in_progress",
      decision: typeof decision === "string" && decision.length > 0 ? decision : null,
      risk_score: Number.isFinite(numericScore) ? numericScore : null,
      completed_at: decision ? new Date().toISOString() : null
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/sessions?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "session.created",
    entity: "verification_sessions",
    entity_id: data?.id,
    metadata: { provider }
  });

  redirect("/dashboard/sessions?success=created");
}
