"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateSessionsBulk(formData: FormData) {
  const ids = formData.getAll("session_ids").filter((id) => typeof id === "string") as string[];
  const status = formData.get("bulk_status");

  if (!ids.length) {
    redirect("/dashboard/sessions?error=no-selection");
  }

  if (!status || typeof status !== "string") {
    redirect("/dashboard/sessions?error=no-bulk-update");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("verification_sessions")
    .update({ status })
    .in("id", ids);

  if (error) {
    redirect(`/dashboard/sessions?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "session.bulk_updated",
    entity: "verification_sessions",
    metadata: { ids, status }
  });

  redirect("/dashboard/sessions?success=bulk-updated");
}
