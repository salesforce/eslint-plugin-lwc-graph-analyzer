# no-wire-config-property-uses-getter-function-returning-inaccessible-import

This rule flags wire configurations using a getter that imports an unknown resource. To resolve this error, make sure that the wires are importing only known and valid resources, such as resources imported from `@salesforce/*`. 

## ❌ Incorrect

```javascript
import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { invalid } from 'x/invalid';

export default class ScriptTestClass extends LightningElement {
    get label() {
        return invalid;
    }

    @wire(getRecord, { label: '$label' })
    record1;
}
```

## ✅ Correct

```javascript
import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import myLabel from '@salesforce/label/My.Label';

export default class ScriptTestClass extends LightningElement {
    get label() {
        return myLabel;
    }

    @wire(getRecord, { label: '$label' })
    record1;
}
```