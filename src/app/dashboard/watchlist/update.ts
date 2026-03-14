"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateWatchlistStatus(formData: FormData) {
  const id = formData.get("id");
  const status = formData.get("status");

  if (!id || typeof id !== "string" || !status || typeof status !== "string") {
    redirect("/dashboard/watchlist");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("watchlist_matches")
    .update({ status })
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/watchlist?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "watchlist.status_updated",
    entity: "watchlist_matches",
    entity_id: id,
    metadata: { status }
  });

  redirect("/dashboard/watchlist?success=status-updated");
}
