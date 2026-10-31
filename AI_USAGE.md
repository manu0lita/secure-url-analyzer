# AI Usage Disclosure

This document describes how AI assistance was used while preparing SentinelAI — Secure URL Analyzer. It must be reviewed and completed by the author before submission so that it accurately reflects the tools and work used in the final repository.

## 1. Which AI tools did you use?

- **ChatGPT (OpenAI):** Used during preparation of the project documentation, test-case planning, and review of the dashboard output shown for this assessment.
- **Other tools:** Add every other AI tool actually used to design, generate, debug, or review the project (for example, Gemini, Claude, Copilot, or an IDE assistant). 

## 2. How did AI assist you?

ChatGPT helped organise the project documentation and map the project to the assessment requirements. It also helped identify technical points that needed manual verification, including consistency of the threat-score calculation, the distinction between an HTTP input URL and a separate HTTPS/TLS probe, the interpretation of URL entropy, and the evidential limits of mapping a URL to MITRE ATT&CK techniques.

Add a precise description of any AI assistance used for source-code generation, debugging, UI design, test writing, or research. Do not claim that AI performed work that it did not perform.

## 3. Which parts were generated or substantially suggested by AI?

- The README and this disclosure document were drafted with ChatGPT assistance and must be checked against the final implementation.
- The sample test-case structure and validation ideas were suggested with ChatGPT assistance.
- **Source code:** Complete this statement truthfully: `[Identify the files/functions generated or substantially suggested by AI, or state that no source code was AI-generated.]`
- **Other assets or components:** `[Identify any AI-generated UI, prompts, test code, or other components, or write “None”.]`

## 4. What mistakes, insecure suggestions, or incorrect assumptions did AI make?

During review of the displayed analysis, the following issues were identified for verification rather than accepted blindly:

- The displayed score was 49/100, but the visible contributions (+18, +12, and +6) total 36. The unexplained difference must be investigated and resolved in the scoring implementation or explained by additional documented factors.
- The display said the submitted URL did not use HTTPS while also showing TLS 1.0 and certificate details. These can refer to separate HTTP and HTTPS checks, but the application must make that distinction explicit and the underlying probe must be verified.
- The entropy value was shown as 6.00 for a URL reported to be 25 characters long. If entropy was calculated over exactly those 25 characters, that value exceeds the maximum possible empirical Shannon entropy per character. The measured input and calculation must be checked.
- A URL's structure alone does not establish that its page steals credentials or that a spearphishing campaign occurred. MITRE ATT&CK mappings should be described as possible associations unless additional evidence supports them.
- Reputation-graph, domain, certificate, or AI-confidence claims must not be presented as live verified results when the dashboard is using mock data.

Record any additional AI-generated coding errors, insecure suggestions, incorrect assumptions, or false positives found during your own testing. If none were found in a particular area, say so accurately rather than inventing an issue.

## 5. How did you manually validate the generated code or output?

Complete this section after carrying out the checks. Keep only the checks you actually performed and record the result.

- [ ] Read the source code for the URL parsing and feature-extraction logic.
- [ ] Ran the application locally using the documented command.
- [ ] Tested a benign URL and saved the actual output.
- [ ] Tested a synthetic suspicious-pattern URL and saved the actual output.
- [ ] Tested a false-positive or limitation case, such as a long or high-entropy URL that is not automatically treated as malicious solely because of that feature.
- [ ] Recalculated the score from the individual contributions and checked the cap/weighting rules.
- [ ] Checked that HTTP, HTTPS, TLS version, and certificate statements match the actual network checks performed.
- [ ] Verified whether DNS, WHOIS, reputation, and MITRE ATT&CK data are live, cached, or simulated.
- [ ] Checked error handling for malformed URLs and unavailable network lookups.
- [ ] Reviewed dependencies and removed credentials, API keys, tokens, and private data from the repository.

**Test environment and results:** `[Add operating system, runtime version, commands executed, test date, and pass/fail results.]`

## 6. What did you change after reviewing AI-generated work?

`[Describe the actual changes made. Examples may include correcting a scoring mismatch, changing unsupported claims to “potential indicators”, labelling mock data, adding input validation, improving error handling, or adding false-positive tests. Do not list a change unless it was actually implemented.]`

## 7. Which part of the final project can you confidently explain without AI assistance?

`[Write in your own words. For example, explain the URL parsing process, the feature-extraction logic, how each rule contributes to the score, how the final verdict is selected, and why a heuristic result can be a false positive. Keep only the parts you can genuinely explain and demonstrate live.]`

## Declaration

I have reviewed this disclosure and confirm that it accurately describes the AI tools and assistance used in the submitted version of the project. I have not treated AI-generated output as verified security evidence without checking it.

**Author:** Manasvi Vinodkumar Yelloor  
**Date:** `[Enter submission date]`
