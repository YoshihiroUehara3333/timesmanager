module.exports = {
  env: {
    browser: true,
    node: true,
    es2023: true,
    'jest/globals': true,
  },
  extends: [
    'standard',
    'eslint:recommended',
  ],
  plugins: [
    'jest',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 13
  },
  rules: {
    // https://eslint.org/docs/rules/array-bracket-newline
    // 配列の先頭のブラケットの後で改行をするか
    //   ⇒ 要素追加時の diff の可読性を考慮して always を設定
    //      ただし、要素数 0 の配列だけは改行すると見づらいので minItems: 1 として [] を許容
    'array-bracket-newline': [
      'error',
      { minItems: 1 },
    ],
    // https://eslint.org/docs/rules/array-element-newline
    // 配列の要素単位に改行をするか
    //   ⇒ 要素追加時の diff の可読性を考慮して always を設定
    'array-element-newline': [
      'error',
      'always',
    ],
    // https://eslint.org/docs/rules/comma-dangle
    // 配列やオブジェクトの最後の要素でカンマを付与するか
    //   ⇒ 要素追加時の diff の可読性やカンマ付与漏れによる構文エラーを考慮して only-multiline を設定
    //      always にすると逆に可読性が下がるので、要素単位に改行するケースのみを対象
    'comma-dangle': [
      'error',
      'only-multiline',
    ]
  },
  ignorePatterns: [
    '!.*.js'
  ],
}
