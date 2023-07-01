/*
 * Copyright (c) 2023, salesforce.com, inc.
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

        // Allint warnings are suppressed using variants of eslint-disable
        assert.equal(messages.length, 0);
    });
});
