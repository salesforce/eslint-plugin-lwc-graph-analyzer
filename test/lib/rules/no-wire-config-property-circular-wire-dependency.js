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
    '@salesforce/lwc-graph-analyzer/no-wire-config-property-circular-wire-dependency',
    allRules.rules['no-wire-config-property-circular-wire-dependency'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, track, wire } from 'lwc';
                import { getLayout } from 'lightning/uiLayoutApi';
                import { getObjectInfo, getObjectInfos } from 'lightning/uiObjectInfoApi';
                import { getRecordAvatars } from 'lightning/uiRecordAvatarApi';
                import { getRecord } from 'lightning/uiRecordApi';
                
                // has 2 circular references: 3->4->1->3, 4->2->1->4
                export default class App extends LightningElement {
                    // lack of @api annotation indicates title is a private property
                    @track
                    title = 'Welcome to Lightning Web Components Playground!';
                
                    @track
                    showFeatures = true;
                
                    @wire(getLayout, { input: '$wiredOutput3', input2: '$wiredOutput4' })
                    wiredOutput1;
                
                    @wire(getObjectInfo, { input: '$wiredOutput1.data', input2: '$wiredOutput2.data' })
                    wiredOutput4;
                
                    @wire(getObjectInfos, { objectApiNames: ['Account', 'Case'] })
                    wiredOutput5;
                
                    @wire(getRecordAvatars, { input: '$wiredOutput1.data', input5: '$wiredOutput5.data' })
                    wiredOutput2;
                
                    @wire(getRecord, {
                        input4: '$wiredOutput4.data',
                    })
                    wiredOutput3;
                }`,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `This input property is part of circular wire dependencies in this chain: 'wiredOutput3->wiredOutput4->wiredOutput1->wiredOutput3'.`
                    }
                ]
            }
        ]
    }
);
