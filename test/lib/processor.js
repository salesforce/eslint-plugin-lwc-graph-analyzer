/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { expect } = require('chai');
const bundleAnalyzer = require('../../lib/processor');
const LwcBundle = require('../../lib/lwc-bundle');

describe('BundleAnalyzer', () => {
    beforeEach(() => {
        bundleAnalyzer.lwcBundle = null;
    });

    describe('lwcBundle property', () => {
        it('should get and set lwcBundle', () => {
            const bundle = LwcBundle.lwcBundleFromContent('test', 'js content');
            bundleAnalyzer.lwcBundle = bundle;
            expect(bundleAnalyzer.lwcBundle).to.equal(bundle);
        });
    });

    describe('setLwcBundleFromContent', () => {
        it('should set bundle from js and html content', () => {
            const jsContent = 'export default class Test {}';
            const htmlContent = '<template></template>';
            bundleAnalyzer.setLwcBundleFromContent('test', jsContent, htmlContent);

            expect(bundleAnalyzer.lwcBundle).to.be.instanceof(LwcBundle);
            expect(bundleAnalyzer.lwcBundle.js.content).to.equal(jsContent);
            expect(bundleAnalyzer.lwcBundle.htmlTemplates[0].content).to.equal(htmlContent);
        });

        it('should set bundle from js content only', () => {
            const jsContent = 'export default class Test {}';
            bundleAnalyzer.setLwcBundleFromContent('test', jsContent);

            expect(bundleAnalyzer.lwcBundle).to.be.instanceof(LwcBundle);
            expect(bundleAnalyzer.lwcBundle.js.content).to.equal(jsContent);
            expect(bundleAnalyzer.lwcBundle.htmlTemplates).to.be.undefined;
        });

        it('should set bundle from html content only', () => {
            const htmlContent = '<template></template>';
            bundleAnalyzer.setLwcBundleFromContent('test', undefined, htmlContent);

            expect(bundleAnalyzer.lwcBundle).to.be.instanceof(LwcBundle);
            expect(bundleAnalyzer.lwcBundle.js).to.be.undefined;
            expect(bundleAnalyzer.lwcBundle.htmlTemplates[0].content).to.equal(htmlContent);
        });
    });

    describe('preprocess', () => {
        it('should process js file with existing bundle', () => {
            const jsContent = 'export default class Test {}';
            bundleAnalyzer.setLwcBundleFromContent('test', jsContent);
            bundleAnalyzer.lwcBundle.setPrimaryFileByContent(jsContent);

            const result = bundleAnalyzer.preprocess(jsContent, 'test.js');
            expect(result).to.have.length(1);
            expect(result[0].text).to.equal(jsContent);
            expect(result[0].filename).to.equal(bundleAnalyzer.lwcBundle.getBundleKey());
        });

        it('should process html file with existing bundle', () => {
            const htmlContent = '<template></template>';
            bundleAnalyzer.setLwcBundleFromContent('test', undefined, htmlContent);
            bundleAnalyzer.lwcBundle.setPrimaryFileByContent(htmlContent);

            const result = bundleAnalyzer.preprocess(htmlContent, 'test.html');
            expect(result).to.have.length(1);
            expect(result[0].text).to.equal('');
            expect(result[0].filename).to.equal(bundleAnalyzer.lwcBundle.getBundleKey());
        });

        it('should return empty array when no matching file found in bundle', () => {
            const jsContent = 'export default class Test {}';
            bundleAnalyzer.setLwcBundleFromContent('test', jsContent);

            const result = bundleAnalyzer.preprocess('non-matching content', 'test.js');
            expect(result).to.be.an('array').that.is.empty;
        });

        it('should create new bundle for programmatic content', () => {
            const jsContent = 'export default class Test {}';
            const result = bundleAnalyzer.preprocess(jsContent, 'test.js');

            expect(result).to.have.length(1);
            expect(result[0].text).to.equal(jsContent);
            expect(bundleAnalyzer.lwcBundle).to.be.instanceof(LwcBundle);
            expect(bundleAnalyzer.lwcBundle.js.content).to.equal(jsContent);
            expect(bundleAnalyzer.lwcBundle.primaryFile).to.equal(bundleAnalyzer.lwcBundle.js);
            expect(result[0].filename).to.equal(bundleAnalyzer.lwcBundle.getBundleKey());
        });
    });

    describe('postprocess', () => {
        it('should flatten messages and clear bundle state', () => {
            const jsContent = 'export default class Test {}';
            bundleAnalyzer.setLwcBundleFromContent('test', jsContent);
            bundleAnalyzer.lwcBundle.setPrimaryFileByContent(jsContent);

            const messages = [
                [{ ruleId: 'rule1', severity: 2 }],
                [{ ruleId: 'rule2', severity: 1 }]
            ];
            const result = bundleAnalyzer.postprocess(messages, 'test.js');

            expect(result).to.deep.equal([
                { ruleId: 'rule1', severity: 2 },
                { ruleId: 'rule2', severity: 1 }
            ]);
            expect(bundleAnalyzer.lwcBundle).to.be.null;
        });
    });

    describe('supportsAutofix', () => {
        it('should be true', () => {
            expect(bundleAnalyzer.supportsAutofix).to.be.true;
        });
    });
});
