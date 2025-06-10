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
    '@salesforce/lwc-graph-analyzer/no-eval-usage',
    lwcGraphAnalyzer.rules['no-eval-usage'],
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
                        // invalid getter - portability - contains 'eval' reference
                        eval("alert('this is executed by eval()')");
                        const recordName = this.record?.data?.Fields?.name;
                        if (recordName) {
                            return '%' + recordName + '%';
                        }
                        return 'Default Search Key';
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
                }`,
                filename: 'lwc-code.js',
                errors: [
                    {
                        message: `This call expression contains a non-portable identifier: 'eval'.`
                    }
                ]
            }
        ]
    }
);
