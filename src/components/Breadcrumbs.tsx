import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-haze">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="transition hover:text-frost">
              {item.label}
            </Link>
          ) : (
            <span className="text-frost/80">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="text-haze/50">/</span>}
        </div>
      ))}
    </nav>
  );
}
