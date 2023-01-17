# no-reference-to-class-functions

This rule flags call expressions that reference a function defined in a class. These functions are not supported. To resolve this error, replace the function defined in the class with a getter. 

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    doSomething() {
        return 'value';
    }

    get value() {
        return this.doSomething(); // flags
    }

    someProp = `${this.doSomething()}`; // flags
}

```

## ✅ Correct

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