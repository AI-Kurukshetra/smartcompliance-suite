"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateCaseStatusFromList(formData: FormData) {
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
    redirect(`/dashboard/cases?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "case.status_updated",
    entity: "cases",
    entity_id: id,
    metadata: { status }
  });

  redirect("/dashboard/cases?success=status-updated");
}

export async function updateCasePriorityFromList(formData: FormData) {
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
    redirect(`/dashboard/cases?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "case.priority_updated",
    entity: "cases",
    entity_id: id,
    metadata: { priority }
  });

  redirect("/dashboard/cases?success=priority-updated");
}

export async function updateCasesBulk(formData: FormData) {
  const ids = formData.getAll("case_ids").filter((id) => typeof id === "string") as string[];
  const status = formData.get("bulk_status");
  const priority = formData.get("bulk_priority");

  if (!ids.length) {
    redirect("/dashboard/cases?error=no-selection");
  }

  if (
    (!status || typeof status !== "string") &&
    (!priority || typeof priority !== "string")
  ) {
    redirect("/dashboard/cases?error=no-bulk-update");
  }

  const supabase = createSupabaseAdminClient();
  const updates: { status?: string; priority?: string } = {};
  if (status && typeof status === "string") updates.status = status;
  if (priority && typeof priority === "string") updates.priority = priority;

  const { error } = await supabase.from("cases").update(updates).in("id", ids);

  if (error) {
    redirect(`/dashboard/cases?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "case.bulk_updated",
    entity: "cases",
    metadata: { ids, updates }
  });

  redirect("/dashboard/cases?success=bulk-updated");
}
