/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview This rule checks whether v-model used on the component do not have custom modifiers
 */
'use strict'

const rule = require('../../../lib/rules/no-custom-modifiers-on-v-model')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

ruleTester.run('no-custom-modifiers-on-v-model', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName.trim="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.trim="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName.lazy="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.lazy="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName.number="foo"></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.number="foo"></template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model:propName.aaa="foo"></template>',
      errors: [
        {
          message: "'v-model' directives don't support the modifier 'aaa'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-model.aaa="foo"></template>',
      errors: [
        {
          message: "'v-model' directives don't support the modifier 'aaa'.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 41
        }
      ]
    }
  ]
})
