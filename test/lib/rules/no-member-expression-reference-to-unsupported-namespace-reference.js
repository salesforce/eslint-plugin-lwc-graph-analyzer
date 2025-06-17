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
    '@salesforce/lwc-graph-analyzer/no-member-expression-reference-to-unsupported-namespace-reference',
    lwcGraphAnalyzer.rules['no-member-expression-reference-to-unsupported-namespace-reference'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire, api } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                import { testObject} from 'test/objects/testObject'; 

                export default class Example extends LightningElement {
                    @api
                    recordId;

                    tempMemberVar

                    get searchKey() {
                        const recordName = this.record?.data?.Fields?.name;
                        
                        const tempVar = this.tempMemberVar //invalid;
                        
                        let testVar = testObject.testProperty; //invalid.

                        if(recordName) {
                            return '%' + recordName + '%';
                        }
                        return 'Default Search Key';
                    }

                    @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
                    record = {};

                    @wire(findContacts, { searchKey: '$searchKey' })
                    contacts;
                }`,
                filename: 'lwc-code.js',
                errors: [
                    {
                        message: `This member expression references an unsupported namespace: 'testObject'.`
                    }
                ]
            }
        ]
    }
);
