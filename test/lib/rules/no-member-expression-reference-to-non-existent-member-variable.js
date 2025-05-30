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
    '@salesforce/lwc-graph-analyzer/no-member-expression-reference-to-non-existent-member-variable',
    lwcGraphAnalyzer.rules['no-member-expression-reference-to-non-existent-member-variable'],
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

                    get searchKey() {
                        const recordName = this.record?.data?.Fields?.name;
                        const tempVar = this.tempMemberVar;
                        
                        if(recordName) {
                            return '%' + recordName + '%';
                        }

                        return 'Default Search Key' + tempVar;
                    }

                    @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
                    record = {};

                    @wire(findContacts, { searchKey: '$searchKey' })
                    contacts;
                }`,
                filename: {
                    filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                    preprocess: bundleAnalyzer.preprocess,
                    postprocess: bundleAnalyzer.postprocess
                },
                errors: [
                    {
                        message: `This member expression references a member variable that doesn’t exist: 'tempMemberVar'.`
                    }
                ]
            }
        ]
    }
);
