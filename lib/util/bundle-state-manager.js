/*
 * Copyright (c) 2022-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

/**
 * Manages the state of LWC bundles during ESLint processing.
 * Uses the bundle's unique key for lookups.
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
     * @returns {string | undefined} The bundle key used to store the bundle, or undefined if no primary file exists
     */
    addBundleState(bundle) {
        try {
            const key = bundle.getBundleKey();
            this.#bundleMap.set(key, bundle);
            return key;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * Retrieves a bundle by its unique key
     *
     * @param {string} key - The unique key to look up the bundle by
     * @returns {import('../lwc-bundle') | undefined} The matching LWC bundle, if found
     */
    getBundleByKey(key) {
        return this.#bundleMap.get(key);
    }

    /**
     * Removes a bundle from the state manager
     *
     * @param {import('../lwc-bundle')} bundle - The bundle to remove
     * @returns {boolean} True if the bundle was found and removed, false otherwise
     */
    removeBundleState(bundle) {
        try {
            const key = bundle.getBundleKey();
            return this.#bundleMap.delete(key);
        } catch (error) {
            return false;
        }
    }

    /**
     * Clears all bundles from the state manager
     */
    clear() {
        this.#bundleMap.clear();
    }

    /**
     * Checks if a bundle exists with the given key
     *
     * @param {string} key - The unique key to check for
     * @returns {boolean} True if a bundle exists with the given key, false otherwise
     */
    hasBundleWithKey(key) {
        return this.#bundleMap.has(key);
    }
}

// Export a singleton instance
module.exports = new BundleStateManager();
