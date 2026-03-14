"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createDataSource(formData: FormData) {
  const name = formData.get("name");
  const category = formData.get("category");
  const config = formData.get("config");

  if (!name || typeof name !== "string") {
    redirect("/dashboard/data-sources?error=missing-name");
  }

  let parsedConfig: Record<string, unknown> = {};
  if (typeof config === "string" && config.trim()) {
    try {
      parsedConfig = JSON.parse(config);
    } catch (error) {
      redirect("/dashboard/data-sources?error=invalid-json");
    }
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("data_sources")
    .insert({
      name,
      category: typeof category === "string" ? category : null,
      config: parsedConfig,
      status: "active"
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/data-sources?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "data_source.created",
    entity: "data_sources",
    entity_id: data?.id,
    metadata: { name }
  });

  redirect("/dashboard/data-sources?success=created");
}
