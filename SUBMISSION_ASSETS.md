# Submission Assets

## Public Links

- Repository: https://github.com/SperLat/agent-trust-console
- Hosted demo: TBD
- Video walkthrough: TBD

## Suggested Submission Title

Agent Trust Console

## Suggested Short Description

Policy-as-code governance console that detects unsafe AI-agent intent, blocks risky tool or egress behavior, and produces audit-ready evidence for enterprise teams.

## Suggested Long Description

Agent Trust Console gives security, compliance, and platform teams a focused workflow for reviewing AI-agent behavior before risky actions happen. An operator declares the agent, business intent, allowed files, allowed outbound domains, inbound prompt, and optional candidate response. The local policy engine detects prompt injection, credential exposure, PII, forbidden paths, undeclared domains, dangerous shell behavior, and intent mismatches, then returns an allow, human review, quarantine, or deny decision with matched rules and recommendations.

The demo includes seeded scenarios for benign support triage, CRM prompt injection, finance credential egress, healthcare PHI handling, and DevOps command escalation. It also exports Lobster Trap-style policy YAML, previews OpenAI-compatible `_lobstertrap` metadata and verdicts, exposes deterministic scenario evaluations, and exports JSONL audit evidence for compliance review.

## Reviewer Commands

```bash
npm install
npm run verify
npm start
```

Open `http://localhost:4321`.

## Video Checklist

1. Show the scenario evaluation matrix with `5/5 controls passing`.
2. Inspect CRM prompt injection and show the denied decision.
3. Inspect finance credential egress and show credential/path rules.
4. Switch to support ticket triage and show an allowed decision.
5. Show policy YAML, proxy contract preview, JSONL audit export, and report export.
