/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

module.exports = {
    plugins: ['@salesforce/lwc-graph-analyzer'],
    processor: '@salesforce/lwc-graph-analyzer/bundleAnalyzer',
    parser: require.resolve('../parser'),
    overrides: [
        {
            files: ['**/*.html']
        }
    ]
};
