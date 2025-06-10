/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const crypto = require('crypto');

/**
 * Generates a SHA-256 hash for the given content
 *
 * @param {string} content - The content to hash
 * @returns {string} The generated hash in hexadecimal format
 */
function generateHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

module.exports = {
    generateHash
};
