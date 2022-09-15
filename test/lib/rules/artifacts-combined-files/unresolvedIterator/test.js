/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, track, wire } from 'lwc';
import { getContacts } from 'lightning/contacts'; // bogus wire import

export default class App extends LightningElement {
    @track
    title = 'Welcome to Lightning Web Components Playground!';

    @wire(getContacts, {})
    contacts;
}
