# no-render-function-return-statement

This rule flags render functions that don’t have a return statement. To resolve this error, review the functions and make sure that they’re composed with a return statement. 


## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    render() {
        const val = 'val';
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
