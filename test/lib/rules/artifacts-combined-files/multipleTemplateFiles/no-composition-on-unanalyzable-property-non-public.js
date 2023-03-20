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
        const messages = lintBundle(__filename, 'test.html');
        assert.equal(messages.length, 1);
        assert.equal(
            messages[0].message,
            "This child component references an unanalyzable property 'title' that’s not a public property."
        );
    });
});
