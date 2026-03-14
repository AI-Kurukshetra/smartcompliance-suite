import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const customers = [
  {
    full_name: "Ava Kline",
    email: "ava.kline@northlightbank.com",
    status: "verified",
    jurisdiction: "US",
    risk_level: "low"
  },
  {
    full_name: "Noah Patel",
    email: "noah.patel@heliosfintech.io",
    status: "in_review",
    jurisdiction: "UK",
    risk_level: "medium"
  },
  {
    full_name: "Sofia Alvarez",
    email: "sofia.alvarez@equinoxcapital.com",
    status: "flagged",
    jurisdiction: "EU",
    risk_level: "high"
  },
  {
    full_name: "Liam Chen",
    email: "liam.chen@atlasbank.com",
    status: "verified",
    jurisdiction: "US",
    risk_level: "low"
  },
  {
    full_name: "Maya Singh",
    email: "maya.singh@zenithpay.io",
    status: "in_review",
    jurisdiction: "IN",
    risk_level: "medium"
  },
  {
    full_name: "Ethan Brooks",
    email: "ethan.brooks@ridgecapital.com",
    status: "flagged",
    jurisdiction: "EU",
    risk_level: "high"
  }
];

const documentsSeed = [
  {
    email: "ava.kline@northlightbank.com",
    doc_type: "Passport",
    country: "US",
    status: "verified"
  },
  {
    email: "noah.patel@heliosfintech.io",
    doc_type: "Driver License",
    country: "UK",
    status: "pending"
  },
  {
    email: "sofia.alvarez@equinoxcapital.com",
    doc_type: "National ID",
    country: "ES",
    status: "rejected"
  },
  {
    email: "liam.chen@atlasbank.com",
    doc_type: "Passport",
    country: "US",
    status: "verified"
  },
  {
    email: "maya.singh@zenithpay.io",
    doc_type: "Aadhaar",
    country: "IN",
    status: "pending"
  },
  {
    email: "ethan.brooks@ridgecapital.com",
    doc_type: "National ID",
    country: "DE",
    status: "rejected"
  }
];

const casesSeed = [
  {
    email: "sofia.alvarez@equinoxcapital.com",
    title: "Enhanced due diligence review",
    priority: "high",
    status: "open"
  },
  {
    email: "noah.patel@heliosfintech.io",
    title: "Jurisdiction mismatch verification",
    priority: "medium",
    status: "open"
  },
  {
    email: "liam.chen@atlasbank.com",
    title: "Address verification follow-up",
    priority: "low",
    status: "open"
  },
  {
    email: "maya.singh@zenithpay.io",
    title: "High velocity transaction review",
    priority: "medium",
    status: "open"
  },
  {
    email: "ethan.brooks@ridgecapital.com",
    title: "Watchlist escalation review",
    priority: "high",
    status: "open"
  }
];

const alertsSeed = [
  {
    email: "sofia.alvarez@equinoxcapital.com",
    caseTitle: "Enhanced due diligence review",
    severity: "high",
    status: "open",
    message: "Watchlist match detected (PEP)."
  },
  {
    email: "noah.patel@heliosfintech.io",
    caseTitle: "Jurisdiction mismatch verification",
    severity: "medium",
    status: "open",
    message: "Document mismatch flagged by OCR."
  },
  {
    email: "liam.chen@atlasbank.com",
    caseTitle: "Address verification follow-up",
    severity: "low",
    status: "open",
    message: "Minor address mismatch detected."
  },
  {
    email: "maya.singh@zenithpay.io",
    caseTitle: "High velocity transaction review",
    severity: "medium",
    status: "open",
    message: "Multiple rapid transactions flagged."
  },
  {
    email: "ethan.brooks@ridgecapital.com",
    caseTitle: "Watchlist escalation review",
    severity: "high",
    status: "open",
    message: "Potential sanctions list match."
  }
];

const sessionsSeed = [
  {
    email: "ava.kline@northlightbank.com",
    provider: "Alloy",
    status: "completed",
    decision: "approved",
    risk_score: 12.4
  },
  {
    email: "noah.patel@heliosfintech.io",
    provider: "Alloy",
    status: "in_progress",
    decision: null,
    risk_score: 48.9
  },
  {
    email: "liam.chen@atlasbank.com",
    provider: "Alloy",
    status: "completed",
    decision: "approved",
    risk_score: 9.2
  },
  {
    email: "maya.singh@zenithpay.io",
    provider: "Onfido",
    status: "in_progress",
    decision: null,
    risk_score: 42.7
  },
  {
    email: "ethan.brooks@ridgecapital.com",
    provider: "Alloy",
    status: "completed",
    decision: "rejected",
    risk_score: 88.5
  }
];

const watchlistSeed = [
  {
    email: "sofia.alvarez@equinoxcapital.com",
    list_name: "Global PEP",
    match_score: 91.3,
    status: "open"
  },
  {
    email: "maya.singh@zenithpay.io",
    list_name: "Regional Watchlist",
    match_score: 58.4,
    status: "open"
  },
  {
    email: "ethan.brooks@ridgecapital.com",
    list_name: "Global PEP",
    match_score: 92.1,
    status: "open"
  }
];

const riskProfilesSeed = [
  {
    email: "ava.kline@northlightbank.com",
    score: 12.4,
    level: "low",
    factors: { source: "baseline" }
  },
  {
    email: "noah.patel@heliosfintech.io",
    score: 48.9,
    level: "medium",
    factors: { source: "watchlist" }
  },
  {
    email: "sofia.alvarez@equinoxcapital.com",
    score: 79.2,
    level: "high",
    factors: { source: "behavioral" }
  },
  {
    email: "liam.chen@atlasbank.com",
    score: 9.2,
    level: "low",
    factors: { source: "baseline" }
  },
  {
    email: "maya.singh@zenithpay.io",
    score: 42.7,
    level: "medium",
    factors: { source: "velocity" }
  },
  {
    email: "ethan.brooks@ridgecapital.com",
    score: 88.5,
    level: "high",
    factors: { source: "watchlist" }
  }
];

const transactionsSeed = [
  {
    email: "ava.kline@northlightbank.com",
    transaction_ref: "TX-1001",
    amount: 1420.5,
    currency: "USD",
    type: "deposit",
    status: "settled",
    processed_at: "2026-03-10T09:35:00Z"
  },
  {
    email: "noah.patel@heliosfintech.io",
    transaction_ref: "TX-1002",
    amount: 3600,
    currency: "GBP",
    type: "transfer",
    status: "pending",
    processed_at: "2026-03-11T11:20:00Z"
  },
  {
    email: "sofia.alvarez@equinoxcapital.com",
    transaction_ref: "TX-1003",
    amount: 7800.42,
    currency: "EUR",
    type: "withdrawal",
    status: "flagged",
    processed_at: "2026-03-12T15:10:00Z"
  },
  {
    email: "liam.chen@atlasbank.com",
    transaction_ref: "TX-1004",
    amount: 299.99,
    currency: "USD",
    type: "payment",
    status: "settled",
    processed_at: "2026-03-13T08:45:00Z"
  },
  {
    email: "maya.singh@zenithpay.io",
    transaction_ref: "TX-1005",
    amount: 510.25,
    currency: "INR",
    type: "deposit",
    status: "settled",
    processed_at: "2026-03-13T18:00:00Z"
  },
  {
    email: "ethan.brooks@ridgecapital.com",
    transaction_ref: "TX-1006",
    amount: 12880,
    currency: "EUR",
    type: "transfer",
    status: "pending",
    processed_at: "2026-03-14T10:48:00Z"
  }
];

const biometricTemplatesSeed = [
  {
    email: "ava.kline@northlightbank.com",
    template_type: "face",
    template_hash: "tmpl-face-001",
    enrolled_at: "2025-11-20T10:08:00Z"
  },
  {
    email: "noah.patel@heliosfintech.io",
    template_type: "voice",
    template_hash: "tmpl-voice-001",
    enrolled_at: "2025-12-02T14:02:00Z"
  }
];

const deviceFingerprintsSeed = [
  {
    email: "ava.kline@northlightbank.com",
    device_id: "device-ava-001",
    operating_system: "iOS 18",
    browser: "Safari 19",
    last_seen: "2026-03-13T09:30:00Z"
  },
  {
    email: "noah.patel@heliosfintech.io",
    device_id: "device-noah-001",
    operating_system: "macOS 14",
    browser: "Chrome 120",
    last_seen: "2026-03-12T16:20:00Z"
  },
  {
    email: "maya.singh@zenithpay.io",
    device_id: "device-maya-001",
    operating_system: "Android 15",
    browser: "Chrome Mobile 123",
    last_seen: "2026-03-13T20:05:00Z"
  }
];

const customerRelationshipsSeed = [
  {
    primaryEmail: "ava.kline@northlightbank.com",
    relatedEmail: "liam.chen@atlasbank.com",
    relationship_type: "co_applicant",
    established_at: "2024-05-01T09:00:00Z"
  },
  {
    primaryEmail: "noah.patel@heliosfintech.io",
    relatedEmail: "maya.singh@zenithpay.io",
    relationship_type: "business_partner",
    established_at: "2023-11-12T12:20:00Z"
  },
  {
    primaryEmail: "ethan.brooks@ridgecapital.com",
    relatedEmail: "sofia.alvarez@equinoxcapital.com",
    relationship_type: "shared_address",
    established_at: "2025-01-15T08:45:00Z"
  }
];

const regulatoryFrameworksSeed = [
  {
    name: "FATCA",
    region: "Global",
    status: "active",
    description: "Foreign Account Tax Compliance Act reporting for U.S. citizens."
  },
  {
    name: "GDPR",
    region: "EU",
    status: "active",
    description: "Data privacy protections influencing AML data handling."
  },
  {
    name: "Basel III",
    region: "Global",
    status: "active",
    description: "Capital and risk management overlay supporting AML governance."
  }
];

const caseFilesSeed = [
  {
    caseTitle: "Enhanced due diligence review",
    doc_type: "National ID",
    notes: "Rejected national ID needs resubmission."
  },
  {
    caseTitle: "High velocity transaction review",
    doc_type: "Aadhaar",
    notes: "Supplemental evidence attached."
  },
  {
    caseTitle: "Watchlist escalation review",
    doc_type: "National ID",
    notes: "Supplemental evidence attached."
  }
];

const rules = [
  {
    name: "High risk jurisdiction escalation",
    description: "Escalate cases for high-risk jurisdictions.",
    is_active: true,
    rules: { jurisdiction: ["IR", "KP", "RU"], action: "manual_review" }
  },
  {
    name: "PEP watchlist auto-flag",
    description: "Flag customers matching PEP watchlist entries.",
    is_active: true,
    rules: { watchlist: "PEP", action: "flag" }
  },
  {
    name: "Velocity threshold alert",
    description: "Flag rapid transaction bursts for review.",
    is_active: true,
    rules: { transactions: "rapid", action: "alert" }
  },
  {
    name: "Document expiry check",
    description: "Reject documents expiring within 30 days.",
    is_active: true,
    rules: { expires_within_days: 30, action: "reject" }
  }
];

const dataSources = [
  { name: "Alloy Core", category: "KYC", status: "active" },
  { name: "Sanctions Feed", category: "Sanctions", status: "active" },
  { name: "Device Intel", category: "Behavioral", status: "active" },
  { name: "PEP Radar", category: "Sanctions", status: "active" },
  { name: "OCR Vision", category: "Documents", status: "active" }
];

const reports = [
  {
    report_type: "SAR",
    period_start: "2026-03-01",
    period_end: "2026-03-10",
    status: "draft"
  },
  {
    report_type: "CTR",
    period_start: "2026-02-01",
    period_end: "2026-02-28",
    status: "submitted"
  },
  {
    report_type: "KYC Summary",
    period_start: "2026-03-01",
    period_end: "2026-03-14",
    status: "draft"
  }
];

async function seed() {
  const { error: customerError } = await supabase
    .from("customers")
    .upsert(customers, { onConflict: "email" });

  if (customerError) throw customerError;

  const { data: customerRows, error: customerFetchError } = await supabase
    .from("customers")
    .select("id,email,full_name")
    .in(
      "email",
      customers.map((customer) => customer.email)
    );

  if (customerFetchError) throw customerFetchError;

  const customerMap = new Map(
    customerRows?.map((row) => [row.email, row]) ?? []
  );

  const documents = documentsSeed
    .map((doc) => ({
      customer_id: customerMap.get(doc.email)?.id,
      doc_type: doc.doc_type,
      country: doc.country,
      status: doc.status
    }))
    .filter((doc) => doc.customer_id);

  if (documents.length) {
    const { data: existingDocs } = await supabase
      .from("identity_documents")
      .select("customer_id,doc_type")
      .in(
        "customer_id",
        documents.map((doc) => doc.customer_id as string)
      );

    const existingDocKeys = new Set(
      (existingDocs ?? []).map((doc) => `${doc.customer_id}:${doc.doc_type}`)
    );

    const newDocs = documents.filter(
      (doc) => !existingDocKeys.has(`${doc.customer_id}:${doc.doc_type}`)
    );

    if (newDocs.length) {
      const { error: documentError } = await supabase
        .from("identity_documents")
        .insert(newDocs);
      if (documentError) throw documentError;
    }
  }

  const cases = casesSeed
    .map((item) => ({
      customer_id: customerMap.get(item.email)?.id,
      title: item.title,
      priority: item.priority,
      status: item.status
    }))
    .filter((item) => item.customer_id);

  const caseTitles = cases.map((item) => item.title);
  const { data: existingCases } = await supabase
    .from("cases")
    .select("id,title")
    .in("title", caseTitles);

  const existingCaseTitles = new Set(
    (existingCases ?? []).map((item) => item.title)
  );

  const newCases = cases.filter((item) => !existingCaseTitles.has(item.title));
  if (newCases.length) {
    const { error: caseError } = await supabase.from("cases").insert(newCases);
    if (caseError) throw caseError;
  }

  const { data: caseRows } = await supabase
    .from("cases")
    .select("id,title,customer_id")
    .in("title", caseTitles);

  const caseMap = new Map(
    (caseRows ?? []).map((item) => [item.title, item])
  );

  const alerts = alertsSeed
    .map((alert) => ({
      customer_id: customerMap.get(alert.email)?.id,
      case_id: caseMap.get(alert.caseTitle)?.id,
      severity: alert.severity,
      status: alert.status,
      message: alert.message
    }))
    .filter((alert) => alert.customer_id && alert.case_id);

  const { data: existingAlerts } = await supabase
    .from("alerts")
    .select("message")
    .in(
      "message",
      alerts.map((alert) => alert.message)
    );

  const existingAlertMessages = new Set(
    (existingAlerts ?? []).map((alert) => alert.message)
  );

  const newAlerts = alerts.filter(
    (alert) => !existingAlertMessages.has(alert.message)
  );
  if (newAlerts.length) {
    const { error: alertError } = await supabase.from("alerts").insert(newAlerts);
    if (alertError) throw alertError;
  }

  const sessions = sessionsSeed
    .map((session) => ({
      customer_id: customerMap.get(session.email)?.id,
      provider: session.provider,
      status: session.status,
      decision: session.decision,
      risk_score: session.risk_score,
      completed_at: session.status === "completed" ? new Date().toISOString() : null
    }))
    .filter((session) => session.customer_id);

  const { data: existingSessions } = await supabase
    .from("verification_sessions")
    .select("customer_id,provider")
    .in(
      "customer_id",
      sessions.map((session) => session.customer_id as string)
    )
    .in(
      "provider",
      Array.from(new Set(sessions.map((session) => session.provider)))
    );

  const existingSessionKeys = new Set(
    (existingSessions ?? []).map(
      (session) => `${session.customer_id}:${session.provider}`
    )
  );

  const newSessions = sessions.filter(
    (session) =>
      !existingSessionKeys.has(`${session.customer_id}:${session.provider}`)
  );

  if (newSessions.length) {
    const { error: sessionError } = await supabase
      .from("verification_sessions")
      .insert(newSessions);
    if (sessionError) throw sessionError;
  }

  const matches = watchlistSeed
    .map((match) => ({
      customer_id: customerMap.get(match.email)?.id,
      list_name: match.list_name,
      match_score: match.match_score,
      status: match.status
    }))
    .filter((match) => match.customer_id);

  const { data: existingMatches } = await supabase
    .from("watchlist_matches")
    .select("customer_id,list_name")
    .in(
      "customer_id",
      matches.map((match) => match.customer_id as string)
    );

  const existingMatchKeys = new Set(
    (existingMatches ?? []).map(
      (match) => `${match.customer_id}:${match.list_name}`
    )
  );

  const newMatches = matches.filter(
    (match) => !existingMatchKeys.has(`${match.customer_id}:${match.list_name}`)
  );

  if (newMatches.length) {
    const { error: watchlistError } = await supabase
      .from("watchlist_matches")
      .insert(newMatches);
    if (watchlistError) throw watchlistError;
  }

  const riskProfiles = riskProfilesSeed
    .map((profile) => ({
      customer_id: customerMap.get(profile.email)?.id,
      score: profile.score,
      level: profile.level,
      factors: profile.factors,
      last_assessed_at: new Date().toISOString()
    }))
    .filter((profile) => profile.customer_id);

  const { error: riskError } = await supabase
    .from("risk_profiles")
    .upsert(riskProfiles, { onConflict: "customer_id" });
  if (riskError) throw riskError;

  const transactions = transactionsSeed
    .map((tx) => ({
      customer_id: customerMap.get(tx.email)?.id,
      transaction_ref: tx.transaction_ref,
      amount: tx.amount,
      currency: tx.currency,
      type: tx.type,
      status: tx.status,
      processed_at: tx.processed_at
    }))
    .filter((tx) => tx.customer_id);

  if (transactions.length) {
    const { error: transactionError } = await supabase
      .from("transactions")
      .upsert(transactions, { onConflict: "transaction_ref" });
    if (transactionError) throw transactionError;
  }

  const biometricTemplates = biometricTemplatesSeed
    .map((template) => ({
      customer_id: customerMap.get(template.email)?.id,
      template_type: template.template_type,
      template_hash: template.template_hash,
      enrolled_at: template.enrolled_at
    }))
    .filter((template) => template.customer_id);

  if (biometricTemplates.length) {
    const { error: biometricError } = await supabase
      .from("biometric_templates")
      .upsert(biometricTemplates, { onConflict: "template_hash" });
    if (biometricError) throw biometricError;
  }

  const deviceFingerprints = deviceFingerprintsSeed
    .map((device) => ({
      customer_id: customerMap.get(device.email)?.id,
      device_id: device.device_id,
      operating_system: device.operating_system,
      browser: device.browser,
      last_seen: device.last_seen
    }))
    .filter((device) => device.customer_id);

  if (deviceFingerprints.length) {
    const { error: deviceError } = await supabase
      .from("device_fingerprints")
      .upsert(deviceFingerprints, { onConflict: "device_id" });
    if (deviceError) throw deviceError;
  }

  const customerRelationships = customerRelationshipsSeed
    .map((relationship) => ({
      primary_customer_id: customerMap.get(relationship.primaryEmail)?.id,
      related_customer_id: customerMap.get(relationship.relatedEmail)?.id,
      relationship_type: relationship.relationship_type,
      established_at: relationship.established_at
    }))
    .filter(
      (relationship) =>
        relationship.primary_customer_id && relationship.related_customer_id
    );

  if (customerRelationships.length) {
    const { error: relationshipError } = await supabase
      .from("customer_relationships")
      .upsert(customerRelationships, {
        onConflict: ["primary_customer_id", "related_customer_id"]
      });
    if (relationshipError) throw relationshipError;
  }

  const { error: regulatoryError } = await supabase
    .from("regulatory_frameworks")
    .upsert(regulatoryFrameworksSeed, { onConflict: "name" });
  if (regulatoryError) throw regulatoryError;

  const { data: docRows } = await supabase
    .from("identity_documents")
    .select("id,customer_id,doc_type")
    .in(
      "customer_id",
      Array.from(new Set(documents.map((doc) => doc.customer_id as string)))
    );

  const docMap = new Map(
    (docRows ?? []).map((doc) => [`${doc.customer_id}:${doc.doc_type}`, doc])
  );

  const caseFiles = caseFilesSeed
    .map((file) => {
      const caseRow = caseMap.get(file.caseTitle);
      if (!caseRow) return null;
      const docKey = `${caseRow.customer_id}:${file.doc_type}`;
      const docRow = docMap.get(docKey);
      if (!docRow) return null;
      return {
        case_id: caseRow.id,
        document_id: docRow.id,
        notes: file.notes
      };
    })
    .filter((file): file is { case_id: string; document_id: string; notes: string } =>
      Boolean(file)
    );

  if (caseFiles.length) {
    const { data: existingCaseFiles } = await supabase
      .from("case_files")
      .select("case_id,document_id")
      .in(
        "case_id",
        Array.from(new Set(caseFiles.map((file) => file.case_id)))
      );

    const existingCaseFileKeys = new Set(
      (existingCaseFiles ?? []).map(
        (file) => `${file.case_id}:${file.document_id}`
      )
    );

    const newCaseFiles = caseFiles.filter(
      (file) => !existingCaseFileKeys.has(`${file.case_id}:${file.document_id}`)
    );

    if (newCaseFiles.length) {
      const { error: caseFileError } = await supabase
        .from("case_files")
        .insert(newCaseFiles);
      if (caseFileError) throw caseFileError;
    }
  }

  const { error: ruleError } = await supabase
    .from("compliance_rules")
    .upsert(rules, { onConflict: "name" });
  if (ruleError) throw ruleError;

  const { error: sourceError } = await supabase
    .from("data_sources")
    .upsert(dataSources, { onConflict: "name" });
  if (sourceError) throw sourceError;

  const { data: existingReports } = await supabase
    .from("reports")
    .select("report_type,period_start")
    .in(
      "report_type",
      reports.map((report) => report.report_type)
    );

  const existingReportKeys = new Set(
    (existingReports ?? []).map(
      (report) => `${report.report_type}:${report.period_start}`
    )
  );

  const newReports = reports.filter(
    (report) => !existingReportKeys.has(`${report.report_type}:${report.period_start}`)
  );

  if (newReports.length) {
    const { error: reportError } = await supabase.from("reports").insert(newReports);
    if (reportError) throw reportError;
  }

  const { data: existingAudit } = await supabase
    .from("audit_logs")
    .select("id")
    .eq("action", "seed.completed")
    .limit(1);

  if (!existingAudit?.length) {
    await supabase.from("audit_logs").insert([
      {
        action: "seed.completed",
        entity: "system",
        metadata: { seeded_at: new Date().toISOString() }
      }
    ]);
  }

  console.log("Seed data inserted successfully.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
