/*
 * Copyright (c) 2023-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { docUrl } = require('./doc-url');
const { analyzeLWC } = require('./helper');

/**
 * Creates an ESLint rule object.
 *
 * @param {string} ruleName - The name of the rule to create.
 * @returns A `Rule.RuleModule` shaped object representing this ESLint rule.
 */
function createRule(ruleName) {
    return {
        meta: {
            docs: {
                recommeded: false,
                url: docUrl(ruleName)
            },
            type: 'problem',
            schema: []
        },
        create: function (context) {
            analyzeLWC(context);
            return {};
        }
    };
}

module.exports = {
    createRule
};
