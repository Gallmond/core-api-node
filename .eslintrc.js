module.exports = {
    'env': {
        'node': true,
        'es2021': true,
        // jest globals are defined (describe, test, etc)
        'jest': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'overrides': [
        {
            'files' : [
                './tests/**/*.js'
            ],
            'rules': {
                // allows 'require' in jest tests
                '@typescript-eslint/no-var-requires': 'off',
            }
        }
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        'eol-last': ['error', 'always'],
        'indent': [
            'error',
            4
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
        ]
    }
}
