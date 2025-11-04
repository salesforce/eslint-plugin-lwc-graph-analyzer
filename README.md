# @salesforce/eslint-plugin-lwc-graph-analyzer

`eslint-plugin-lwc-graph-analyzer` is an ESLint plugin that analyzes the data flow graph of a Lightning web component, to ensure the component can be statically analyzed, a requirement for LWC data priming and offline use cases.

## Should I use this plugin?

This plugin wraps the [Komaci static analyzer](https://www.npmjs.com/package/@komaci/static-analyzer), which interrogates your Lightning web component's `@wire` definitions and dependency graph, and validates whether these can be statically analyzed. Static analyzability is a requirement for LWCs to support offline use cases. Using this plugin will help you catch any exceptions to your component's static analyzability, ensuring that it can take full advantage of the Lightning SDK's offline capabilities.

## Installation

To add this plugin to your package/project, install it with your favorite Node.js package manager.

### yarn

```sh
$ yarn add --dev @salesforce/eslint-plugin-lwc-graph-analyzer
```

### npm

```sh
$ npm install --save-dev @salesforce/eslint-plugin-lwc-graph-analyzer
```

## Configuration

ESLint version-specific configuration examples are provided below. Here are some additional considerations for configuring the plugin.

- In an SFDX project, you would most commonly add your configuration at the root of your LWC "tree"—which by default resides at `force-app/main/default/lwc/`—since the plugin's analysis applies specifically to Lightning web components.
- Extending the appropriate `recommended` config based on your ESLint version will enable static analysis on all `.js` and `.html` files used in your Lightning web components.

### ESLint &gt;= 9

The default configurations are now in the flat config format supported by ESLint 9 and beyond. Here's how to include the `recommended` config in your flat config:

```javascript
// eslint.config.js
const { defineConfig } = require("eslint/config");
const lwcGraphAnalyzerPlugin = require("@salesforce/eslint-plugin-lwc-graph-analyzer");

module.exports = defineConfig([
    {
        plugins: {
            "@salesforce/lwc-graph-analyzer": lwcGraphAnalyzerPlugin,
        },
        extends: [lwcGraphAnalyzerPlugin.configs.recommended],
    },
]);
```

```javascript
// eslint.config.mjs
import js from '@eslint/js';
import lwcGraphAnalyzerPlugin from '@salesforce/eslint-plugin-lwc-graph-analyzer';

export default [
    { 
        plugins: { 
            '@salesforce/lwc-graph-analyzer': lwcGraphAnalyzerPlugin 
        }
    },
    js.configs.recommended,
    lwcGraphAnalyzerPlugin.configs.recommended
];
```

### ESLint &lt; 9

Configurations for legacy ESLint have moved to `-legacy` extensions. Here's an `.eslintrc.json` configuration file that will configure the `eslint-plugin-lwc-graph-analyzer` plugin with the `recommended-legacy` config:

```json
{
    "extends": ["eslint:recommended", "plugin:@salesforce/lwc-graph-analyzer/recommended-legacy"]
}
```

**Note:** If you have a `.eslintignore` configuration in your project, do _not_ add an entry to ignore HTML files. This will cause the plugin to skip linting on LWC bundles that include HTML templates. There are a number of Komaci-based static analysis rules that apply specifically to the HTML template of a Lightning web component bundle.
