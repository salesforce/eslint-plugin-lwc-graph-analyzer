# no-render-function-contains-more-than-return-statement

This rule flags render functions that do more than just return a value. To resolve this error, review the functions and make sure that they’re composed to only return a value. 


## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
import template from './tesTemplate.html';
export default class Example extends LightningElement {
    render() {
        const val = 'val';
        return val ? template : undefined;
    }
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
import template from './tesTemplate.html';
export default class Example extends LightningElement {
    render() {
        return template;
    }
}

```
