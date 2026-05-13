# Video Script

Target length: 2-3 minutes. Lablab guidance allows short video presentations, and this version stays below five minutes.

## 0:00 - 0:20 - Problem

AI agents now read files, call APIs, and send data into business systems. Enterprise teams need a way to see whether an agent is doing what it claimed before sensitive data leaves the boundary.

## 0:20 - 0:40 - Product

Agent Trust Console is a governance dashboard for AI-agent behavior. An operator declares the agent, business intent, allowed files, allowed domains, inbound prompt, and optional candidate response. The console returns an allow, human review, quarantine, or deny decision with matched rules and audit evidence.

## 0:40 - 1:10 - Prompt Injection Demo

Load the CRM prompt injection scenario and run inspection.

Narration:

This request tells the agent to ignore instructions and export customer emails to a denied webhook domain. The console blocks it, marks the request as denied, and shows prompt injection, denied egress, and intent mismatch rules.

## 1:10 - 1:40 - Secret Egress Demo

Load the finance credential egress scenario and run inspection.

Narration:

This scenario tries to open `.env`, expose a Stripe secret key, and reference payroll data. The console catches credential-shaped output, forbidden local path access, regulated data, and finance-policy scope violations.

## 1:40 - 2:00 - Benign Flow

Load the support ticket triage scenario and run inspection.

Narration:

The benign request stays inside the declared ticket data source and approved help-center domain, so the console allows it and still records the decision for later review.

## 2:00 - 2:30 - Reviewer Evidence

Show the scenario evaluation matrix with `5/5 controls passing`, then scroll to policy YAML, proxy contract preview, JSONL audit export, and report export.

Narration:

The demo includes deterministic scenario checks so reviewers can verify behavior without trusting a black box. It exports Lobster Trap-style policy YAML, previews OpenAI-compatible `_lobstertrap` metadata, and produces audit-ready JSONL and Markdown evidence.

## 2:30 - 2:50 - Close

Agent Trust Console is the operator layer that helps enterprise security teams trust AI agents before deployment. It turns prompt risk, tool scope, egress control, and compliance evidence into one review loop.
