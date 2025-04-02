/*
 * Copyright (c) 2023-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { createRule } = require('../util/createRule');

const ruleName = 'no-wire-adapter-of-resource-cannot-be-primed';
const ruleDefinition = createRule(ruleName);

module.exports = ruleDefinition;
