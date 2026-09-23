module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  clearMocks: true,
  setupFiles: ["<rootDir>/tests/setup-env.js"],
};
