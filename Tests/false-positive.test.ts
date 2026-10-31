import { describe, expect, it } from "vitest";

/**
 * INTEGRATION NOTE
 * ----------------
 * Keep this import identical to the one in url-analyzer.test.ts and point it
 * to the actual reusable analyzer function in your src/ folder.
 */
import { analyzeUrl } from "../src/lib/urlAnalyzer";

type Analysis = {
  score?: number;
  threatScore?: number;
  overallThreatScore?: number;
  verdict?: string;
  aiVerdict?: string;
  findings?: unknown[];
  reasons?: unknown[];
  [key: string]: unknown;
};

function getVerdict(result: Analysis): string {
  const value = result.aiVerdict ?? result.verdict;
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("Analyzer result must contain a non-empty verdict or aiVerdict.");
  }
  return value.trim().toUpperCase();
}

function getScore(result: Analysis): number {
  const value = result.threatScore ?? result.overallThreatScore ?? result.score;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Analyzer result must contain a numeric risk score.");
  }
  return value;
}

const benignVerdicts = ["BENIGN", "SAFE", "LOW"];

describe("SentinelAI URL analyzer — false-positive resistance", () => {
  it("does not classify the ordinary example.com homepage as suspicious or malicious", async () => {
    const result = (await analyzeUrl("https://example.com/")) as Analysis;

    expect(getScore(result)).toBeGreaterThanOrEqual(0);
    expect(getScore(result)).toBeLessThanOrEqual(100);
    expect(benignVerdicts).toContain(getVerdict(result));
  });

  it("does not treat a random-looking query parameter alone as proof of a threat", async () => {
    const url = "https://example.com/search?ref=a8Kp9Lm2Qx7V";
    const result = (await analyzeUrl(url)) as Analysis;

    // High entropy can be recorded as a weak signal, but it should not by itself
    // establish phishing, malware, or credential theft. A benign URL with a
    // random-looking tracking/reference value should remain benign/low risk.
    expect(benignVerdicts).toContain(getVerdict(result));
  });

  it("does not claim a confirmed malicious incident from URL shape alone", async () => {
    const url =
      "http://login-verify-account.example.test/session/update?token=Q7vN2xK9pL4mR8sT";
    const result = (await analyzeUrl(url)) as Analysis;

    // The synthetic URL has suspicious lexical/transport signals. Without a
    // verified malicious reputation result or page-level evidence, the correct
    // outcome is SUSPICIOUS/review, not a confirmed MALICIOUS classification.
    expect(getVerdict(result)).toBe("SUSPICIOUS");
  });
});
