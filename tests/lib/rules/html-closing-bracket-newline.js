/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/html-closing-bracket-newline')
const RuleTester = require('../../eslint-compat').RuleTester

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('html-closing-bracket-newline', rule, {
  valid: [
    `<template><div></div></template>`,
    `
      <template>
        <div
          id=""
        >
        </div>
      </template>
    `,
    {
      code: `<template><div></div></template>`,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ]
    },
    {
      code: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ]
    },
    {
      code: `
        <template>
          <div
            id=""
            >
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'always'
        }
      ]
    },
    {
      code: `
        <template>
          <div id="">
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'always'
        }
      ]
    },
    {
      code: `
        <template
        >
          <div
            id="">
          </div
          >
        </template
        >
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'never'
        }
      ]
    },
    {
      code: `
        <template
        >
          <div id=""
          >
          </div
          >
        </template
        >
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'never'
        }
      ]
    },
    {
      code: `
        <template>
          <MyComp
            :foo="foo"
          />
          <MyComp :foo="foo" />
        </template>
      `,
      options: [
        {
          selfClosingTag: {
            singleline: 'never',
            multiline: 'always'
          }
        }
      ]
    },
    {
      code: `
        <template>
          <MyComp :foo="foo"
          />
          <MyComp
            :foo="foo" />
        </template>
      `,
      options: [
        {
          selfClosingTag: {
            singleline: 'always',
            multiline: 'never'
          }
        }
      ]
    },

    // Ignore if no closing brackets
    `
      <template>
        <div
          id=
          ""
    `
  ],
  invalid: [
    {
      code: `
        <template>
          <div
          ></div

          >
        </template>
      `,
      output: `
        <template>
          <div></div>
        </template>
      `,
      errors: [
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 3,
          column: 15,
          endLine: 4,
          endColumn: 11
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 2 line breaks found.',
          line: 4,
          column: 17,
          endLine: 6,
          endColumn: 11
        }
      ]
    },
    {
      code: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      output: `
        <template>
          <div
            id=""
>
          </div>
        </template>
      `,
      errors: [
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: `
        <template>
          <div
          ></div

          >
        </template>
      `,
      output: `
        <template>
          <div></div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ],
      errors: [
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 3,
          column: 15,
          endLine: 4,
          endColumn: 11
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 2 line breaks found.',
          line: 4,
          column: 17,
          endLine: 6,
          endColumn: 11
        }
      ]
    },
    {
      code: `
        <template>
          <div
            id=""
            >
          </div>
        </template>
      `,
      output: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ],
      errors: [
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 4,
          column: 18,
          endLine: 5,
          endColumn: 13
        }
      ]
    },
    {
      code: `
        <template>
          <div
            id="">
          </div>
        </template>
      `,
      output: `
        <template>
          <div
            id=""
>
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'always'
        }
      ],
      errors: [
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: `
        <template>
          <div id=""
          >
          </div
          >
        </template>
      `,
      output: `
        <template>
          <div id="">
          </div>
        </template>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'always'
        }
      ],
      errors: [
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 3,
          column: 21,
          endLine: 4,
          endColumn: 11
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 5,
          column: 16,
          endLine: 6,
          endColumn: 11
        }
      ]
    },
    {
      code: `
        <template
        >
          <div
            id=""
            >
          </div>
        </template
        >
      `,
      output: `
        <template
        >
          <div
            id="">
          </div
>
        </template
        >
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'never'
        }
      ],
      errors: [
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 5,
          column: 18,
          endLine: 6,
          endColumn: 13
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 7,
          column: 16,
          endLine: 7,
          endColumn: 16
        }
      ]
    },
    {
      code: `
        <template
        >
          <div id="">
          </div>
        </template
        >
      `,
      output: `
        <template
        >
          <div id=""
>
          </div
>
        </template
        >
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'never'
        }
      ],
      errors: [
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 21
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 16
        }
      ]
    },
    {
      code: `
        <template
        >
        </template
        >
        <script
        >
        </script
        >
        <style
        ></style
        >
      `,
      output: `
        <template>
        </template>
        <script>
        </script>
        <style></style>
      `,
      options: [
        {
          singleline: 'never',
          multiline: 'never'
        }
      ],
      errors: [
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 2,
          column: 18,
          endLine: 3,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 4,
          column: 19,
          endLine: 5,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 6,
          column: 16,
          endLine: 7,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 8,
          column: 17,
          endLine: 9,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 10,
          column: 15,
          endLine: 11,
          endColumn: 9
        },
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 11,
          column: 17,
          endLine: 12,
          endColumn: 9
        }
      ]
    },
    {
      code: `
        <template>
        </template>
        <script>
        </script>
        <style></style>
      `,
      output: `
        <template
>
        </template
>
        <script
>
        </script
>
        <style
></style
>
      `,
      options: [
        {
          singleline: 'always',
          multiline: 'always'
        }
      ],
      errors: [
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 2,
          column: 18,
          endColumn: 18,
          endLine: 2
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 3,
          column: 19,
          endColumn: 19,
          endLine: 3
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 4,
          column: 16,
          endColumn: 16,
          endLine: 4
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 5,
          column: 17,
          endColumn: 17,
          endLine: 5
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 6,
          column: 15,
          endColumn: 15,
          endLine: 6
        },
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 6,
          column: 23,
          endColumn: 23,
          endLine: 6
        }
      ]
    },
    {
      code: `
        <template>
          <MyComp
          />
        </template>
      `,
      output: `
        <template>
          <MyComp/>
        </template>
      `,
      options: [
        {
          selfClosingTag: {
            singleline: 'never',
            multiline: 'always'
          }
        }
      ],
      errors: [
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 3,
          column: 18,
          endLine: 4,
          endColumn: 11
        }
      ]
    },
    {
      code: `
        <template>
          <MyComp
            :foo="foo"/>
        </template>
      `,
      output: `
        <template>
          <MyComp
            :foo="foo"
/>
        </template>
      `,
      options: [
        {
          selfClosingTag: {
            singleline: 'never',
            multiline: 'always'
          }
        }
      ],
      errors: [
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 23
        }
      ]
    },
    {
      code: `
        <template>
          <MyComp :foo="foo"/>
        </template>
      `,
      output: `
        <template>
          <MyComp :foo="foo"
/>
        </template>
      `,
      options: [
        {
          selfClosingTag: {
            singleline: 'always',
            multiline: 'never'
          }
        }
      ],
      errors: [
        {
          message:
            'Expected 1 line break before closing bracket, but no line breaks found.',
          line: 3,
          column: 29,
          endLine: 3,
          endColumn: 29
        }
      ]
    },
    {
      code: `
        <template>
          <MyComp
            :foo="foo"
          />
        </template>
      `,
      output: `
        <template>
          <MyComp
            :foo="foo"/>
        </template>
      `,
      options: [
        {
          selfClosingTag: {
            singleline: 'always',
            multiline: 'never'
          }
        }
      ],
      errors: [
        {
          message:
            'Expected no line breaks before closing bracket, but 1 line break found.',
          line: 4,
          column: 23,
          endLine: 5,
          endColumn: 11
        }
      ]
    }
  ]
})
