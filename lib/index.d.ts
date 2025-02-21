import type { Linter } from 'eslint';

export type LwcBundleFile = { filename: string; content: string };

export type LwcBundle = {
    componentBaseName: string;
    js?: LwcBundleFile | null;
    htmlTemplates?: LwcBundleFile[] | null;
};

export class BundleAnalyzer implements Linter.Processor {
    get lwcBundle(): LwcBundle | null;
    set lwcBundle(value: LwcBundle | null);
    setLwcBundleFromContent(
        componentBaseName: string,
        jsContent?: string | null,
        ...htmlTemplateContent: string[] | null
    ): LwcBundle;
    preprocess(text: string, filename: string): string[];
    postprocess(messages: Linter.LintMessage[][], filename: string): Linter.LintMessage[];
    supportsAutofix: boolean;
}
