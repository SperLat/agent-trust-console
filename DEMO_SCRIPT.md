# Demo Script

## 0:00 - 0:15

Open Agent Trust Console and state the enterprise problem: AI agents can take unsafe actions before humans notice.

## 0:15 - 0:45

Load **CRM prompt injection**. Show declared intent and allowed domain. Run inspection.

Expected result: `Denied`, high risk, matched prompt injection and outbound egress rules.

## 0:45 - 1:15

Load **Finance credential egress**. Run inspection with candidate response populated.

Expected result: `Denied` or `Quarantined`, credential detection, forbidden `.env` path, and token rotation recommendation.

## 1:15 - 1:45

Load **Support ticket triage**. Run inspection.

Expected result: low-risk allow decision with an audit event.

## 1:45 - 2:10

Show generated policy YAML and explain that it is designed to map into Lobster Trap-style enforcement.

## 2:10 - 2:30

Export the report and show the audit trail. Close with the value: policy decisions, operator evidence, and compliance records in one agent governance loop.
