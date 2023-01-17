# no-composition-on-unanalyzable-getter-property

This rule flags iterators, image `src` attributes, or child components that reference an unanalyzable getter. To resolve this error, review the referenced getter and make sure that it’s valid. 

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    prop;
    get invalidGetter() {
        this.prop = 'new value'; // mutations not allowed
        return this.prop;
    }
}

```

```html
<template>
    <c-child input={invalidGetter}></c-child>
</template>

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    @api prop;
    get getter() {
        return this.prop;
    }
}

```

```html
<template>
    <c-child input={getter}></c-child>
</template>

```
