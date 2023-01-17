# no-call-expression-references-unsupported-namespace

This rule flags getters that invoke a function from an unsupported import. Getters don’t support invoking functions. To resolve this error, review the getter and remove the invocation of functions.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
import invalid from 'x/invalid';
export default class Example extends LightningElement {
    get invalidGetter() {
        return invalid();
    }
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {}

```