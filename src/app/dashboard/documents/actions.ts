"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createDocument(formData: FormData) {
  const customerId = formData.get("customer_id");
  const docType = formData.get("doc_type");
  const country = formData.get("country");
  const status = formData.get("status");

  if (!docType || typeof docType !== "string") {
    redirect("/dashboard/documents?error=missing-type");
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("identity_documents")
    .insert({
      customer_id: typeof customerId === "string" && customerId.length > 0 ? customerId : null,
      doc_type: docType,
      country: typeof country === "string" ? country : null,
      status: typeof status === "string" ? status : "pending"
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/documents?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "document.created",
    entity: "identity_documents",
    entity_id: data?.id,
    metadata: { doc_type: docType }
  });

  redirect("/dashboard/documents?success=created");
}
