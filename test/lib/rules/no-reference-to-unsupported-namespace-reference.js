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
    '@salesforce/lwc-graph-analyzer/no-reference-to-unsupported-namespace-reference',
    allRules.rules['no-reference-to-unsupported-namespace-reference'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                import { bobo } from 'kurtis/dogs';
                import NAME_FIELD from '@salesforce/schema/Account.Name';
                
                export default class ScriptTestClass extends LightningElement {
                    get input() {
                        return bobo;
                    }
                
                    get nameField() {
                        return NAME_FIELD;
                    }
                
                    @wire(getRecord, { recordIds: '$input' })
                    record1;
                
                    @wire(getRecord, { recordIds: '0001', field: '$nameField' })
                    record2;
                }`,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `Reference to import 'bobo' from an unsupported namespace is not allowed`
                    }
                ]
            }
        ]
    }
);
