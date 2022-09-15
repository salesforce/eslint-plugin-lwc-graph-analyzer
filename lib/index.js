/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const processor = require('./processor');
const base = require('./configs/base');
const recommended = require('./configs/recommended');

const noGetterContainsMoreThanReturnStatement = require('./rules/no-getter-contains-more-than-return-statement');
const noAssignmentExpressionAssignsValueToMemberVariable = require('./rules/no-assignment-expression-assigns-value-to-member-variable');
const noWireConfigReferencesNonLocalPropertyReactiveValue = require('./rules/no-wire-config-references-non-local-property-reactive-value');
const noPrivateWireConfigProperty = require('./rules/no-private-wire-config-property');
const noUnresolvedParentClassReference = require('./rules/no-unresolved-parent-class-reference');
const noClassRefersToParentClassFromUnsupportedNamespace = require('./rules/no-class-refers-to-parent-class-from-unsupported-namespace');
const noReferenceToUnsupportedNamespaceReference = require('./rules/no-reference-to-unsupported-namespace-reference');
const noWireConfigPropertyUsesGetterFunctionReturningInaccessibleImport = require('./rules/no-wire-config-property-uses-getter-function-returning-inaccessible-import');
const noWireConfigPropertyUsesGetterFunctionReturningNonLiteral = require('./rules/no-wire-config-property-uses-getter-function-returning-non-literal');
const noWireConfigPropertyCircularWireDependency = require('./rules/no-wire-config-property-circular-wire-dependency');
const noWireConfigurationPropertyUsingOutputOfNonPrimeableWire = require('./rules/no-wire-configuration-property-using-output-of-non-primeable-wire');
const noMissingResourceCannotPrimeWireAdapter = require('./rules/no-missing-resource-cannot-prime-wire-adapter');
const noWireConfigPropertyUsesImportedArtifactFromUnsupportedNamespace = require('./rules/no-wire-config-property-uses-imported-artifact-from-unsupported-namespace');
const noWireAdapterOfResourceCannotBePrimed = require('./rules/no-wire-adapter-of-resource-cannot-be-primed');
const noUnsupportedMemberVariableInMemberExpression = require('./rules/no-unsupported-member-variable-in-member-expression');
const noMultipleTemplateFiles = require('./rules/no-multiple-template-files');
const noConditionalUsingUnanalyzableNonPublicProperty = require('./rules/no-conditional-using-unanalyzable-non-public-property');
const noConditionalOnUnanalyzableGetterProperty = require('./rules/no-conditional-on-unanalyzable-getter-property');
const noConditionalUsingPropertyFromUnresolvableWire = require('./rules/no-conditional-using-property-from-unresolvable-wire');
const noImageReferenceUnanalyzableSourceProperty = require('./rules/no-image-reference-unanalyzable-source-property');
const noImageReferenceMissingSourceProperty = require('./rules/no-image-reference-missing-source-property');
const noIterateOnUnanalyzableGetterProperty = require('./rules/no-iterate-on-unanalyzable-getter-property');
const noIterateOnUnanalyzablePropertyFromUnresolvableWire = require('./rules/no-iterate-on-unanalyzable-property-from-unresolvable-wire');
const noUndefinedWireConfigProperty = require('./rules/no-undefined-wire-config-property');
const noIterateOnUnanalyzablePropertyFromNonPublicProperty = require('./rules/no-iterate-on-unanalyzable-property-from-non-public-property');
const noConditionalOnUnanalyzableNonPublicGetterProperty = require('./rules/no-conditional-on-unanalyzable-non-public-getter-property');
const noIterateOnUnanalyzableProperty = require('./rules/no-iterate-on-unanalyzable-property');
const noAssignmentExpressionForExternalComponents = require('./rules/no-assignment-expression-for-external-components');
const noTaggedTemplateExpressionContainsUnsupportedNamespace = require('./rules/no-tagged-template-expression-contains-unsupported-namespace');
const noExpressionContainsModuleLevelVariableRef = require('./rules/no-expression-contains-module-level-variable-ref');
const noCallExpressionReferencesUnsupportedNamespace = require('./rules/no-call-expression-references-unsupported-namespace');
const noEvalUsage = require('./rules/no-eval-usage');
const noReferenceToClassFunctions = require('./rules/no-reference-to-class-functions');
const noReferenceToModuleFunctions = require('./rules/no-reference-to-module-functions');
const noFunctionsDeclaredWithinGetterMethod = require('./rules/no-functions-declared-within-getter-method');
const noMemberExpressionReferenceToNonExistentMemberVariable = require('./rules/no-member-expression-reference-to-non-existent-member-variable');
const noMemberExpressionReferenceToUnsupportedNamespaceReference = require('./rules/no-member-expression-reference-to-unsupported-namespace-reference');
const noMemberExpressionContainsNonPortableIdentifier = require('./rules/no-member-expression-contains-non-portable-identifier');
const noMemberExpressionReferenceToSuperClass = require('./rules/no-member-expression-reference-to-super-class');
const noMemberExpressionReferenceToUnsupportedGlobal = require('./rules/no-member-expression-reference-to-unsupported-global');

module.exports = {
    rules: {
        'no-getter-contains-more-than-return-statement': noGetterContainsMoreThanReturnStatement,
        'no-assignment-expression-assigns-value-to-member-variable':
            noAssignmentExpressionAssignsValueToMemberVariable,
        'no-wire-config-references-non-local-property-reactive-value':
            noWireConfigReferencesNonLocalPropertyReactiveValue,
        'no-private-wire-config-property': noPrivateWireConfigProperty,
        'no-unresolved-parent-class-reference': noUnresolvedParentClassReference,
        'no-class-refers-to-parent-class-from-unsupported-namespace':
            noClassRefersToParentClassFromUnsupportedNamespace,
        'no-reference-to-unsupported-namespace-reference':
            noReferenceToUnsupportedNamespaceReference,
        'no-wire-config-property-uses-getter-function-returning-inaccessible-import':
            noWireConfigPropertyUsesGetterFunctionReturningInaccessibleImport,
        'no-wire-config-property-uses-getter-function-returning-non-literal':
            noWireConfigPropertyUsesGetterFunctionReturningNonLiteral,
        'no-wire-config-property-circular-wire-dependency':
            noWireConfigPropertyCircularWireDependency,
        'no-wire-configuration-property-using-output-of-non-primeable-wire':
            noWireConfigurationPropertyUsingOutputOfNonPrimeableWire,
        'no-missing-resource-cannot-prime-wire-adapter': noMissingResourceCannotPrimeWireAdapter,
        'no-wire-config-property-uses-imported-artifact-from-unsupported-namespace':
            noWireConfigPropertyUsesImportedArtifactFromUnsupportedNamespace,
        'no-wire-adapter-of-resource-cannot-be-primed': noWireAdapterOfResourceCannotBePrimed,
        'no-unsupported-member-variable-in-member-expression':
            noUnsupportedMemberVariableInMemberExpression,
        'no-multiple-template-files': noMultipleTemplateFiles,
        'no-conditional-using-unanalyzable-non-public-property':
            noConditionalUsingUnanalyzableNonPublicProperty,
        'no-conditional-on-unanalyzable-getter-property': noConditionalOnUnanalyzableGetterProperty,
        'no-conditional-using-property-from-unresolvable-wire':
            noConditionalUsingPropertyFromUnresolvableWire,
        'no-image-reference-unanalyzable-source-property':
            noImageReferenceUnanalyzableSourceProperty,
        'no-image-reference-missing-source-property': noImageReferenceMissingSourceProperty,
        'no-iterate-on-unanalyzable-getter-property': noIterateOnUnanalyzableGetterProperty,
        'no-iterate-on-unanalyzable-property-from-unresolvable-wire':
            noIterateOnUnanalyzablePropertyFromUnresolvableWire,

        // TODO: These rules do not have tests because Komaci itself did not have tests for them.
        'no-undefined-wire-config-property': noUndefinedWireConfigProperty,
        'no-iterate-on-unanalyzable-property-from-non-public-property':
            noIterateOnUnanalyzablePropertyFromNonPublicProperty,
        'no-conditional-on-unanalyzable-non-public-getter-property':
            noConditionalOnUnanalyzableNonPublicGetterProperty,
        'no-iterate-on-unanalyzable-property': noIterateOnUnanalyzableProperty,
        'no-assignment-expression-for-external-components':
            noAssignmentExpressionForExternalComponents,
        'no-tagged-template-expression-contains-unsupported-namespace':
            noTaggedTemplateExpressionContainsUnsupportedNamespace,
        'no-expression-contains-module-level-variable-ref':
            noExpressionContainsModuleLevelVariableRef,
        'no-call-expression-references-unsupported-namespace':
            noCallExpressionReferencesUnsupportedNamespace,
        'no-eval-usage': noEvalUsage,
        'no-reference-to-class-functions': noReferenceToClassFunctions,
        'no-reference-to-module-functions': noReferenceToModuleFunctions,
        'no-functions-declared-within-getter-method': noFunctionsDeclaredWithinGetterMethod,
        'no-member-expression-reference-to-non-existent-member-variable':
            noMemberExpressionReferenceToNonExistentMemberVariable,
        'no-member-expression-reference-to-unsupported-namespace-reference':
            noMemberExpressionReferenceToUnsupportedNamespaceReference,
        'no-member-expression-contains-non-portable-identifier':
            noMemberExpressionContainsNonPortableIdentifier,
        'no-member-expression-reference-to-super-class': noMemberExpressionReferenceToSuperClass,
        'no-member-expression-reference-to-unsupported-global':
            noMemberExpressionReferenceToUnsupportedGlobal
    },
    configs: {
        base,
        recommended
    },
    processors: {
        bundleAnalyzer: processor
    }
};
