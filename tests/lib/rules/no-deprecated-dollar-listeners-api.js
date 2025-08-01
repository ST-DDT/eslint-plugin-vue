/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/no-deprecated-dollar-listeners-api')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})
ruleTester.run('no-deprecated-dollar-listeners-api', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-bind="$attrs"/>
        </template>
        <script>
        export default {
          mounted () {
            this.$emit('start')
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
          methods: {
            click () {
              this.$emit('click')
            }
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
        }
        const another = function () {
          console.log(this.$listeners)
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div foo="$listeners"/>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-on="() => {
            function click ($listeners) {
              fn(foo.$listeners)
              fn($listeners)
            }
          }"/>
          <div v-for="$listeners in list">
            <div v-on="$listeners">
          </div>
          <VueComp>
            <template v-slot="{$listeners}">
              <div v-on="$listeners">
            </template>
          </VueComp>
        </template>
        <script>
        export default {
          methods: {
            click ($listeners) {
              foo.$listeners
            }
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
          computed: {
            foo () {
              const {vm} = this
              return vm.$listeners
            }
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
        <template>
          <div v-on="$listeners"/>
        </template>
        <script>
        export default {
          computed: {
            foo () {
              return this.$listeners
            }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 32
        },
        {
          messageId: 'deprecated',
          line: 9,
          column: 27,
          endLine: 9,
          endColumn: 37
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="listener in $listeners"/>
          <div :foo="$listeners"/>
        </template>
        <script>
        export default {
          computed: {
            foo () {
              fn(this.$listeners)
            }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 3,
          column: 35,
          endLine: 3,
          endColumn: 45
        },
        {
          messageId: 'deprecated',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 32
        },
        {
          messageId: 'deprecated',
          line: 10,
          column: 23,
          endLine: 10,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          computed: {
            foo () {
              const vm = this
              return vm.$listeners
            }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 7,
          column: 25,
          endLine: 7,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          computed: {
            foo () {
              const vm = this
              function fn() {
                return vm.$listeners
              }
              return fn()
            }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 8,
          column: 27,
          endLine: 8,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          computed: {
            foo () {
              const vm = this
              const a = vm?.$listeners
              const b = this?.$listeners
            }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 7,
          column: 29,
          endLine: 7,
          endColumn: 39
        },
        {
          messageId: 'deprecated',
          line: 8,
          column: 31,
          endLine: 8,
          endColumn: 41
        }
      ]
    }
  ]
})
