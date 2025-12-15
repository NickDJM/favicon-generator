const config = {
  "*.{js,mjs,cjs}": [
    "eslint --fix",
    "prettier --write --ignore-path .eslintignore",
  ],
};

export default config;
