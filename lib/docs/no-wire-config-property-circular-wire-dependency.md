# no-wire-config-property-circular-wire-dependency

This rule flags circular dependencies that occur when a wire’s output is an input into another wire, and that wire’s output is an input into the original wire. Circular dependencies cause an infinite loop during runtime. To resolve this error, review the flagged dependency chain and refactor the code to remove the circular dependency.

## ❌ Incorrect

```javascript
import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
export default class Example extends LightningElement {
    @wire(getRecord, { input: '$wireOutput2' })
    wireOutput1;

    @wire(getRecord, { input: '$wireOutput1' })
    wireOutput2;
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    @api input;
    @wire(getRecord, { input: '$input' })
    wireOutput;
}

```