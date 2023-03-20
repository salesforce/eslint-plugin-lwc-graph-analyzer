/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { assert } = require('chai');
const { lintBundle } = require('../helper');

describe('Bundle linting', function () {
    it('should return correct errors', function () {
        const messages = lintBundle(__filename, 'test.js');
        assert.equal(messages.length, 2);
        const expected =
            "This member expression references an unsupported member variable 'blah'.";
        assert.equal(messages[0].message, expected);
        assert.equal(messages[1].message, expected);
    });
});
