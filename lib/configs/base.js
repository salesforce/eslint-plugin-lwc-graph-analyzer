/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const bundleAnalyzer = require('../processor');

module.exports = {
    files: ['*.html', '**/*.html', '*.js', '**/*.js'],
    processor: bundleAnalyzer,
    languageOptions: {
        parser: require('@babel/eslint-parser'),
        parserOptions: {
            ecmaVersion: 'latest',
            requireConfigFile: false,
            sourceType: 'module',
            babelOptions: {
                parserOpts: {
                    plugins: [['decorators', { decoratorsBeforeExport: false }]]
                }
            }
        }
    }
};
