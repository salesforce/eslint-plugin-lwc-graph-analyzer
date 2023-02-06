# no-assignment-expression-assigns-value-to-member-variable

 This rule flags getters in custom components that mutate properties, which prevents the static analyzer from being able to determine a value for the property when priming. To resolve this error, don’t assign or mutate member variables in your getter functions.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    prop;
    get input() {
        const value = 'value';
        this.prop = value;
        return value;
    }
}
```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    prop;
    get input() {
        return 'value';
    }
}
```


