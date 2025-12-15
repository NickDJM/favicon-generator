import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

const files = ["*.js", "*.cjs"];
const ignores = ["!.*.js", "!.*.mjs", "!.*.cjs"];

const config = {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      ...globals.node,
    },
  },
};

export default [
  js.configs.recommended,
  prettier,
  config,
  {
    files,
  },
  {
    ignores,
  },
];
