# no-missing-resource-cannot-prime-wire-adapter

This rule flags wire adapters that refer to a resource that isn’t defined. To resolve this error, review the referenced resource and make sure that the resource is imported or defined correctly. 

## ❌ Incorrect

```javascript
import { LightningElement, wire } from 'lwc';

export default class ScriptTestClass extends LightningElement {
    // getRecord has not been imported
    @wire(getRecord, {})
    record;
}
```

## ✅ Correct

```javascript
import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class ScriptTestClass extends LightningElement {
    @wire(getRecord, {})
    record;
}
```