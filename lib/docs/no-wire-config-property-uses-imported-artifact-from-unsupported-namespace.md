# no-wire-config-property-uses-imported-artifact-from-unsupported-namespace

This rule flags wire configurations that reference an imported artifact that’s not from a supported resource. To resolve this error, make sure that the wires reference only supported and valid resources, such as artifacts imported from `@salesforce/*`.

## ❌ Incorrect

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import invalid from 'x/invalid';

export default class Example extends LightningElement {
    @wire(getRecord, { label: invalid })
    records;
}

```

## ✅ Correct

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import label from '@salesforce/label/My.Label';

export default class Example extends LightningElement {
    @wire(getRecord, { recordId: label })
    records;
}

```