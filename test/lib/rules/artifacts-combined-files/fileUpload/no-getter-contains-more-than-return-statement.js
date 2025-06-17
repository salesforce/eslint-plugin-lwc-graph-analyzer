/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { assert } = require('chai');
const { lintBundle, lintProgrammaticBundle } = require('../helper');

describe('Bundle linting', function () {
    function verifyMessages(messages) {
        // All lint warnings are suppressed using variants of eslint-disable
        assert.equal(messages.length, 0);
    }

    it('should return correct errors with file-based bundle', function () {
        const messages = lintBundle(__filename, 'test.js');
        verifyMessages(messages);
    });

    it('should return correct errors with programmatic bundle', function () {
        const messages = lintProgrammaticBundle(__filename, 'test.js');
        verifyMessages(messages);
    });
});
