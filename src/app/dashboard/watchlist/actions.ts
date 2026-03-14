"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createWatchlistMatch(formData: FormData) {
  const customerId = formData.get("customer_id");
  const listName = formData.get("list_name");
  const matchScore = formData.get("match_score");
  const status = formData.get("status");

  if (!listName || typeof listName !== "string") {
    redirect("/dashboard/watchlist?error=missing-list");
  }

  const numericScore = typeof matchScore === "string" && matchScore ? Number(matchScore) : null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("watchlist_matches")
    .insert({
      customer_id: typeof customerId === "string" && customerId.length > 0 ? customerId : null,
      list_name: listName,
      match_score: Number.isFinite(numericScore) ? numericScore : null,
      status: typeof status === "string" ? status : "open"
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/dashboard/watchlist?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.from("audit_logs").insert({
    action: "watchlist.created",
    entity: "watchlist_matches",
    entity_id: data?.id,
    metadata: { list_name: listName }
  });

  redirect("/dashboard/watchlist?success=created");
}

export async function createCaseFromMatch(formData: FormData) {
  const matchId = formData.get("match_id");

  if (!matchId || typeof matchId !== "string") {
    redirect("/dashboard/watchlist?error=missing-match");
  }

  const supabase = createSupabaseAdminClient();
  const { data: match, error: matchError } = await supabase
    .from("watchlist_matches")
    .select("id,customer_id,list_name,match_score,status")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    redirect("/dashboard/watchlist?error=match-not-found");
  }

  const score = typeof match.match_score === "number" ? match.match_score : 0;
  const priority = score >= 80 ? "high" : score >= 50 ? "medium" : "low";

  const { data: caseRow, error: caseError } = await supabase
    .from("cases")
    .insert({
      customer_id: match.customer_id,
      title: `Watchlist match: ${match.list_name ?? "Unknown list"}`,
      priority,
      status: "open"
    })
    .select("id")
    .single();

  if (caseError) {
    redirect(`/dashboard/watchlist?error=${encodeURIComponent(caseError.message)}`);
  }

  await supabase
    .from("watchlist_matches")
    .update({ status: "escalated" })
    .eq("id", match.id);

  await supabase.from("audit_logs").insert({
    action: "case.created_from_watchlist",
    entity: "cases",
    entity_id: caseRow?.id,
    metadata: { match_id: match.id }
  });

  redirect("/dashboard/watchlist?success=case-created");
}
