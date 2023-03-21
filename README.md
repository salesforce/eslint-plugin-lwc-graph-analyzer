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

Here's an example snippet of a `.eslintrc.json` configuration file, that will configure the `eslint-plugin-lwc-graph-analyzer` plugin. Extending the `plugin:@salesforce/lwc-graph-analyzer/recommended` ESLint configuration will enable static analysis on all `.js` and `.html` files used in your Lightning web components.

```json
{
    "extends": ["eslint:recommended", "plugin:@salesforce/lwc-graph-analyzer/recommended"]
}
```

In an SFDX project, you would most commonly add this configuration at the root of your LWC "tree"—which by default resides at `force-app/main/default/lwc/`—since the plugin's analysis applies specifically to Lightning web components.

**Note:** If you have a `.eslintignore` configuration in your project, do *not* add an entry to ignore HTML files. This will cause the plugin to skip linting on LWC bundles that include HTML templates. There are a number of Komaci-based static analysis rules that apply specifically to the HTML template of a Lightning web component bundle.
