import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createHash } from "crypto";

const hashTemplate = (payload: string) =>
  createHash("sha256").update(payload).digest("hex");

export async function GET() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("biometric_templates")
    .select("id,template_type,template_hash,enrolled_at,customers(id,full_name,email)")
    .order("enrolled_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ templates: data ?? [] });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const email = (payload.email ?? "").toString().trim().toLowerCase();
  const templateType = (payload.template_type ?? "").toString().trim();
  const templateData = (payload.template_data ?? "").toString();

  if (!email || !templateType || !templateData) {
    return NextResponse.json(
      { error: "email, template_type, and template_data are required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: customerData } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  const customerId = customerData?.id;
  if (!customerId) {
    return NextResponse.json({ error: "customer not found" }, { status: 404 });
  }

  const templateHash = hashTemplate(templateData);
  const { data, error } = await supabase.from("biometric_templates").upsert(
    [
      {
        customer_id: customerId,
        template_type: templateType,
        template_hash: templateHash,
        enrolled_at: new Date().toISOString()
      }
    ],
    { onConflict: "customer_id,template_hash" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_logs").insert([
    {
      action: "biometric.enrolled",
      entity: "biometric_templates",
      metadata: { customer_id: customerId, template_type: templateType }
    }
  ]);

  return NextResponse.json({ template: data?.[0] ?? null });
}
