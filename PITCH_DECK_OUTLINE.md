# Pitch Deck Outline

## Slide 1 - Agent Trust Console

Enterprise AI-agent governance for prompt risk, tool scope, egress control, and audit evidence.

## Slide 2 - Problem

AI agents increasingly read files, call tools, hit APIs, and send data to downstream systems. A single manipulated prompt can leak credentials, expose regulated data, or trigger the wrong action while teams lack a clear operator review loop.

## Slide 3 - Solution

Agent Trust Console lets an operator declare intent, files, domains, prompt, and candidate response, then returns an explainable governance decision: allow, human review, quarantine, or deny.

## Slide 4 - Demo Scenarios

- Support ticket triage: allowed.
- CRM prompt injection: denied.
- Finance credential egress: denied.
- Healthcare PHI handling: human review.
- DevOps command escalation: denied.

## Slide 5 - Technical Approach

- Local deterministic policy engine.
- Prompt injection, credential, PII, egress, file scope, command, and intent detectors.
- Three policy packs: enterprise, finance, healthcare.
- Expected-vs-actual scenario evaluation matrix.

## Slide 6 - Lobster Trap Alignment

- Exports Lobster Trap-style YAML policy.
- Previews OpenAI-compatible `_lobstertrap` request metadata.
- Returns ingress and egress verdict shapes.
- Designed as an operator workflow around a deployable policy enforcement layer.

## Slide 7 - Business Value

- Blocks measurable risk patterns before tool or network access.
- Gives security teams readable decisions and recommendations.
- Preserves JSONL audit evidence for regulated workflows.
- Runs without external model calls or transmitted prompts.

## Slide 8 - Next Steps

- Hosted demo deployment.
- Optional direct Lobster Trap runtime adapter.
- Persistent audit storage and authentication.
- Policy packs for SOC 2, HIPAA, finance, and legal workflows.
