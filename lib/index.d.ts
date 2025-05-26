import type { Linter, ESLint } from 'eslint';

/**
 * Represents a file in an LWC bundle, with its content and designation as the primary file,
 * i.e. the file requested by ESLint to be linted.
 */
export type LwcBundleFile = {
    /** The name of the file */
    filename: string;
    /** The content of the file */
    content: string;
    /** Whether this is the primary file being linted by ESLint */
    isPrimary: boolean;
};

/**
 * Represents a bundle of files that make up an LWC component. The bundle contains the JavaScript
 * file and any HTML template files that comprise the component. One file in the bundle will be
 * designated as the primary file, which is the file that ESLint is currently processing.
 */
declare class LwcBundle {
    /**
     * Creates a new LWC bundle instance
     *
     * @param componentBaseName - The base name of the component (e.g., 'myComponent' for 'myComponent.js' et al)
     * @param js - The JavaScript file of the bundle, if present
     * @param htmlTemplates - The HTML template files of the bundle, if present
     */
    constructor(componentBaseName: string, js?: LwcBundleFile, htmlTemplates?: LwcBundleFile[]);

    /** Gets the base name of the component */
    get componentBaseName(): string;

    /** Gets the JavaScript file of the bundle, if present */
    get js(): LwcBundleFile | undefined;

    /** Gets the HTML template files of the bundle, if present */
    get htmlTemplates(): LwcBundleFile[] | undefined;

    /** Gets the primary file being linted by ESLint */
    get primaryFile(): LwcBundleFile;

    /**
     * Creates a record of filenames to their content for Komaci analysis
     *
     * @returns A record mapping filenames to their content
     */
    filesRecord(): Record<string, string>;

    /**
     * Sets the primary file in the bundle based on content matching
     *
     * @param content - The content to match against
     * @returns True if a matching file was found and set as primary
     */
    setPrimaryFileByContent(content: string): boolean;

    /**
     * Creates an `LwcBundle` instance from the specified content files. The primary file
     * designation will be set later when the bundle is processed by ESLint.
     *
     * @param componentBaseName - The base name of the component
     * @param jsContent - The content of the JavaScript file, if present
     * @param htmlTemplateContent - The contents of the HTML template files, if any
     * @returns A new LWC bundle instance
     */
    static lwcBundleFromContent(
        componentBaseName: string,
        jsContent?: string,
        ...htmlTemplateContent: string[]
    ): LwcBundle;

    /**
     * Creates a bundle from filesystem files
     *
     * @param lwcFileContent - The content of the file being processed
     * @param lwcFilePath - The path to the file being processed
     * @param lwcFileExtension - The file extension of the file being processed
     * @returns A new LWC bundle instance, or null if the file cannot be found
     */
    static lwcBundleFromFilesystem(
        lwcFileContent: string,
        lwcFilePath: string,
        lwcFileExtension: string
    ): LwcBundle | null;
}

/**
 * ESLint processor that analyzes LWC bundles. This will set up the LWC bundle to be processed
 * by Komaci.
 */
export class BundleAnalyzer implements Linter.Processor {
    /** Gets the current LWC bundle being processed */
    get lwcBundle(): LwcBundle | null;

    /** Sets the LWC bundle to be processed */
    set lwcBundle(value: LwcBundle | null);

    /**
     * Sets the LWC bundle content from content files
     *
     * @param componentBaseName - The base name of the component
     * @param jsContent - The content of the JavaScript file, if present
     * @param htmlTemplateContent - The contents of the HTML template files, if any
     */
    setLwcBundleFromContent(
        componentBaseName: string,
        jsContent?: string,
        ...htmlTemplateContent: string[]
    ): void;

    /**
     * Preprocesses the input file for ESLint
     *
     * @param text - The content of the ESLint file
     * @param filename - The input filename
     * @returns An array of files and their content to be processed
     */
    preprocess(text: string, filename: string): string[];

    /**
     * Postprocesses the linting results
     *
     * @param messages - The two-dimensional array of messages returned from linting
     * @param filename - The input filename
     * @returns A one-dimensional flattened array of messages
     */
    postprocess(messages: Linter.LintMessage[][], filename: string): Linter.LintMessage[];

    /** Whether the processor supports autofix */
    supportsAutofix: boolean;
}

/**
 * The ESLint plugin for LWC graph analysis
 */
declare const lwcGraphAnalyzerPlugin: ESLint.Plugin & {
    /** The bundle analyzer processor */
    processors: {
        bundleAnalyzer: BundleAnalyzer;
    };
    /** The plugin's configuration presets */
    configs: {
        base: Linter.Config;
        recommended: Linter.Config;
    };
    /** The plugin's parser */
    parser: Linter.Parser;
};

export = lwcGraphAnalyzerPlugin;
export { LwcBundle };
