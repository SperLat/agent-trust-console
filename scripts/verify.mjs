import { spawn } from "node:child_process";

const PORT = Number(process.env.VERIFY_PORT || 4322);
const BASE_URL = `http://localhost:${PORT}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(process) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 15000) {
    if (process.exitCode !== null) throw new Error(`Server exited with code ${process.exitCode}.`);
    try {
      const response = await fetch(`${BASE_URL}/api/status`);
      if (response.ok) return response.json();
    } catch {
      // Server may still be starting.
    }
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${BASE_URL}`);
}

async function expectText(pathname, expected) {
  const response = await fetch(`${BASE_URL}${pathname}`);
  const text = await response.text();
  if (!response.ok) throw new Error(`${pathname} returned HTTP ${response.status}`);
  if (!text.includes(expected)) throw new Error(`${pathname} did not include ${expected}`);
  return { pathname, status: response.status, bytes: text.length };
}

async function inspectScenario() {
  const scenarioPayload = await fetch(`${BASE_URL}/api/scenarios`).then((response) => response.json());
  const scenario = scenarioPayload.scenarios.find((item) => item.id === "prompt-injection-crm");
  const response = await fetch(`${BASE_URL}/api/inspect`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(scenario)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Inspect request failed");
  if (result.action !== "deny") throw new Error(`Expected deny decision, got ${result.action}`);
  if (!result.matchedRules.some((rule) => rule.id === "LT-IN-001")) {
    throw new Error("Expected prompt injection rule LT-IN-001.");
  }
  if (!result.lobsterTrapRequest?._lobstertrap?.declared_intent) {
    throw new Error("Expected Lobster Trap request metadata.");
  }
  if (result.lobsterTrapVerdict?.verdict !== "DENY") {
    throw new Error("Expected Lobster Trap DENY verdict shape.");
  }
  return {
    requestId: result.requestId,
    action: result.action,
    riskScore: result.riskScore,
    matchedRules: result.matchedRules.map((rule) => rule.id)
  };
}

async function evaluateScenarioSuite() {
  const response = await fetch(`${BASE_URL}/api/evaluations`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Evaluation request failed");
  if (result.failed !== 0) throw new Error(`Expected all evaluations to pass; ${result.failed} failed.`);
  return {
    total: result.total,
    passed: result.passed,
    failed: result.failed
  };
}

const server = spawn(process.execPath, ["--use-system-ca", "server.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: { ...process.env, PORT: String(PORT) },
  stdio: ["ignore", "pipe", "pipe"]
});

let stderr = "";
server.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
});

try {
  const status = await waitForServer(server);
  const checks = [
    await expectText("/", "Agent Trust Console"),
    await expectText("/api/status", "Agent Trust Console"),
    await expectText("/api/policy.yaml?pack=enterprise", "policy_name")
  ];
  const inspection = await inspectScenario();
  const evaluation = await evaluateScenarioSuite();
  console.log(JSON.stringify({
    ok: true,
    app: status.app,
    baseUrl: BASE_URL,
    checks,
    inspection,
    evaluation
  }, null, 2));
} finally {
  server.kill();
  await wait(250);
}

if (stderr.trim()) console.error(stderr.trim());
