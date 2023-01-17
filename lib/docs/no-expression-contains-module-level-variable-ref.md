# no-expression-contains-module-level-variable-ref

This rule flags getters that reference a variable defined at the module level. To resolve this error, remove the variable from the module level. 

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
const moduleValue = 'val';
export default class Example extends LightningElement {
    get invalid() {
        return moduleValue;
    }
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    get propValue() {
        return 'val';
    }
    get valid() {
        return this.propValue;
    }
}

```
