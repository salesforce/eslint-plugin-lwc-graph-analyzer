/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { RuleTester } = require('eslint');
const { RULE_TESTER_CONFIG } = require('./shared');
const lwcGraphAnalyzer = require('../../../lib/index');
const ruleTester = new RuleTester(RULE_TESTER_CONFIG);

ruleTester.run(
    '@salesforce/lwc-graph-analyzer/no-unresolved-parent-class-reference',
    lwcGraphAnalyzer.rules['no-unresolved-parent-class-reference'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { api } from 'lwc';

                /* eslint-disable no-undef */
                export default class ScriptTestClass extends Foo {
                    /* eslint-disable no-undef */
                    @api testProp;
                }`,
                filename: 'lwc-code.js',
                errors: [
                    {
                        message: `This class references a parent class that can’t be resolved.`
                    }
                ]
            }
        ]
    }
);
