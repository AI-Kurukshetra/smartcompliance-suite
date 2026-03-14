# SmartCompliance Suite

Next.js + Tailwind dashboard starter with Supabase authentication and a KYC/AML data model.

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure env vars

```bash
cp .env.example .env.local
```

Set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`)
- `SUPABASE_SERVICE_ROLE_KEY` (for seeding only)

3. Run the dev server

```bash
npm run dev
```

## Seed demo data

```bash
npm run seed
```

## Supabase auth flow

- `app/(auth)/login` sends a magic link using `signInWithOtp`.
- `app/auth/callback` exchanges the auth code for a session.
- `middleware.ts` protects `/dashboard` routes.

## Data model

Core tables are created via Supabase migrations:
- `customers`, `identity_documents`, `verification_sessions`, `risk_profiles`, `watchlist_matches`
- `cases`, `case_files`, `alerts`
- `audit_logs`, `compliance_rules`, `reports`, `data_sources`
