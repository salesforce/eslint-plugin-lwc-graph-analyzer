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
    '@salesforce/lwc-graph-analyzer/no-wire-config-references-non-local-property-reactive-value',
    lwcGraphAnalyzer.rules['no-wire-config-references-non-local-property-reactive-value'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, api, wire } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                // eslint-disable-next-line no-unused-vars
                import { GetData } from 'c/myData';
                export default class Example extends LightningElement {
                    @api recordId1;
                
                    @wire(getRecord, { recordId: '$recordId1', prop2: '$recordId1.data.id' })
                    record1(value) {
                        console.log(value);
                    }
                
                    @wire(getRecord, { recordId: '$GetData' })
                    record2(value) {
                        console.log(value);
                    }
                }`,
                filename: {
                    filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                    preprocess: bundleAnalyzer.preprocess,
                    postprocess: bundleAnalyzer.postprocess
                },
                errors: [
                    {
                        message: `This wire configuration references a reactive value 'GetData' that’s not a local property.`
                    }
                ]
            }
        ]
    }
);
