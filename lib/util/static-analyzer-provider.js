/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const StaticAnalyzerInterface = require('./static-analyzer-interface');
const staticAnalyzer = require('@komaci/static-analyzer');

/**
 * Concrete implementation of StaticAnalyzerInterface that uses the actual static analyzer
 */
class StaticAnalyzerProvider extends StaticAnalyzerInterface {
    generatePrimingDiagnosticsModule(options) {
        return staticAnalyzer.generatePrimingDiagnosticsModule(options);
    }

    get diagnosticMessages() {
        return staticAnalyzer.diagnosticMessages;
    }
}

module.exports = StaticAnalyzerProvider;
