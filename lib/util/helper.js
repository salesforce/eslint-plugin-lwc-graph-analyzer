/*
 * Copyright (c) 2022-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { basename } = require('path');
const staticAnalyzer = require('@komaci/static-analyzer');
const bundleStateManager = require('./bundle-state-manager');
// eslint-disable-next-line no-unused-vars
const LwcBundle = require('../lwc-bundle');

const lwcNamespace = 'c';

function rangeToLoc(range) {
    const {
        start: { line, character: column },
        end: { line: endLine, character: endColumn }
    } = range;
    return {
        start: {
            // Komaci reports line number using 0 based index so adjust it by 1.
            line: line + 1,
            column: column
        },
        end: {
            line: endLine + 1,
            column: endColumn
        }
    };
}

function diagnosticToReport(diagnostic) {
    const { message, range } = diagnostic;

    return {
        message,
        node: {
            loc: rangeToLoc(range)
        }
    };
}

/**
 * Adds a new entry to the LWC bundle cache.
 *
 * @param {import('../lwc-bundle')} bundle - The LWC bundle to cache
 */
function setLwcBundleCacheEntry(bundle) {
    bundleStateManager.addBundleState(bundle);
}

/**
 * Removes an entry from the LWC bundle cache.
 *
 * @param {import('../lwc-bundle')} bundle - The LWC bundle to remove from the cache
 */
function removeLwcBundleCacheEntry(bundle) {
    bundleStateManager.removeBundleState(bundle);
}

function analyzeLWC(context) {
    const eslintReports = getKomaciReport(context.id, context.filename);

    for (const report of eslintReports) {
        context.report(report);
    }
}

/**
 * Extracts the original bundle key from an ESLint-processed filename.
 * ESLint modifies filenames between preprocess() and rule analysis by:
 * 1. Prepending the full path
 * 2. Adding an index prefix (e.g. "0_") to the filename
 * This function handles that by:
 * 1. Extracting just the filename from the path
 * 2. Removing the index prefix
 *
 * @param {string} eslintFilename - The filename as provided by ESLint's context
 * @returns {string} The original bundle key used for lookup
 */
function extractBundleKey(eslintFilename) {
    // Extract just the filename from the path
    const filename = basename(eslintFilename);

    // Remove the index prefix (e.g. "0_") that ESLint adds
    return filename.replace(/^(\d+_)?/, '');
}

function getKomaciReport(ruleName, filename) {
    const bundleKey = extractBundleKey(filename);
    const lwcBundle = bundleStateManager.getBundleByKey(bundleKey);
    if (!lwcBundle) {
        console.warn('getKomaciReport(): LWC bundle not configured. Nothing to do.');
        return [];
    }

    const lwcBundleFiles = lwcBundle.filesRecord();
    let eslintReports = staticAnalyzer.generatePrimingDiagnosticsModule({
        type: 'bundle',
        namespace: lwcNamespace,
        name: lwcBundle.componentBaseName,
        files: lwcBundleFiles
    });

    // Rule name will be of the form '@salesforce/lwc-graph-analyzer/some-rule-name'. Komaci's
    // rule name will be based on the 'some-rule-name' portion of the full name, which gets
    // translated into 'SOME_RULE_NAME' in Komaci parlance.
    const ruleNameParts = ruleName.split('/');
    const ruleKeyInput = ruleNameParts[ruleNameParts.length - 1];
    const ruleKey = ruleKeyInput.toUpperCase().replace(/-/g, '_');

    // Diagnostic messages is the catalog of all Komaci errors. Find the one that matches the rule name
    // so that the Komaci reports can be filtered.
    const diagnosticMessage = staticAnalyzer.diagnosticMessages[ruleKey];

    if (!diagnosticMessage) {
        // No matching diagnostic message was found. Return an empty array to indicate that
        // there is no lint warning/error to report back to the caller.
        console.warn(`getKomaciReport(): No Komaci diagnostic message for for '${ruleKey}'.`);
        return [];
    }

    function extractDiagnosticCodeValue(diagnostic) {
        return typeof diagnostic.code === 'object' && 'value' in diagnostic.code
            ? diagnostic.code.value
            : diagnostic.code;
    }

    eslintReports = eslintReports.filter((reportDiagnostic) => {
        const reportDiagnosticValue = extractDiagnosticCodeValue(reportDiagnostic);
        const diagnosticValue = extractDiagnosticCodeValue(diagnosticMessage);
        return reportDiagnosticValue === diagnosticValue;
    });

    return eslintReports.map(diagnosticToReport);
}

module.exports = {
    setLwcBundleCacheEntry,
    removeLwcBundleCacheEntry,
    analyzeLWC,
    extractBundleKey
};
