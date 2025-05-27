/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { expect } = require('chai');
const {
    FilesystemProvider,
    DefaultFilesystemProvider
} = require('../../../lib/util/filesystem-provider');

describe('FilesystemProvider', () => {
    describe('FilesystemProvider (abstract class)', () => {
        let provider;

        beforeEach(() => {
            provider = new FilesystemProvider();
        });

        it('should throw error for unimplemented existsSync', () => {
            expect(() => provider.existsSync('/some/path')).to.throw('Method not implemented');
        });

        it('should throw error for unimplemented readdirSync', () => {
            expect(() => provider.readdirSync('/some/path')).to.throw('Method not implemented');
        });

        it('should throw error for unimplemented readFileSync', () => {
            expect(() => provider.readFileSync('/some/path')).to.throw('Method not implemented');
        });
    });

    describe('DefaultFilesystemProvider', () => {
        let provider;
        const testDir = __dirname;
        const testFile = __filename;

        beforeEach(() => {
            provider = new DefaultFilesystemProvider();
        });

        it('should check if file exists', () => {
            expect(provider.existsSync(testFile)).to.be.true;
            expect(provider.existsSync('/nonexistent/file')).to.be.false;
        });

        it('should read directory contents', () => {
            const files = provider.readdirSync(testDir);
            expect(files).to.be.an('array');
            expect(files).to.include('filesystem-provider.js');
        });

        it('should read file contents', () => {
            const content = provider.readFileSync(testFile, { encoding: 'utf-8' });
            expect(content).to.be.a('string');
            expect(content).to.include('Copyright');
        });

        it('should handle readFileSync options', () => {
            const content = provider.readFileSync(testFile, { encoding: 'utf-8' });
            expect(content).to.be.a('string');
        });

        it('should throw error for nonexistent file read', () => {
            expect(() => {
                provider.readFileSync('/nonexistent/file');
            }).to.throw();
        });

        it('should throw error for nonexistent directory read', () => {
            expect(() => {
                provider.readdirSync('/nonexistent/directory');
            }).to.throw();
        });
    });
});
