"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createCaseFile(formData: FormData) {
  const caseId = formData.get("case_id");
  const documentId = formData.get("document_id");
  const notes = formData.get("notes");

  if (!caseId || typeof caseId !== "string") {
    redirect("/dashboard/case-files?error=missing-case");
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("case_files")
    .insert({
      case_id: caseId,
      document_id: typeof documentId === "string" && documentId.length > 0 ? documentId : null,
      notes: typeof notes === "string" ? notes : null
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/case-files?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "case_file.created",
    entity: "case_files",
    entity_id: data?.id,
    metadata: { case_id: caseId }
  });

  redirect("/dashboard/case-files?success=created");
}
