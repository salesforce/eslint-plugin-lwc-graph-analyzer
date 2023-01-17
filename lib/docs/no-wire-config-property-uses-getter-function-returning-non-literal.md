# no-wire-config-property-uses-getter-function-returning-non-literal

This rule flags wire configurations using a getter that returns a non-literal value, which isn’t supported for static analysis. If the flagged component is intended for offline use, refactor the getter to return a literal value, or remove the getter that returns a non-literal value. 

## ❌ Incorrect

```javascript
import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
export default class Example extends LightningElement {
    prop; // unsupported
    get value() {
        return this.prop;
    }

    @wire(getRecord, { input: '$value' }) // flags
    record;
}
```

## ✅ Correct

```javascript
import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
export default class Example extends LightningElement {
    get value() {
    return "abcd1234";
    }
    }

    @wire(getRecord, { input: '$value' }) // flags
    record;
}

```