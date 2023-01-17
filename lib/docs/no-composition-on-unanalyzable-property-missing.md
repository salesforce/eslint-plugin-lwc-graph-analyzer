# no-composition-on-unanalyzable-property-missing

This rule flags iterators, image `src` attributes, or child components that reference a property that’s not found in the JavaScript file. This rule also flags a child class that references a property that’s only defined on the parent class. To resolve this error, review the referenced properties and make sure that they’re correctly defined.

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {}

```

```html
<template>
    <c-child input={doesNotExist}></c-child>
</template>

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
export default class Example extends LightningElement {
    @api doesExist;
}

```

```html
<template>
    <c-child input={doesExist}></c-child>
</template>

```

## 😟 Limitations

This rule flags a child class that references a property that’s only defined on the parent class.

### ❌ Incorrect

```javascript
import Parent from 'x/parent';
export default class Example extends Parent {}

```

```html
<template>
    <c-child input={existsOnParent}></c-child>
</template>

```

### ✅ Correct

Update the JavaScript file to explicitly define properties that are referenced in the template.

```javascript
import Parent from 'x/parent';
export default class Example extends Parent {
    @api existsOnParent;
}

```

```html
<template>
    <c-child input={existsOnParent}></c-child>
</template>

```
