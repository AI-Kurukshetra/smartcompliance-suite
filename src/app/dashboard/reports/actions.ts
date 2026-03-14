"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createReport(formData: FormData) {
  const reportType = formData.get("report_type");
  const periodStart = formData.get("period_start");
  const periodEnd = formData.get("period_end");

  if (!reportType || typeof reportType !== "string") {
    redirect("/dashboard/reports?error=missing-type");
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("reports")
    .insert({
      report_type: reportType,
      period_start: typeof periodStart === "string" && periodStart ? periodStart : null,
      period_end: typeof periodEnd === "string" && periodEnd ? periodEnd : null,
      status: "draft"
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/reports?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "report.created",
    entity: "reports",
    entity_id: data?.id,
    metadata: { report_type: reportType }
  });

  redirect("/dashboard/reports?success=created");
}
