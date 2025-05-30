/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { assert } = require('chai');
const { lintBundle, lintProgrammaticBundle } = require('../helper');

describe('Bundle linting', function () {
    const expectedMessage =
        "This member expression references an unsupported member variable 'blah'.";

    function verifyMessages(messages) {
        assert.equal(messages.length, 2);
        assert.equal(messages[0].message, expectedMessage);
        assert.equal(messages[1].message, expectedMessage);
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
