# no-private-wire-config-property

This rule flags wire configurations that use a private property. Private properties in wire configurations aren’t resolvable. To resolve this error, make the property public or use a property that’s already public. 

## ❌ Incorrect

```javascript
import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class Example extends LightningElement {
    recordId;

    @wire(getRecord, { recordId: '$recordId' })
    record;
}
```

## ✅ Correct

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class Example extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId' })
    record;
}
```

## 😟 Limitations

Public properties decorated with `@api` can't be reassigned.

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class Example extends LightningElement {
    recordId; // recordId can't have the @api declaration because the property is mutated below

    connectedCallback() {
        this.recordId = '1234'; // Prevents recordId from being made public
    }

    @wire(getRecord, { recordId: '$recordId' })
    record;
}
```
