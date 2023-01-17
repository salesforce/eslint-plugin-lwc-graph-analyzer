# no-functions-declared-within-getter-method

This rule flags getters or template expressions that define a function. To resolve this error, remove the function that’s defined within the getter.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';

export default class Example extends LightningElement {
    get value() {
        return (() => 'value')(); // flags
    }

    str = `${(() => 'value')()}`; // flags
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';

export default class Example extends LightningElement {
    get value() {
        return 'value';
    }

    str = `value`;
}

```