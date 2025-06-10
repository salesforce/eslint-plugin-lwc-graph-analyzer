/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const js = require('@eslint/js');
const nodePlugin = require('eslint-plugin-n');
const eslintPlugin = require('eslint-plugin-eslint-plugin');
const tseslint = require('typescript-eslint');

module.exports = [
    {
        ignores: ['test/**/test.js', 'reports/**']
    },
    {
        ...js.configs.recommended,
        ...nodePlugin.configs['flat/recommended-script'],
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                // jest globals
                jest: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly'
            }
        },
        rules: {
            strict: ['error', 'global']
        }
    },
    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: ['**/*.d.ts']
    })),
    {
        files: ['lib/rules/*.js'],
        plugins: {
            'eslint-plugin': eslintPlugin
        },
        ...eslintPlugin.configs['flat/recommended'],
        rules: {
            'eslint-plugin/prefer-message-ids': 'off' // Messages come straight from Komaci.
        }
    }
];
