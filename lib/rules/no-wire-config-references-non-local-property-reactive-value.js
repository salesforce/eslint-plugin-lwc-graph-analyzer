/*
 * Copyright (c) 2023-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { createRule } = require('../util/createRule');

const ruleName = 'no-wire-config-references-non-local-property-reactive-value';
const ruleDefinition = createRule(ruleName);

module.exports = ruleDefinition;
