/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { expect } = require('chai');
const bundleStateManager = require('../../../lib/util/bundle-state-manager');
const LwcBundle = require('../../../lib/lwc-bundle');

describe('BundleStateManager', () => {
    beforeEach(() => {
        bundleStateManager.clear();
    });

    describe('addBundleState', () => {
        it('should add a bundle with js file as primary', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent);
            bundle.setPrimaryFileByContent(jsContent);

            const key = bundleStateManager.addBundleState(bundle);
            expect(key).to.equal(bundle.getBundleKey());
            expect(bundleStateManager.getBundleByKey(bundle.getBundleKey())).to.equal(bundle);
        });

        it('should add a bundle with html file as primary', () => {
            const htmlContent = '<template></template>';
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent, htmlContent);
            bundle.setPrimaryFileByContent(htmlContent);

            const key = bundleStateManager.addBundleState(bundle);
            expect(key).to.equal(bundle.getBundleKey());
            expect(bundleStateManager.getBundleByKey(bundle.getBundleKey())).to.equal(bundle);
        });

        it('should return defined key when bundle has js file', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent);
            const key = bundleStateManager.addBundleState(bundle);
            expect(key).to.not.be.undefined;
        });
    });

    describe('getBundleByKey', () => {
        it('should return bundle when key matches', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent);
            bundle.setPrimaryFileByContent(jsContent);
            bundleStateManager.addBundleState(bundle);

            const foundBundle = bundleStateManager.getBundleByKey(bundle.getBundleKey());
            expect(foundBundle).to.equal(bundle);
        });

        it('should return undefined when no matching bundle found', () => {
            const bundle = bundleStateManager.getBundleByKey('non-matching-key');
            expect(bundle).to.be.undefined;
        });
    });

    describe('removeBundleState', () => {
        it('should remove bundle when key matches', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent);
            bundle.setPrimaryFileByContent(jsContent);
            bundleStateManager.addBundleState(bundle);

            const removed = bundleStateManager.removeBundleState(bundle);
            expect(removed).to.be.true;
            expect(bundleStateManager.getBundleByKey(bundle.getBundleKey())).to.be.undefined;
        });

        it('should return false when bundle has no primary file', () => {
            const bundle = LwcBundle.lwcBundleFromContent('test', 'js content', 'html content');
            const removed = bundleStateManager.removeBundleState(bundle);
            expect(removed).to.be.false;
        });

        it('should return false when bundle not found', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent);
            bundle.setPrimaryFileByContent(jsContent);

            const removed = bundleStateManager.removeBundleState(bundle);
            expect(removed).to.be.false;
        });
    });

    describe('clear', () => {
        it('should remove all bundles from state', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent);
            bundle.setPrimaryFileByContent(jsContent);
            bundleStateManager.addBundleState(bundle);

            bundleStateManager.clear();
            expect(bundleStateManager.getBundleByKey(bundle.getBundleKey())).to.be.undefined;
        });
    });
});
