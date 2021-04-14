module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      files: ["src/*.ts", "src/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
      },
    },
    {
      files: ["test/*.js", "test/**/*.js"],
      env: {
        jest: true,
      },
    },
  ],
};
