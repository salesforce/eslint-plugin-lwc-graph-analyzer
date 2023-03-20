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
    '@salesforce/lwc-graph-analyzer/no-wire-config-property-uses-imported-artifact-from-unsupported-namespace',
    allRules.rules['no-wire-config-property-uses-imported-artifact-from-unsupported-namespace'],
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
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `This wire configuration uses an imported artifact 'getBlah' from an unsupported namespace 'nothing/uiObjectInfoApi'.`
                    }
                ]
            }
        ]
    }
);
