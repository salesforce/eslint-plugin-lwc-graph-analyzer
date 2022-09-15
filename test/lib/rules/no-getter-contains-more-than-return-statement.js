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
    '@salesforce/lwc-graph-analyzer/no-getter-contains-more-than-return-statement',
    allRules.rules['no-getter-contains-more-than-return-statement'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                export default class Example extends LightningElement {
                    recordId;
                
                    get config() {
                        var foo = 'hello';
                        return foo;
                    }
                
                    get myObjLiteral() {
                        return {
                            prop1: 'prop1 value',
                            prop2: 'prop1 value',
                        };
                    }
                
                    @wire(getRecord, { recordId: '$config' })
                    record(value) {
                        console.log(value);
                    }
                
                    @wire(getRecord, { recordId: '$myObjLiteral.prop2' })
                    record2;
                }`,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `Supported getters can only contain a return statement`
                    }
                ]
            }
        ]
    }
);
