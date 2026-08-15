import js from "@eslint/js";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["../site-dist/**", "../ssr-dist/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "jsx-a11y": jsxA11y, "react-hooks": reactHooks },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react-hooks/set-state-in-effect": "off"
    }
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.mjs"],
    languageOptions: { globals: globals.node }
  }
);
