/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    get unresolvableGetter() {
        return 5 + 5;
    }

    get features() {
        const chips = [];
        chips.push({
            label: 'label',
            icon: 'icon'
        });
        return chips;
    }
}
