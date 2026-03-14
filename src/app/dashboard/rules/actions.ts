"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createRule(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");
  const rules = formData.get("rules");

  if (!name || typeof name !== "string") {
    redirect("/dashboard/rules?error=missing-name");
  }

  let parsedRules: Record<string, unknown> = {};
  if (typeof rules === "string" && rules.trim()) {
    try {
      parsedRules = JSON.parse(rules);
    } catch (error) {
      redirect("/dashboard/rules?error=invalid-json");
    }
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("compliance_rules")
    .insert({
      name,
      description: typeof description === "string" ? description : null,
      rules: parsedRules,
      is_active: true
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/rules?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "rule.created",
    entity: "compliance_rules",
    entity_id: data?.id,
    metadata: { name }
  });

  redirect("/dashboard/rules?success=created");
}
