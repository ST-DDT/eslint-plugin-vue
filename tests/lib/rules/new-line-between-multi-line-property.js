/**
 * @fileoverview Enforce new lines between multi-line properties in Vue components.
 * @author IWANABETHATGUY
 */
'use strict'

const rule = require('../../../lib/rules/new-line-between-multi-line-property')
const RuleTester = require('../../eslint-compat').RuleTester
const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2015,
    sourceType: 'module'
  }
})

ruleTester.run('new-line-between-multi-line-property', rule, {
  valid: [
    // test good example of proposal https://github.com/vuejs/eslint-plugin-vue/issues/391
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        name: 'component-name',
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        },

        computed: {
          formattedValue: function () {
            // ...
            // ...
            // ...
            // ...
          },

          inputClasses: function () {
            // ...
            // ...
            // ...
            // ...
          }
        },

        methods: {
          methodA: function () {
            // ...
            // ...
            // ...
          },

          methodB: function () {
            // ...
            // ...
            // ...
          }
        }
      }
      </script>
      `
    },
    // should valid if there are more than one line between
    // multiline property
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        name: 'component-name',
        props: {
          value: {
            type: String,
            required: true
          },


          focused: {
            type: Boolean,
            default: false
          },


          label: String,
          icon: String
        },
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
        }/*A*/

        ,/*B*/emits: {
        },
      }
      </script>`
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },
          label: String,
          icon: String
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 13,
          column: 12,
          endLine: 14,
          endColumn: 11
        }
      ]
    },
    // test bad example of proposal https://github.com/vuejs/eslint-plugin-vue/issues/391
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        name: 'component-name',
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        },
        computed: {
          formattedValue: function () {
            // ...
            // ...
            // ...
            // ...
          },

          inputClasses: function () {
            // ...
            // ...
            // ...
            // ...
          }
        },
        methods: {
          methodA: function () {
            // ...
            // ...
            // ...
          },

          methodB: function () {
            // ...
            // ...
            // ...
          }
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        name: 'component-name',
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        },

        computed: {
          formattedValue: function () {
            // ...
            // ...
            // ...
            // ...
          },

          inputClasses: function () {
            // ...
            // ...
            // ...
            // ...
          }
        },

        methods: {
          methodA: function () {
            // ...
            // ...
            // ...
          },

          methodB: function () {
            // ...
            // ...
            // ...
          }
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 18,
          column: 10,
          endLine: 19,
          endColumn: 9
        },
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 33,
          column: 10,
          endLine: 34,
          endColumn: 9
        }
      ]
    },
    // test set insertLine and minLineOfMultilineProperty to 5
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          setMultiLineProperty: {
            type: String,
            required: true
          },
          focused: {
            type: Boolean,
            default: false,
            required: true
          },
          label: String,
          icon: String
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          setMultiLineProperty: {
            type: String,
            required: true
          },
          focused: {
            type: Boolean,
            default: false,
            required: true
          },

          label: String,
          icon: String
        }
      }
      </script>
      `,
      options: [{ minLineOfMultilineProperty: 5 }],
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 13,
          column: 12,
          endLine: 14,
          endColumn: 11
        }
      ]
    },
    // test js comments
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          setMultiLineProperty: {
            type: String,
            required: true
          },
          focused: {
            type: Boolean,
            default: false,
            required: true
          },
          // comments
          label: String,
          icon: String
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          setMultiLineProperty: {
            type: String,
            required: true
          },
          focused: {
            type: Boolean,
            default: false,
            required: true
          },

          // comments
          label: String,
          icon: String
        }
      }
      </script>
      `,
      options: [{ minLineOfMultilineProperty: 5 }],
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 13,
          column: 12,
          endLine: 15,
          endColumn: 11
        }
      ]
    },
    // test js doc
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          setMultiLineProperty: {
            type: String,
            required: true
          },
        },

        methods: {
          test() {

          },
          /**
          *
          * @returns
          */
          test2() {

          }
        }
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          setMultiLineProperty: {
            type: String,
            required: true
          },
        },

        methods: {
          test() {

          },

          /**
          *
          * @returns
          */
          test2() {

          }
        }
      }
      </script>
      `,
      options: [],
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 14,
          column: 12,
          endLine: 19,
          endColumn: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },
          focused: {
            type: Boolean,
            default: false
          },
          label: String,
          icon: String
        },
        staticMethodFn() {
          fn(
            fn(),
            {
            a: {
              foo,
            },
            b: {
              foo,
            },
            c: {
              foo,
            },
          });
        },
      }
      </script>
      `,
      output: `
      <script>
      export default {
        props: {
          value: {
            type: String,
            required: true
          },

          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        },

        staticMethodFn() {
          fn(
            fn(),
            {
            a: {
              foo,
            },
            b: {
              foo,
            },
            c: {
              foo,
            },
          });
        },
      }
      </script>
      `,
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 8,
          column: 12,
          endLine: 9,
          endColumn: 11
        },
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 12,
          column: 12,
          endLine: 13,
          endColumn: 11
        },
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 15,
          column: 10,
          endLine: 16,
          endColumn: 9
        }
      ]
    },
    // test Vue.component()
    {
      filename: 'test.vue',
      code: `
      <script>
      Vue.component('test', {
        props: {
          value: {
            type: String,
            required: true
          },
          //test
          focused: {
            type: Boolean,
            default: false
          },
          label: String,
          icon: String
        },
        staticMethodFn() {
          fn(
            fn(),
            {
            a: {
              foo,
            },
            b: {
              foo,
            },
            c: {
              foo,
            },
          });
        },
      })
      </script>
      `,
      output: `
      <script>
      Vue.component('test', {
        props: {
          value: {
            type: String,
            required: true
          },

          //test
          focused: {
            type: Boolean,
            default: false
          },

          label: String,
          icon: String
        },

        staticMethodFn() {
          fn(
            fn(),
            {
            a: {
              foo,
            },
            b: {
              foo,
            },
            c: {
              foo,
            },
          });
        },
      })
      </script>
      `,
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 8,
          column: 12,
          endLine: 10,
          endColumn: 11
        },
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 13,
          column: 12,
          endLine: 14,
          endColumn: 11
        },
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 16,
          column: 10,
          endLine: 17,
          endColumn: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
        },emits: {
        }
      }
      </script>`,
      output: `
      <script>
      export default {
        props: {
        },

emits: {
        }
      }
      </script>`,
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 5,
          column: 10,
          endLine: 5,
          endColumn: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
        }
        ,emits: {
        }
      }
      </script>`,
      output: `
      <script>
      export default {
        props: {
        }

        ,emits: {
        }
      }
      </script>`,
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 5,
          column: 10,
          endLine: 6,
          endColumn: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
        }/*A*/
        ,/*B*/emits: {
        },

        data: {
        }/*A*/,/*B*/computed: {
        },

        watch: {
        }/*A*/,
        /*B*/methods: {
        }
      }
      </script>`,
      output: `
      <script>
      export default {
        props: {
        }/*A*/

        ,/*B*/emits: {
        },

        data: {
        }/*A*/,

/*B*/computed: {
        },

        watch: {
        }/*A*/,

        /*B*/methods: {
        }
      }
      </script>`,
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 5,
          column: 10,
          endLine: 6,
          endColumn: 15
        },
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 10,
          column: 10,
          endLine: 10,
          endColumn: 21
        },
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 14,
          column: 10,
          endLine: 15,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
        }
        ,
        emits: {
        }
      }
      </script>`,
      output: `
      <script>
      export default {
        props: {
        }

        ,
        emits: {
        }
      }
      </script>`,
      errors: [
        {
          message:
            'Enforce new lines between multi-line properties in Vue components.',
          line: 5,
          column: 10,
          endLine: 7,
          endColumn: 9
        }
      ]
    }
  ]
})
