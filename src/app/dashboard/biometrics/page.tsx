import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { enrollBiometricTemplate } from "./actions";

export default async function BiometricsPage() {
  const supabase = createSupabaseAdminClient();
  const { data: templates } = await supabase
    .from("biometric_templates")
    .select("id,template_type,enrolled_at,customers(id,full_name,email)")
    .order("enrolled_at", { ascending: false })
    .limit(50);

  const counts = (templates ?? []).reduce<Record<string, number>>((acc, entry) => {
    const bucket = entry.template_type ?? "unknown";
    acc[bucket] = (acc[bucket] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Biometrics</p>
        <h1 className="text-3xl font-semibold text-frost md:text-4xl">Biometric enrollments</h1>
        <p className="max-w-xl text-haze">
          Capture biometric templates, keep audit trail, and surface enrollments for compliance teams.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {Object.entries(counts).map(([type, total]) => (
          <div key={type} className="rounded-3xl border border-white/10 bg-ink/70 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-haze/60">{type}</p>
            <p className="mt-3 text-3xl font-semibold text-frost">{total}</p>
            <p className="mt-2 text-sm text-haze">templates</p>
          </div>
        ))}
        {!Object.keys(counts).length && (
          <div className="rounded-3xl border border-white/10 bg-ink/70 p-6">
            <p className="text-sm text-haze">No templates yet. Enroll a biometric template below.</p>
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="gradient-border glass rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-frost">Recent templates</h2>
          <div className="mt-6 space-y-4">
            {templates?.length ? (
              templates.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-frost">{entry.template_type ?? "Template"}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-haze">
                      {new Date(entry.enrolled_at ?? "").toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-haze">
                    {(entry.customers as { full_name?: string } | null)?.full_name ?? "Unknown customer"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-haze">No biometric templates enrolled yet.</p>
            )}
          </div>
        </div>

        <div className="gradient-border glass rounded-3xl p-8">
          <h2 className="text-2xl font-semibold text-frost">Enroll a template</h2>
          <p className="mt-2 text-sm text-haze">Upload the customer email, template type, and biometric payload (base64 or descriptor string).</p>
          <form action={enrollBiometricTemplate} className="mt-5 flex flex-col gap-4">
            <label className="space-y-1 text-sm text-frost">
              Customer email
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost/90 focus:border-white"
              />
            </label>
            <label className="space-y-1 text-sm text-frost">
              Template type
              <input
                name="template_type"
                type="text"
                required
                placeholder="face, voice, iris"
                className="w-full rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost/90 focus:border-white"
              />
            </label>
            <label className="space-y-1 text-sm text-frost">
              Template payload
              <textarea
                name="template_data"
                required
                rows={4}
                placeholder="Base64 descriptor or hashed payload"
                className="w-full rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-frost/90 focus:border-white"
              />
            </label>
            <button
              type="submit"
              className="mt-4 rounded-2xl bg-frost px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white/90"
            >
              Enroll biometric template
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
