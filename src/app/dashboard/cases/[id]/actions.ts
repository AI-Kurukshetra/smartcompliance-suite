"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateCaseStatus(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (!id || typeof id !== "string" || !status || typeof status !== "string") {
    redirect("/dashboard/cases");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("cases")
    .update({ status })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/cases/${id}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "case.status_updated",
    entity: "cases",
    entity_id: id,
    metadata: { status }
  });

  redirect(`/dashboard/cases/${id}?success=status-updated`);
}

export async function updateCasePriority(formData: FormData) {
  const id = formData.get("id");
  const priority = formData.get("priority");

  if (!id || typeof id !== "string" || !priority || typeof priority !== "string") {
    redirect("/dashboard/cases");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("cases")
    .update({ priority })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/cases/${id}?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "case.priority_updated",
    entity: "cases",
    entity_id: id,
    metadata: { priority }
  });

  redirect(`/dashboard/cases/${id}?success=priority-updated`);
}
