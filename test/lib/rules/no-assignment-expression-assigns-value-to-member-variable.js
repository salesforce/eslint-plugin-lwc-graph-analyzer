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
    '@salesforce/lwc-graph-analyzer/no-assignment-expression-assigns-value-to-member-variable',
    lwcGraphAnalyzer.rules['no-assignment-expression-assigns-value-to-member-variable'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire, api } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                
                export default class Example extends LightningElement {
                    @api
                    recordId;
                
                    blah = 'temp';
                
                    get invalidGetter() {
                        this.blah = "I'm not valid";
                        return blah;
                    }
                
                    @wire(getRecord, {
                        recordId: '$recordId',
                        other: '$invalidGetter',
                        layoutTypes: ['Full'],
                        modes: ['View'],
                    })
                    record = {};
                }`,
                filename: 'lwc-code.js',
                errors: [
                    {
                        message: `This assignment expression can’t assign a value to the member variable 'blah'.`
                    }
                ]
            }
        ]
    }
);
