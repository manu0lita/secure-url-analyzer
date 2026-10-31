# SentinelAI test integration notes

These are Vitest TypeScript test templates based on the three analysis outputs supplied for this project.

## Important: connect tests to the real analyzer

Both test files currently import:

```ts
import { analyzeUrl } from "../src/lib/urlAnalyzer";
```

Before running them, confirm that this module exists and exports a reusable `analyzeUrl(url: string)` function. If the actual source file or exported function has a different name, change the import (and, if necessary, the function call) in both files. If analysis is currently embedded in a React component or generated from fixed mock data, extract the analysis logic into a reusable function and have the UI and tests call the same function.

The tests are not proof that the deployed app works until they call that real function and pass locally.

## What the supplied outputs revealed

- `https://example.com/` was reported as `SUSPICIOUS`, score 35.
- `https://example.com/search?ref=a8Kp9Lm2Qx7V` was reported as `SUSPICIOUS`, score 33.
- The synthetic `.test` URL was reported as `MALICIOUS`, score 88.
- The dashboard labels the build `v1.0 · mock`.

Therefore the false-positive tests intentionally express the desired security behaviour and are expected to expose current problems until the classifier is corrected: ordinary benign URLs should not become suspicious solely because of entropy or simulated reputation; URL-shape indicators alone should not establish a confirmed malicious incident.

## Install and run

From the project root, install Vitest if it is not already installed:

```bash
bun add -d vitest
```

Add this script to the existing `scripts` object in `package.json` (do not delete other scripts):

```json
"test": "vitest run"
```

Then run:

```bash
bun run test
```

A failed false-positive test is a real finding to investigate, not something to hide. Do not change the expected verdict merely to make the test pass; fix the analyzer or document a justified limitation.
