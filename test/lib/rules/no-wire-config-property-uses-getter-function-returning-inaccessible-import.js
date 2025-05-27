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
    '@salesforce/lwc-graph-analyzer/no-wire-config-property-uses-getter-function-returning-inaccessible-import',
    lwcGraphAnalyzer.rules[
        'no-wire-config-property-uses-getter-function-returning-inaccessible-import'
    ],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                import { bobo } from 'kurtis/dogs';
                import NAME_FIELD from '@salesforce/schema/Account.Name';
                
                export default class ScriptTestClass extends LightningElement {
                    get input() {
                        return bobo;
                    }
                
                    get nameField() {
                        return NAME_FIELD;
                    }
                
                    @wire(getRecord, { recordIds: '$input' })
                    record1;
                
                    @wire(getRecord, { recordIds: '0001', field: '$nameField' })
                    record2;
                }`,
                filename: {
                    filename: 'lwc-code.js',
                    preprocess: bundleAnalyzer.preprocess,
                    postprocess: bundleAnalyzer.postprocess
                },
                errors: [
                    {
                        message: `This wire configuration uses a property from a getter function named 'input' that returns an inaccessible import.`
                    }
                ]
            }
        ]
    }
);
