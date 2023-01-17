# no-wire-config-references-non-local-property-reactive-value

This rule flags wire configurations with reactive values (‘`$prop`’) that are not local properties. Wire configurations with reactive values must reference only component properties. To resolve this error, review the reactive values and make sure that they don’t reference imported values, or other values defined outside of the component’s class. Alternatively, you can wrap the imported artifact delivery in a local property getter function.

## ❌ Incorrect

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import label from '@salesforce/label/My.Label';

export default class Example extends LightningElement {
    @wire(getRecord, { recordId: '$label' })
    records;
}

```

## ✅ Correct

Reference the value directly.

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import label from '@salesforce/label/My.Label';

export default class Example extends LightningElement {
    @wire(getRecord, { recordId: label })
    records;
}

```

Or, set the value to a property before referencing the value.

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import label from '@salesforce/label/My.Label';

export default class Example extends LightningElement {
    @api label;
    @wire(getRecord, { recordId: '$label' })
    records;
}

```

Or, use a getter that returns the value.

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import label from '@salesforce/label/My.Label';

export default class Example extends LightningElement {
    get label() {
        return label;
    }
    @wire(getRecord, { recordId: '$label' })
    records;
}

```
