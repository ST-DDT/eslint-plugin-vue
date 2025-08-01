/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/html-end-tags')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('html-end-tags', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><p></p></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><br></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><input></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><img></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><self-closing-custom-element/></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div/></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div a="b>test</div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><!--</div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><svg><![CDATA[test</svg></div></template>'
    },

    // https://github.com/vuejs/eslint-plugin-vue/issues/1403
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <p>
            <Address
              value=""
              onchange="await setTokenAddress(event.target.value)"/>
          </p>
        </div>
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><div></div></template>',
      output: '<template><div><div></div></div></template>',
      errors: [
        {
          message: "'<div>' should have end tag.",
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><p></div></template>',
      output: '<template><div><p></p></div></template>',
      errors: [
        {
          message: "'<p>' should have end tag.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 19
        }
      ]
    }
  ]
})
