/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { expect } = require('chai');
const { getKomaciReport, setStaticAnalyzerProvider } = require('../../../lib/util/helper');
const LwcBundle = require('../../../lib/lwc-bundle');
const bundleStateManager = require('../../../lib/util/bundle-state-manager');
const MockStaticAnalyzer = require('./mock-static-analyzer');

describe('helper', () => {
    describe('getKomaciReport', () => {
        let mockStaticAnalyzer;

        beforeEach(() => {
            bundleStateManager.clear();
            mockStaticAnalyzer = new MockStaticAnalyzer();
            setStaticAnalyzerProvider(mockStaticAnalyzer);
        });

        afterEach(() => {
            bundleStateManager.clear();
        });

        it('should only include diagnostics that target the primary file', () => {
            // Create a bundle with both JS and HTML files
            const jsContent = 'export default class Test {}';
            const htmlContent = '<template>Test</template>';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent, htmlContent);
            bundle.setPrimaryFileByContent(jsContent);
            bundleStateManager.addBundleState(bundle);

            // Set up mock diagnostics for both files
            const mockDiagnostics = [
                {
                    code: {
                        value: 'TEST_RULE',
                        target: { path: 'test.js' }
                    },
                    message: 'Test message for JS file',
                    range: {
                        start: { line: 0, character: 0 },
                        end: { line: 0, character: 10 }
                    }
                },
                {
                    code: {
                        value: 'TEST_RULE',
                        target: { path: 'test.html' }
                    },
                    message: 'Test message for HTML file',
                    range: {
                        start: { line: 0, character: 0 },
                        end: { line: 0, character: 10 }
                    }
                }
            ];
            mockStaticAnalyzer.setDiagnostics(mockDiagnostics);

            // Set up mock diagnostic messages
            mockStaticAnalyzer.setDiagnosticMessages({
                TEST_RULE: {
                    code: { value: 'TEST_RULE' }
                }
            });

            const bundleKey = bundle.getBundleKey();
            const reports = getKomaciReport(
                '@salesforce/lwc-graph-analyzer/test-rule',
                `0_${bundleKey}`
            );

            // Should only include the diagnostic for the primary file (test.js)
            expect(reports).to.have.length(1);
            expect(reports[0].message).to.equal('Test message for JS file');
        });

        it('should handle cases where no diagnostics match the primary file', () => {
            // Create a bundle with both JS and HTML files
            const jsContent = 'export default class Test {}';
            const htmlContent = '<template>Test</template>';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent, htmlContent);
            bundle.setPrimaryFileByContent(jsContent);
            bundleStateManager.addBundleState(bundle);

            // Set up mock diagnostics only for the HTML file
            const mockDiagnostics = [
                {
                    code: {
                        value: 'TEST_RULE',
                        target: { path: 'test.html' }
                    },
                    message: 'Test message for HTML file',
                    range: {
                        start: { line: 0, character: 0 },
                        end: { line: 0, character: 10 }
                    }
                }
            ];
            mockStaticAnalyzer.setDiagnostics(mockDiagnostics);

            // Set up mock diagnostic messages
            mockStaticAnalyzer.setDiagnosticMessages({
                TEST_RULE: {
                    code: { value: 'TEST_RULE' }
                }
            });

            const bundleKey = bundle.getBundleKey();
            const reports = getKomaciReport(
                '@salesforce/lwc-graph-analyzer/test-rule',
                `0_${bundleKey}`
            );

            // Should return empty array since no diagnostics target the primary file
            expect(reports).to.have.length(0);
        });

        it('should return empty array when no bundle is found', () => {
            // Don't add any bundles to the state manager
            const reports = getKomaciReport(
                '@salesforce/lwc-graph-analyzer/test-rule',
                '0_nonexistent-bundle'
            );

            expect(reports).to.be.an('array').that.is.empty;
        });

        it('should return empty array when no matching diagnostic message is found', () => {
            // Create a bundle with both JS and HTML files
            const jsContent = 'export default class Test {}';
            const htmlContent = '<template>Test</template>';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent, htmlContent);
            bundle.setPrimaryFileByContent(jsContent);
            bundleStateManager.addBundleState(bundle);

            // Set up mock diagnostics
            const mockDiagnostics = [
                {
                    code: {
                        value: 'TEST_RULE',
                        target: { path: 'test.js' }
                    },
                    message: 'Test message for JS file',
                    range: {
                        start: { line: 0, character: 0 },
                        end: { line: 0, character: 10 }
                    }
                }
            ];
            mockStaticAnalyzer.setDiagnostics(mockDiagnostics);

            // Don't set up any diagnostic messages, so no match will be found
            mockStaticAnalyzer.setDiagnosticMessages({});

            const bundleKey = bundle.getBundleKey();
            const reports = getKomaciReport(
                '@salesforce/lwc-graph-analyzer/test-rule',
                `0_${bundleKey}`
            );

            expect(reports).to.be.an('array').that.is.empty;
        });
    });
});
