# no-tagged-template-expression-contains-unsupported-namespace

This rule flags template expression tags that are from an unsupported resource. To resolve this error, review the tags in the template expression and make sure that they’re defined correctly. 

## ❌ Incorrect

```javascript
import { LightningElement } from 'lwc';
import invalid from 'x/invalid';

export default class Example extends LightningElement {
    invalidProp = invalid`normal string`;
}

```

## ✅ Correct

```javascript
import { LightningElement } from 'lwc';
import { gql } from 'lightning/uiGraphQLApi';

export default class Example extends LightningElement {
    validProp = gql`normal string`;
}

```