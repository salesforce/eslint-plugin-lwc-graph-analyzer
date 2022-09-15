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
    '@salesforce/lwc-graph-analyzer/no-missing-resource-cannot-prime-wire-adapter',
    allRules.rules['no-missing-resource-cannot-prime-wire-adapter'],
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
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `The wire adapter cannot be primed because it refers to a missing resource`
                    }
                ]
            }
        ]
    }
);
