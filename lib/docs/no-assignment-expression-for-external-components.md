# no-assignment-expression-for-external-components

This rule flags assignment expressions with components created outside of a Salesforce namespace. These external components aren’t supported by assignment expressions.


## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    prop;
    get getter() {
        return (this.prop = 'hi'), this.prop;
    }
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    @api prop;
    get getter() {
        return this.prop;
    }
}

```
