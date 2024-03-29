/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { RuleTester } = require('eslint');
const { RULE_TESTER_CONFIG } = require('./shared');
const allRules = require('../../../lib/index');
const ruleTester = new RuleTester(RULE_TESTER_CONFIG);

ruleTester.run(
    '@salesforce/lwc-graph-analyzer/no-class-refers-to-parent-class-from-unsupported-namespace',
    allRules.rules['no-class-refers-to-parent-class-from-unsupported-namespace'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { Foo } from './foo';

                export default class ScriptTestClass extends Foo {}
                `,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `This class refers to a parent class from an unsupported namespace.`
                    }
                ]
            }
        ]
    }
);
