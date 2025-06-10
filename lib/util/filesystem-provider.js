/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { readdirSync, readFileSync, existsSync } = require('fs');

/**
 * Interface for filesystem operations
 */
class FilesystemProvider {
    /**
     * Checks if a file exists
     * @param {string} path - The path to check
     * @returns {boolean} True if the file exists
     */
    existsSync(path) {
        throw new Error('Method not implemented');
    }

    /**
     * Reads the contents of a directory
     * @param {string} path - The directory path
     * @returns {string[]} Array of filenames
     */
    readdirSync(path) {
        throw new Error('Method not implemented');
    }

    /**
     * Reads the contents of a file
     * @param {string} path - The file path
     * @param {Object} options - Read options
     * @returns {string} The file contents
     */
    readFileSync(path, options) {
        throw new Error('Method not implemented');
    }
}

/**
 * Default filesystem provider implementation using Node's fs module
 */
class DefaultFilesystemProvider extends FilesystemProvider {
    existsSync(path) {
        return existsSync(path);
    }

    readdirSync(path) {
        return readdirSync(path);
    }

    readFileSync(path, options) {
        return readFileSync(path, options);
    }
}

module.exports = {
    FilesystemProvider,
    DefaultFilesystemProvider
};
