import { defineConfig } from "cypress"

export default defineConfig({
  env: {
    apiUrl: "http://localhost:8081"
  },
  e2e: {
    baseUrl: "http://localhost:4200/#",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },    
  },
})
