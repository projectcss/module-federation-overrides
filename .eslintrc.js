/**
 * @file 符合百度规范的eslint配置
 * @author FranckChen(chenfna02@baidu.com)
 */

const path = require('path');

module.exports = {
    extends: [
        '@ecomfe/eslint-config/strict',
        '@ecomfe/eslint-config/import/strict',
        '@ecomfe/eslint-config/react/strict',
        '@ecomfe/eslint-config/typescript/strict'
    ],
    ignorePatterns: ['**/{node_modules,output}'],
    settings: {
        'import/resolver': {
            alias: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                map: [
                    ['@src', path.resolve(__dirname, 'src')]
                ]
            },
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts']
            }
        },
        react: {
            version: 'detect'
        }
    },
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json',
        babelOptions: {
            configFile: path.resolve(__dirname, 'babel.config.js')
        }
    },
    // 覆盖掉bug规则和与百度规范不符的规则
    rules: {
        'comma-dangle': [
            'error',
            {
                arrays: 'never',
                objects: 'never',
                imports: 'never',
                exports: 'never',
                functions: 'never'
            }
        ],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                tsx: 'never',
                ts: 'never'
            }
        ],
        '@typescript-eslint/no-namespace': 'off',
        'import/named': 'off',
        'operator-linebreak': 'off',
        'import/unambiguous': 'off',
        'react/jsx-no-bind': 'off',
        'indent': 'off',
        '@typescript-eslint/indent': ['error']
    }
};
