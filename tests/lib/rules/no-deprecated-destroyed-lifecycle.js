/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/no-deprecated-destroyed-lifecycle')

const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})
ruleTester.run('no-deprecated-destroyed-lifecycle', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        unmounted () {},
        beforeUnmount () {},
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        unmounted,
        beforeUnmount,
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        beforeCreate,
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeUnmount,
        unmounted,
        errorCaptured,
        renderTracked,
        renderTriggered,
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        beforeUnmount:beforeDestroy,
        unmounted:destroyed,
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        ...beforeDestroy,
        ...destroyed,
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        [beforeDestroy] () {},
        [destroyed] () {},
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
        beforeDestroy () {},
        destroyed () {},
      }
      </script>
      `,
      output: `
      <script>
      export default {
        beforeUnmount () {},
        unmounted () {},
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 22
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        beforeDestroy,
        destroyed,
      }
      </script>
      `,
      output: `
      <script>
      export default {
        beforeUnmount:beforeDestroy,
        unmounted:destroyed,
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 22
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        beforeCreate,
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeDestroy,
        destroyed,
        errorCaptured,
      }
      </script>
      `,
      output: `
      <script>
      export default {
        beforeCreate,
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeUnmount:beforeDestroy,
        unmounted:destroyed,
        errorCaptured,
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 12,
          column: 9,
          endLine: 12,
          endColumn: 22
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 13,
          column: 9,
          endLine: 13,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        ['beforeDestroy']() {},
        ['destroyed']() {},
      }
      </script>
      `,
      output: `
      <script>
      export default {
        ['beforeUnmount']() {},
        ['unmounted']() {},
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 4,
          column: 10,
          endLine: 4,
          endColumn: 25
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 5,
          column: 10,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        [\`beforeDestroy\`]() {},
        [\`destroyed\`]() {},
      }
      </script>
      `,
      output: `
      <script>
      export default {
        [\`beforeUnmount\`]() {},
        [\`unmounted\`]() {},
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 4,
          column: 10,
          endLine: 4,
          endColumn: 25
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 5,
          column: 10,
          endLine: 5,
          endColumn: 21
        }
      ]
    }
  ]
})
