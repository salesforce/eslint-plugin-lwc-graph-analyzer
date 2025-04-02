/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

/**
 * @module parser.js
 * @description Custom no-op parser for the LWC graph analyzer plugin
 *
 * Because this plugin relies solely on Komaci analysis, which does its own parsing
 * of input LWC content, it does not need for ESLint to also parse the JS files
 * that it's processing. As such, this parser is passes through any input content.
 */

/**
 * No-op parse method. Returns the empty AST representation of the file.
 *
 * @param {string} text - The text of the file to parse
 * @param {*} options - Any options associated with the parsing
 * @returns An empty `AST.Program` object.
 */
// eslint-disable-next-line no-unused-vars
function parse(text, options) {
    return {
        type: 'Program',
        body: [],
        sourceType: 'module',
        comments: [],
        tokens: [],
        loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: text.length }
        },
        range: [0, text.length]
    };
}

/**
 * The ESLint parser entry point for the no-op parser
 *
 * @param {string} text - The text of the file to parse
 * @param {*} options - Any options associated with the parsing
 * @returns
 */
function parseForESLint(text, options) {
    return {
        ast: parse(text, options),
        services: {},
        scopeManager: null,
        visitorKeys: {}
    };
}

module.exports = { parseForESLint };
