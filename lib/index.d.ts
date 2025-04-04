import type { Linter, ESLint } from 'eslint';

export type LwcBundleFile = { filename: string; content: string };

declare class LwcBundle {
    constructor(componentBaseName: string, js?: LwcBundleFile, htmlTemplates?: LwcBundleFile[]);
    get componentBaseName(): string;
    get js(): LwcBundleFile | undefined;
    get htmlTemplates(): LwcBundleFile[] | undefined;
    filesRecord(): Record<string, string>;
    static lwcBundleFromContent(
        componentBaseName: string,
        jsContent?: string,
        ...htmlTemplateContent: string[]
    ): LwcBundle;
    static lwcBundleFromFilesystem(
        lwcFileContent: string,
        lwcFilePath: string,
        lwcFileExtension: string
    ): LwcBundle;
}

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
    parser: Linter.Parser;
};

export = lwcGraphAnalyzerPlugin;
export { LwcBundle };
