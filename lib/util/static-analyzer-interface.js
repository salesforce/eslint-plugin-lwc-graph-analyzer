/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/**
 * Interface for static analysis functionality
 */
class StaticAnalyzerInterface {
    constructor() {
        if (this.constructor === StaticAnalyzerInterface) {
            throw new TypeError(
                'StaticAnalyzerInterface is an abstract class and cannot be instantiated directly'
            );
        }
    }

    /**
     * Generates priming diagnostics for a module
     * @param {Object} options - The options for generating diagnostics
     * @param {string} options.type - The type of module
     * @param {string} options.namespace - The namespace of the module
     * @param {string} options.name - The name of the module
     * @param {Object<string, string>} options.files - The files to analyze
     * @returns {Array<Object>} The generated diagnostics
     */
    generatePrimingDiagnosticsModule(options) {
        throw new Error('Method not implemented');
    }

    /**
     * Gets the diagnostic messages catalog
     * @returns {Object} The diagnostic messages catalog
     */
    get diagnosticMessages() {
        throw new Error('Method not implemented');
    }
}

module.exports = StaticAnalyzerInterface;
