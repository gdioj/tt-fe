import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "next/typescript",
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier" // Must be last to override other configs
  ),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // TypeScript specific rules (globally acknowledged standards)
      "@typescript-eslint/no-unused-vars": [
        "error", 
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-const": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error", 
        { prefer: "type-imports" }
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/array-type": ["error", { default: "array" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      
      // React specific rules (globally acknowledged standards)
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // Using TypeScript for prop validation
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-uses-vars": "error",
      "react/no-children-prop": "error",
      "react/no-danger-with-children": "error",
      "react/no-deprecated": "warn",
      "react/no-direct-mutation-state": "error",
      "react/no-find-dom-node": "error",
      "react/no-is-mounted": "error",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": "error",
      "react/no-unsafe": "warn",
      "react/require-render-return": "error",
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": [
        "error", 
        { props: "never", children: "never" }
      ],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-no-useless-fragment": "error",
      
      // React Hooks rules (globally acknowledged standards)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // General JavaScript/ES6 rules (globally acknowledged standards)
      "no-console": "warn",
      "no-debugger": "error",
      "no-alert": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "no-duplicate-imports": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-unused-expressions": "error",
      "no-use-before-define": ["error", { functions: false, classes: true }],
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "radix": "error",
      "yoda": "error",
      
      // Import rules (globally acknowledged standards)
      "import/no-duplicates": "error",
      "import/no-unresolved": "off", // TypeScript handles this
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external", 
            "internal",
            "parent",
            "sibling",
            "index"
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error",
      "import/no-default-export": "off", // Next.js requires default exports for pages
      
      // Accessibility rules (globally acknowledged standards)
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/interactive-supports-focus": "warn",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      
      // Code quality rules (globally acknowledged standards)
      "complexity": ["warn", 10],
      "max-depth": ["warn", 4],
      "max-lines": ["warn", 300],
      "max-lines-per-function": ["warn", 50],
      "max-params": ["warn", 3],
      "no-magic-numbers": ["warn", { 
        ignore: [0, 1, -1], 
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true 
      }],
      
      // Disable formatting rules (handled by Prettier)
      "semi": "off",
      "quotes": "off",
      "comma-dangle": "off",
      "object-curly-spacing": "off",
      "array-bracket-spacing": "off",
      "computed-property-spacing": "off",
      "key-spacing": "off",
      "space-before-blocks": "off",
      "keyword-spacing": "off",
      "space-infix-ops": "off",
      "space-unary-ops": "off",
      "arrow-spacing": "off",
      "template-curly-spacing": "off",
      "rest-spread-spacing": "off",
      "indent": "off",
      "max-len": "off",
    },
  },
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/__tests__/**/*.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    rules: {
      // Relax some rules for test files
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "max-lines-per-function": "off",
      "complexity": "off",
      "no-magic-numbers": "off",
      "import/no-extraneous-dependencies": "off",
    },
  },
  {
    files: ["**/*.config.{js,ts,mjs}", "**/next.config.{js,ts,mjs}"],
    rules: {
      // Relax some rules for config files
      "no-console": "off",
      "@typescript-eslint/no-var-requires": "off",
      "import/no-default-export": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      ".git/**",
      "*.min.js",
      "public/**",
    ],
  },
];

export default eslintConfig;
