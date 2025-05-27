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
const bundleAnalyzer = lwcGraphAnalyzer.processors.bundleAnalyzer;
const ruleTester = new RuleTester(RULE_TESTER_CONFIG);

ruleTester.run(
    '@salesforce/lwc-graph-analyzer/no-assignment-expression-for-external-components',
    lwcGraphAnalyzer.rules['no-assignment-expression-for-external-components'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire, api } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                import findContacts from '@salesforce/apex/ContactController.findContacts';

                export default class Example extends LightningElement {
                    @api
                    recordId;

                    blah; 

                    get searchKey() {
                        const recordName = this.record?.data?.Fields?.name;
                        this.blah = "asdf";  //invalid for both assignemnt Expr and trying to reference an unsupported member var. 
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
                filename: {
                    filename: 'lwc-code.js',
                    preprocess: bundleAnalyzer.preprocess,
                    postprocess: bundleAnalyzer.postprocess
                },
                errors: [
                    {
                        message: `The assignment expression doesn’t support this component because the component is external to the Salesforce namespace.`
                    }
                ]
            }
        ]
    }
);
