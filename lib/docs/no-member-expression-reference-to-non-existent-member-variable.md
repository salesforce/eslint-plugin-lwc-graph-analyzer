# no-member-expression-reference-to-non-existent-member-variable

This rule flags expressions that reference a member variable that’s not defined. To resolve this error, review the member variable and make sure that it’s defined correctly.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    get value() {
        return this.doesNotExist;
    }

    otherValue = `${this.doesNotExist}`;
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    @api doesExist;
    get value() {
        return this.doesExist;
    }

    otherValue = `${this.doesExist}`;
}

```