/*
 * Copyright (c) 2022-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { readdirSync, readFileSync, existsSync } = require('fs');
const { basename, dirname, extname, join, parse } = require('path');
const { addReport, lwcNamespace } = require('./util/helper');

const staticAnalyzer = require('@komaci/static-analyzer');

const SUPPORTS_AUTOFIX = true;

/**
 * Represents the files in an LWC bundle.
 *
 * @typedef {Object} LwcBundle
 * @property {string} componentBaseName - The basename of the LWC, e.g. 'AccountView' for 'AccountView.js',
 * 'AccountView.html', and 'AccountView.css'.
 * @property {{ filename: string, content: string } | undefined} js - The content of the JS file.
 * @property {{ filename: string, content: string }[] | undefined} htmlTemplates - The contents of one or
 * more of the LWC HTML templates.
 */

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
    #lwcBundle;
    supportsAutofix;

    constructor() {
        this.#lwcBundle = null;
        this.supportsAutofix = SUPPORTS_AUTOFIX;
    }

    /**
     * Gets the LWC Bundle content.
     *
     * @type {LwcBundle} - The LWC Bundle content.
     */
    get lwcBundle() {
        return this.#lwcBundle;
    }

    /**
     * Sets the LWC Bundle content.
     *
     * @param {LwcBundle} value - The LWC bundle object to set.
     */
    set lwcBundle(value) {
        this.#lwcBundle = value;
    }

    /**
     * Sets the `lwcBundle` property with the content arguments.
     *
     * @param {string} componentBaseName - The basename of the LWC, e.g. 'AccountView' for 'AccountView.js',
     * 'AccountView.html', and 'AccountView.css'.
     * @param {string | undefined} jsContent - The content of the JS file.
     * @param  {string[]} htmlTemplateContent - The contents of one or more of the LWC HTML templates.
     */
    setLwcBundleFromContent = (componentBaseName, jsContent, ...htmlTemplateContent) => {
        this.#lwcBundle = { componentBaseName };
        if (jsContent) {
            this.#lwcBundle['js'] = { filename: `${componentBaseName}.js`, content: jsContent };
        }
        if (htmlTemplateContent.length > 0) {
            this.#lwcBundle['htmlTemplates'] = [
                { filename: `${componentBaseName}.html`, content: htmlTemplateContent[0] }
            ];
            for (let i = 1; i < htmlTemplateContent.length; i++) {
                this.#lwcBundle['htmlTemplates'].push({
                    filename: `${componentBaseName}.${i + 1}.html`,
                    content: htmlTemplateContent[i]
                });
            }
        }
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
        const fileExtension = extname(filename);

        // If this.#lwcBundle has already been set, use that data. Otherwise, create
        // it from the file system.
        if (!this.#lwcBundle) {
            const bundleFromFilesystem = this.#buildLwcBundleFromFilesystem(
                text,
                filename,
                fileExtension
            );
            if (bundleFromFilesystem === null) {
                // Can't process this content. Exit out from further processing.
                return [];
            } else {
                this.#lwcBundle = bundleFromFilesystem;
            }
        }

        // If the files object only has a single entry then it needs a single
        // file analysis.
        const files = this.#filesFromLwcBundle();
        if (Object.keys(files).length == 1) {
            // Single file analysis is performed at the rule level. So return
            // a single object in an array to continue with eslint processing.
            return [{ text, filename: filename }];
        }

        // TODO: Refactor all of this logic below once we implement a custom
        // no-op parser, since Komaci does all the parsing for us.

        let eslintReports = staticAnalyzer.generatePrimingDiagnosticsModule({
            type: 'bundle',
            namespace: lwcNamespace,
            name: this.#lwcBundle.componentBaseName,
            files: files
        });

        // Filter the report for Javascript or html.
        eslintReports = eslintReports.filter((report) => {
            return report.code.target.path.endsWith(fileExtension);
        });

        // Stash the report in in-memory storage. The report is later looked up when the
        // plugin's rules run. When the rules find that the report exist for a given file
        // then it will use the report instead rather than trying to run Komaci analysis again.
        addReport(filename, eslintReports);

        // Continue linting the text only for Javascript. For html, further linting cannot be
        // performed by eslint so pass empty string.
        if (fileExtension === '.html') {
            return [{ text: '', filename }];
        } else {
            return [{ text: text, filename }];
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
    // eslint-disable-next-line no-unused-vars
    postprocess = (messages, filename) => {
        // Clear the existing bundle data.
        this.#lwcBundle = null;
        return messages.flat();
    };

    /**
     * Creates the files K/V object for the LWC bundle, required for Komaci analysis.
     *
     * @returns {Object<string, string>} A K/V object mapping filenames to their content.
     */
    #filesFromLwcBundle = () => {
        const filesObj = {};
        if (!this.#lwcBundle) {
            return filesObj;
        }
        if (this.#lwcBundle.js) {
            filesObj[this.#lwcBundle.js.filename] = this.#lwcBundle.js.content;
        }
        if (this.#lwcBundle.htmlTemplates) {
            this.#lwcBundle.htmlTemplates.forEach((htmlTemplate) => {
                filesObj[htmlTemplate.filename] = htmlTemplate.content;
            });
        }
        return filesObj;
    };

    /**
     * Determines whether the candidate file within the LWC bundle directory is responsive
     * to the naming conventions of LWC bundle files, and thus truly a part of the bundle.
     *
     * @param {string} candidateFilename - The file in the bundle directory to evaluate.
     * @param string lwcFilename - The filename of the pre-determined file in the LWC bundle.
     * @returns {boolean} True if the file should be included in the LWC bundle, false otherwise.
     */
    #isFilePartOfLwcBundle = (candidateFilename, lwcFilename) => {
        const candidateFileExt = extname(candidateFilename);
        if (candidateFileExt !== '.html' && candidateFileExt !== '.js') {
            // Only perform bundle analysis for html or Javascript
            return false;
        }

        // TODO: Need to find the exact rules on what makes a bundle. For now, following
        // Komaci's test case where multiple html files uses the name format of test.html,
        // test.2.html, test.3.html.
        const lwcFilenamePrefix = lwcFilename.split('.')[0];
        const candidateFilenamePrefix = candidateFilename.split('.')[0];
        return lwcFilenamePrefix === candidateFilenamePrefix && candidateFilename !== lwcFilename;
    };

    /**
     * Creates an `LwcBundle` object based on files on the filesystem. This is the entry point
     * for creating the logical repesentation of the LWC bundle that needs to be built up
     * from evaluating files with the ESLint CLI.
     *
     * @param {string} lwcFileContent - The contents of the file under evaluation
     * @param {string} lwcFilePath - The path to the file under evaluation
     * @param {string} lwcFileExtension - The file extension of the file
     * @returns {LwcBundle | null} The LWC bundle object representing the LWC contents.
     */
    #buildLwcBundleFromFilesystem = (lwcFileContent, lwcFilePath, lwcFileExtension) => {
        // If the file does not exist, then this code to lint came in programatically.
        // While this plugin (and processor, specifically) *can* lint code
        // programmatically, it must come in through the setLwcBundleFromContent()
        // method.
        const exists = existsSync(lwcFilePath);
        if (!exists) {
            console.warn(
                'lwc-graph-analyzer: Code specified programatically must be staged via BundleAnalyzer.setLwcBundleFromContent(). Skipping.'
            );
            return null;
        }

        const lwcBundleDir = dirname(lwcFilePath); // dir is all folder segments until to the file, e.g.) a/b/c/d
        const lwcFilename = basename(lwcFilePath); // myLwc.js
        const lwcFilenamePrefix = parse(lwcFilePath).name; // myLwc

        const lwcBundle = {
            componentBaseName: lwcFilenamePrefix,
            js: null,
            htmlTemplates: []
        };
        if (lwcFileExtension === '.js') {
            lwcBundle.js = { filename: lwcFilename, content: lwcFileContent };
        } else if (lwcFileExtension === '.html') {
            lwcBundle.htmlTemplates.push({ filename: lwcFilename, content: lwcFileContent });
        }

        // Look at all the files in the LWC bundle directory to find other associated files such as
        // <LWC Name>.2.html, <LWC Name>.3.html, etc. Komaci needs all files related to the LWC
        // bundle.
        const candidateLwcBundleFiles = readdirSync(lwcBundleDir);
        candidateLwcBundleFiles.forEach((candidateFilename) => {
            if (this.#isFilePartOfLwcBundle(candidateFilename, lwcFilename)) {
                const candidateFileExtension = extname(candidateFilename);
                const candidateFilePath = join(lwcBundleDir, candidateFilename);
                const candidateFileContent = readFileSync(candidateFilePath, { encoding: 'utf-8' });
                if (candidateFileExtension === '.js') {
                    lwcBundle.js = { filename: candidateFilename, content: candidateFileContent };
                } else if (candidateFileExtension === '.html') {
                    lwcBundle.htmlTemplates.push({
                        filename: candidateFilename,
                        content: candidateFileContent
                    });
                }
            }
        });

        return lwcBundle;
    };
}

const bundleAnalyzer = new BundleAnalyzer();

module.exports = bundleAnalyzer;
