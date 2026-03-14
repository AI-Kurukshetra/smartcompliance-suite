"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createAlert(formData: FormData) {
  const message = formData.get("message");
  const severity = formData.get("severity");
  const customerId = formData.get("customer_id");

  if (!message || typeof message !== "string") {
    redirect("/dashboard/alerts?error=missing-message");
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("alerts")
    .insert({
      message,
      severity: typeof severity === "string" ? severity : "medium",
      customer_id: typeof customerId === "string" && customerId.length > 0 ? customerId : null,
      status: "open"
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/alerts?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "alert.created",
    entity: "alerts",
    entity_id: data?.id,
    metadata: { severity }
  });

  redirect("/dashboard/alerts?success=created");
}
