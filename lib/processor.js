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
    supportsAutofix = SUPPORTS_AUTOFIX;

    isFileLwcBundleToBase = (file, bundleBaseFile) => {
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

    preprocess = (text, filename) => {
        const exists = existsSync(filename);

        // If the filename is mangled then it is a block of generated code
        // by eslint core. Verify if it is mangled by checking if such file
        // actually exists. If the file doesn't exist then don't process any
        // further and just return.
        if (!exists) {
            return [{ text, filename }];
        }

        // filename is passed in as a full path, e.g.) a/b/c/d/myLwc.js
        const dir = dirname(filename); // dir is all folder segments until to the file, e.g.) a/b/c/d
        const ext = extname(filename); // .html or .js
        const bundleBaseFileWithoutExtension = parse(filename).name; // myLwc
        const bundleBaseFile = basename(filename); // myLwc.js

        const files = {
            [bundleBaseFile]: text
        };

        const dirFiles = readdirSync(dir);

        // Suppose filename is test.js. The iteration below will
        // look at all the files in the directory and finds other files such as
        // test.html and test.2.html to create an object to pass to Komaci
        // for analyzing a bundle.
        dirFiles.forEach((dirFile) => {
            if (this.isFileLwcBundleToBase(dirFile, bundleBaseFile)) {
                const dirFileFullPath = join(dir, dirFile);
                const dirFileTextContent = readFileSync(dirFileFullPath).toString();
                files[dirFile] = dirFileTextContent;
            }
        });

        // If the files object only has a single entry then it needs a single
        // file analysis.
        if (Object.keys(files).length == 1) {
            // Single file analysis is performed at the rule level. So return
            // a single object in an array to continue with eslint processing.
            return [{ text, filename: filename }];
        } else {
            let eslintReports = staticAnalyzer.generatePrimingDiagnosticsModule({
                type: 'bundle',
                namespace: lwcNamespace,
                name: bundleBaseFileWithoutExtension,
                files: files
            });

            // Filter the report for Javascript or html.
            eslintReports = eslintReports.filter((report) => {
                return report.code.target.path.endsWith(ext);
            });

            // Stash the report in in-memory storage. The report is later looked up when the
            // plugin's rules run. When the rules find that the report exist for a given file
            // then it will use the report instead rather than trying to run Komaci analysis again.
            addReport(filename, eslintReports);

            // Continue linting the text only for Javascript. For html, further linting cannot be
            // performed by eslint so pass empty string.
            if (ext === '.html') {
                return [{ text: '', filename }];
            } else {
                return [{ text: text, filename }];
            }
        }
    };

    // eslint-disable-next-line no-unused-vars
    postprocess = (messages, filename) => {
        return messages.flat();
    };
}

const bundleAnalyzer = new BundleAnalyzer();

module.exports = bundleAnalyzer;
