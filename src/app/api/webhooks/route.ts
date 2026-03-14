import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id,action,entity,metadata,created_at")
    .eq("entity", "webhook")
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ webhooks: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient();
  let payload: unknown = {};

  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const { error } = await supabase.from("audit_logs").insert([
    {
      action: "webhook.received",
      entity: "webhook",
      metadata: payload
    }
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
