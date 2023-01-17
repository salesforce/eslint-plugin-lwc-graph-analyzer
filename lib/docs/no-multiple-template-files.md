# no-multiple-template-files

This rule flags components that use more than one template file, because Static Analyzer can’t analyze components with more than one template file. Lightning web components can use more than one template, but it’s not recommended. For more information, see [Render Multiple Templates](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.create_render) in the *Lightning Web Components Dev Guide*.

## ❌ Incorrect

```javascript
// example.js
import { LightningElement } from 'lwc';
import tmpl1 from './example.html';
import tmpl2 from './example.2.html';
export default class Example extends LightningElement {
    @api someInput;
    render() {
        return this.someInput ? tmpl1 : tmpl2;
    }
}
```

```html
<!-- example.html -->
<template></template>
<!-- example.2.html -->
<template></template>
<!-- flags -->

```