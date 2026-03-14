"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateCustomerStatus(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (!id || typeof id !== "string" || !status || typeof status !== "string") {
    redirect("/dashboard/customers");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("customers")
    .update({ status })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/customers/${id}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "customer.status_updated",
    entity: "customers",
    entity_id: id,
    metadata: { status }
  });

  redirect(`/dashboard/customers/${id}?success=status-updated`);
}

export async function updateCustomerRiskLevel(formData: FormData) {
  const id = formData.get("id");
  const riskLevel = formData.get("risk_level");

  if (!id || typeof id !== "string" || !riskLevel || typeof riskLevel !== "string") {
    redirect("/dashboard/customers");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("customers")
    .update({ risk_level: riskLevel })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/customers/${id}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "customer.risk_updated",
    entity: "customers",
    entity_id: id,
    metadata: { risk_level: riskLevel }
  });

  redirect(`/dashboard/customers/${id}?success=risk-updated`);
}
