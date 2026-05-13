# Agent Trust Console

Enterprise AI-agent governance dashboard for the TechEx Intelligent Enterprise Solutions Hackathon.

The app inspects agent prompts and candidate responses against policy-as-code guardrails, then produces a decision, risk score, matched rules, recommendations, and an audit trail. It is designed for the Agent Security & AI Governance track and uses a Lobster Trap-compatible policy shape.

## Current Status

- Local policy/risk engine implemented.
- Prompt injection, secret handling, PII, egress, file scope, and dangerous command detectors implemented.
- Three policy packs: enterprise baseline, finance controls, and healthcare controls.
- Interactive dashboard implemented with scenario loading, declared intent/scope controls, response inspection, YAML export, and report export.
- No hackathon submission has been made.
- No public repository has been created or pushed yet.

## Run Locally

```powershell
npm start
```

Open:

```text
http://localhost:4321
```

Run verification:

```powershell
npm run verify
```

## API

- `GET /api/status`: app and track status.
- `GET /api/scenarios`: seeded governance scenarios.
- `GET /api/policies`: policy pack metadata and generated YAML.
- `GET /api/policy.yaml?pack=enterprise`: policy-as-code export.
- `POST /api/inspect`: inspect a prompt/response payload.
- `GET /api/audit`: local audit events.

## Hackathon Fit

Recommended track: **Agent Security & AI Governance**.

Project angle: companies adopting AI agents need a practical operator console that can see what an agent claims it is doing, detect what it is actually trying to do, enforce policy before tool or network access, and preserve a clean audit trail.

## Next Steps

1. Register/enroll on the TechEx hackathon page.
2. Create a public GitHub repo named `agent-trust-console`.
3. Push this project after approval.
4. Deploy a hosted demo.
5. Record a short video showing benign, prompt injection, secret exfiltration, and PHI scenarios.
