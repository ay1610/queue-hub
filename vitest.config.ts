import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "components/ui/**", // Ignore all files in components/ui/
        "lib/generated/**", // Ignore generated files
        ".next/**", // Ignore Next.js build output
      ],
    },
    include: [
      "components/**/*.test.{ts,tsx}",
      "__tests__/**/*.test.{ts,tsx}",
      "app/**/*.test.{ts,tsx}",
    ],
  },
});
