# Alloy Blueprint Coverage

This document maps the **Data Model & API Overview** from `alloy_blueprint_20260310_134708.pdf` against what is currently implemented in the repo. The goal is to keep the flow intact while clearly showing what exists, what is proxied, and what still requires work.

## Key Entities

| Entity | Status | Notes & references |
| --- | --- | --- |
| `Users` | Partial | Supabase Auth handles `user` metadata for every `/dashboard` request (`src/app/dashboard/layout.tsx:1`); there is no custom `users` table yet. |
| `Customers` | Implemented | `customers` seeded and upserted in `scripts/seed.ts:16`; dashboard list + detail views consume it (`src/app/dashboard/customers/page.tsx:2`). |
| `IdentityDocuments` | Implemented | Seeded via `documentsSeed` and inserted into `identity_documents` (`scripts/seed.ts:61`); listed under `/dashboard/documents` (`src/app/dashboard/documents/page.tsx:3`). |
| `VerificationSessions` | Implemented | `sessionsSeed` writes to `verification_sessions` (`scripts/seed.ts:171`); `/dashboard/sessions` renders them (`src/app/dashboard/sessions/page.tsx:1`). |
| `RiskProfiles` | Implemented | `riskProfilesSeed` upserts into `risk_profiles` (`scripts/seed.ts:230`); `/dashboard/risk-profiles` surfaces them (`src/app/dashboard/risk-profiles/page.tsx:1`). |
| `WatchlistEntries` | Implemented (as `watchlist_matches`) | Seeded in `scripts/seed.ts:209`; dashboard watches via `watchlist_matches` queries everywhere (`src/app/dashboard/watchlist/page.tsx:1`). |
| `Transactions` | Implemented | `transactionsSeed` defines sample ledger entries and they are upserted in `scripts/seed.ts:269`–`scripts/seed.ts:345`, so counts are available to `/dashboard` and `/app/api/analytics/route.ts`. |
| `CaseFiles` | Implemented | Seeded from `caseFilesSeed` into `case_files`, linking cases + docs (`scripts/seed.ts:269`); `/dashboard/case-files` page exists (`src/app/dashboard/case-files/page.tsx:1`). |
| `ComplianceRules` | Implemented | `rules` upserted on seed (`scripts/seed.ts:287`); `/dashboard/rules` pages/actions lean on `compliance_rules` (`src/app/dashboard/rules/page.tsx:1`). |
| `AuditLogs` | Implemented | Seed writes `seed.completed` audit entry (`scripts/seed.ts:641`); `/dashboard/audit` page reads `audit_logs` (`src/app/dashboard/audit/page.tsx:1`). |
| `Alerts` | Implemented | `alertsSeed` inserts `alerts` (`scripts/seed.ts:133`); dashboard exposes `/dashboard/alerts` (`src/app/dashboard/alerts/page.tsx:1`). |
| `Reports` | Implemented | `reports` array inserted in `scripts/seed.ts:322`; `/dashboard/reports` page uses `reports` table (`src/app/dashboard/reports/page.tsx:1`). |
| `DataSources` | Implemented | `dataSources` upserted (`scripts/seed.ts:314`); `/dashboard/data-sources` page uses it (`src/app/dashboard/data-sources/page.tsx:1`). |
| `BiometricTemplates` | Implemented | `biometricTemplatesSeed` upserts biometric metadata in `scripts/seed.ts:326`–`scripts/seed.ts:341`; counts surface in `/app/api/admin/route.ts`. |
| `DeviceFingerprints` | Implemented | `deviceFingerprintsSeed` introduces device fingerprints and is persisted in `scripts/seed.ts:341`–`scripts/seed.ts:375`. |
| `CustomerRelationships` | Implemented | Relationship linkages come from `customerRelationshipsSeed` (`scripts/seed.ts:365`–`scripts/seed.ts:745`) and are available via `/app/api/admin/route.ts`. |
| `RegulatoryFrameworks` | Implemented | Regulatory frameworks are seeded in `scripts/seed.ts:386`–`scripts/seed.ts:768` and now contribute to the admin analytics surface. |

## API Endpoint Groups

The blueprint mentions REST-style endpoint groups, but this codebase currently only uses Next.js pages and server actions—**no `/app/api` routes exist yet**.

| Group | Status | Notes |
| --- | --- | --- |
| `/auth` | Implemented | `src/app/api/auth/route.ts` exposes Supabase session data for clients that need to verify login state. |
| `/customers` | Implemented | `src/app/api/customers/route.ts` returns the latest customer profiles via the admin client. |
| `/verification` | Implemented | `src/app/api/verification/route.ts` streams verification sessions with linked customer metadata. |
| `/documents` | Implemented | `src/app/api/documents/route.ts` surfaces identity documents plus related case files. |
| `/screening` | Implemented | `src/app/api/screening/route.ts` bundles watchlist matches and alert history for screening insights. |
| `/risk-assessment` | Implemented | `src/app/api/risk-assessment/route.ts` delivers scores/levels pulled directly from `risk_profiles`. |
| `/cases` | Implemented | `src/app/api/cases/route.ts` exposes case records linked to customers. |
| `/reports` | Implemented | `src/app/api/reports/route.ts` exposes report metadata for the REST surface. |
| `/webhooks` | Implemented | `src/app/api/webhooks/route.ts` stores incoming payloads in `audit_logs` and lists the last webhook entries. |
| `/admin` | Implemented | `src/app/api/admin/route.ts` aggregates row counts across key tables (customers, transactions, biometrics, etc.). |
| `/analytics` | Implemented | `src/app/api/analytics/route.ts` reports total transaction volume plus risk-distribution and status buckets. |
| `/compliance-rules` | Implemented | `src/app/api/compliance-rules/route.ts` returns the active rule set for integrations. |
| `/audit` | Implemented | `src/app/api/audit/route.ts` flows the most recent audit entries to API consumers. |
| `/alerts` | Implemented | `src/app/api/alerts/route.ts` enumerates alerts with linked cases and customers. |
| `/data-sources` | Implemented | `src/app/api/data-sources/route.ts` surfaces configured third-party feeds. |

## Flow notes

- The Supabase service-role client (`src/lib/supabase/admin.ts`) powers `/dashboard` read operations while auth-specific code continues using `createSupabaseServerClient` to respect the session cookie.<br>
- All blueprint endpoint groups now have dedicated route handlers under `src/app/api/<group>/route.ts`, and each route relies on the admin client to query the seeded tables (including the new transactions, biometrics, device, relationship, and regulatory framework data).

## Next steps

1. Add dashboard-facing views or widgets for the new entities (transactions, biometrics, device fingerprints, relationships, frameworks) so they are easier to monitor from the UI.
2. Harden the API routes with request validation or RLS-aware guards if the project needs multi-tenant protections or user-level scoping.
3. Expand the REST spec documentation (OpenAPI, Postman collection, etc.) so downstream services can discover the `/api` surface quickly.

## Next steps

1. Define the missing tables/entities in Supabase (SQL migrations or `scripts/seed.ts` equivalents).  
2. Create `/app/api/*` route handlers that follow the listed endpoint groups so external systems can call them.  
3. Extend the dashboard to visualize any newly introduced entities and ensure ACLs that currently rely on the service-role client respect RLS if needed.
