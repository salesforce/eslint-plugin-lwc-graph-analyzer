import type { Linter, ESLint } from 'eslint';

export type LwcBundleFile = { filename: string; content: string };

export type LwcBundle = {
    componentBaseName: string;
    js?: LwcBundleFile;
    htmlTemplates?: LwcBundleFile[];
};

export class BundleAnalyzer implements Linter.Processor {
    get lwcBundle(): LwcBundle | null;
    set lwcBundle(value: LwcBundle | null);
    setLwcBundleFromContent(
        componentBaseName: string,
        jsContent?: string,
        ...htmlTemplateContent: string[]
    ): void;
    preprocess(text: string, filename: string): string[];
    postprocess(messages: Linter.LintMessage[][], filename: string): Linter.LintMessage[];
    supportsAutofix: boolean;
}

declare const lwcGraphAnalyzerPlugin: ESLint.Plugin & {
    processors: {
        bundleAnalyzer: BundleAnalyzer;
    };
    configs: {
        base: Linter.Config;
        recommended: Linter.Config;
    };
};

export = lwcGraphAnalyzerPlugin;
