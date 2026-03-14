"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateAlertStatus(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (!id || typeof id !== "string" || !status || typeof status !== "string") {
    redirect("/dashboard/alerts");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("alerts")
    .update({ status })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/alerts?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "alert.status_updated",
    entity: "alerts",
    entity_id: id,
    metadata: { status }
  });

  redirect("/dashboard/alerts?success=status-updated");
}
