import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AuditPage() {
  const supabase = createSupabaseAdminClient();
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("id,action,entity,entity_id,metadata,created_at,actor_id")
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-haze">Audit Logs</p>
        <h1 className="text-3xl font-semibold text-frost">Immutable activity trail</h1>
        <p className="max-w-xl text-haze">
          Every compliance action is recorded for review and reporting.
        </p>
      </header>

      <section className="gradient-border glass rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-frost">Latest events</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm text-frost/90">
          {logs?.length ? (
            logs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-frost">{log.action}</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-haze">
                    {log.entity}
                  </span>
                </div>
                <p className="mt-2 text-xs text-haze">
                  Actor: {log.actor_id ?? "system"}
                </p>
                <p className="mt-2 text-xs text-haze">
                  Entity ID: {log.entity_id ?? "N/A"}
                </p>
                <p className="mt-2 text-xs text-haze/70">
                  {log.metadata ? JSON.stringify(log.metadata) : "{}"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-haze">No audit logs yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
