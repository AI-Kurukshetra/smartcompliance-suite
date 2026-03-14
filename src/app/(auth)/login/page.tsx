import Link from "next/link";
import { sendMagicLink } from "./actions";

interface LoginPageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { success, error } = await searchParams;
  const errorMessage =
    error === "signin-required"
      ? "Please sign in to continue."
      : error
        ? decodeURIComponent(error)
        : null;

  return (
    <main className="noise min-h-screen bg-midnight bg-mesh px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
        <header className="flex flex-col gap-4">
          <Link href="/" className="text-sm uppercase tracking-[0.4em] text-haze">
            SmartCompliance
          </Link>
          <h1 className="text-4xl font-semibold text-frost md:text-5xl">
            Sign in to your workspace
          </h1>
          <p className="max-w-xl text-lg text-haze">
            Supabase handles passwordless authentication with secure, time-bound magic links.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="gradient-border glass rounded-3xl p-8">
            <form action={sendMagicLink} className="flex flex-col gap-4">
              <label className="text-sm font-semibold text-frost/90" htmlFor="email">
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@studio.com"
                className="w-full rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-base text-frost placeholder:text-haze/60 focus:border-neon focus:outline-none"
              />
              <button
                type="submit"
                className="mt-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-midnight shadow-glow transition hover:-translate-y-0.5"
              >
                Send magic link
              </button>
            </form>

            {success && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 text-sm text-neon">
                Check your email for the sign-in link.
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-ember/30 bg-ink/70 px-4 py-3 text-sm text-ember">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="gradient-border glass rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-frost">Security notes</h2>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-haze">
              <li className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                Magic links expire in minutes.
              </li>
              <li className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                Sessions are stored in secure cookies.
              </li>
              <li className="rounded-2xl border border-white/10 bg-ink/70 px-4 py-3">
                Supabase handles the heavy lifting.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
