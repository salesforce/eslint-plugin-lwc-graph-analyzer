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
    '@salesforce/lwc-graph-analyzer/no-wire-configuration-property-using-output-of-non-primeable-wire',
    allRules.rules['no-wire-configuration-property-using-output-of-non-primeable-wire'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, track, wire } from 'lwc';
                import { getLayout } from 'lightning/uiLayoutApi';
                import { getObjectInfo } from 'lightning/uiObjectInfoApi';
                import { getRecordAvatars } from 'lightning/uiRecordAvatarApi';
                import { getRecord } from 'lightning/uiRecordApi';
                
                // the wires are all primeable in this case (this does not have circular reference)
                export default class App extends LightningElement {
                    // lack of @api annotation indicates title is a private property
                    @track
                    title = 'Welcome to Lightning Web Components Playground!';
                
                    @track
                    showFeatures = true;
                
                    // This is primeable, since the wire adapter is valid and the config prop is,
                    // public (definition is annotated with @api)
                    @wire(getLayout, { input: '$title' })
                    wiredOutput1;
                
                    @wire(getObjectInfo, { input: '$wiredOutput1.data', input2: '$wiredOutput2.data' })
                    wiredOutput4;
                
                    @wire(getRecordAvatars, { input: '$wiredOutput1.data' })
                    wiredOutput2;
                
                    @wire(getRecord, {
                        input: '$wiredOutput1.data',
                        input2: '$wiredOutput2.data',
                        input4: '$wiredOutput4.data',
                    })
                    wiredOutput3;
                }`,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `This wire configuration uses a property 'wiredOutput1' that’s the output of a wire that can’t be primed for offline use or caching.`
                    },
                    {
                        message: `This wire configuration uses a property 'wiredOutput2' that’s the output of a wire that can’t be primed for offline use or caching.`
                    },
                    {
                        message: `This wire configuration uses a property 'wiredOutput1' that’s the output of a wire that can’t be primed for offline use or caching.`
                    },
                    {
                        message: `This wire configuration uses a property 'wiredOutput1' that’s the output of a wire that can’t be primed for offline use or caching.`
                    },
                    {
                        message: `This wire configuration uses a property 'wiredOutput2' that’s the output of a wire that can’t be primed for offline use or caching.`
                    },
                    {
                        message: `This wire configuration uses a property 'wiredOutput4' that’s the output of a wire that can’t be primed for offline use or caching.`
                    }
                ]
            }
        ]
    }
);
