/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const RULE_TESTER_CONFIG = {
    languageOptions: {
        parser: require('@babel/eslint-parser'),
        parserOptions: {
            requireConfigFile: false,
            sourceType: 'module',
            babelOptions: {
                parserOpts: {
                    plugins: [['decorators', { decoratorsBeforeExport: false }]]
                }
            }
        }
    },
    plugins: {
        '@salesforce/lwc-graph-analyzer': require('../../../lib/index')
    },
    processor: require('../../../lib/processor')
};
module.exports = {
    RULE_TESTER_CONFIG
};
