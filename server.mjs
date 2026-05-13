import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildPolicyYaml,
  evaluateScenarios,
  inspectConversation,
  POLICY_PACKS,
  SCENARIOS
} from "./src/analysis-engine.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4321);
const HOST = process.env.HOST || "0.0.0.0";
const MAX_BODY_BYTES = 1024 * 1024;
const auditLog = [];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".yaml": "text/yaml; charset=utf-8",
  ".yml": "text/yaml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, status, text, contentType = "text/plain; charset=utf-8") {
  response.writeHead(status, {
    "content-type": contentType,
    "cache-control": "no-store"
  });
  response.end(text);
}

async function readJson(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
      throw new Error("Request body is too large.");
    }
  }
  return raw ? JSON.parse(raw) : {};
}

function addAudit(result) {
  auditLog.unshift({
    requestId: result.requestId,
    timestamp: result.timestamp,
    agent: result.agent,
    action: result.action,
    riskScore: result.riskScore,
    policyPack: result.policyPack,
    declaredIntent: result.declaredIntent,
    detectedIntent: result.detectedIntent,
    matchedRules: result.matchedRules.map((rule) => rule.id)
  });
  if (auditLog.length > 200) auditLog.pop();
}

function auditJsonl() {
  return auditLog.map((event) => JSON.stringify(event)).join("\n");
}

async function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const requestedPath = path.resolve(__dirname, `.${pathname}`);

  if (!requestedPath.startsWith(__dirname)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const content = await fs.readFile(requestedPath);
    response.writeHead(200, {
      "content-type": MIME_TYPES[path.extname(requestedPath)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname === "/api/status") {
    sendJson(response, 200, {
      app: "Agent Trust Console",
      track: "TechEx Agent Security & AI Governance",
      mode: "local-policy-engine",
      submitted: false,
      generatedAt: new Date().toISOString()
    });
    return;
  }

  if (url.pathname === "/api/scenarios") {
    sendJson(response, 200, { scenarios: SCENARIOS });
    return;
  }

  if (url.pathname === "/api/policies") {
    const selected = url.searchParams.get("pack") || "enterprise";
    sendJson(response, 200, {
      policies: POLICY_PACKS,
      yaml: buildPolicyYaml(selected)
    });
    return;
  }

  if (url.pathname === "/api/audit") {
    sendJson(response, 200, { events: auditLog });
    return;
  }

  if (url.pathname === "/api/audit.jsonl") {
    sendText(response, 200, auditJsonl(), "application/x-ndjson; charset=utf-8");
    return;
  }

  if (url.pathname === "/api/evaluations") {
    sendJson(response, 200, evaluateScenarios());
    return;
  }

  if (url.pathname === "/api/policy.yaml") {
    const selected = url.searchParams.get("pack") || "enterprise";
    sendText(response, 200, buildPolicyYaml(selected), "text/yaml; charset=utf-8");
    return;
  }

  if (url.pathname === "/api/inspect" && request.method === "POST") {
    try {
      const payload = await readJson(request);
      const result = inspectConversation(payload);
      addAudit(result);
      sendJson(response, 200, result);
    } catch (error) {
      sendJson(response, 400, {
        error: error.message,
        generatedAt: new Date().toISOString()
      });
    }
    return;
  }

  await serveStatic(request, response);
});

server.listen(PORT, HOST, () => {
  console.log(`Agent Trust Console running at http://${HOST}:${PORT}`);
});
