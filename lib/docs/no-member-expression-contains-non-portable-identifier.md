# no-member-expression-contains-non-portable-identifier

This rule flags expressions that contain a non-portable variable like `document` or `window`. To resolve this error, refactor your code to remove non-portable variables.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    get value() {
        return window.foo;
    }

    str = `${window.foo}`;
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
	get value() {
	    return ‘foo’; // This expression is valid because it isn’t using a global variable, such as window or document 
    }
}

```
