module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      files: ["test/*.js", "test/**/*.js"],
      env: {
        jest: true,
      },
    },
  ],
};
