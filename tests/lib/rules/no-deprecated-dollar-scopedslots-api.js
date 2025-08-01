/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/no-deprecated-dollar-scopedslots-api')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})
ruleTester.run('no-deprecated-dollar-scopedslots-api', rule, {
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
          console.log(this.$scopedSlots)
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div foo="$scopedSlots"/>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-on="() => {
            function click ($scopedSlots) {
              fn(foo.$scopedSlots)
              fn($scopedSlots)
            }
          }"/>
          <div v-for="$scopedSlots in list">
            <div v-on="$scopedSlots">
          </div>
          <VueComp>
            <template v-slot="{$scopedSlots}">
              <div v-on="$scopedSlots">
            </template>
          </VueComp>
        </template>
        <script>
        export default {
          methods: {
            click ($scopedSlots) {
              foo.$scopedSlots
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
              return vm.$scopedSlots
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
          <div v-if="$scopedSlots.default"/>
        </template>
        <script>
        export default {
          render() {
            return this.$scopedSlots.foo('bar')
          }
        }
        </script>
      `,
      output: `
        <template>
          <div v-if="$slots.default"/>
        </template>
        <script>
        export default {
          render() {
            return this.$slots.foo('bar')
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
          endColumn: 34
        },
        {
          messageId: 'deprecated',
          line: 8,
          column: 25,
          endLine: 8,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="slot in $scopedSlots"/>
          <div :foo="$scopedSlots"/>
        </template>
        <script>
        export default {
          computed: {
            foo () {
              fn(this.$scopedSlots)
            }
          }
        }
        </script>
      `,
      output: `
        <template>
          <div v-for="slot in $slots"/>
          <div :foo="$slots"/>
        </template>
        <script>
        export default {
          computed: {
            foo () {
              fn(this.$slots)
            }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 43
        },
        {
          messageId: 'deprecated',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 34
        },
        {
          messageId: 'deprecated',
          line: 10,
          column: 23,
          endLine: 10,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          render() {
            const vm = this
            return vm.$scopedSlots.foo('bar')
          }
        }
        </script>
      `,
      output: `
        <script>
        export default {
          render() {
            const vm = this
            return vm.$slots.foo('bar')
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 6,
          column: 23,
          endLine: 6,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          render() {
            const vm = this
            function fn() {
              return vm.$scopedSlots
            }
            return fn().foo('bar')
          }
        }
        </script>
      `,
      output: `
        <script>
        export default {
          render() {
            const vm = this
            function fn() {
              return vm.$slots
            }
            return fn().foo('bar')
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
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          render () {
            const vm = this
            const a = vm?.$scopedSlots
            const b = this?.$scopedSlots
            return a.foo('bar')
          }
        }
        </script>
      `,
      output: `
        <script>
        export default {
          render () {
            const vm = this
            const a = vm?.$slots
            const b = this?.$slots
            return a.foo('bar')
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 6,
          column: 27,
          endLine: 6,
          endColumn: 39
        },
        {
          messageId: 'deprecated',
          line: 7,
          column: 29,
          endLine: 7,
          endColumn: 41
        }
      ]
    }
  ]
})
