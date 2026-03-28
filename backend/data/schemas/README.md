# Data Schemas — SenseHire

All dummy data lives in `backend/data/`. This file explains the shape of each JSON file.

---

## Vector Dimensions (CRITICAL — all vectors use this same order)

Every ability vector and job vector has exactly **5 dimensions** in this fixed order:

| Index | Dimension | Description |
|-------|-----------|-------------|
| 0 | `visual` | Visual processing — reading text, monitoring screens |
| 1 | `auditory` | Hearing — phone calls, verbal instructions, audio alerts |
| 2 | `fineMotor` | Typing, mouse, keyboard input |
| 3 | `cognitiveLoad` | Focus, multitasking, complex reasoning |
| 4 | `verbalComm` | Speaking — meetings, presentations, calls |

Scale: **1 = very low ability/demand**, **5 = very high ability/demand**

---

## candidates.json
```json
{
  "id": "c001",
  "userId": "u001",
  "fullName": "string",
  "skills": ["string"],
  "yearsExperience": "number",
  "preferredRoles": ["string"],
  "disabilityCategory": "Visual | Hearing | Motor | Cognitive",
  "disabilitySubType": "string",
  "abilityVectorId": "av001",
  "profileComplete": "number (0-100)",
  "bio": "string",
  "location": "string",
  "remote": "boolean",
  "appliedJobs": ["j001"]
}
```

## users.json
```json
{
  "id": "u001",
  "username": "string",
  "password": "string (plain for demo only)",
  "role": "candidate | employer",
  "candidateId": "c001 | null",
  "email": "string"
}
```

## jobs.json
```json
{
  "id": "j001",
  "title": "string",
  "company": "string",
  "description": "string",
  "requiredSkills": ["string"],
  "experienceLevel": "string",
  "location": "string",
  "remote": "boolean",
  "taskRequirements": {
    "visualMonitoring": "1-5",
    "phoneCalls": "1-5",
    "fineMotorInput": "1-5",
    "sustainedFocus": "1-5",
    "verbalCommunication": "1-5"
  },
  "jobVectorId": "jv001",
  "postedDate": "ISO date string",
  "accessibilityScore": "null | number"
}
```

## ability-vectors.json
```json
{
  "id": "av001",
  "candidateId": "c001",
  "vector": [3, 4, 4, 5, 3],
  "dimensions": { "visual": 3, "auditory": 4, "fineMotor": 4, "cognitiveLoad": 5, "verbalComm": 3 },
  "labels": { "visual": "plain language description of this score" },
  "generatedAt": "ISO date string"
}
```

## job-vectors.json
```json
{
  "id": "jv001",
  "jobId": "j001",
  "vector": [2, 1, 4, 4, 2],
  "dimensions": { "visual": 2, "auditory": 1, "fineMotor": 4, "cognitiveLoad": 4, "verbalComm": 2 },
  "reasoning": { "visual": "why this demand score was assigned" },
  "generatedAt": "ISO date string"
}
```

## disability-types.json
```json
{
  "id": "cat-visual",
  "category": "Visual | Hearing | Motor | Cognitive",
  "icon": "emoji",
  "description": "string",
  "subTypes": [
    { "id": "vis-lowvision", "label": "string", "description": "string" }
  ]
}
```

## stories.json
```json
{
  "id": "s001",
  "authorName": "string",
  "authorTitle": "string",
  "disabilityCategory": "string",
  "title": "string",
  "story": "string (long form)",
  "postedAt": "ISO date string",
  "likes": "number"
}
```