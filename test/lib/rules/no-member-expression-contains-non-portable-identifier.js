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
    '@salesforce/lwc-graph-analyzer/no-member-expression-contains-non-portable-identifier',
    allRules.rules['no-member-expression-contains-non-portable-identifier'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire, track } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                import findContacts from '@salesforce/apex/ContactController.findContacts';

                export default class Example extends LightningElement {
                    get recordId() {
                        // valid getter
                        return 'a07EE00000Q4nrLYAR';
                    }

                    get searchKey() {
                        return window.open();
                    }

                    @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
                    record = {};

                    @wire(findContacts, { searchKey: '$searchKey' })
                    contacts;
                }`,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `This member expression contains a non-portable identifier: 'window'.`
                    }
                ]
            }
        ]
    }
);
