# @salesforce/eslint-plugin-lwc-graph-analyzer

> An ESLint plugin to analyze the data flow graph of a Lightning web component, to ensure the component's offline-ability.

## Should I use this plugin?

This plugin wraps the [Komaci static analyzer](https://www.npmjs.com/package/@komaci/static-analyzer), which looks at your component's `@wire` definitions and validates whether the component is offline-able or not. You should use this plugin to ensure that your Lightning web component can take full advantage of the Lightning SDK.

## Installation

This plugin has not yet been published to a public registry. Instead, clone the repo on your machine.

```
git clone https://github.com/salesforce/eslint-plugin-lwc-graph-analyzer.git
cd eslint-plugin-lwc-graph-analyzer
yarn install
yarn test // Ensures your installation is working properly
```

Then, from the root of your LWC project run to add the plugin to your `package.json`:

```sh
$ yarn add --dev <path to cloned repo>/eslint-plugin-lwc-graph-analyzer
```

## Usage

Here's an example `.eslintrc` that configures the plugin. Extending the `plugin:@salesforce/lwc-graph-analyzer/recommended` config will enable static analysis on all `.js` and `.html` files used in Lightning web components.

```json
{
    "extends": ["eslint:recommended", "plugin:@salesforce/lwc-graph-analyzer/recommended"]
}
```

If you have `.eslintignore` in your project do not add an entry to ignore html files. This will cause the plugin to skip linting on LWC bundles that include html templates.
