module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-unreachable": "warn",
    "no-unused-vars": [
      1,
      {
        "vars": "all",
        "args": "none"
      }
    ]
    // "max-len": [
    //   "warn",
    //   {
    //     "code": 120,
    //     "tabWidth": 2,
    //     "ignoreUrls": true
    //   }
    // ]
  },
}
