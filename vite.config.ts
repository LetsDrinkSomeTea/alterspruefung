import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// The base path assumes deployment to GitHub Pages under the project name.
// For a user/organization page (letsdrinksometea.github.io) set this to "/".
const REPOSITORY_NAME = "alterspruefung";

export default defineConfig(({ command }) => ({
  base: command === "build" ? `/${REPOSITORY_NAME}/` : "/",
  resolve: {
    alias: {
      "@domain": fileURLToPath(new URL("./src/domain", import.meta.url)),
      "@application": fileURLToPath(new URL("./src/application", import.meta.url)),
      "@infrastructure": fileURLToPath(new URL("./src/infrastructure", import.meta.url)),
      "@presentation": fileURLToPath(new URL("./src/presentation", import.meta.url)),
      "@config": fileURLToPath(new URL("./src/config", import.meta.url))
    }
  },
  build: {
    target: "es2022",
    sourcemap: true,
    // A single-page temporal subtraction deserves aggressive chunking.
    rollupOptions: {
      output: {
        manualChunks: {
          "domain-layer": ["./src/domain/index.ts"],
          "application-layer": ["./src/application/index.ts"]
        }
      }
    }
  }
}));
