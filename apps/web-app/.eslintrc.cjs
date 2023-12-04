/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/consistent-indexed-object-style": "off",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "prefer-const": "warn",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};

module.exports = config;
