"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function formatMessage(value: string) {
  const decoded = decodeURIComponent(value);
  if (decoded.includes(" ") || decoded.includes(".")) {
    return decoded;
  }
  return decoded
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
    .concat(".");
}

export default function Toast() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(true);

  const { type, message } = useMemo(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success) {
      return { type: "success", message: formatMessage(success) } as const;
    }
    if (error) {
      return { type: "error", message: formatMessage(error) } as const;
    }
    return { type: null, message: null } as const;
  }, [searchParams]);

  useEffect(() => {
    setVisible(true);
    if (!message) return;
    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div className="fixed right-6 top-6 z-50">
      <div
        className={`flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-soft backdrop-blur ${
          type === "success"
            ? "border-neon/40 bg-ink/90 text-neon"
            : "border-ember/40 bg-ink/90 text-ember"
        } animate-rise`}
      >
        <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-current" />
        <div>
          <p className="font-semibold">{type === "success" ? "Success" : "Error"}</p>
          <p className="mt-1 text-xs text-frost/80">{message}</p>
        </div>
      </div>
    </div>
  );
}
