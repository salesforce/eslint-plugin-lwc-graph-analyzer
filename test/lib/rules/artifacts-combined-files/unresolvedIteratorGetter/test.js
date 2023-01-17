/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    prop = ['prop'];

    get unresolvableGetter() {
        this.prop = 'food';
        return this.prop;
    }
}
