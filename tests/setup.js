import orchestrator from "./orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});