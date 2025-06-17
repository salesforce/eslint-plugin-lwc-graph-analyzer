/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { RuleTester } = require('eslint');
const { RULE_TESTER_CONFIG } = require('./shared');
const lwcGraphAnalyzer = require('../../../lib/index');
const ruleTester = new RuleTester(RULE_TESTER_CONFIG);

ruleTester.run(
    '@salesforce/lwc-graph-analyzer/no-class-refers-to-parent-class-from-unsupported-namespace',
    lwcGraphAnalyzer.rules['no-class-refers-to-parent-class-from-unsupported-namespace'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { Foo } from './foo';

                export default class ScriptTestClass extends Foo {}
                `,
                filename: 'lwc-code.js',
                errors: [
                    {
                        message: `This class refers to a parent class from an unsupported namespace.`
                    }
                ]
            }
        ]
    }
);
