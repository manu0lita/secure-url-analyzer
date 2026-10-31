# SentinelAI — Secure URL Analyzer

> **Project status:** Prototype / mock-data build. Update this README after checking the actual source code and running the final tests. Do not describe simulated intelligence results as verified live threat-intelligence findings.

## 1. Overview

SentinelAI — Secure URL Analyzer is a cybersecurity proof-of-concept intended to help a user inspect a URL and understand signals that may indicate risk. The dashboard is designed around a SOC-style workflow: URL feature extraction, a risk score and verdict, explainable findings, domain/TLS information, possible MITRE ATT&CK associations, and suggested defensive actions.

The tool is a triage aid, not a malware detector and not proof that a website is malicious. A suspicious verdict means that one or more indicators deserve investigation. A benign verdict does not guarantee that a URL is safe.

**Important:** The dashboard version shown during development identifies itself as `v1.0 · mock`. Therefore, any simulated reputation, certificate, domain-intelligence, AI-confidence, or threat-feed result must be labelled as simulated unless the implementation actually retrieves and validates that information from a real source. Replace this status statement only after you have verified the final implementation.

## 2. Security problem being addressed

Analysts and security learners often receive URLs through email, messages, tickets, or alerts. Manually checking URL structure and related indicators can be repetitive. This project aims to organise initial URL triage by presenting observable features and explaining why they may matter.

## 3. Intended users

- Cybersecurity students learning URL and phishing triage.
- Junior SOC analysts performing preliminary investigation.
- Security teams reviewing URLs in an authorised workflow.

## 4. Main features

The current dashboard design includes the following areas. Keep a feature in this list only if it is implemented in the submitted code; mark simulated features clearly.

- URL input and analysis workflow.
- URL feature display, such as URL length, special characters, entropy, suspicious keywords, redirects, IP-based URLs, subdomain depth, and HTTPS use.
- A threat score and verdict with an explanation of contributing indicators.
- Domain and DNS information, where available.
- SSL/TLS and certificate information, where an actual connection check is implemented.
- Possible MITRE ATT&CK technique associations, which should be treated as hypotheses unless supported by additional evidence.
- Defensive recommendations for further investigation.

## 5. Technology

Complete this table from the actual project files. Do not list a tool or library merely because it was considered.

| Component | Actual technology used |
|---|---|
| Application language | **[Fill from source code]** |
| Runtime / package manager | **[Confirm: Bun / Node.js / other]** |
| Front end / framework | **[Fill from package.json]** |
| Back end / analysis engine | **[Fill from source code, or write “not applicable”]** |
| Testing framework | **[Fill from package.json, or write “manual tests only”]** |
| External APIs / threat feeds | **[List actual integrations, or write “none; simulated data only”]** |

## 6. Requirements

- Install the runtime used by this project (confirm it from `package.json`).
- Install the project dependencies using the package manager and lockfile supplied with the project.
- Use only test URLs or systems you are authorised to inspect.

## 7. Installation and execution

The exact commands depend on the scripts in `package.json`. First inspect that file and use the scripts actually defined there.

If the project is a Bun project, the usual dependency-install command is:

```bash
bun install
```

Then run the script defined in `package.json`. For example, use `bun run dev` **only if** a `dev` script exists. If the script has another name, use that name instead. Do not submit unverified commands.

If the project uses a different runtime or package manager, replace the commands above with the verified commands for that setup.

## 8. Usage

1. Start the application using the verified command from the previous section.
2. Enter a URL in the URL input field.
3. Start the analysis.
4. Review the verdict, score, individual indicators, and explanations.
5. Check which results are live observations and which are simulated.
6. Save or export the result only using functionality that exists in the submitted version.

Do not use the sample domains below to infer that a real organisation is malicious. The suspicious example is synthetic and uses the reserved `.test` namespace for controlled testing.

## 9. Sample inputs and outputs

The `samples/` directory contains:

- `benign-url.json` — a low-risk-format test input using `https://www.example.com/`.
- `suspicious-test-url.json` — a synthetic URL with several suspicious-looking features. It is a test string, not a live phishing site.
- `false-positive-url.json` — a benign-looking URL with a long opaque query value, useful for checking that entropy alone is not treated as proof.
- `expected-output.json` — behavioural checks that the implementation should satisfy. The exact verdict and score depend on the code's documented scoring rules.
- `sample-output.json` — a template. Replace it with the **actual output produced by your final application** before submission. Do not present the template as a successful test result.

If the application currently accepts a URL through its dashboard rather than reading JSON files, open the JSON file and paste the value of `input.url` into the URL field. The JSON fixtures document the test case; they do not imply that JSON-file upload is implemented.

## 10. Testing and validation

At minimum, demonstrate:

1. A successful analysis of the benign test URL.
2. A suspicious-pattern test using the synthetic `.test` URL, or another controlled test input supported by your application.
3. A false-positive / limitation case using `false-positive-url.json`. A long URL or high-entropy query value by itself must not be described as proof of malicious activity.
4. A check that the displayed score equals the sum of the contributing score components, subject to the documented scoring and cap rules.
5. A check that HTTP/HTTPS and TLS results are described consistently. If the input uses HTTP but the application separately probes HTTPS, document that separate probe.

Record the actual output and test result. If a test fails, fix the implementation or document the limitation; do not change the expected result merely to make a failed test appear successful.

## 11. Security considerations

- Analyse only URLs and infrastructure that you are authorised to inspect.
- Do not submit credentials, session cookies, private tokens, or confidential URLs to external services.
- Do not automatically visit potentially malicious URLs from a personal or production browser. Use an isolated lab or safe URL-analysis method.
- Treat URL content, DNS data, reputation responses, and page content as untrusted input.
- Do not execute downloaded files or active content as part of URL inspection.
- Do not automatically block a domain or IP based only on a heuristic score. Human review and corroborating evidence are required.
- Avoid logging secrets or full query strings that may contain tokens or personal data.

## 12. Known limitations

Update this list to match the final implementation.

- The dashboard build shown during development is marked `mock`; simulated results are not live threat intelligence.
- Heuristic indicators can produce false positives and false negatives.
- URL entropy alone does not prove domain-generation activity or maliciousness.
- A URL alone cannot prove credential harvesting, spearphishing, or execution. Page inspection and contextual evidence may be required.
- A TLS version or certificate result is meaningful only if a real HTTPS connection was tested and the result was captured correctly.
- Reputation and infrastructure conclusions require identifiable sources, timestamps, and a documented lookup process.
- The tool is intended for preliminary triage and does not replace a full security investigation.

## 13. Future improvements

- Add reproducible unit and integration tests for URL parsing and scoring.
- Add clearly identified, optional real DNS and certificate checks with timeouts and safe error handling.
- Integrate reputable threat-intelligence sources only where permitted, documenting data source, timestamp, and API limitations.
- Improve false-positive handling through explainable rules and confidence calibration.
- Export a structured JSON or Markdown investigation report.
- Add regression tests for malformed URLs, redirects, internationalised domain names, IP-literal URLs, and unusually long inputs.

## Demonstration Video

A demonstration of SentinelAI covering URL analysis,
threat scoring, explainable findings, testing and
known limitations.

**Demo Video:** [Watch SentinelAI Demonstration](https://drive.google.com/file/d/1Gh6Sgtua1_A4SwDwZUxT5Rxsd-YLgMsg/view?usp=sharing)

## Supplementary Cybersecurity Project

### Apex Planet – Task 2: Network Security

This project demonstrates my practical experience
with network reconnaissance, vulnerability assessment,
traffic analysis and firewall configuration.

Tools explored include Nmap, Nessus, Wireshark,
hping3 and iptables.

**GitHub/linkedin Repository:**
https://github.com/manu0lita/apex-planet-task-2-network-security
https://lnkd.in/p/d3tUvZvz

## 14. Responsible AI use

AI tools were used as assistants during project preparation. The exact tools, generated or suggested components, mistakes found, and manual validation steps are recorded in [`AI_USAGE.md`](AI_USAGE.md). AI-generated findings are not treated as verified facts without independent checks.

## 15. Author

**Manasvi Vinodkumar Yelloor**  
Cybersecurity / Network Security learner
