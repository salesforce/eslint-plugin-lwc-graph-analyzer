/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const bundleAnalyzer = require('./processor');
const LwcBundle = require('./lwc-bundle');
const allRules = require('./rules');

module.exports = {
    rules: allRules,
    configs: {
        base: require('./configs/base'),
        recommended: require('./configs/recommended'),
        'base-legacy': require('./configs/base-legacy'),
        'recommended-legacy': require('./configs/recommended-legacy')
    },
    processors: {
        bundleAnalyzer
    }
};
module.exports.LwcBundle = LwcBundle;
