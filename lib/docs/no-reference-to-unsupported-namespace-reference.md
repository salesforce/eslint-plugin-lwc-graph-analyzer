# no-reference-to-unsupported-namespace-reference

This rule flags expressions that use a resource imported from an unsupported namespace. To resolve this error, review the imported resources and make sure that they’re imported from supported namespaces like `@salesforce/*`.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
import invalid from 'x/invalid';
export default class Example extends LightningElement {
    get value() {
        return invalid;
    }
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
import valid from '@salesforce/label/My.Label';
export default class Example extends LightningElement {
    get value() {
        return valid;
    }
}

```