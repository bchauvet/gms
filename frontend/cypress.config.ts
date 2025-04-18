import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9000', // Update this to match your dev server URL
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false, // Disable video recording for faster tests
    screenshotOnRunFailure: true,
  },
});
