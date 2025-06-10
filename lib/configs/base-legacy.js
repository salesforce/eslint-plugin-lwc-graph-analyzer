/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

module.exports = {
    plugins: ['@salesforce/lwc-graph-analyzer'],
    parser: '@babel/eslint-parser',
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
};
