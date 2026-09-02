import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

/**
 * Lint rules are the cheapest code review we have: they catch the same class
 * of mistake every time, on every branch, without anyone having to remember.
 *
 * WHAT IS ADDED BEYOND next/core-web-vitals, AND WHY
 *
 *  jsx-a11y      Next's default config ships almost none of these. Without
 *                them nothing stops an input from shipping with no label, or
 *                a div from being given an onClick and no keyboard path. Set
 *                to `error` because a warning in a 145-file repo is noise
 *                nobody reads.
 *
 *  import/order  Import blocks were in arbitrary order, which makes diffs
 *                noisier than the change they contain and quietly encourages
 *                duplicate imports of the same module.
 *
 *  no-console    39 stray console calls had accumulated. console.error and
 *                console.warn stay allowed: those are real signals, and they
 *                are what lib/logger.js forwards in development.
 *
 *  no-unused-vars / no-empty  An empty catch block is the single most common
 *                way an error disappears in this codebase. The linter should
 *                say so rather than a reviewer having to notice.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  {
    // next/core-web-vitals already REGISTERS jsx-a11y and import; redefining
    // the plugins here is a hard config error. Only the rules are set.
    rules: {
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/iframe-has-title": "error",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/label-has-associated-control": [
        "error",
        { assert: "either" }, // htmlFor OR a nested control both count
      ],
      "import/order": [
        "warn",
        {
          groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
          "newlines-between": "never",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-console": ["error", { allow: ["error", "warn"] }],
      "no-empty": ["error", { allowEmptyCatch: false }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      eqeqeq: ["error", "smart"],
      "no-var": "error",
      "prefer-const": "error",
    },
  },
  {
    // Tests legitimately stub, spy and assert on console output.
    files: ["**/*.test.{js,jsx}", "e2e/**/*.js"],
    rules: { "no-console": "off", "no-unused-vars": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
