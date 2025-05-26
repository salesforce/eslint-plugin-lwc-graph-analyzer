/*
 * Copyright (c) 2022-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { generateHash } = require('./hash-utils');

/**
 * Manages the state of LWC bundles during ESLint processing.
 * Uses a hash-based lookup system to handle concurrent processing of multiple files.
 */
class BundleStateManager {
    #bundleMap;

    constructor() {
        this.#bundleMap = new Map();
    }

    /**
     * Adds a bundle to the state manager
     *
     * @param {import('../lwc-bundle')} bundle - The LWC bundle to add
     * @returns {string | undefined} The hash key used to store the bundle, or undefined if no primary file exists
     */
    addBundleState(bundle) {
        const primaryFile = bundle.primaryFile;
        if (!primaryFile) {
            return undefined;
        }
        const hash = generateHash(primaryFile.content);
        this.#bundleMap.set(hash, bundle);
        return hash;
    }

    /**
     * Retrieves a bundle by the hash of its content
     *
     * @param {string} content - The content to look up the bundle by
     * @returns {import('../lwc-bundle') | undefined} The matching LWC bundle, if found
     */
    getBundleByContent(content) {
        const hash = generateHash(content);
        return this.#bundleMap.get(hash);
    }

    /**
     * Removes a bundle from the state manager
     *
     * @param {import('../lwc-bundle')} bundle - The bundle to remove
     * @returns {boolean} True if the bundle was found and removed, false otherwise
     */
    removeBundleState(bundle) {
        const primaryFile = bundle.primaryFile;
        if (!primaryFile) {
            return false;
        }
        const hash = generateHash(primaryFile.content);
        return this.#bundleMap.delete(hash);
    }

    /**
     * Clears all bundles from the state manager
     */
    clear() {
        this.#bundleMap.clear();
    }
}

// Export a singleton instance
module.exports = new BundleStateManager();
