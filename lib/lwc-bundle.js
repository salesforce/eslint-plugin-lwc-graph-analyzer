/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { readdirSync, readFileSync, existsSync } = require('fs');
const { basename, dirname, extname, join, parse } = require('path');

/**
 * Represents the JS and HTML filenames and contents of an LWC bundle
 * @class
 */
class LwcBundle {
    #componentBaseName;
    #js;
    #htmlTemplates;

    /**
     * Create a new instance of an LwcBundle
     *
     * @param {string} componentBaseName
     * @param {{filename: string, content: string} | undefined} js
     * @param  {{filename: string, content: string}[] | undefined} htmlTemplates
     */
    constructor(componentBaseName, js, htmlTemplates) {
        this.#componentBaseName = componentBaseName;
        this.#js = js;
        this.#htmlTemplates = htmlTemplates;
    }

    /**
     * The component's base name (e.g. 'myLwc.js' would be 'myLwc')
     *
     * @returns {string}
     */
    get componentBaseName() {
        return this.#componentBaseName;
    }

    /**
     * The JS filename and content
     *
     * @returns {{filename: string, content: string} | undefined}
     */
    get js() {
        return this.#js;
    }

    /**
     * The filenames and contents of the HTML templates
     *
     * @returns {{filename: string, content: string}[] | undefined}
     */
    get htmlTemplates() {
        return this.#htmlTemplates;
    }

    /**
     * Creates the `Record` of filenames to their content from the LWC bundle. This is the
     * required object schema for input into Komaci analysis.
     *
     * @param {LwcBundle} lwcBundle - The `LwcBundle` to parse the files out of.
     * @returns {Object<string, string>} A `Record` object mapping filenames to their content.
     */
    filesRecord() {
        const filesObj = {};
        if (this.#js) {
            filesObj[this.#js.filename] = this.#js.content;
        }
        if (this.#htmlTemplates) {
            this.#htmlTemplates.forEach((htmlTemplate) => {
                filesObj[htmlTemplate.filename] = htmlTemplate.content;
            });
        }
        return filesObj;
    }

    /**
     * Creates an `LwcBundle` object from the input arguments.
     *
     * @param {string} componentBaseName - The basename of the LWC, e.g. 'AccountView' for 'AccountView.js',
     * 'AccountView.html', and 'AccountView.css'
     * @param {string | undefined} jsContent - The content of the JS file
     * @param  {string[]} htmlTemplateContent - The contents of one or more of the LWC HTML templates
     * @returns
     */
    static lwcBundleFromContent(componentBaseName, jsContent, ...htmlTemplateContent) {
        const js = jsContent
            ? { filename: `${componentBaseName}.js`, content: jsContent }
            : undefined;
        let htmlTemplates;
        if (htmlTemplateContent.length > 0) {
            htmlTemplates = [
                { filename: `${componentBaseName}.html`, content: htmlTemplateContent[0] }
            ];
            for (let i = 1; i < htmlTemplateContent.length; i++) {
                htmlTemplates.push({
                    filename: `${componentBaseName}.${i + 1}.html`,
                    content: htmlTemplateContent[i]
                });
            }
        }
        return new LwcBundle(componentBaseName, js, htmlTemplates);
    }

    /**
     * Creates a logical `LwcBundle` object based on the file path and content input
     * that an ESLint processor's `preprocess` method receives.
     *
     * @param {string} lwcFileContent - The contents of the file
     * @param {string} lwcFilePath - The path to the file
     * @param {string} lwcFileExtension - The file extension of the file
     * @returns {LwcBundle | null} The LWC bundle object representing the LWC contents,
     * or `null` if sufficient LWC file contents cannot be found on the filesystem.
     */
    static lwcBundleFromFilesystem(lwcFileContent, lwcFilePath, lwcFileExtension) {
        // If the file does not exist, then this code to lint came in programatically.
        // While this plugin (and processor, specifically) *can* lint code
        // programmatically, it must come in through the setLwcBundleFromContent()
        // method.
        const exists = existsSync(lwcFilePath);
        if (!exists) {
            return null;
        }

        const lwcBundleDir = dirname(lwcFilePath); // dir is all folder segments until to the file, e.g.) a/b/c/d
        const lwcFilename = basename(lwcFilePath); // myLwc.js
        const lwcFilenamePrefix = parse(lwcFilePath).name; // myLwc

        const componentBaseName = lwcFilenamePrefix;
        let js;
        let htmlTemplates;
        if (lwcFileExtension === '.js') {
            js = { filename: lwcFilename, content: lwcFileContent };
        } else if (lwcFileExtension === '.html') {
            htmlTemplates = [{ filename: lwcFilename, content: lwcFileContent }];
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
                    js = { filename: candidateFilename, content: candidateFileContent };
                } else if (candidateFileExtension === '.html') {
                    if (htmlTemplates) {
                        htmlTemplates.push({
                            filename: candidateFilename,
                            content: candidateFileContent
                        });
                    } else {
                        htmlTemplates = [
                            {
                                filename: candidateFilename,
                                content: candidateFileContent
                            }
                        ];
                    }
                }
            }
        });

        return new LwcBundle(componentBaseName, js, htmlTemplates);
    }

    /**
     * Determines whether the candidate file within the LWC bundle directory is responsive
     * to the naming conventions of LWC bundle files, and thus truly a part of the bundle.
     *
     * @param {string} candidateFilename - The file in the bundle directory to evaluate.
     * @param string lwcFilename - The filename of the pre-determined file in the LWC bundle.
     * @returns {boolean} True if the file should be included in the LWC bundle, false otherwise.
     */
    static #isFilePartOfLwcBundle(candidateFilename, lwcFilename) {
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
    }
}

module.exports = LwcBundle;
