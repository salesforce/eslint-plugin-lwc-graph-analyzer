/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { version, repository } = require('../../package.json');

function docUrl(ruleName) {
    return `${repository.url}/blob/${version}/docs/rules/${ruleName}.md`;
}

module.exports = {
    docUrl,
};