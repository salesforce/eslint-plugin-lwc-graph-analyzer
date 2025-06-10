/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { assert } = require('chai');
const staticAnalyzer = require('@komaci/static-analyzer');
const plugin = require('..');

describe('Plugin', function () {
    it("has same number of rules as Komaci's diagnostic messages", function () {
        assert.equal(
            Object.keys(staticAnalyzer.diagnosticMessages).length,
            Object.keys(plugin.rules).length
        );
    });

    it('rules reflect keys in diagnostic messages', function () {
        let keys = Object.keys(staticAnalyzer.diagnosticMessages)
            .map((key) => {
                return key.toLowerCase().replace(/_/g, '-');
            })
            .sort();

        let rules = Object.keys(plugin.rules).sort();

        let diffOnKeys = keys.filter((x) => !rules.includes(x));
        let diffOnRules = rules.filter((x) => !keys.includes(x));

        assert.equal(diffOnKeys.length, 0);
        assert.equal(diffOnRules.length, 0);
        assert.equal(keys.length, rules.length);

        const keysRulesEqual = keys.every((element, index) => {
            if (element === rules[index]) {
                return true;
            }
            return false;
        });
        assert.equal(keysRulesEqual, true);
    });

    it('recommended rules count equals the number of existing rules', function () {
        assert.equal(
            Object.keys(plugin.configs.recommended.rules).length,
            Object.keys(plugin.rules).length
        );

        let recommendedRules = Object.keys(plugin.configs.recommended.rules);

        // Strip out scoped module path then sort the array.
        recommendedRules = recommendedRules
            .map((rule) => {
                return rule.replace('@salesforce/lwc-graph-analyzer/', '');
            })
            .sort();

        const rules = Object.keys(plugin.rules).sort();

        const rulesEqual = rules.some((element, index) => {
            return element === recommendedRules[index];
        });
        assert.equal(rulesEqual, true);
    });
});
