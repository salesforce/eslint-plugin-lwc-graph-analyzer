# no-reference-to-module-functions

This rule flags call expressions that reference a function defined in a module. These functions are not supported. To resolve this error, replace the function defined in the module with a getter.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';

// Module level function
function doSomething() {
    return 'value';
}

export default class Example extends LightningElement {
    get value() {
        return doSomething(); // flags
    }

    someProp = `${doSomething()}`; // flags
}

```

## ✅ Correct

Replace with a getter if you can.

```javascript
import { LightningElement } from 'lwc';

export default class Example extends LightningElement {
    get something() {
        return 'value';
    }
    get value() {
        return this.something;
    }

    someProp = `${this.something}`;
}

```