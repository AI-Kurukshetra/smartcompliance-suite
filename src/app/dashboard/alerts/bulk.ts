"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateAlertsBulk(formData: FormData) {
  const ids = formData.getAll("alert_ids").filter((id) => typeof id === "string") as string[];
  const status = formData.get("bulk_status");

  if (!ids.length) {
    redirect("/dashboard/alerts?error=no-selection");
  }

  if (!status || typeof status !== "string") {
    redirect("/dashboard/alerts?error=no-bulk-update");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("alerts").update({ status }).in("id", ids);

  if (error) {
    redirect(`/dashboard/alerts?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "alert.bulk_updated",
    entity: "alerts",
    metadata: { ids, status }
  });

  redirect("/dashboard/alerts?success=bulk-updated");
}
