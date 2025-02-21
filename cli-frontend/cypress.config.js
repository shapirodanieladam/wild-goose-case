const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Assuming this is where test-fixtures/s1-frontend runs
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Adding a custom viewport size if needed
    viewportWidth: 1280,
    viewportHeight: 800,
    // Disable test isolation to maintain localStorage between tests
    testIsolation: false
  },
})