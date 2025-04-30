// @ts-check
import eslintConfig from "@k4i/config/eslint-config";
import { defineConfig } from "eslint/config";

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
 eslintConfig.base,
 eslintConfig.node,
 eslintConfig.typescript,
 eslintConfig.prettier,
 [
  {
   name: "Override",
   rules: {
    "require-await": "off",
    "node/no-process-exit": "off",
   },
  },
 ],
]);
