/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { basename, dirname, extname, join, parse } = require('path');
const { generateHash } = require('./util/hash-utils');
const { randomUUID } = require('crypto');
const { DefaultFilesystemProvider } = require('./util/filesystem-provider');

/**
 * @typedef {Object} LwcBundleFile
 * @property {string} filename - The name of the file
 * @property {string} content - The content of the file
 * @property {boolean} isPrimary - Whether this is the primary file being linted
 */

/**
 * Represents the JS and HTML filenames and contents of an LWC bundle
 * @class
 */
class LwcBundle {
    #componentBaseName;
    #js;
    #htmlTemplates;
    #primaryFileUuidKey;
    #filesystemProvider;

    /**
     * Create a new instance of an LwcBundle
     *
     * @param {string} componentBaseName
     * @param {LwcBundleFile | undefined} js
     * @param {LwcBundleFile[] | undefined} htmlTemplates
     * @param {FilesystemProvider} [filesystemProvider=new DefaultFilesystemProvider()]
     */
    constructor(
        componentBaseName,
        js,
        htmlTemplates,
        filesystemProvider = new DefaultFilesystemProvider()
    ) {
        this.#componentBaseName = componentBaseName;
        this.#js = js;
        this.#htmlTemplates = htmlTemplates;
        this.#primaryFileUuidKey = randomUUID();
        this.#filesystemProvider = filesystemProvider;
    }

    /**
     * Sets the primary file based on content hash comparison
     *
     * @param {string} content - The content to match against
     * @returns {boolean} True if a matching file was found and set as primary
     */
    setPrimaryFileByContent(content) {
        const targetHash = generateHash(content);
        let found = false;

        // Reset all files to non-primary
        if (this.#js) {
            this.#js.isPrimary = false;
        }
        if (this.#htmlTemplates) {
            this.#htmlTemplates.forEach((template) => {
                template.isPrimary = false;
            });
        }

        // Find and set the matching file as primary
        if (this.#js && generateHash(this.#js.content) === targetHash) {
            this.#js.isPrimary = true;
            found = true;
        } else if (this.#htmlTemplates) {
            for (const template of this.#htmlTemplates) {
                if (generateHash(template.content) === targetHash) {
                    template.isPrimary = true;
                    found = true;
                    break;
                }
            }
        }

        return found;
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
     * @returns {LwcBundleFile | undefined}
     */
    get js() {
        return this.#js;
    }

    /**
     * The filenames and contents of the HTML templates
     *
     * @returns {LwcBundleFile[] | undefined}
     */
    get htmlTemplates() {
        return this.#htmlTemplates;
    }

    /**
     * Gets the primary file in the bundle
     *
     * @returns {LwcBundleFile | undefined} The primary file, or undefined if no file is marked as primary
     */
    get primaryFile() {
        return this.#js?.isPrimary ? this.#js : this.#htmlTemplates?.find((t) => t.isPrimary);
    }

    /**
     * Gets a unique key for this bundle based on its js file since komaci only supports js files. This key is used as file name for further linting.
     *
     * @returns {string} A unique key in the format `<base file name>_<uuid>.js`
     */
    getBundleKey() {
        const primaryFile = this.primaryFile;
        if (!primaryFile) {
            throw new Error('Cannot generate bundle key: no primary file exists');
        }

        const { name } = parse(primaryFile.filename);
        return `${name}_${this.#primaryFileUuidKey}.js`;
    }

    /**
     * Creates the `Record` of filenames to their content from the LWC bundle. This is the
     * required object schema for input into Komaci analysis.
     *
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
     * @param {string} componentBaseName - The basename of the LWC, e.g. 'AccountView' for 'AccountView.js'
     * @param {string | undefined} jsContent - The content of the JS file
     * @param {string[]} htmlTemplateContent - The contents of one or more of the LWC HTML templates
     * @returns {LwcBundle}
     */
    static lwcBundleFromContent(componentBaseName, jsContent, ...htmlTemplateContent) {
        const jsFile = jsContent
            ? {
                  filename: `${componentBaseName}.js`,
                  content: jsContent,
                  isPrimary: false
              }
            : undefined;

        let htmlTemplates;
        if (htmlTemplateContent.length > 0) {
            htmlTemplates = htmlTemplateContent.map((content, index) => {
                const filename =
                    index === 0
                        ? `${componentBaseName}.html`
                        : `${componentBaseName}.${index + 1}.html`;
                return {
                    filename,
                    content,
                    isPrimary: false
                };
            });
        }

        return new LwcBundle(componentBaseName, jsFile, htmlTemplates);
    }

    /**
     * Creates a logical `LwcBundle` object based on the single file content input
     * that an ESLint processor's `preprocess` method receives.
     *
     * @param {string} lwcFileContent - The contents of the file being processed
     * @param {string} lwcFilePath - The path to the file being processed
     * @param {string} lwcFileExtension - The file extension of the file being processed
     * @returns {LwcBundle} The LWC bundle object representing the LWC contents.
     */
    static lwcBundleFromFile(lwcFileContent, lwcFilePath, lwcFileExtension) {
        const lwcFilename = basename(lwcFilePath);
        const componentBaseName = parse(lwcFilePath).name;

        const primaryFile = {
            filename: lwcFilename,
            content: lwcFileContent,
            isPrimary: true
        };

        let js;
        let htmlTemplates;
        if (lwcFileExtension === '.js') {
            js = primaryFile;
        } else if (lwcFileExtension === '.html') {
            htmlTemplates = [primaryFile];
        } else {
            throw new Error(`Unsupported file extension: ${lwcFileExtension}`);
        }

        return new LwcBundle(componentBaseName, js, htmlTemplates);
    }

    /**
     * Creates a logical `LwcBundle` object based on the file path and content input
     * that an ESLint processor's `preprocess` method receives.
     *
     * @param {string} lwcFileContent - The contents of the file being processed
     * @param {string} lwcFilePath - The path to the file being processed
     * @param {string} lwcFileExtension - The file extension of the file being processed
     * @returns {LwcBundle | null} The LWC bundle object representing the LWC contents,
     * or `null` if sufficient LWC file contents cannot be found on the filesystem.
     */
    static lwcBundleFromFilesystem(
        lwcFileContent,
        lwcFilePath,
        lwcFileExtension,
        filesystemProvider = new DefaultFilesystemProvider()
    ) {
        // Validate file extension first
        if (lwcFileExtension !== '.js' && lwcFileExtension !== '.html') {
            throw new Error(`Unsupported file extension: ${lwcFileExtension}`);
        }

        const exists = filesystemProvider.existsSync(lwcFilePath);
        if (!exists) {
            return null;
        }

        const lwcBundleDir = dirname(lwcFilePath);
        const lwcFilename = basename(lwcFilePath);
        const lwcFilenamePrefix = parse(lwcFilePath).name;

        const componentBaseName = lwcFilenamePrefix;
        let js;
        let htmlTemplates;

        // The file being processed is always the primary file
        const primaryFile = {
            filename: lwcFilename,
            content: lwcFileContent,
            isPrimary: true
        };

        if (lwcFileExtension === '.js') {
            js = primaryFile;
        } else if (lwcFileExtension === '.html') {
            htmlTemplates = [primaryFile];
        }

        // Look at all the files in the LWC bundle directory to find other associated files
        const candidateLwcBundleFiles = filesystemProvider.readdirSync(lwcBundleDir);
        candidateLwcBundleFiles.forEach((candidateFilename) => {
            if (this.#isFilePartOfLwcBundle(candidateFilename, lwcFilename)) {
                const candidateFileExtension = extname(candidateFilename);
                const candidateFilePath = join(lwcBundleDir, candidateFilename);
                const candidateFileContent = filesystemProvider.readFileSync(candidateFilePath, {
                    encoding: 'utf-8'
                });

                const bundleFile = {
                    filename: candidateFilename,
                    content: candidateFileContent,
                    isPrimary: false // These are additional files, not the primary one
                };

                if (candidateFileExtension === '.js') {
                    js = bundleFile;
                } else if (candidateFileExtension === '.html') {
                    if (htmlTemplates) {
                        htmlTemplates.push(bundleFile);
                    } else {
                        htmlTemplates = [bundleFile];
                    }
                }
            }
        });

        return new LwcBundle(componentBaseName, js, htmlTemplates, filesystemProvider);
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
