# Submission Assets

## Public Links

- Repository: https://github.com/SperLat/agent-trust-console
- Hosted demo: TBD
- Video walkthrough: TBD
- Slide presentation: TBD

## Suggested Submission Title

Agent Trust Console

## Suggested Short Description

Policy-as-code governance console that detects unsafe AI-agent intent, blocks risky tool or egress behavior, and produces audit-ready evidence for enterprise teams.

## Suggested Long Description

Agent Trust Console gives security, compliance, and platform teams a focused workflow for reviewing AI-agent behavior before risky actions happen. An operator declares the agent, business intent, allowed files, allowed outbound domains, inbound prompt, and optional candidate response. The local policy engine detects prompt injection, credential exposure, PII, forbidden paths, undeclared domains, dangerous shell behavior, and intent mismatches, then returns an allow, human review, quarantine, or deny decision with matched rules and recommendations.

The demo includes seeded scenarios for benign support triage, CRM prompt injection, finance credential egress, healthcare PHI handling, and DevOps command escalation. It also exports Lobster Trap-style policy YAML, previews OpenAI-compatible `_lobstertrap` metadata and verdicts, exposes deterministic scenario evaluations, and exports JSONL audit evidence for compliance review.

## Suggested Tags

AI agents, agent security, AI governance, enterprise security, policy as code, prompt injection, data loss prevention, audit logs, compliance, Lobster Trap, Veea

## Suggested Category / Track

Agent Security & AI Governance

## Business Value

Enterprise teams are moving AI agents from pilots into production workflows where agents can read files, use tools, call APIs, and send data to downstream systems. Agent Trust Console gives security and compliance owners a practical review loop before sensitive data leaves the boundary. It demonstrates measurable risk reduction by blocking prompt injection, credential exposure, undeclared egress, dangerous commands, and declared-versus-detected intent mismatches, while preserving audit evidence a regulated team can review.

## Technical Differentiation

- Policy decisions are deterministic and explainable instead of opaque model judgments.
- The demo includes expected-vs-actual scenario evaluations so reviewers can verify behavior quickly.
- The policy export follows a Lobster Trap-style YAML shape.
- The proxy preview shows OpenAI-compatible `_lobstertrap` metadata and verdict structures.
- The system runs locally without API keys, external model calls, or prompt transmission.

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

## Form Field Drafts

### Demo Application Platform

Render

### Application URL

TBD after Render deployment.

### Public GitHub Repository

https://github.com/SperLat/agent-trust-console

### Slide Presentation

Use `PITCH_DECK_OUTLINE.md` as the slide source.

### Video Presentation

Use `VIDEO_SCRIPT.md` as the recording script.
