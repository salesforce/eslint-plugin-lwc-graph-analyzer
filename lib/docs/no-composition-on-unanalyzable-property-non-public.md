# no-composition-on-unanalyzable-property-non-public

This rule flags iterators, image `src` attributes, or child components that reference a property that isn’t public. To resolve this error, review the referenced property to make sure that it’s public and valid.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    notPublic;
}

```

```html
<template>
    <c-child input={notPublic}></c-child>
</template>

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    @api public;
}

```

```html
<template>
    <c-child input={public}></c-child>
</template>

```
