const nextJest = require("next/jest");

const createdJestConfig = nextJest({
  dir: './',
});
const jestConfig = createdJestConfig({
  moduleDirectories: ["node_modules","<rootDir>"],
  setupFiles: ['<rootDir>/jest.setup.js'],
});

module.exports = jestConfig;
