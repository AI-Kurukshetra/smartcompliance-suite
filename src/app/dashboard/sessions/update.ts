"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateSessionStatus(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (!id || typeof id !== "string" || !status || typeof status !== "string") {
    redirect("/dashboard/sessions");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("verification_sessions")
    .update({ status })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/sessions?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "session.status_updated",
    entity: "verification_sessions",
    entity_id: id,
    metadata: { status }
  });

  redirect("/dashboard/sessions?success=status-updated");
}
