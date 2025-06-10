/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { expect } = require('chai');
const StaticAnalyzerInterface = require('../../../lib/util/static-analyzer-interface');

describe('StaticAnalyzerInterface', () => {
    it('should throw an error when instantiated directly', () => {
        expect(() => new StaticAnalyzerInterface()).to.throw(
            TypeError,
            'StaticAnalyzerInterface is an abstract class and cannot be instantiated directly'
        );
    });

    it('should throw an error when generatePrimingDiagnosticsModule is called', () => {
        // Create a subclass to test the method
        class TestAnalyzer extends StaticAnalyzerInterface {}
        const analyzer = new TestAnalyzer();

        expect(() =>
            analyzer.generatePrimingDiagnosticsModule({
                type: 'test',
                namespace: 'test',
                name: 'test',
                files: {}
            })
        ).to.throw(Error, 'Method not implemented');
    });

    it('should throw an error when diagnosticMessages getter is accessed', () => {
        // Create a subclass to test the getter
        class TestAnalyzer extends StaticAnalyzerInterface {}
        const analyzer = new TestAnalyzer();

        expect(() => analyzer.diagnosticMessages).to.throw(Error, 'Method not implemented');
    });
});
