# no-member-expression-reference-to-unsupported-global

This rule flags expressions that reference a global variable, such as `String` or `Object`. To resolve this error, refactor your code to remove the global variables.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    get value() {
        return new String.foo();
    }

    str = `${String.foo}`;
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {}

```
