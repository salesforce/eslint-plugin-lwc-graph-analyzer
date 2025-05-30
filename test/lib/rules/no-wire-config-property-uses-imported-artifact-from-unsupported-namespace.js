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
    '@salesforce/lwc-graph-analyzer/no-wire-config-property-uses-imported-artifact-from-unsupported-namespace',
    lwcGraphAnalyzer.rules[
        'no-wire-config-property-uses-imported-artifact-from-unsupported-namespace'
    ],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire, api } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                import { getBlah } from 'nothing/uiObjectInfoApi';
                export default class Example extends LightningElement {
                    @api
                    recordId;
                
                    @wire(getRecord, { recordId: getBlah })
                    records;
                }`,
                filename: {
                    filename: 'lwc-code.js',
                    preprocess: bundleAnalyzer.preprocess,
                    postprocess: bundleAnalyzer.postprocess
                },
                errors: [
                    {
                        message: `This wire configuration uses an imported artifact 'getBlah' from an unsupported namespace 'nothing/uiObjectInfoApi'.`
                    }
                ]
            }
        ]
    }
);
