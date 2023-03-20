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
    '@salesforce/lwc-graph-analyzer/no_wire_adapter_of_resource_cannot_be_primed',
    allRules.rules['no-wire-adapter-of-resource-cannot-be-primed'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire, api } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                import { invalidWire } from 'lightning/uiAppsApi';
                import findContacts from '@salesforce/apex/ContactController.findContacts';

                const FIELDS = ['Account.name', 'Account.address'];

                export default class Example extends LightningElement {
                    @api
                    record;

                    @api
                    recordId;

                    get searchKey() {
                        const recordName = this.record?.data?.Fields?.name;

                        if (recordName) {
                            return '%' + recordName + '%';
                        }
                        return 'Default Search Key';
                    }

                    @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
                    record(value) {
                        console.log(value);
                    }

                    @wire(getRecord, { recordId: '$record.data.id', fields: FIELDS })
                    record2;

                    @wire(findContacts, { searchKey: '$record.data.something' })
                    contacts;

                    @wire(invalidWire, { id: '6xeffa27' })
                    badRecords;
                }`,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `The wire adapter 'invalidWire' of resource 'lightning/uiAppsApi' can’t be primed.`
                    }
                ]
            }
        ]
    }
);
