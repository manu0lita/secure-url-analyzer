import { describe, expect, it } from "vitest";

/**
 * INTEGRATION NOTE
 * ----------------
 * Change this import to the real, exported URL-analysis function in your src/ folder.
 * The function should accept a URL string and return the analysis object used by the UI.
 * Example expected export: export async function analyzeUrl(url: string) { ... }
 *
 * If your current analyzer is embedded inside a React component or returns only mock data,
 * extract the analysis logic into a reusable function before treating these as integration tests.
 */
import { analyzeUrl } from "../src/lib/urlAnalyzer";

type Analysis = {
  score?: number;
  threatScore?: number;
  overallThreatScore?: number;
  verdict?: string;
  aiVerdict?: string;
  confidence?: number;
  aiConfidence?: number;
  [key: string]: unknown;
};

function getScore(result: Analysis): number {
  const value = result.threatScore ?? result.overallThreatScore ?? result.score;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(
      "Analyzer result must contain a numeric score, threatScore, or overallThreatScore.",
    );
  }
  return value;
}

function getVerdict(result: Analysis): string {
  const value = result.aiVerdict ?? result.verdict;
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("Analyzer result must contain a non-empty verdict or aiVerdict.");
  }
  return value.trim().toUpperCase();
}

function getOptionalConfidence(result: Analysis): number | undefined {
  const value = result.aiConfidence ?? result.confidence;
  return typeof value === "number" ? value : undefined;
}

describe("SentinelAI URL analyzer — core behaviour", () => {
  it("accepts a normal HTTPS URL and returns a structured risk assessment", async () => {
    const result = (await analyzeUrl("https://example.com/")) as Analysis;

    expect(result).toBeDefined();
    expect(typeof result).toBe("object");

    const score = getScore(result);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);

    // The exact verdict is deliberately not asserted here. The dedicated
    // false-positive tests assert that benign examples are not over-classified.
    expect(["BENIGN", "SAFE", "LOW", "SUSPICIOUS", "MALICIOUS"]).toContain(
      getVerdict(result),
    );

    const confidence = getOptionalConfidence(result);
    if (confidence !== undefined) {
      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(100);
    }
  });

  it("analyses a synthetic suspicious-pattern URL without relying on a live target", async () => {
    const syntheticUrl =
      "http://login-verify-account.example.test/session/update?token=Q7vN2xK9pL4mR8sT";
    const result = (await analyzeUrl(syntheticUrl)) as Analysis;

    // .test is a reserved testing suffix. This test should perform URL-string
    // analysis only; it must not require the hostname to resolve or be contacted.
    expect(result).toBeDefined();
    const score = getScore(result);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(["SUSPICIOUS", "MALICIOUS"]).toContain(getVerdict(result));
  });
});
