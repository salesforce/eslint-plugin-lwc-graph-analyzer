/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/* eslint-disable no-undef */
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import foo from 'badNamespace';

export default class Example extends LightningElement {
    @api
    recordId;

    blah;

    get invalidGetter() {
        this.blah = "I'm not valid" + foo;
        return this.blah;
    }

    @wire(getRecord, { recordId: '$recordId', layoutTypes: ['Full'], modes: ['View'] })
    record = {};
}
