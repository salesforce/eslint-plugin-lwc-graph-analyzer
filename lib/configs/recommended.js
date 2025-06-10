/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

module.exports = {
    extends: ['./configs/base'],
    overrides: [
        {
            files: ['*.html', '**/*.html', '*.js', '**/*.js'],
            processor: '@salesforce/lwc-graph-analyzer/bundleAnalyzer',
            rules: {
                '@salesforce/lwc-graph-analyzer/no-getter-contains-more-than-return-statement':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-assignment-expression-assigns-value-to-member-variable':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-wire-config-references-non-local-property-reactive-value':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-private-wire-config-property': 'warn',
                '@salesforce/lwc-graph-analyzer/no-unresolved-parent-class-reference': 'warn',
                '@salesforce/lwc-graph-analyzer/no-class-refers-to-parent-class-from-unsupported-namespace':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-reference-to-unsupported-namespace-reference':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-wire-config-property-uses-getter-function-returning-inaccessible-import':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-wire-config-property-uses-getter-function-returning-non-literal':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-wire-config-property-circular-wire-dependency':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-wire-configuration-property-using-output-of-non-primeable-wire':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-missing-resource-cannot-prime-wire-adapter':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-wire-config-property-uses-imported-artifact-from-unsupported-namespace':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-wire-adapter-of-resource-cannot-be-primed':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-unsupported-member-variable-in-member-expression':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-multiple-template-files': 'warn',
                '@salesforce/lwc-graph-analyzer/no-assignment-expression-for-external-components':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-tagged-template-expression-contains-unsupported-namespace':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-expression-contains-module-level-variable-ref':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-call-expression-references-unsupported-namespace':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-eval-usage': 'warn',
                '@salesforce/lwc-graph-analyzer/no-reference-to-class-functions': 'warn',
                '@salesforce/lwc-graph-analyzer/no-reference-to-module-functions': 'warn',
                '@salesforce/lwc-graph-analyzer/no-functions-declared-within-getter-method': 'warn',
                '@salesforce/lwc-graph-analyzer/no-member-expression-reference-to-non-existent-member-variable':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-member-expression-reference-to-unsupported-namespace-reference':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-member-expression-contains-non-portable-identifier':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-member-expression-reference-to-super-class':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-member-expression-reference-to-unsupported-global':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-composition-on-unanalyzable-getter-property':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-composition-on-unanalyzable-property-from-unresolvable-wire':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-composition-on-unanalyzable-property-missing':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-composition-on-unanalyzable-property-non-public':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-render-function-contains-more-than-return-statement':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-render-function-return-statement-not-returning-imported-template':
                    'warn',
                '@salesforce/lwc-graph-analyzer/no-render-function-return-statement': 'warn'
            }
        }
    ]
};
