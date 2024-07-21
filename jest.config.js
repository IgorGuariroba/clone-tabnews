const nextJest = require("next/jest");

const createdJestConfig = nextJest({
  dir: '.',
});
const jestConfig = createdJestConfig({
  moduleDirectories: ["node_modules","<rootDir>"],
  setupFiles: ["./tests/setup.js"],
  testTimeout: 60000,
});

module.exports = jestConfig;
