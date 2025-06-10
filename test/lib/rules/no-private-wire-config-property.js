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
const ruleTester = new RuleTester(RULE_TESTER_CONFIG);

ruleTester.run(
    '@salesforce/lwc-graph-analyzer/no-private-wire-config-property',
    lwcGraphAnalyzer.rules['no-private-wire-config-property'],
    {
        valid: [],
        invalid: [
            {
                code: `import { LightningElement, wire } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                export default class Example extends LightningElement {
                    recordId1;
                
                    @wire(getRecord, { recordId: '$recordId1', prop2: '$recordId1.data.id' })
                    record1(value) {
                        console.log(value);
                    }
                }`,
                filename: 'lwc-code.js',
                errors: [
                    {
                        message: `This wire configuration uses a property 'recordId1' that is private.`
                    },
                    {
                        message: `This wire configuration uses a property 'recordId1' that is private.`
                    }
                ]
            }
        ]
    }
);
