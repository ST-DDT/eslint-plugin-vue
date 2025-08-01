/**
 * @fileoverview disallow using deprecated events api
 * @author yoyo930021
 */
'use strict'

const rule = require('../../../lib/rules/no-deprecated-events-api')

const RuleTester = require('../../eslint-compat').RuleTester

const languageOptions = {
  ecmaVersion: 2020,
  sourceType: 'module'
}

const ruleTester = new RuleTester()
ruleTester.run('no-deprecated-events-api', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `
        createApp({
          mounted () {
            this.$emit('start')
          }
        })
      `,
      languageOptions
    },
    {
      filename: 'test.js',
      code: `
        createApp({
          methods: {
            click () {
              this.$emit('click')
            }
          }
        })
      `,
      languageOptions
    },
    {
      filename: 'test.js',
      code: `
        const another = function () {
          this.$on('start', args => {
            console.log('start')
          })
        }

        createApp({
          mounted () {
            this.$emit('start')
          }
        })
      `,
      languageOptions
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this.$emit('start')
          }
        })
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          mounted () {
            this.$emit('start')
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        import mitt from 'mitt'
        const emitter = mitt()

        export default {
          setup () {
            emitter.on('foo', e => console.log('foo', e))
            emitter.emit('foo', { a: 'b' })
            emitter.off('foo', onFoo)
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          mounted () {
            a(this.$on)
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            // It is OK because checking whether it is deprecated.
            this.$on?.('start', foo)
            this.$off?.('start', foo)
            this.$once?.('start', foo)
          }
        })
      `,
      languageOptions
    }
  ],

  invalid: [
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this.$on('start', function (args) {
              console.log('start', args)
            })
          }
        })
      `,
      languageOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this.$off('start')
          }
        })
      `,
      languageOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          mounted () {
            this.$once('start', function () {
              console.log('start')
            })
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            const vm = this
            vm.$on('start', function (args) {
              console.log('start', args)
            })
          }
        })
      `,
      languageOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this?.$on('start')
            this?.$off('start')
            this?.$once('start')
          }
        })
      `,
      languageOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 22
        },
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 5,
          column: 19,
          endLine: 5,
          endColumn: 23
        },
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            ;(this?.$on)('start')
            ;(this?.$off)('start')
            ;(this?.$once)('start')
          }
        })
      `,
      languageOptions,
      errors: [
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 24
        },
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 5,
          column: 21,
          endLine: 5,
          endColumn: 25
        },
        {
          message:
            'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.',
          line: 6,
          column: 21,
          endLine: 6,
          endColumn: 26
        }
      ]
    }
  ]
})
