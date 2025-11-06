/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const { Linter } = require('eslint');
const lwcGraphAnalyzer = require('../../../lib/index');
const bundleAnalyzer = require('../../../lib/processor');
const baseConfig = require('../../../lib/configs/base');

/**
 * Test to verify programmatic linting of both HTML and JS content at runtime
 * using setLwcBundleFromContent() approach
 */
describe('Programmatic Bundle Linting', () => {
    it('should lint both HTML and JS files with runtime content', () => {
        // Create JS content with a getter that violates the rule
        // The getter has more than just a return statement AND is referenced in the template
        const jsContent = `
import { LightningElement, track } from 'lwc';

export default class TestComponent extends LightningElement {
    data = [];

    @track
    descriptionValue = '';

    get displayValue() {
        const value = this.data[0];
        if (value) {
            return value.name;
        }
        return 'N/A';
    }

    handleDescriptionInputChange(event) {
        this.descriptionValue = event.detail.value;
    }
    
}`;

        // HTML content that references the getter
        const htmlContent = `<template>
        <div>{displayValue}</div>
        <lightning-input
            type="text"
            label="Description"
            value={descriptionValue}
            onchange={handleDescriptionInputChange}
        ></lightning-input>
</template>`;

        // 1. Set up the bundle with all content
        bundleAnalyzer.setLwcBundleFromContent(
            'testComponent', // component base name
            jsContent, // JS content
            htmlContent // HTML content
        );

        // 2. Configure ESLint with the rule that has violations in both files
        const pluginPrefix = '@salesforce/lwc-graph-analyzer';
        const config = {
            ...baseConfig,
            plugins: { [pluginPrefix]: lwcGraphAnalyzer },
            rules: {
                [`${pluginPrefix}/no-getter-contains-more-than-return-statement`]: 'error',
                [`${pluginPrefix}/no-composition-on-unanalyzable-property-non-public`]: 'error'
            }
        };

        const linter = new Linter();

        // 3. Lint JS file
        const jsErrors = linter.verify(jsContent, config, {
            filename: 'testComponent.js'
        });

        // 4. Set up the bundle with all content again since the bundle is cleared after each lint call
        bundleAnalyzer.setLwcBundleFromContent(
            'testComponent', // component base name
            jsContent, // JS content
            htmlContent // HTML content
        );

        // Verify we got violations for the JS file
        // The displayValue getter violates the rule because it's referenced in HTML
        expect(jsErrors.length).toBeGreaterThan(0);
        const jsViolation = jsErrors.find(
            (err) =>
                err.ruleId ===
                '@salesforce/lwc-graph-analyzer/no-getter-contains-more-than-return-statement'
        );
        expect(jsViolation).toBeDefined();
        expect(jsViolation.ruleId).toBe(
            '@salesforce/lwc-graph-analyzer/no-getter-contains-more-than-return-statement'
        );
        expect(jsViolation.message).toBe('Getters can only contain a return statement.');
        expect(jsViolation.line).toBeGreaterThan(0);
    });

    it('should return empty violations when no errors exist', () => {
        const jsContent = `
import { LightningElement } from 'lwc';
export default class MyComponent extends LightningElement {
    value = 'test';
}`;

        const htmlContent = `<template><div>{value}</div></template>`;

        bundleAnalyzer.setLwcBundleFromContent('myComponent', jsContent, htmlContent);

        const pluginPrefix = '@salesforce/lwc-graph-analyzer';
        const config = {
            ...baseConfig,
            plugins: { [pluginPrefix]: lwcGraphAnalyzer },
            rules: {
                [`${pluginPrefix}/no-getter-contains-more-than-return-statement`]: 'error'
            }
        };

        const linter = new Linter();

        const jsErrors = linter.verify(jsContent, config, {
            filename: 'myComponent.js'
        });

        // No violations expected since we're using a simple property, not a getter
        const jsViolations = jsErrors.filter(
            (err) =>
                err.ruleId ===
                '@salesforce/lwc-graph-analyzer/no-getter-contains-more-than-return-statement'
        );

        expect(jsViolations.length).toBe(0);
    });
});
