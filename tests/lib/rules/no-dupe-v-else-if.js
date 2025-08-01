/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-dupe-v-else-if')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2019,
    sourceType: 'module'
  }
})

tester.run('no-dupe-v-else-if', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" />
        <div v-else-if="bar" />
        <div v-else-if="baz" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" >
          <div v-else-if="foo" />
        </div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" />
        <div v-else-if="bar" />
        <div v-if="bar" />
        <div v-else-if="foo" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="isSomething(x)" />
        <div v-else-if="isSomethingElse(x)" />

        <div v-if="a" />
        <div v-else-if="b" />
        <div v-else-if="c && d" />
        <div v-else-if="c && e" />

        <div v-if="n === 1" />
        <div v-else-if="n === 2" />
        <div v-else-if="n === 3" />
        <div v-else-if="n === 4" />
        <div v-else-if="n === 5" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" />
        <div />
        <div v-else-if="foo" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if />
        <div v-else-if />
      </template>
      `
    },
    // parse error
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo." />
        <div v-else-if="foo." />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-else-if="foo." />
        <div v-else-if="foo" />
      </template>
      `
    },

    // Referred to the ESLint core rule.
    '<template><div v-if="a" /><div v-else-if="b" /></template>',
    '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="c" /></template>',
    '<template><div v-if="true" /><div v-else-if="false" /></template>',
    '<template><div v-if="1" /><div v-else-if="2" /></template>',
    '<template><div v-if="f" /><div v-else-if="f()" /></template>',
    '<template><div v-if="f(a)" /><div v-else-if="g(a)" /></template>',
    '<template><div v-if="f(a)" /><div v-else-if="f(b)" /></template>',
    '<template><div v-if="a === 1" /><div v-else-if="a === 2" /></template>',
    '<template><div v-if="a === 1" /><div v-else-if="b === 1" /></template>',
    '<template><div v-if="a" /></template>',
    '<template><div v-if="a"><div v-if="a" /></div></template>',
    '<template><div v-if="a"><div v-if="b" /></div><div v-else-if="b" /></template>',
    '<template><div v-if="a"><div v-if="b" /><div v-else-if="a" /></div></template>',
    '<template><div v-if="a" /><div v-else-if="!!a" /></template>',
    '<template><div v-if="a === 1" /><div v-else-if="a === (1)" /></template>',
    '<template><div v-if="a || b" /><div v-else-if="c || d" /></template>',
    '<template><div v-if="a || b" /><div v-else-if="a || c" /></template>',
    '<template><div v-if="a" /><div v-else-if="a || b" /></template>',
    '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="a || b || c" /></template>',
    '<template><div v-if="a && b" /><div v-else-if="a" /><div v-else-if="b" /></template>',
    '<template><div v-if="a && b" /><div v-else-if="b && c" /><div v-else-if="a && c" /></template>',
    '<template><div v-if="a && b" /><div v-else-if="b || c" /></template>',
    '<template><div v-if="a" /><div v-else-if="b && (a || c)" /></template>',
    '<template><div v-if="a" /><div v-else-if="b && (c || d && a)" /></template>',
    '<template><div v-if="a && b && c" /><div v-else-if="a && b && (c || d)" /></template>'
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" />
        <div v-else-if="foo" />
      </template>
      `,
      errors: [
        {
          message:
            'This branch can never execute. Its condition is a duplicate or covered by previous conditions in the `v-if` / `v-else-if` chain.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="isSomething(x)" />
        <div v-else-if="isSomething(x)" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a" />
        <div v-else-if="b" />
        <div v-else-if="c && d" />
        <div v-else-if="c && d" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="n === 1" />
        <div v-else-if="n === 2" />
        <div v-else-if="n === 3" />
        <div v-else-if="n === 2" />
        <div v-else-if="n === 5" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a || b" />
        <div v-else-if="a" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a" />
        <div v-else-if="b" />
        <div v-else-if="a || b" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a" />
        <div v-else-if="a && b" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a && b" />
        <div v-else-if="a && b && c" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a || b" />
        <div v-else-if="b && c" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a" />
        <div v-else-if="b && c" />
        <div v-else-if="d && (c && e && b || a)" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 5,
          column: 31,
          endLine: 5,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="foo" />
        <div v-else-if="foo && bar" />
        <div v-else-if="baz && foo" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 28
        },
        {
          messageId: 'unexpected',
          line: 5,
          column: 32,
          endLine: 5,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a && b" />
        <div v-else-if="a && b && c" />
        <div v-else-if="a && c && b" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 36
        },
        {
          messageId: 'unexpected',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="a || b" />
        <div v-else-if="a" />
        <div v-else-if="b" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 26
        },
        {
          messageId: 'unexpected',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'foo.vue',
      code: `
      <template>
        <div v-if      ="((f && e) || d) && c || (b && a)" />
        <div v-else-if ="(a && b) || (c && (d || (e && f)))" />
        <div v-else-if ="(a && b) || (c && (d || (e && f)))" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 60
        },
        {
          messageId: 'unexpected',
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 60
        }
      ]
    },

    // Referred to the ESLint core rule.
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="a" /><div v-else-if="c" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 64,
          endLine: 1,
          endColumn: 65
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 64,
          endLine: 1,
          endColumn: 65
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="c" /><div v-else-if="a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 85,
          endLine: 1,
          endColumn: 86
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 64,
          endLine: 1,
          endColumn: 65
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="c" /><div v-else-if="b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 85,
          endLine: 1,
          endColumn: 86
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="c" /><div v-else-if="b" /><div v-else-if="d" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 85,
          endLine: 1,
          endColumn: 86
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="c" /><div v-else-if="d" /><div v-else-if="b" /><div v-else-if="e" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 106,
          endLine: 1,
          endColumn: 107
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="a" /><div v-else-if="a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 44
        },
        {
          messageId: 'unexpected',
          line: 1,
          column: 64,
          endLine: 1,
          endColumn: 65
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="a" /><div v-else-if="b" /><div v-else-if="a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 64,
          endLine: 1,
          endColumn: 65
        },
        {
          messageId: 'unexpected',
          line: 1,
          column: 85,
          endLine: 1,
          endColumn: 86
        },
        {
          messageId: 'unexpected',
          line: 1,
          column: 106,
          endLine: 1,
          endColumn: 107
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a"><div v-if="b" /></div><div v-else-if="a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 63,
          endLine: 1,
          endColumn: 64
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a === 1" /><div v-else-if="a === 1" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 49,
          endLine: 1,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="1 < a" /><div v-else-if="1 < a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 47,
          endLine: 1,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="true" /><div v-else-if="true" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 46,
          endLine: 1,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a && b" /><div v-else-if="a && b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a && b || c" /><div v-else-if="a && b || c" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 53,
          endLine: 1,
          endColumn: 64
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="f(a)" /><div v-else-if="f(a)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 46,
          endLine: 1,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a === 1" /><div v-else-if="a===1" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 49,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a === 1" /><div v-else-if="a === /* comment */ 1" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 49,
          endLine: 1,
          endColumn: 70
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b" /><div v-else-if="a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b" /><div v-else-if="a" /><div v-else-if="b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 49
        },
        {
          messageId: 'unexpected',
          line: 1,
          column: 69,
          endLine: 1,
          endColumn: 70
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b" /><div v-else-if="b || a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="a || b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 64,
          endLine: 1,
          endColumn: 70
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b" /><div v-else-if="c || d" /><div v-else-if="a || d" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 74,
          endLine: 1,
          endColumn: 80
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="(a === b && fn(c)) || d" /><div v-else-if="fn(c) && a === b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 65,
          endLine: 1,
          endColumn: 81
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="a && b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a && b" /><div v-else-if="a && b && c" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 59
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || c" /><div v-else-if="a && b || c" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 59
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="c && a || b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 64,
          endLine: 1,
          endColumn: 75
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="c && (a || b)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 70,
          endLine: 1,
          endColumn: 76
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b && c" /><div v-else-if="d && (a || e && c && b)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 75,
          endLine: 1,
          endColumn: 91
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b && c" /><div v-else-if="b && c && d" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 53,
          endLine: 1,
          endColumn: 64
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b" /><div v-else-if="b && c" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="(a || b) && c" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 65,
          endLine: 1,
          endColumn: 71
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="(a && (b || c)) || d" /><div v-else-if="(c || b) && e && a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 62,
          endLine: 1,
          endColumn: 80
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a && b || b && c" /><div v-else-if="a && b && c" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 58,
          endLine: 1,
          endColumn: 69
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b && c" /><div v-else-if="d && (c && e && b || a)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 75,
          endLine: 1,
          endColumn: 91
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || (b && (c || d))" /><div v-else-if="(d || c) && b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 62,
          endLine: 1,
          endColumn: 75
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b" /><div v-else-if="(b || a) && c" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 49,
          endLine: 1,
          endColumn: 55
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b" /><div v-else-if="c" /><div v-else-if="d" /><div v-else-if="b && (a || c)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 90,
          endLine: 1,
          endColumn: 91
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b || c" /><div v-else-if="a || (b && d) || (c && e)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 53,
          endLine: 1,
          endColumn: 78
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || (b || c)" /><div v-else-if="a || (b && c)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 55,
          endLine: 1,
          endColumn: 68
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || b" /><div v-else-if="c" /><div v-else-if="d" /><div v-else-if="(a || c) && (b || d)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 91,
          endLine: 1,
          endColumn: 97
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="b" /><div v-else-if="c && (a || d && b)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 70,
          endLine: 1,
          endColumn: 81
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="a || a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || a" /><div v-else-if="a || a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a || a" /><div v-else-if="a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a" /><div v-else-if="a && a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a && a" /><div v-else-if="a && a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-if="a && a" /><div v-else-if="a" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 48,
          endLine: 1,
          endColumn: 49
        }
      ]
    }
  ]
})
