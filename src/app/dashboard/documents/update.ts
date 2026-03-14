"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateDocumentStatusFromList(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (!id || typeof id !== "string" || !status || typeof status !== "string") {
    redirect("/dashboard/documents");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("identity_documents")
    .update({ status })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/documents?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "document.status_updated",
    entity: "identity_documents",
    entity_id: id,
    metadata: { status }
  });

  redirect("/dashboard/documents?success=status-updated");
}
