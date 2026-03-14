"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateDocumentsBulk(formData: FormData) {
  const ids = formData.getAll("document_ids").filter((id) => typeof id === "string") as string[];
  const status = formData.get("bulk_status");

  if (!ids.length) {
    redirect("/dashboard/documents?error=no-selection");
  }

  if (!status || typeof status !== "string") {
    redirect("/dashboard/documents?error=no-bulk-update");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("identity_documents")
    .update({ status })
    .in("id", ids);

  if (error) {
    redirect(`/dashboard/documents?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "document.bulk_updated",
    entity: "identity_documents",
    metadata: { ids, status }
  });

  redirect("/dashboard/documents?success=bulk-updated");
}
