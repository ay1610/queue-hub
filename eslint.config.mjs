import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["lib/generated/prisma/**", "coverage/**", "**/*.d.ts"],
  },
  //...compat.extends("next/core-web-vitals", "next/typescript","prettier"),
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
    },
  }),
];

export default eslintConfig;
