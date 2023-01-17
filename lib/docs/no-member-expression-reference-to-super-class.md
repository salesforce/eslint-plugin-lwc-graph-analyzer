# no-member-expression-reference-to-super-class

This rule flags expressions that reference a superclass. To resolve this error, remove the `super` reference and explicitly define the referenced property in the class.

## ❌ Incorrect

```javascript
import Parent from 'x/parent';
export default class Example extends Parent {
    get value() {
        return super.value;
    }

    str = `${super.value}`;
}

```

## ✅ Correct

```javascript
import Parent from 'x/parent';
export default class Example extends Parent {
    @api value; // value is explicitly defined in the Example class
    get value() {
        return this.value;
    }

    str = `${this.value}`;
}

```
