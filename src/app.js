const app = document.querySelector("#app");

const icons = {
  shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>`,
  scan: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 12h8"/></svg>`,
  export: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5"/><path d="M12 18h.01"/></svg>`,
  activity: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l3 8 4-16 3 8h4"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`
};

const state = {
  status: null,
  scenarios: [],
  policies: {},
  policyYaml: "",
  evaluation: null,
  activeScenarioId: "",
  form: {
    agent: "",
    declaredIntent: "",
    allowedPaths: "",
    allowedDomains: "",
    policyPack: "enterprise",
    input: "",
    response: ""
  },
  result: null,
  audit: [],
  loading: false,
  notice: ""
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function titleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function actionLabel(action) {
  return {
    allow: "Allowed",
    human_review: "Needs review",
    quarantine: "Quarantined",
    deny: "Denied"
  }[action] || titleCase(action);
}

function riskClass(score) {
  if (score >= 75) return "risk-critical";
  if (score >= 50) return "risk-high";
  if (score >= 25) return "risk-medium";
  return "risk-low";
}

function selectedScenario() {
  return state.scenarios.find((scenario) => scenario.id === state.activeScenarioId) || state.scenarios[0] || null;
}

function setFormFromScenario(scenario) {
  if (!scenario) return;
  state.activeScenarioId = scenario.id;
  state.form = {
    agent: scenario.agent,
    declaredIntent: scenario.declaredIntent,
    allowedPaths: scenario.allowedPaths.join(", "),
    allowedDomains: scenario.allowedDomains.join(", "),
    policyPack: scenario.policyPack,
    input: scenario.input,
    response: scenario.response
  };
}

async function loadInitialData() {
  const [status, scenarioPayload, policyPayload, auditPayload] = await Promise.all([
    fetch("/api/status").then((response) => response.json()),
    fetch("/api/scenarios").then((response) => response.json()),
    fetch("/api/policies").then((response) => response.json()),
    fetch("/api/audit").then((response) => response.json()),
    refreshEvaluation()
  ]);
  state.status = status;
  state.scenarios = scenarioPayload.scenarios;
  state.policies = policyPayload.policies;
  state.policyYaml = policyPayload.yaml;
  state.audit = auditPayload.events;
  setFormFromScenario(state.scenarios[1] || state.scenarios[0]);
}

async function refreshEvaluation() {
  state.evaluation = await fetch("/api/evaluations").then((response) => response.json());
  return state.evaluation;
}

async function refreshPolicyYaml() {
  const payload = await fetch(`/api/policies?pack=${encodeURIComponent(state.form.policyPack)}`).then((response) => response.json());
  state.policyYaml = payload.yaml;
  state.policies = payload.policies;
}

async function inspect() {
  state.loading = true;
  state.notice = "";
  render();

  try {
    const response = await fetch("/api/inspect", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(state.form)
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Inspection failed");
    state.result = payload;
    state.audit = await fetch("/api/audit").then((item) => item.json()).then((item) => item.events);
    state.notice = `${actionLabel(payload.action)}: ${payload.matchedRules.length} rule(s) matched`;
  } catch (error) {
    state.notice = error.message;
  } finally {
    state.loading = false;
    render();
  }
}

function download(filename, text, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function resultMarkdown() {
  const result = state.result;
  if (!result) return "";
  return [
    `# Agent Trust Console Report`,
    "",
    `Request: ${result.requestId}`,
    `Agent: ${result.agent}`,
    `Policy: ${result.policyLabel}`,
    `Action: ${actionLabel(result.action)}`,
    `Risk score: ${result.riskScore}`,
    `Declared intent: ${result.declaredIntent}`,
    `Detected intent: ${result.detectedIntent}`,
    "",
    "## Matched Rules",
    result.matchedRules.map((rule) => `- ${rule.id} (${rule.action}): ${rule.reason}`).join("\n") || "- None",
    "",
    "## Recommendations",
    result.recommendations.map((item) => `- ${item}`).join("\n"),
    "",
    "## Lobster Trap Request Metadata",
    "",
    "```json",
    JSON.stringify(result.lobsterTrapRequest?._lobstertrap || {}, null, 2),
    "```",
    "",
    "## Lobster Trap Verdict Shape",
    "",
    "```json",
    JSON.stringify(result.lobsterTrapVerdict || {}, null, 2),
    "```"
  ].join("\n");
}

function auditJsonl() {
  return state.audit.map((event) => JSON.stringify(event)).join("\n");
}

function renderScenarioList() {
  return `
    <aside class="scenario-panel">
      <div class="brand">
        <span>${icons.shield}</span>
        <strong>Agent Trust Console</strong>
      </div>
      <section>
        <div class="section-label">Demo Scenarios</div>
        <div class="scenario-list">
          ${state.scenarios.map((scenario) => `
            <button class="scenario-row ${scenario.id === state.activeScenarioId ? "active" : ""}" data-action="load-scenario" data-id="${escapeHtml(scenario.id)}">
              <span>${escapeHtml(scenario.title)}</span>
              <small>${escapeHtml(scenario.track)}</small>
            </button>
          `).join("")}
        </div>
      </section>
      <section class="status-block">
        <div class="section-label">Hackathon Fit</div>
        <dl>
          <div><dt>Track</dt><dd>Agent Security</dd></div>
          <div><dt>Mode</dt><dd>${escapeHtml(state.status?.mode || "local")}</dd></div>
          <div><dt>Submission</dt><dd>${state.status?.submitted ? "Submitted" : "Not submitted"}</dd></div>
        </dl>
      </section>
    </aside>
  `;
}

function renderInspectorForm() {
  const policies = Object.values(state.policies);
  return `
    <section class="input-panel">
      <div class="panel-heading">
        <div>
          <strong>Policy Inspection</strong>
          <span>Declare intent, allowed access, prompt, and optional response.</span>
        </div>
        <button class="primary-action" data-action="inspect" ${state.loading ? "disabled" : ""}>${icons.scan}${state.loading ? "Inspecting..." : "Inspect"}</button>
      </div>
      <div class="form-grid">
        <label>
          <span>Agent</span>
          <input data-field="agent" value="${escapeHtml(state.form.agent)}" />
        </label>
        <label>
          <span>Declared Intent</span>
          <input data-field="declaredIntent" value="${escapeHtml(state.form.declaredIntent)}" />
        </label>
        <label>
          <span>Policy Pack</span>
          <select data-field="policyPack">
            ${policies.map((policy) => `<option value="${escapeHtml(policy.id)}" ${state.form.policyPack === policy.id ? "selected" : ""}>${escapeHtml(policy.label)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Allowed Domains</span>
          <input data-field="allowedDomains" value="${escapeHtml(state.form.allowedDomains)}" />
        </label>
      </div>
      <label class="wide-field">
        <span>Allowed Files / Data Sources</span>
        <input data-field="allowedPaths" value="${escapeHtml(state.form.allowedPaths)}" />
      </label>
      <div class="prompt-grid">
        <label>
          <span>Inbound Prompt</span>
          <textarea data-field="input">${escapeHtml(state.form.input)}</textarea>
        </label>
        <label>
          <span>Candidate Agent Response</span>
          <textarea data-field="response" placeholder="Optional response inspection">${escapeHtml(state.form.response)}</textarea>
        </label>
      </div>
    </section>
  `;
}

function renderDecision() {
  const result = state.result;
  if (!result) {
    return `
      <section class="decision-panel empty-decision">
        <span>${icons.activity}</span>
        <strong>Run an inspection to see the governance decision.</strong>
        <p>The console will score prompt risk, compare declared vs detected intent, inspect file/network scope, and produce an audit-ready action.</p>
      </section>
    `;
  }

  return `
    <section class="decision-panel">
      <div class="decision-top">
        <div>
          <span class="eyebrow">Decision</span>
          <h1>${escapeHtml(actionLabel(result.action))}</h1>
          <p>${escapeHtml(result.summary)}</p>
        </div>
        <div class="risk-meter ${riskClass(result.riskScore)}">
          <span>${result.riskScore}</span>
          <small>risk</small>
        </div>
      </div>
      <div class="metric-row">
        <div><span>Declared</span><strong>${escapeHtml(result.declaredIntent)}</strong></div>
        <div><span>Detected</span><strong>${escapeHtml(result.detectedIntent)}</strong></div>
        <div><span>Rules</span><strong>${result.matchedRules.length}</strong></div>
        <div><span>Latency</span><strong>${result.latencyMs}ms</strong></div>
      </div>
      <div class="rule-list">
        ${(result.matchedRules.length ? result.matchedRules : [{ id: "LT-ALLOW-000", action: "allow", severity: "info", reason: "No policy conflicts detected.", evidence: [] }]).map((rule) => `
          <div class="rule-row">
            <span class="rule-code">${escapeHtml(rule.id)}</span>
            <strong>${escapeHtml(titleCase(rule.action))}</strong>
            <p>${escapeHtml(rule.reason)}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderPolicyPanel() {
  return `
    <aside class="right-panel">
      ${renderEvaluationCard()}
      <section class="policy-card">
        <div class="panel-heading compact">
          <div>
            <strong>Policy as Code</strong>
            <span>Lobster Trap-compatible control shape</span>
          </div>
          <button class="outline-action" data-action="download-policy">${icons.export} YAML</button>
        </div>
        <pre>${escapeHtml(state.policyYaml)}</pre>
      </section>
      ${renderProxyCard()}
      <section class="audit-card">
        <div class="panel-heading compact">
          <div>
            <strong>Audit Trail</strong>
            <span>${state.audit.length} local event(s)</span>
          </div>
          <div class="button-pair">
            <button class="outline-action" data-action="download-audit" ${state.audit.length ? "" : "disabled"}>${icons.export} JSONL</button>
            <button class="outline-action" data-action="download-report" ${state.result ? "" : "disabled"}>${icons.export} Report</button>
          </div>
        </div>
        <div class="audit-list">
          ${state.audit.slice(0, 8).map((event) => `
            <div class="audit-row">
              <span class="dot ${event.action}"></span>
              <div>
                <strong>${escapeHtml(actionLabel(event.action))} - ${escapeHtml(event.agent)}</strong>
                <small>${escapeHtml(event.requestId)} - risk ${event.riskScore}</small>
              </div>
            </div>
          `).join("") || `<div class="empty-audit">No inspections yet.</div>`}
        </div>
      </section>
    </aside>
  `;
}

function renderEvaluationCard() {
  const evaluation = state.evaluation;
  if (!evaluation) return "";
  return `
    <section class="evaluation-card">
      <div class="panel-heading compact">
        <div>
          <strong>Scenario Evaluation</strong>
          <span>${evaluation.passed}/${evaluation.total} controls passing</span>
        </div>
      </div>
      <div class="evaluation-list">
        ${evaluation.cases.map((item) => `
          <div class="evaluation-row">
            <span class="dot ${item.pass ? "allow" : "deny"}"></span>
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(actionLabel(item.actualAction))} - expected ${escapeHtml(actionLabel(item.expectedAction))} - risk ${item.riskScore}</small>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderProxyCard() {
  if (!state.result) return "";
  const proxyPreview = {
    request: state.result.lobsterTrapRequest,
    verdict: state.result.lobsterTrapVerdict
  };
  return `
    <section class="proxy-card">
      <div class="panel-heading compact">
        <div>
          <strong>Proxy Contract</strong>
          <span>OpenAI-compatible request metadata and returned verdict</span>
        </div>
      </div>
      <pre>${escapeHtml(JSON.stringify(proxyPreview, null, 2))}</pre>
    </section>
  `;
}

function renderRecommendations() {
  const result = state.result;
  if (!result) return "";
  return `
    <section class="recommendation-strip">
      <div class="section-label">${icons.lock} Operator Recommendations</div>
      <ul>
        ${result.recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function render() {
  app.innerHTML = `
    <div class="app-shell">
      ${renderScenarioList()}
      <main class="workspace">
        <header class="topbar">
          <div>
            <strong>Enterprise agent governance workspace</strong>
            <span>Prompt risk, tool scope, egress control, and audit evidence in one review loop.</span>
          </div>
          ${state.notice ? `<div class="notice">${escapeHtml(state.notice)}</div>` : ""}
        </header>
        <div class="work-grid">
          <div class="center-column">
            ${renderInspectorForm()}
            ${renderDecision()}
            ${renderRecommendations()}
          </div>
          ${renderPolicyPanel()}
        </div>
      </main>
    </div>
  `;
}

document.addEventListener("input", async (event) => {
  const field = event.target.dataset.field;
  if (!field) return;
  state.form[field] = event.target.value;
  if (field === "policyPack") {
    await refreshPolicyYaml();
  }
  render();
});

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "load-scenario") {
    setFormFromScenario(state.scenarios.find((scenario) => scenario.id === target.dataset.id));
    state.result = null;
    await refreshPolicyYaml();
    render();
  }
  if (action === "inspect") inspect();
  if (action === "download-policy") download(`agent-trust-${state.form.policyPack}-policy.yaml`, state.policyYaml, "text/yaml");
  if (action === "download-audit") download(`agent-trust-audit-${new Date().toISOString().slice(0, 10)}.jsonl`, auditJsonl(), "application/x-ndjson");
  if (action === "download-report" && state.result) download(`agent-trust-report-${state.result.requestId}.md`, resultMarkdown(), "text/markdown");
});

await loadInitialData();
render();
inspect();
