# no-getter-contains-more-than-return-statement

This rule flags getters that do more than just return a value. To resolve this error, review the getters and make sure that they’re composed to only return a value. 

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    get invalidGetter() {
        const val = 'val';
        return val;
    }
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    get invalidGetter() {
        return 'val';
    }
}

```
