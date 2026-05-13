import { evaluateScenarios } from "../src/analysis-engine.mjs";

const report = evaluateScenarios();
console.log(JSON.stringify(report, null, 2));

if (report.failed > 0) {
  process.exitCode = 1;
}
