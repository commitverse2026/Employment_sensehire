## How to participate

1. Fork the repo
2. Open an Issue using the feature template to claim your feature
3. Branch: `feature/F01-your-name` (replace F01 with your feature number)
4. Complete the feature per FEATURE.md instructions
5. PR title: `[F01] Onboarding Form — Your Name`
6. PR must pass CI checks (lint + build)

## API key rule (CRITICAL for F10)
- Never commit your API key to the repo
- Use `.env` files only (already in .gitignore)
- Your feature MUST show a graceful error card if the API key is missing
- The error must be contained to your feature's component only — no crashing other pages
- Other participants' code must not break if your key is absent

## JSON files
- Pre-filled dummy data is provided — do not delete existing entries
- You may append new entries; do not modify existing ones
- Always maintain valid JSON (use a linter)