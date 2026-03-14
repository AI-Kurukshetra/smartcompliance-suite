"use client";

import { useTransition } from "react";

interface QuickUpdateProps {
  action: (formData: FormData) => Promise<void>;
  label: string;
  name: string;
  options: string[];
  defaultValue?: string | null;
  hiddenFields?: { name: string; value: string }[];
}

export default function QuickUpdate({
  action,
  label,
  name,
  options,
  defaultValue,
  hiddenFields
}: QuickUpdateProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(() => action(formData));
      }}
      className="flex flex-col gap-2"
    >
      {hiddenFields?.map((field) => (
        <input key={field.name} type="hidden" name={field.name} value={field.value} />
      ))}
      <label className="text-xs uppercase tracking-[0.25em] text-haze/70">{label}</label>
      <div className="flex items-center gap-2">
        <select
          name={name}
          defaultValue={defaultValue ?? ""}
          className="flex-1 rounded-2xl border border-white/10 bg-ink/80 px-3 py-2 text-sm text-frost focus:border-neon focus:outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-frost/90 transition hover:border-white/40"
          disabled={isPending}
        >
          {isPending ? "Saving" : "Update"}
        </button>
      </div>
    </form>
  );
}
