/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const { expect } = require('chai');
const LwcBundle = require('../../lib/lwc-bundle');
const { FilesystemProvider } = require('../../lib/util/filesystem-provider');
const { join } = require('path');

class MockFilesystemProvider extends FilesystemProvider {
    constructor() {
        super();
        this.files = new Map();
        this.directories = new Map();
    }

    addFile(path, content) {
        this.files.set(path, content);
    }

    addDirectory(path, files) {
        this.directories.set(path, files);
    }

    existsSync(path) {
        return this.files.has(path);
    }

    readdirSync(path) {
        return this.directories.get(path) || [];
    }

    readFileSync(path) {
        return this.files.get(path);
    }
}

describe('LwcBundle', () => {
    describe('constructor', () => {
        it('should create a bundle with js and html files', () => {
            const jsFile = {
                filename: 'test.js',
                content: 'export default class Test {}',
                isPrimary: false
            };
            const htmlFiles = [
                {
                    filename: 'test.html',
                    content: '<template></template>',
                    isPrimary: false
                }
            ];
            const bundle = new LwcBundle('test', jsFile, htmlFiles);

            expect(bundle.componentBaseName).to.equal('test');
            expect(bundle.js).to.deep.equal(jsFile);
            expect(bundle.htmlTemplates).to.deep.equal(htmlFiles);
        });

        it('should create a bundle with only js file', () => {
            const jsFile = {
                filename: 'test.js',
                content: 'export default class Test {}',
                isPrimary: false
            };
            const bundle = new LwcBundle('test', jsFile);

            expect(bundle.componentBaseName).to.equal('test');
            expect(bundle.js).to.deep.equal(jsFile);
            expect(bundle.htmlTemplates).to.be.undefined;
        });

        it('should create a bundle with only html files', () => {
            const htmlFiles = [
                {
                    filename: 'test.html',
                    content: '<template></template>',
                    isPrimary: false
                }
            ];
            const bundle = new LwcBundle('test', undefined, htmlFiles);

            expect(bundle.componentBaseName).to.equal('test');
            expect(bundle.js).to.be.undefined;
            expect(bundle.htmlTemplates).to.deep.equal(htmlFiles);
        });
    });

    describe('setPrimaryFileByContent', () => {
        it('should set js file as primary when content matches', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent);
            const result = bundle.setPrimaryFileByContent(jsContent);

            expect(result).to.be.true;
            expect(bundle.js.isPrimary).to.be.true;
            expect(bundle.primaryFile).to.equal(bundle.js);
        });

        it('should set html file as primary when content matches', () => {
            const htmlContent = '<template></template>';
            const bundle = LwcBundle.lwcBundleFromContent('test', undefined, htmlContent);
            const result = bundle.setPrimaryFileByContent(htmlContent);

            expect(result).to.be.true;
            expect(bundle.htmlTemplates[0].isPrimary).to.be.true;
            expect(bundle.primaryFile).to.equal(bundle.htmlTemplates[0]);
        });

        it('should return false when no matching content found', () => {
            const bundle = LwcBundle.lwcBundleFromContent('test', 'js content', 'html content');
            const result = bundle.setPrimaryFileByContent('non-matching content');

            expect(result).to.be.false;
            expect(bundle.js.isPrimary).to.be.false;
            expect(bundle.htmlTemplates[0].isPrimary).to.be.false;
        });
    });

    describe('filesRecord', () => {
        it('should create a record of all files in the bundle', () => {
            const jsContent = 'export default class Test {}';
            const htmlContent = '<template></template>';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent, htmlContent);
            const record = bundle.filesRecord();

            expect(record).to.deep.equal({
                'test.js': jsContent,
                'test.html': htmlContent
            });
        });

        it('should handle bundles with only js file', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent);
            const record = bundle.filesRecord();

            expect(record).to.deep.equal({
                'test.js': jsContent
            });
        });

        it('should handle bundles with only html file', () => {
            const htmlContent = '<template></template>';
            const bundle = LwcBundle.lwcBundleFromContent('test', undefined, htmlContent);
            const record = bundle.filesRecord();

            expect(record).to.deep.equal({
                'test.html': htmlContent
            });
        });
    });

    describe('lwcBundleFromContent', () => {
        it('should create a bundle with js and html content', () => {
            const jsContent = 'export default class Test {}';
            const htmlContent = '<template></template>';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent, htmlContent);

            expect(bundle.componentBaseName).to.equal('test');
            expect(bundle.js.content).to.equal(jsContent);
            expect(bundle.htmlTemplates[0].content).to.equal(htmlContent);
        });

        it('should handle multiple html templates', () => {
            const htmlContent1 = '<template>1</template>';
            const htmlContent2 = '<template>2</template>';
            const bundle = LwcBundle.lwcBundleFromContent(
                'test',
                undefined,
                htmlContent1,
                htmlContent2
            );

            expect(bundle.htmlTemplates).to.have.length(2);
            expect(bundle.htmlTemplates[0].filename).to.equal('test.html');
            expect(bundle.htmlTemplates[1].filename).to.equal('test.2.html');
        });
    });

    describe('getBundleKey', () => {
        it('should generate a unique key when primary file exists', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromContent('test', jsContent);
            bundle.setPrimaryFileByContent(jsContent);
            const key = bundle.getBundleKey();

            expect(key).to.match(/^test_[0-9a-f-]+\.js$/);
        });

        it('should throw error when no primary file exists', () => {
            const bundle = LwcBundle.lwcBundleFromContent('test', undefined, 'html content');
            expect(() => bundle.getBundleKey()).to.throw(
                'Cannot generate bundle key: no primary file exists'
            );
        });
    });

    describe('lwcBundleFromFile', () => {
        it('should create bundle from JS file', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromFile(jsContent, '/path/to/test.js', '.js');

            expect(bundle.componentBaseName).to.equal('test');
            expect(bundle.js.filename).to.equal('test.js');
            expect(bundle.js.content).to.equal(jsContent);
            expect(bundle.js.isPrimary).to.be.true;
            expect(bundle.htmlTemplates).to.be.undefined;
        });

        it('should create bundle from HTML file', () => {
            const htmlContent = '<template></template>';
            const bundle = LwcBundle.lwcBundleFromFile(htmlContent, '/path/to/test.html', '.html');

            expect(bundle.componentBaseName).to.equal('test');
            expect(bundle.js).to.be.undefined;
            expect(bundle.htmlTemplates[0].filename).to.equal('test.html');
            expect(bundle.htmlTemplates[0].content).to.equal(htmlContent);
            expect(bundle.htmlTemplates[0].isPrimary).to.be.true;
        });

        it('should throw error for unsupported file extension', () => {
            expect(() => {
                LwcBundle.lwcBundleFromFile('content', '/path/to/test.css', '.css');
            }).to.throw('Unsupported file extension: .css');
        });
    });

    describe('lwcBundleFromFilesystem', () => {
        let mockFs;
        const testDir = join('path', 'to');
        const testJsPath = join(testDir, 'test.js');
        const testHtmlPath = join(testDir, 'test.html');
        const nonexistentPath = join(testDir, 'nonexistent.js');
        const cssPath = join(testDir, 'test.css');

        beforeEach(() => {
            mockFs = new MockFilesystemProvider();
            mockFs.addFile(testJsPath, 'export default class Test {}');
            mockFs.addFile(testHtmlPath, '<template></template>');
            mockFs.addDirectory(testDir, ['test.js', 'test.html']);
        });

        it('should create bundle from filesystem files', () => {
            const jsContent = 'export default class Test {}';
            const bundle = LwcBundle.lwcBundleFromFilesystem(jsContent, testJsPath, '.js', mockFs);

            expect(bundle.componentBaseName).to.equal('test');
            expect(bundle.js.filename).to.equal('test.js');
            expect(bundle.js.content).to.equal(jsContent);
            expect(bundle.js.isPrimary).to.be.true;
            expect(bundle.htmlTemplates[0].filename).to.equal('test.html');
            expect(bundle.htmlTemplates[0].content).to.equal('<template></template>');
            expect(bundle.htmlTemplates[0].isPrimary).to.be.false;
        });

        it('should return null for non-existent file', () => {
            const bundle = LwcBundle.lwcBundleFromFilesystem(
                'content',
                nonexistentPath,
                '.js',
                mockFs
            );
            expect(bundle).to.be.null;
        });

        it('should throw error for unsupported file extension', () => {
            expect(() => {
                LwcBundle.lwcBundleFromFilesystem('content', cssPath, '.css', mockFs);
            }).to.throw('Unsupported file extension: .css');
        });
    });
});
