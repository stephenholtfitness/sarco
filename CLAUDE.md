# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file static web application for sarcopenia (age-related muscle loss) screening using the validated SARC-F questionnaire. No build tools, package managers, or external dependencies.

## Running the App

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Architecture

Everything lives in `index.html` as three inline sections:

- **CSS** (lines ~7–161): Custom properties for theming (primary teal `#008080`, accent orange `#FF8C00`), risk-level color coding (low/moderate/high), animated score bar, responsive layout (max-width 600px).
- **HTML** (lines ~165–252): Form with 5 SARC-F dropdowns (Strength, Walking Assistance, Rise from Chair, Climb Stairs, Falls). Results rendered into an `aria-live` region.
- **JavaScript** (lines ~254–337): `calculateRisk()` sums dropdown values (0–10 scale) and maps to three risk tiers (0 = low, 1–3 = moderate, 4–10 = high). `resetForm()` clears state without a page reload. No frameworks, no external scripts.

## Scoring Logic

| Score | Risk Level |
|-------|------------|
| 0     | Low        |
| 1–3   | Moderate   |
| 4–10  | High       |

The animated score bar fills proportionally to `score / 10 * 100%`. The CTA button links to an ActiveHosted form for follow-up.
