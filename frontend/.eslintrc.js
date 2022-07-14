module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "import"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      alias: [
        ["@components", "./src/components"],
        ["@app", "./src/components"],
        ["@utils", "./src/utils"],
        ["@core", "./src/core"],
      ],
    },
  },
  rules: {
    "no-debugger": "off",
    "no-console": "off",
    "no-unused-vars": "warn",
    "react/prop-types": "warn",
    // "no-restricted-imports": [
    //   "error",
    //   {
    //     paths: ["antd"],
    //   },
    // ],
    // "import/no-restricted-paths": [
    //   "error",
    //   {
    //     zones: [{ target: "./src/vtb", from: "./src/vtb/api.1" }],
    //   },
    // ],
  },
};
