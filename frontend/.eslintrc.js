module.exports = {
  'env': {
      'browser': true,
      'es6': true
  },
  'extends': ['eslint:recommended', 'plugin:react/recommended'],
  'globals': {
      'Atomics': 'readonly',
      'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
      'ecmaFeatures': {
          'jsx': true
      },
      'ecmaVersion': 2018,
      'sourceType': 'module'
  },
  'plugins': [
      'react'
  ],
  'rules': {
      'indent': [
          'error',
          2
      ],
      'linebreak-style': [
          'error',
          'unix'
      ],
      'quotes': [
          'error',
          'single'
      ],
      'semi': [
          'error',
          'never'
      ],
      "object-curly-spacing": [
          "error",
           "always"
      ],
      "no-multiple-empty-lines": [
          2,
          {"max": 1, "maxEOF": 0}
      ],
      "react/prop-types": 0,
      "no-console": [
          1,
      ]
  }
}
