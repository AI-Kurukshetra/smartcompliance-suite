import { headers } from "next/headers";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export async function resolveSiteUrl() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (origin) {
    return trimTrailingSlash(origin);
  }

  const forwardedHost = headerStore.get("x-forwarded-host");
  if (forwardedHost) {
    const protocol = headerStore.get("x-forwarded-proto") ?? "https";
    return trimTrailingSlash(`${protocol}://${forwardedHost}`);
  }

  const host = headerStore.get("host");
  if (host) {
    const protocol =
      host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    return trimTrailingSlash(`${protocol}://${host}`);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${trimTrailingSlash(process.env.VERCEL_PROJECT_PRODUCTION_URL)}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${trimTrailingSlash(process.env.VERCEL_URL)}`;
  }

  return trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
}
