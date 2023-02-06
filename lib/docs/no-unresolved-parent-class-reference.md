# no-unresolved-parent-class-reference

 This rule flags a class that references an unresolvable parent class. To resolve this error, review the parent class and make sure that the class is defined and imported correctly. 

## ❌ Incorrect

```javascript
const Foo = {}; // Foo is defined, but not a class
export default class Example extends Foo {} // flags
// Foo is not defined at all
export default class Example extends Foo {} // flags
```

## ✅ Correct

```javascript
import Foo from 'x/foo';
export default class Example extends Foo {}
```

## 😟 Limitations

Using mixins with a parent class is currently not supported.

```javascript
import Foo from 'x/foo';
import Mixin from 'x/mixin';

export default class Example extends Mixin(Foo) {}

```
