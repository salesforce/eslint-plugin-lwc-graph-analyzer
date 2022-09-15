/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { track, wire, LightningElement } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class ScriptTestClass extends LightningElement {
    @track recordId;

    @wire(getRecord, { recordId: '$recordId', fields: ['Contact.Name', 'Contact.Phone'] })
    record = {};
}
