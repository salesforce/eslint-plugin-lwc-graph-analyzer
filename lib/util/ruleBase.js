/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const path = require('path');
const { docUrl } = require('../util/doc-url');
const { analyzeLWC } = require('../util/helper');

function ruleBase(filename) {
    return {
        meta: {
            docs: {
                recommeded: false,
                url: docUrl(path.parse(filename).name)
            },
            type: 'problem',
            schema: []
        },
        create: function (context) {
            analyzeLWC(context, filename);
            return {};
        }
    };
}

module.exports = {
    ruleBase
};
