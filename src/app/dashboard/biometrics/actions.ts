"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

const templateHash = (payload: string) =>
  createHash("sha256").update(payload).digest("hex");

export async function enrollBiometricTemplate(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim().toLowerCase();
  const templateType = (formData.get("template_type") ?? "").toString().trim();
  const templateData = (formData.get("template_data") ?? "").toString();

  if (!email || !templateType || !templateData) {
    throw new Error("Email, template type, and template data are required.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: customerData } = await supabase
    .from("customers")
    .select("id,full_name,email")
    .eq("email", email)
    .maybeSingle();

  const customerId = customerData?.id;
  if (!customerId) {
    throw new Error("Customer not found for that email.");
  }

  const { error } = await supabase.from("biometric_templates").upsert(
    [
      {
        customer_id: customerId,
        template_type: templateType,
        template_hash: templateHash(templateData),
        enrolled_at: new Date().toISOString()
      }
    ],
    { onConflict: "customer_id,template_hash" }
  );

  if (error) {
    throw error;
  }

  await supabase.from("audit_logs").insert([
    {
      action: "biometric.enrolled",
      entity: "biometric_templates",
      metadata: { customer_id: customerId, template_type: templateType }
    }
  ]);

  revalidatePath("/dashboard/biometrics");
}
