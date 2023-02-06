# no-eval-usage

This rule flags getters that use the `eval` function. To resolve this error, review the getter and refactor it to remove the `eval` function.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    get invalid() {
        return eval('something evil');
    }
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    get valid() {
        return 'do no evil';
    }
}

```