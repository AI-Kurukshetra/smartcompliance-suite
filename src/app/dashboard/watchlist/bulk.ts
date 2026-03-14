"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateWatchlistBulk(formData: FormData) {
  const ids = formData.getAll("match_ids").filter((id) => typeof id === "string") as string[];
  const status = formData.get("bulk_status");

  if (!ids.length) {
    redirect("/dashboard/watchlist?error=no-selection");
  }

  if (!status || typeof status !== "string") {
    redirect("/dashboard/watchlist?error=no-bulk-update");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("watchlist_matches")
    .update({ status })
    .in("id", ids);

  if (error) {
    redirect(`/dashboard/watchlist?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "watchlist.bulk_updated",
    entity: "watchlist_matches",
    metadata: { ids, status }
  });

  redirect("/dashboard/watchlist?success=bulk-updated");
}
