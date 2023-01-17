# no-class-refers-to-parent-class-from-unsupported-namespace

This rule flags components that extend from a parent class that’s not supported for Lightning web components, such as a custom class. 

## ❌ Incorrect

```javascript
import Foo from './foo';

export default class Example extends Foo {}

```

## ✅ Correct

```javascript
import Foo from 'lightning/recordForm';

export default class Example extends Foo {}

```