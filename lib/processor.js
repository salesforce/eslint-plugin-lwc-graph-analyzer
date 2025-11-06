/*
 * Copyright (c) 2022-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { extname } = require('path');
const {
    setLwcBundleCacheEntry,
    removeLwcBundleCacheEntry,
    extractBundleKey
} = require('./util/helper');
const LwcBundle = require('./lwc-bundle');
const bundleStateManager = require('./util/bundle-state-manager');

const SUPPORTS_AUTOFIX = true;

/**
 * Type representing an ESlint message
 * @see {@link https://eslint.org/docs/latest/integrate/nodejs-api#linterverify}
 *
 * @typedef {Object} Message
 * @property {string} ruleId - The ESLint rule ID associated with the violation
 * @property {number} severity - The severity of the violation
 * @property {string} message - The message associated with the violation
 * @property {number} line - The starting line number of the violation
 * @property {number} column - The starting column number of the violation
 * @property {number} endLine - The ending line number of the violation
 * @property {number} endColumn - The ending column number of the violation
 */

/**
 * ESLint pre-processor that hydrates the files of an LWC bundle.
 */
class BundleAnalyzer {
    /** @private @type {LwcBundle | null} */
    #lwcBundle;

    supportsAutofix;

    constructor() {
        this.#lwcBundle = null;
        this.supportsAutofix = SUPPORTS_AUTOFIX;
    }

    /**
     * Gets the LWC Bundle content.
     *
     * @returns {LwcBundle | null}
     */
    get lwcBundle() {
        return this.#lwcBundle;
    }

    /**
     * Sets the LWC Bundle content.
     *
     * @param {LwcBundle | null} value - The LWC bundle object to set.
     */
    set lwcBundle(value) {
        this.#lwcBundle = value;
    }

    /**
     * Sets the LWC Bundle content from the specified content of the various bundle files.
     *
     * @param {string} componentBaseName - The basename of the LWC
     * @param {string | undefined} jsContent - The content of the JS file
     * @param {string[]} htmlTemplateContent - The contents of the HTML templates
     */
    setLwcBundleFromContent = (componentBaseName, jsContent, ...htmlTemplateContent) => {
        this.#lwcBundle = LwcBundle.lwcBundleFromContent(
            componentBaseName,
            jsContent,
            ...htmlTemplateContent
        );
    };

    /**
     * Preprocessor entry point.
     *
     * @param {string} text - The content of the ESLint file.
     * @param {string} filename - The input filename. This will be the full path to the file if processed
     * by the ESLint CLI, or a dummy value (__placeholder__.js) if called programatically.
     * @returns {{ text: string, filename: string }[]} An array of files and their content, to be processed.
     */
    preprocess = (text, filename) => {
        // Check if this is a file we generated ourselves with `preprocess()` return values.
        const bundleKey = extractBundleKey(filename);
        if (bundleStateManager.hasBundleWithKey(bundleKey)) {
            // Skip processing for files we generated
            return [{ text, filename }];
        }

        const fileExtension = extname(filename);

        // If this.#lwcBundle has already been set, use that data. Otherwise, create
        // it from the file system.
        if (!this.#lwcBundle) {
            const bundleFromFilesystem = LwcBundle.lwcBundleFromFilesystem(
                text,
                filename,
                fileExtension
            );
            if (bundleFromFilesystem === null) {
                // Couldn't find the content based on its file path, which means it's content set programmatically.
                // Just create a bundle out of the single file of content passed in.
                this.#lwcBundle = LwcBundle.lwcBundleFromFile(text, filename, fileExtension);
            } else {
                this.#lwcBundle = bundleFromFilesystem;
            }
        } else {
            // For programmatically set bundles, we need to determine which file is primary
            // based on the content being processed
            const found = this.#lwcBundle.setPrimaryFileByContent(text);
            if (!found) {
                console.warn(
                    `lwc-graph-analyzer preprocess(): Could not find a matching file in the bundle for the content being processed. Skipping.`
                );
                return [];
            }
        }

        setLwcBundleCacheEntry(this.#lwcBundle);

        // Get the unique key for this bundle, which will be used as the filename for ESLint processing. It should always be a js file since komaci only supports js files.
        const uniqueFilename = this.#lwcBundle.getBundleKey();

        // For JavaScript files, we need to return the original text so that ESLint can parse it
        // and properly handle disable comments. For all other file types (like HTML), we return
        // the JS content from the bundle so that rules can run and report violations targeting
        // the HTML file.
        if (fileExtension === '.js') {
            return [{ text, filename: uniqueFilename }];
        } else {
            // Return JS content so ESLint can parse it and rules can run
            return [{ text: this.#lwcBundle.js?.content || '', filename: uniqueFilename }];
        }
    };

    /**
     * Postprocessor entry point.
     *
     * Note: At this time, the postprocessor is just a clean-up process for internal artifacts.
     * The linting result messages are unchanged, only flattened to a one-dimensional structure.
     *
     * @param {Message[][]} messages - The two-dimensional array of messages returned from linting
     * @param {string} filename - The input filename. This will be the full path to the file if processed
     * by the ESLint CLI, or a dummy value (__placeholder__.js) if called programatically.
     * @returns A one-dimensional flattened array of messages.
     */
    postprocess = (messages, filename) => {
        // Clear the existing bundle data.
        if (this.#lwcBundle) {
            removeLwcBundleCacheEntry(this.#lwcBundle);
        }
        this.#lwcBundle = null;
        return messages.flat();
    };
}

const bundleAnalyzer = new BundleAnalyzer();

module.exports = bundleAnalyzer;
