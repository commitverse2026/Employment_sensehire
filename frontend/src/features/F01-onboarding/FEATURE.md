# F01 — Onboarding Form

## What is this?
A clean, multi-step form that collects a candidate's full name,
professional skills (as tags), years of experience, and preferred job roles.

## What you need to build
- Multi-step form with at least 3 steps (step indicator visible at top)
- Smooth animated transitions between steps (no page reload)
- Real-time validation on each field before allowing Next
- Skills entered as removable tag chips
- On submit: POST the data to `/api/onboarding` and append to `candidates.json`

## Expected output
- Working multi-step form rendered at `/onboarding`
- Data saved to `backend/data/candidates.json` on submit
- Console or toast confirmation on success


## Files to change
| File | What to do |
|------|-----------|
| `frontend/src/features/F01-onboarding/index.jsx` | Build the form UI here |
| `backend/routes/f01-onboarding.js` | Add POST `/api/onboarding` route |
| `backend/controllers/f01-onboarding.controller.js` | Write logic to append to candidates.json |
| `backend/data/candidates.json` | Your submitted data will be saved here |

## Data shape (candidates.json entry)
```json
{
  "id": "c001",
  "fullName": "Priya Mehta",
  "skills": ["React", "Node.js", "Figma"],
  "yearsExperience": 3,
  "preferredRoles": ["Frontend Developer", "UI Engineer"]
}
```

## How to claim this feature
Open GitHub Issue using the **F01 — Onboarding Form** template and assign yourself.
Branch name: `feature/F01-your-name`
PR title must start with: `[F01]`