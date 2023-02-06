# no-composition-on-unanalyzable-property-from-unresolvable-wire

This rule flags iterators, image `src` attributes, or child components of an LWC template that reference an unanalyzable property, such as an invalid getter, or a wire output from an unsupported or unprimeable wire. To resolve this error, review the property reference and the referenced variable to make sure they’re both valid.

## ❌ Incorrect

```javascript
import { LightningElement, wire, api } from 'lwc';
import { invalid } from 'x/invalid';
export default class Example extends LightningElement {
    @wire(invalid, {})
    wireOutput;
}

```

```html
<template>
    <c-child input={wireOutput}></c-child>
</template>

```

## ✅ Correct

```javascript
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
export default class Example extends LightningElement {
    @wire(getRecord, {})
    wireOutput;
}

```

```html
<template>
    <c-child input={wireOutput}></c-child>
</template>

```
