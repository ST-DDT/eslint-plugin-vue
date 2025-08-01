/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/no-deprecated-vue-config-keycodes')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2020 }
})

ruleTester.run('no-deprecated-vue-config-keycodes', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `Vue.config.silent = true`
    },
    {
      filename: 'test.js',
      code: 'config.keyCodes = {}'
    },
    {
      filename: 'test.js',
      code: 'V.config.keyCodes = {}'
    }
  ],

  invalid: [
    {
      filename: 'test.js',
      code: 'Vue.config.keyCodes = {}',
      errors: [
        {
          message: '`Vue.config.keyCodes` are deprecated.',
          line: 1,
          column: 1,
          type: 'MemberExpression',
          // messageId: 'unexpected',
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.js',
      code: 'Vue?.config?.keyCodes',
      errors: [
        {
          message: '`Vue.config.keyCodes` are deprecated.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.js',
      code: '(Vue?.config)?.keyCodes',
      errors: [
        {
          message: '`Vue.config.keyCodes` are deprecated.',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 24
        }
      ]
    }
  ]
})
