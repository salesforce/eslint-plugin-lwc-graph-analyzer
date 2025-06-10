/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { version, homepage } = require('../../package.json');

function docUrl(ruleName) {
    return `${homepage}/blob/v${version}/lib/docs/${ruleName}.md`;
}

module.exports = {
    docUrl
};
