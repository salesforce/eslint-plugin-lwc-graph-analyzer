# no-member-expression-reference-to-unsupported-namespace-reference

This rule flags expressions that reference a module that isn’t supported. To resolve this error, make sure to reference modules that are imported from a Salesforce package.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
import invalid from 'x/invalid';
export default class Example extends LightningElement {
    get value() {
        return invalid.foo;
    }

    str = `${invalid.foo}`;
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {}

```