"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveSiteUrl } from "@/lib/site-url";

export async function sendMagicLink(formData: FormData) {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    redirect("/login?error=missing-email");
  }

  const supabase = await createSupabaseServerClient();
  const origin = await resolveSiteUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?success=check-email");
}
