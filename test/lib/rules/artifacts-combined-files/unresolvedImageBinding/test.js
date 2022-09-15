/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, api } from 'lwc';
import { sneaky } from 'snoop';
import PARTNER_LOGOS from '@salesforce/contentAssetUrl/PartnerLogos';

export default class WireFunction extends LightningElement {
    // resolvable properties
    @api
    thisPropUnused = 'there';

    @api
    testField = 'image.jpg';

    get myGetter() {
        return 'resolvable.jpg';
    }

    get goldPartnerLogoUrl() {
        return PARTNER_LOGOS + 'pathinarchive=images/gold_partner.png';
    }

    propUnresolvable = sneaky`normal string`; // unresolvable property

    @api
    otherUnr = 5 + 5; // unresolvable property
}
