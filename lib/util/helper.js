/*
 * Copyright (c) 2022-2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const staticAnalyzer = require('@komaci/static-analyzer');

const diagnostics = {};
const lwcNamespace = `c`;

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

function addReport(filename, report) {
    diagnostics[filename] = report;
}

function getReport(filename) {
    return diagnostics[filename];
}

function analyzeLWC(context) {
    const eslintReports = getKomaciReport(
        context.id,
        context.getPhysicalFilename(),
        context.getSourceCode().text
    );

    for (let report of eslintReports) {
        context.report(report);
    }
}

function getKomaciReport(ruleName, fileName, sourceFile) {
    // If the file is a part of LWC bundle then the preprocessor would have had
    // run already and stashed the komaci report. Use the file name to look up if
    // there exists a stashed komaci report for it. If not, the file needs a
    // single file analysis.
    let eslintReports = getReport(fileName);
    if (!eslintReports) {
        eslintReports = staticAnalyzer.generatePrimingDiagnosticsModule({
            type: 'file',
            fileName: fileName,
            sourceFile: sourceFile,
            namespace: lwcNamespace
        });
    }

    // Rule name will be of the form '@salesforce/lwc-graph-analyzer/some-rule-name'. Komaci's
    // rule name will be based on the 'some-rule-name' portion of the full name, which gets
    // translated into 'SOME_RULE_NAME' in Komaci parlance.
    const ruleNameParts = ruleName.split('/');
    const ruleKeyInput = ruleNameParts[ruleNameParts.length - 1];
    const ruleKey = ruleKeyInput.toUpperCase().replace(/-/g, '_');

    // Diagnostic messages is the catalog of all Komaci errors. Find the one that matches the rule name
    // so that the Komaci reports can be filtered.
    const diagnosticMessage = Object.entries(staticAnalyzer.diagnosticMessages).find(
        // eslint-disable-next-line no-unused-vars
        ([key, _value]) => {
            return key === ruleKey;
        }
    );

    if (!diagnosticMessage) {
        // No matching diagnostic message was found. Return an empty array to indicate that
        // there is no lint warning/error to report back to the caller.
        return [];
    }

    eslintReports = eslintReports.filter((diagnostic) => {
        return diagnostic.code.value === diagnosticMessage[1].code;
    });

    return eslintReports.map(diagnosticToReport);
}

module.exports = {
    diagnosticToReport,
    addReport,
    analyzeLWC,
    lwcNamespace
};
