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
    '@salesforce/lwc-graph-analyzer/no-missing-resource-cannot-prime-wire-adapter',
    lwcGraphAnalyzer.rules['no-missing-resource-cannot-prime-wire-adapter'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire } from 'lwc';

                export default class ScriptTestClass extends LightningElement {
                    /* eslint-disable no-undef */
                    @wire(getRecord, {})
                    record;
                }`,
                filename: 'lwc-code.js',
                errors: [
                    {
                        message: `This wire adapter can’t be primed because it refers to a missing resource.`
                    }
                ]
            }
        ]
    }
);
