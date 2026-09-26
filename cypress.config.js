const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    // mengatasi error cors
    chromeWebSecurity: false,
    // mengatasi error timeout
    responseTimeout: 20000,
    defaultCommandTimeout: 20000,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
