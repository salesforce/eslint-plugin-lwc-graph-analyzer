/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const RULE_TESTER_CONFIG = {
    parser: require.resolve('@babel/eslint-parser'),
    parserOptions: {
        requireConfigFile: false,
        sourceType: 'module',
        babelOptions: {
            parserOpts: {
                plugins: [['decorators', { decoratorsBeforeExport: false }]]
            }
        }
    },
    plugins: ['@salesforce/lwc-graph-analyzer'],
};

module.exports = {
    RULE_TESTER_CONFIG
};
