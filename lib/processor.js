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

class BundleAnalyzer {
    #lwcBundle;
    supportsAutofix;

    constructor() {
        this.#lwcBundle = null;
        this.supportsAutofix = SUPPORTS_AUTOFIX;
    }

    get lwcBundle() {
        return this.#lwcBundle;
    }

    set lwcBundle(value) {
        this.#lwcBundle = value;
    }

    setLwcBundleFromContent = (componentBaseName, jsContent, ...htmlTemplateContent) => {
        this.#lwcBundle = { componentBaseName };
        if (jsContent) {
            this.#lwcBundle['js'] = { filename: `${componentBaseName}.js`, content: jsContent };
        }
        if (htmlTemplateContent && htmlTemplateContent.length > 0) {
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
        return this.#lwcBundle;
    };

    preprocess = (text, filename) => {
        const fileExtension = extname(filename);

        // If this._lwcBundle has already been set, use that data. Otherwise, create
        // it from the file system.
        if (!this.#lwcBundle) {
            const bundleFromFilesystem = this.#buildLwcBundleFromFilesystem(
                text,
                filename,
                fileExtension
            );
            if (bundleFromFilesystem === null) {
                // Can't process this content. Just pass it on.
                return [{ text, filename }];
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

    // eslint-disable-next-line no-unused-vars
    postprocess = (messages, filename) => {
        // Clear the existing bundle data.
        this.#lwcBundle = null;
        return messages.flat();
    };

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

    #isFileLwcBundleToBase = (file, bundleBaseFile) => {
        const fileExt = extname(file);
        if (fileExt !== '.html' && fileExt !== '.js') {
            // Only perform bundle analysis for html or Javascript
            return false;
        }

        // TODO: Need to find the exact rules on what makes a bundle. For now, following
        // Komaci's test case where multiple html files uses the name format of test.html,
        // test.2.html, test.3.html.
        const bundleBaseFileFirstName = bundleBaseFile.split('.')[0];
        const fileFirstName = file.split('.')[0];
        return bundleBaseFileFirstName === fileFirstName && file !== bundleBaseFile;
    };

    #buildLwcBundleFromFilesystem = (text, fullFilePath, fileExtension) => {
        // If the file does not exist, then this code to lint came in programatically.
        // While this plugin (and processor, specifically) *can* lint code
        // programmatically, it must come in through the setLwcBundleFromContent()
        // method.
        const exists = existsSync(fullFilePath);
        if (!exists) {
            console.warn(
                'lwc-graph-analyzer: Code specified programatically must be staged via BundleAnalyzer.setLwcBundleFromContent(). Skipping.'
            );
            return null;
        }

        const dir = dirname(fullFilePath); // dir is all folder segments until to the file, e.g.) a/b/c/d
        const bundleBaseFileWithoutExtension = parse(fullFilePath).name; // myLwc
        const bundleBaseFile = basename(fullFilePath); // myLwc.js

        const lwcBundle = {
            componentBaseName: bundleBaseFileWithoutExtension,
            js: null,
            htmlTemplates: []
        };
        if (fileExtension === '.js') {
            lwcBundle.js = { filename: bundleBaseFile, content: text };
        } else if (fileExtension === '.html') {
            lwcBundle.htmlTemplates.push({ filename: bundleBaseFile, content: text });
        }

        const dirFiles = readdirSync(dir);

        // Suppose filename is test.js. The iteration below will
        // look at all the files in the directory and finds other files such as
        // test.html and test.2.html to create an object to pass to Komaci
        // for analyzing a bundle.
        dirFiles.forEach((dirFile) => {
            if (this.#isFileLwcBundleToBase(dirFile, bundleBaseFile)) {
                const dirFileExtension = extname(dirFile);
                const dirFileFullPath = join(dir, dirFile);
                const dirFileTextContent = readFileSync(dirFileFullPath).toString();
                if (dirFileExtension === '.js') {
                    lwcBundle.js = { filename: dirFile, content: dirFileTextContent };
                } else if (dirFileExtension === '.html') {
                    lwcBundle.htmlTemplates.push({
                        filename: dirFile,
                        content: dirFileTextContent
                    });
                }
            }
        });

        return lwcBundle;
    };
}

const bundleAnalyzer = new BundleAnalyzer();

module.exports = bundleAnalyzer;
