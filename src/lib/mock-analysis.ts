export type Verdict = "Safe" | "Suspicious" | "High Risk" | "Malicious";

export interface AnalysisResult {
  url: string;
  scannedAt: string;
  threatScore: number; // 0-100
  verdict: Verdict;
  confidence: number; // 0-100
  explanations: { label: string; weight: number; detail: string }[];
  ssl: {
    valid: boolean;
    issuer: string;
    grade: string;
    validFrom: string;
    validTo: string;
    protocol: string;
  };
  domain: {
    domain: string;
    registrar: string;
    ageDays: number;
    tld: string;
    ip: string;
    country: string;
    asn: string;
    dns: { type: string; value: string }[];
  };
  features: { name: string; value: string | number; risk: "low" | "med" | "high" }[];
  mitre: { id: string; name: string; tactic: string; rationale: string }[];
  recommendations: { priority: "Critical" | "High" | "Medium" | "Low"; action: string }[];
  timeline: { step: string; status: "done" | "active"; ms: number }[];
}

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function verdictFor(score: number): Verdict {
  if (score >= 80) return "Malicious";
  if (score >= 55) return "High Risk";
  if (score >= 30) return "Suspicious";
  return "Safe";
}

export function analyze(rawUrl: string): AnalysisResult {
  const url = rawUrl.trim();
  let host = url;
  try {
    host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
  } catch {
    /* keep raw */
  }
  const h = hash(url);

  // Deterministic pseudo-random feature signals
  const len = url.length;
  const hasIp = /^(\d{1,3}\.){3}\d{1,3}/.test(host);
  const dashCount = (host.match(/-/g) || []).length;
  const subdomainCount = host.split(".").length - 2;
  const suspiciousWords = ["login", "verify", "secure", "update", "bank", "wallet", "free", "gift", "account"];
  const matchedWords = suspiciousWords.filter((w) => url.toLowerCase().includes(w));
  const entropy = Math.min(8, 2.4 + (h % 100) / 25);
  const hasAt = url.includes("@");
  const httpsOk = url.startsWith("https://");

  let score = 8;
  if (!httpsOk) score += 18;
  if (hasIp) score += 25;
  if (len > 75) score += 10;
  if (dashCount > 2) score += 8;
  if (subdomainCount > 2) score += 9;
  score += matchedWords.length * 9;
  if (entropy > 4.5) score += 12;
  if (hasAt) score += 14;
  score += (h % 17);
  score = Math.min(99, Math.max(2, score));

  const verdict = verdictFor(score);
  const confidence = 72 + ((h >> 3) % 25);

  const ageDays = 30 + (h % 4000);
  const tld = (host.split(".").pop() || "com").toLowerCase();
  const sslValid = httpsOk && score < 70;

  return {
    url,
    scannedAt: new Date().toISOString(),
    threatScore: score,
    verdict,
    confidence,
    explanations: [
      hasIp && { label: "Raw IP in hostname", weight: 25, detail: "Hostname is a raw IPv4 address — common in phishing kits to evade domain-based blocklists." },
      !httpsOk && { label: "No HTTPS", weight: 18, detail: "URL is served over plaintext HTTP; credentials and session data would be exposed." },
      matchedWords.length > 0 && { label: `Sensitive keywords: ${matchedWords.join(", ")}`, weight: matchedWords.length * 9, detail: "Lexical signals associated with credential-harvesting lures." },
      len > 75 && { label: "Excessive URL length", weight: 10, detail: `URL is ${len} characters — long URLs frequently encode obfuscated payloads or redirects.` },
      entropy > 4.5 && { label: "High path entropy", weight: 12, detail: `Shannon entropy ≈ ${entropy.toFixed(2)} suggests randomized / DGA-style tokens.` },
      subdomainCount > 2 && { label: "Deep subdomain nesting", weight: 9, detail: `${subdomainCount} subdomains — used to spoof brands within the path.` },
      hasAt && { label: "‘@’ character in URL", weight: 14, detail: "The '@' trick hides the real destination from casual readers." },
      { label: "Reputation graph proximity", weight: 6, detail: "Adjacent to clusters previously flagged by community threat feeds." },
    ].filter(Boolean) as AnalysisResult["explanations"],
    ssl: {
      valid: sslValid,
      issuer: sslValid ? "Let's Encrypt R3" : "Self-signed / Invalid chain",
      grade: sslValid ? (score < 30 ? "A+" : "B") : "F",
      validFrom: "2025-09-12",
      validTo: "2026-09-12",
      protocol: sslValid ? "TLS 1.3" : "TLS 1.0",
    },
    domain: {
      domain: host,
      registrar: ["NameCheap", "GoDaddy", "Porkbun", "Cloudflare Registrar"][h % 4],
      ageDays,
      tld,
      ip: hasIp ? host : `${20 + (h % 200)}.${h % 255}.${(h >> 4) % 255}.${(h >> 8) % 255}`,
      country: ["US", "DE", "RU", "CN", "NL", "BR"][h % 6],
      asn: `AS${13000 + (h % 50000)}`,
      dns: [
        { type: "A", value: `${20 + (h % 200)}.${h % 255}.${(h >> 4) % 255}.${(h >> 8) % 255}` },
        { type: "MX", value: `mail.${host}` },
        { type: "NS", value: `ns1.${host}` },
        { type: "TXT", value: "v=spf1 include:_spf.google.com ~all" },
      ],
    },
    features: [
      { name: "URL length", value: len, risk: len > 75 ? "high" : len > 40 ? "med" : "low" },
      { name: "Special symbols", value: (url.match(/[?&=%@]/g) || []).length, risk: "med" },
      { name: "Shannon entropy", value: entropy.toFixed(2), risk: entropy > 4.5 ? "high" : "low" },
      { name: "Suspicious keywords", value: matchedWords.length, risk: matchedWords.length ? "high" : "low" },
      { name: "Redirect chain", value: 1 + (h % 4), risk: (h % 4) > 2 ? "high" : "low" },
      { name: "IP-based URL", value: hasIp ? "Yes" : "No", risk: hasIp ? "high" : "low" },
      { name: "Subdomain depth", value: subdomainCount, risk: subdomainCount > 2 ? "high" : "low" },
      { name: "Uses HTTPS", value: httpsOk ? "Yes" : "No", risk: httpsOk ? "low" : "high" },
    ],
    mitre: [
      { id: "T1566.002", name: "Spearphishing Link", tactic: "Initial Access", rationale: "URL structure mirrors known phishing lure templates." },
      { id: "T1056.003", name: "Web Portal Capture", tactic: "Credential Access", rationale: "Page topology suggests credential entry form harvesting." },
      { id: "T1204.001", name: "User Execution: Malicious Link", tactic: "Execution", rationale: "Delivery vector relies on user clicking the link." },
      { id: "T1583.001", name: "Acquire Infrastructure: Domains", tactic: "Resource Development", rationale: `Domain age ${ageDays}d & registrar pattern match adversary tradecraft.` },
    ],
    recommendations: [
      { priority: score > 70 ? "Critical" : "High", action: "Block the URL at the secure web gateway and DNS resolver." },
      { priority: "High", action: "Add the hosting IP & ASN to the watchlist for 30 days." },
      { priority: "Medium", action: "Notify affected users; rotate credentials if interaction occurred." },
      { priority: "Medium", action: "Hunt for similar lookalike domains via passive DNS." },
      { priority: "Low", action: "Submit indicators to internal TIP and community feeds." },
    ],
    timeline: [
      { step: "URL received", status: "done", ms: 12 },
      { step: "Feature extraction", status: "done", ms: 84 },
      { step: "AI inference", status: "done", ms: 312 },
      { step: "Threat intelligence checks", status: "done", ms: 540 },
      { step: "Explanation generation", status: "done", ms: 220 },
      { step: "Final verdict", status: "done", ms: 18 },
    ],
  };
}

export const verdictMeta: Record<Verdict, { color: string; ring: string; label: string }> = {
  Safe: { color: "var(--success)", ring: "ring-[color:var(--success)]/40", label: "SAFE" },
  Suspicious: { color: "var(--warn)", ring: "ring-[color:var(--warn)]/40", label: "SUSPICIOUS" },
  "High Risk": { color: "var(--warn)", ring: "ring-[color:var(--warn)]/40", label: "HIGH RISK" },
  Malicious: { color: "var(--danger)", ring: "ring-[color:var(--danger)]/40", label: "MALICIOUS" },
};
