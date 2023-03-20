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
    '@salesforce/lwc-graph-analyzer/no-call-expression-references-unsupported-namespace',
    allRules.rules['no-call-expression-references-unsupported-namespace'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                import { testFunction } from 'test/functoins/testFunctoins';
                const testFunc1 = () => 'dog';
                
                export default class Example extends LightningElement {
                    @api
                    recordId;

                    get searchKey() {
                        const recordName = this.record?.data?.Fields?.name;
                        
                        let testVar = testFunction(); //invalid bc import from unsupported ns
                        if(recordName) {
                            return '%' + recordName + '%';
                        }
                        let test = testFunc1(); //invalid bc function defined anonymously
                        return 'Default Search Key';
                    }

                    @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
                    record = {};

                    @wire(findContacts, { searchKey: '$searchKey' })
                    contacts;

                    testFunc2() {
                        return 'foo';
                    }
                }`,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `This call expression references an unsupported namespace: 'testFunction'.`
                    }
                ]
            }
        ]
    }
);
