/*
 * Copyright (c) 2023-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { createRule } = require('../util/createRule');

const ruleName = 'no-assignment-expression-for-external-components';
const ruleDefinition = createRule(ruleName);

module.exports = ruleDefinition;
