/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { analyzeLWC } = require('../util/helper');

module.exports = {
    meta: {
        type: 'problem',
        schema: []
    },
    create: function (context) {
        analyzeLWC(context, __filename);
        return {};
    }
};
