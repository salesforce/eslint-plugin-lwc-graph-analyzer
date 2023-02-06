# no-render-function-return-statement-not-returning-imported-template

This rule flags render functions that return a value that’s not an imported local template. To resolve this error, review the function and make sure that its return statement returns a supported imported template.

## ❌ Incorrect

```javascript
import { LightningElement, api } from 'lwc';
import template from 'lightning/something';
export default class Example extends LightningElement {
    @api
    firstOrSecondTemplate;


    @api
    passedInTemplate;


    render() {
        return this.firstOrSecondTemplate
            ? this.passedInTemplate // not supported because it's passed through the prop
            : template; // not supported because it's imported from another module
    }
}
```

## ✅ Correct

```javascript
import { LightningElement, api } from 'lwc';
import firstTemplate from './firstTemplate.html';
import secondTemplate from './secondTemplate.html';
export default class Example extends LightningElement {
    @api
    firstOrSecondTemplate;


    render() {
        return this.firstOrSecondTemplate ? firstTemplate : secondTemplate;
    }
}

```
