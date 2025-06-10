/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const StaticAnalyzerInterface = require('../../../lib/util/static-analyzer-interface');

/**
 * Mock implementation of StaticAnalyzerInterface for testing
 */
class MockStaticAnalyzer extends StaticAnalyzerInterface {
    constructor() {
        super();
        this._diagnostics = [];
        this._diagnosticMessages = {};
    }

    /**
     * Sets the diagnostics that will be returned by generatePrimingDiagnosticsModule
     * @param {Array<Object>} diagnostics - The diagnostics to return
     */
    setDiagnostics(diagnostics) {
        this._diagnostics = diagnostics;
    }

    /**
     * Sets the diagnostic messages catalog
     * @param {Object} messages - The diagnostic messages catalog
     */
    setDiagnosticMessages(messages) {
        this._diagnosticMessages = messages;
    }

    generatePrimingDiagnosticsModule() {
        return this._diagnostics;
    }

    get diagnosticMessages() {
        return this._diagnosticMessages;
    }
}

module.exports = MockStaticAnalyzer;
