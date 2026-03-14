"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createCustomer(formData: FormData) {
  const fullName = formData.get("full_name");
  const email = formData.get("email");
  const jurisdiction = formData.get("jurisdiction");

  if (!fullName || typeof fullName !== "string") {
    redirect("/dashboard/customers?error=missing-name");
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("customers")
    .insert({
      full_name: fullName,
      email: typeof email === "string" ? email : null,
      jurisdiction: typeof jurisdiction === "string" ? jurisdiction : null,
      status: "pending",
      risk_level: "medium"
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/customers?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "customer.created",
    entity: "customers",
    entity_id: data?.id,
    metadata: { full_name: fullName }
  });

  redirect("/dashboard/customers?success=created");
}
