const nextJest = require("next/jest");

const createdJestConfig = nextJest({
  dir: '.',
});
const jestConfig = createdJestConfig({
  moduleDirectories: ["node_modules","<rootDir>"],
});

module.exports = jestConfig;
