"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createCase(formData: FormData) {
  const title = formData.get("title");
  const customerId = formData.get("customer_id");
  const priority = formData.get("priority");

  if (!title || typeof title !== "string") {
    redirect("/dashboard/cases?error=missing-title");
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("cases")
    .insert({
      title,
      customer_id: typeof customerId === "string" && customerId.length > 0 ? customerId : null,
      priority: typeof priority === "string" ? priority : "medium",
      status: "open"
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/cases?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "case.created",
    entity: "cases",
    entity_id: data?.id,
    metadata: { title }
  });

  redirect("/dashboard/cases?success=created");
}
