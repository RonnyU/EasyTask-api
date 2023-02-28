module.exports = {
  env: {
    node: true
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  extends: [
    './node_modules/ts-standard/eslintrc.json'
  ],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off'
  }
}
