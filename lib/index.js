/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const bundleAnalyzer = require('./processor');
const base = require('./configs/base');
const recommended = require('./configs/recommended');
const parser = require('./parser');
const LwcBundle = require('./lwc-bundle');

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
const noCompositionOnUnanalyzableGetterProperty = require('./rules/no-composition-on-unanalyzable-getter-property');
const noCompositionOnUnanalyzablePropertyFromUnresolvableWire = require('./rules/no-composition-on-unanalyzable-property-from-unresolvable-wire');
const noCompositionOnUnanalyzablePropertyNonPublic = require('./rules/no-composition-on-unanalyzable-property-non-public');
const noCompositionOnUnanalyzablePropertyMissing = require('./rules/no-composition-on-unanalyzable-property-missing');
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
const noRenderFunctionContainsMoreThanReturnStatement = require('./rules/no-render-function-contains-more-than-return-statement');
const noRenderFunctionReturnStatementNotReturningImportedTemplate = require('./rules/no-render-function-return-statement-not-returning-imported-template');
const noRenderFunctionReturnStatement = require('./rules/no-render-function-return-statement');

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
        'no-composition-on-unanalyzable-getter-property': noCompositionOnUnanalyzableGetterProperty,
        'no-composition-on-unanalyzable-property-from-unresolvable-wire':
            noCompositionOnUnanalyzablePropertyFromUnresolvableWire,
        'no-composition-on-unanalyzable-property-non-public':
            noCompositionOnUnanalyzablePropertyNonPublic,
        'no-composition-on-unanalyzable-property-missing':
            noCompositionOnUnanalyzablePropertyMissing,
        'no-assignment-expression-for-external-components':
            noAssignmentExpressionForExternalComponents,
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
            noMemberExpressionReferenceToUnsupportedGlobal,

        // TODO: These rules do not have tests because Komaci itself did not have tests for them.
        'no-tagged-template-expression-contains-unsupported-namespace':
            noTaggedTemplateExpressionContainsUnsupportedNamespace,
        'no-render-function-contains-more-than-return-statement':
            noRenderFunctionContainsMoreThanReturnStatement,
        'no-render-function-return-statement-not-returning-imported-template':
            noRenderFunctionReturnStatementNotReturningImportedTemplate,
        'no-render-function-return-statement': noRenderFunctionReturnStatement
    },
    configs: {
        base,
        recommended
    },
    processors: {
        bundleAnalyzer
    },
    parser
};
module.exports.LwcBundle = LwcBundle;
