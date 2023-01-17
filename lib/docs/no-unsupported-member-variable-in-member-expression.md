# no-unsupported-member-variable-in-member-expression

This rule flags getter or template expressions that reference an unsupported or private member variable. To resolve this error, review the member variable definition and make sure that it’s public. 

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    privateProp; // unsupported member variable

    get value() {
        return this.privateProp; // flags
    }

    otherValue = `${this.privateProp}`; // flags
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    @api prop;

    get value() {
        return this.prop;
    }

    otherValue = `${this.prop}`;
}

```