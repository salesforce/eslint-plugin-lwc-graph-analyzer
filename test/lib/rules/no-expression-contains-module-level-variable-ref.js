/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

'use strict';

const { RuleTester } = require('eslint');
const { RULE_TESTER_CONFIG } = require('./shared');
const allRules = require('../../../lib/index');
const ruleTester = new RuleTester(RULE_TESTER_CONFIG);

ruleTester.run(
    '@salesforce/lwc-graph-analyzer/no-expression-contains-module-level-variable-ref',
    allRules.rules['no-expression-contains-module-level-variable-ref'],
    {
        valid: [],
        invalid: [
            {
                code: `
                import { LightningElement, wire, api } from 'lwc';
                import { getRecord } from 'lightning/uiRecordApi';
                import findContacts from '@salesforce/apex/ContactController.findContacts';
                import { testFunction } from 'test/functoins/testFunctoins';

                const testModuleVar = "test";

                export default class Example extends LightningElement {

                    get searchKey() {
                        let var1, var2 = "hello";
                        var1 = testModuleVar;
                        return "serch key";
                    }

                    testFunction(val){
                        return val;
                    }
                }`,
                filename: 'lwc-code.js', // Komaci needs a fake filename to be provided from RuleTester or otherwise it fails to run
                errors: [
                    {
                        message: `This getter references a variable defined at the module level: 'testModuleVar'.`
                    }
                ]
            }
        ]
    }
);
