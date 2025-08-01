/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/no-multiple-slot-args')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})
ruleTester.run('no-multiple-slot-args', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          var children = this.$scopedSlots.default()
          var children = this.$scopedSlots.foo(foo)
          const bar = this.$scopedSlots.bar
          bar(foo)
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          unknown.$scopedSlots.default(foo, bar)
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          // for Vue3
          var children = this.$slots.default()
          var children = this.$slots.foo(foo)
          const bar = this.$slots.bar
          bar(foo)
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          this.$foo.default(foo, bar)
        }
      }
      </script>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          this.$scopedSlots.default(foo, bar)
          this.$scopedSlots.foo(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected multiple arguments.',
          line: 5,
          column: 42,
          endLine: 5,
          endColumn: 45
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 6,
          column: 38,
          endLine: 6,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          this?.$scopedSlots?.default?.(foo, bar)
          this?.$scopedSlots?.foo?.(foo, bar)
          const vm = this
          vm?.$scopedSlots?.default?.(foo, bar)
          vm?.$scopedSlots?.foo?.(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected multiple arguments.',
          line: 5,
          column: 46,
          endLine: 5,
          endColumn: 49
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 6,
          column: 42,
          endLine: 6,
          endColumn: 45
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 8,
          column: 44,
          endLine: 8,
          endColumn: 47
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 9,
          column: 40,
          endLine: 9,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          this.$scopedSlots.default?.(foo, bar)
          this.$scopedSlots.foo?.(foo, bar)
          const vm = this
          vm.$scopedSlots.default?.(foo, bar)
          vm.$scopedSlots.foo?.(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected multiple arguments.',
          line: 5,
          column: 44,
          endLine: 5,
          endColumn: 47
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 6,
          column: 40,
          endLine: 6,
          endColumn: 43
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 8,
          column: 42,
          endLine: 8,
          endColumn: 45
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 9,
          column: 38,
          endLine: 9,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          ;(this?.$scopedSlots)?.default?.(foo, bar)
          ;(this?.$scopedSlots?.foo)?.(foo, bar)
          const vm = this
          ;(vm?.$scopedSlots)?.default?.(foo, bar)
          ;(vm?.$scopedSlots?.foo)?.(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected multiple arguments.',
          line: 5,
          column: 49,
          endLine: 5,
          endColumn: 52
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 8,
          column: 47,
          endLine: 8,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          ;(this?.$scopedSlots).default(foo, bar)
          ;(this?.$scopedSlots?.foo)(foo, bar)
          const vm = this
          ;(vm?.$scopedSlots).default(foo, bar)
          ;(vm?.$scopedSlots?.foo)(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected multiple arguments.',
          line: 5,
          column: 46,
          endLine: 5,
          endColumn: 49
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 8,
          column: 44,
          endLine: 8,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          let children

          this.$scopedSlots.default(foo, { bar })

          children = this.$scopedSlots.foo
          if (children) children(...foo)
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected multiple arguments.',
          line: 7,
          column: 42,
          endLine: 7,
          endColumn: 49
        },
        {
          message: 'Unexpected spread argument.',
          line: 10,
          column: 34,
          endLine: 10,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          // for Vue3
          this.$slots.default(foo, bar)
          this.$slots.foo(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected multiple arguments.',
          line: 6,
          column: 36,
          endLine: 6,
          endColumn: 39
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 7,
          column: 32,
          endLine: 7,
          endColumn: 35
        }
      ]
    }
  ]
})
