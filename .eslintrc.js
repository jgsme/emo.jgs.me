module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020
  },
  plugins: [
    "prettier"
  ],
  rules: {
    "prettier/prettier": [
      2, {
        "singleQuote": true,
        "semi": false
      }
    ]
  },
  env: {
    es6: true,
    browser: true
  }
}
