/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

module.exports = {
    displayName: 'Unit Tests',
    setupFilesAfterEnv: ['jest-extended', 'jest-chain'],
    testMatch: [
        '<rootDir>/test/plugin.js',
        '<rootDir>/test/lib/rules/**/*.js',
        '<rootDir>/test/lib/util/**/*.js',
        '<rootDir>/test/lib/lwc-bundle.js',
        '<rootDir>/test/lib/processor.js',
        '!**/test/lib/rules/**/test.js',
        '!**/test/lib/rules/artifacts-combined-files/helper.js',
        '!**/test/lib/rules/shared.js',
        '!**/test/lib/**/mock-*.js'
    ],
    moduleFileExtensions: ['js', 'json'],
    testResultsProcessor: 'jest-sonar-reporter',
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/lib/'],
    moduleDirectories: ['node_modules'],
    collectCoverage: true,
    collectCoverageFrom: ['lib/**/*.js', 'modules/**/*.js'],
    coverageDirectory: 'reports/coverage',
    reporters: [
        'default',
        [
            'jest-junit',
            {
                suiteName: 'Unit Tests',
                output: './reports/junit/jest-results.xml'
            }
        ]
    ]
};
