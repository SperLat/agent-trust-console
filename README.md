# Agent Trust Console

Enterprise AI-agent governance dashboard for the TechEx Intelligent Enterprise Solutions Hackathon.

The app inspects agent prompts and candidate responses against policy-as-code guardrails, then produces a decision, risk score, matched rules, recommendations, and an audit trail. It is designed for the Agent Security & AI Governance track and uses a Lobster Trap-compatible policy shape.

## Current Status

- Local policy/risk engine implemented.
- Prompt injection, secret handling, PII, egress, file scope, and dangerous command detectors implemented.
- Three policy packs: enterprise baseline, finance controls, and healthcare controls.
- Interactive dashboard implemented with scenario loading, declared intent/scope controls, response inspection, scenario evaluation status, Lobster Trap-style YAML export, OpenAI-compatible proxy metadata preview, JSONL audit export, and report export.
- Integration guide added in `INTEGRATION.md`.
- Public repository pushed to `https://github.com/SperLat/agent-trust-console`.
- No hackathon submission has been made.

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

Run the deterministic scenario evaluator only:

```powershell
npm run eval
```

## API

- `GET /api/status`: app and track status.
- `GET /api/scenarios`: seeded governance scenarios.
- `GET /api/policies`: policy pack metadata and generated YAML.
- `GET /api/policy.yaml?pack=enterprise`: policy-as-code export.
- `POST /api/inspect`: inspect a prompt/response payload.
- `GET /api/audit`: local audit events.
- `GET /api/audit.jsonl`: audit export for compliance review.
- `GET /api/evaluations`: expected vs actual scenario control matrix.

## Hackathon Fit

Recommended track: **Agent Security & AI Governance**.

Project angle: companies adopting AI agents need a practical operator console that can see what an agent claims it is doing, detect what it is actually trying to do, enforce policy before tool or network access, and preserve a clean audit trail.

## Next Steps

1. Register/enroll on the TechEx hackathon page.
2. Deploy a hosted demo.
3. Record a short video showing benign, prompt injection, secret exfiltration, PHI, and policy export scenarios.
4. Submit the public repository, hosted demo, and video through the hackathon portal.
