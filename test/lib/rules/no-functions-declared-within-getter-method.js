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
    '@salesforce/lwc-graph-analyzer/no-functions-declared-within-getter-method',
    allRules.rules['no-functions-declared-within-getter-method'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire, track } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                import findContacts from '@salesforce/apex/ContactController.findContacts';

                export default class Example extends LightningElement {
                    get searchKey() {
                        return 'Default Search Key' + function (x, y) {
                            return x + y;
                        };
                    }

                    get recordId() {
                        // valid getter
                        return 'a07EE00000Q4nrLYAR';
                    }

                    get myContactName() {
                        // valid getter
                        return 'Jay Wright';
                    }

                    @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
                    record = {};

                    @wire(findContacts, { searchKey: '$searchKey' })
                    contacts;

                    myProp;
                }`,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `Functions may not be declared within a getter method`
                    }
                ]
            }
        ]
    }
);
