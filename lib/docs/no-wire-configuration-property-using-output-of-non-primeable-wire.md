# no-wire-configuration-property-using-output-of-non-primeable-wire

This rule flags wire configurations that reference the output of a wire that can’t be analyzed. This rule flags any wire that uses input from another wire that can’t be primed for offline use or caching. To resolve this error, review the related wires to make sure they’re known and valid. 

## ❌ Incorrect

```javascript
import { LightningElement, wire, api } from 'lwc';
import { invalid } from 'x/invalid';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class Example extends LightningElement {
    // This wire is invalid because of another rule, such as no-wire-adapter-of-resource-cannot-be-primed, so its associated property can’t be referenced by another wire
    @wire(invalid, {}) 
    wiredOutput1;

    // Since "invalid" is not primable, its output "wiredOutput1.data" 
    // cannot be used as input in another wire
    @wire(getObjectInfo, { input: '$wiredOutput1.data' })
    wiredOutput2;
}
```

## ✅ Correct

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class Example extends LightningElement {
    // "getRecord" from "lightning/uiRecordApi" is a known wire, and 
    // thus primeable
    @wire(getRecord, {})
    wiredOutput1;

    // valid
    @wire(getObjectInfo, { input: '$wiredOutput1.data' })
    wiredOutput2;
}
```
