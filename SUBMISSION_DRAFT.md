# Submission Draft

## Project

Agent Trust Console

## One-liner

Policy-as-code governance console that detects unsafe AI-agent intent, blocks risky tool or egress behavior, and produces audit-ready evidence for enterprise teams.

## Problem

Enterprise AI agents can read files, call tools, summarize sensitive data, and send output to other systems. Most teams still lack a clear operator loop for checking whether an agent's declared task matches its detected behavior before data leaves the boundary.

## Solution

Agent Trust Console gives security, compliance, and platform teams a focused review surface:

- Declare the agent, business intent, allowed files, and allowed outbound domains.
- Inspect inbound prompts and candidate responses.
- Detect prompt injection, credential exposure, PII, forbidden paths, undeclared domains, and dangerous shell behavior.
- Return allow, human review, quarantine, or deny decisions.
- Show expected vs actual scenario evaluations, export Lobster Trap-style policy YAML, preview OpenAI-compatible `_lobstertrap` request metadata, and produce audit-ready JSONL/report artifacts.

## Track

Agent Security & AI Governance

## Demo Flow

1. Open the CRM prompt injection scenario.
2. Run inspection and show deny decision from `LT-IN-001` plus denied domain evidence.
3. Open the finance credential egress scenario.
4. Show quarantine and secret redaction recommendation.
5. Switch to the benign support ticket triage scenario.
6. Show the allowed decision and audit event.
7. Show the scenario evaluation matrix.
8. Export policy YAML, JSONL audit evidence, and an inspection report.

## Current Integrations

- Local policy engine modeled around Lobster Trap-style ingress, data, egress, file, and audit rules.
- Policy-as-code YAML export.
- OpenAI-compatible proxy metadata and verdict preview.
- Local audit trail with JSONL export.
- Deterministic scenario evaluator for reviewer verification.

## Planned Before Submission

- Hosted demo.
- Short video walkthrough.
- Optional direct Lobster Trap runtime integration if feasible inside the build window.
