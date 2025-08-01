/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/html-closing-bracket-spacing')

const ruleTester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

ruleTester.run('html-closing-bracket-spacing', rule, {
  valid: [
    '',
    '<template><div></div><div /></template>',
    '<template><div foo></div><div foo /></template>',
    '<template><div foo=a></div><div foo=a /></template>',
    '<template><div foo="a"></div><div foo="a" /></template>',
    {
      code: '<template ><div ></div><div /></template>',
      options: [{ startTag: 'always' }]
    },
    {
      code: '<template><div></div ><div /></template >',
      options: [{ endTag: 'always' }]
    },
    {
      code: '<template><div></div><div/></template>',
      options: [{ selfClosingTag: 'never' }]
    },
    '<template><div',
    '<template><div></div',
    {
      code: '<template><div',
      options: [{ startTag: 'never', endTag: 'never' }]
    },
    {
      code: '<template><div></div',
      options: [{ startTag: 'never', endTag: 'never' }]
    }
  ],
  invalid: [
    {
      code: '<template>\n  <div >\n  </div >\n  <div/>\n</template>',
      output: '<template>\n  <div>\n  </div>\n  <div />\n</template>',
      errors: [
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 7,
          endColumn: 9,
          endLine: 2
        },
        {
          message: "Expected no space before '>', but found.",
          line: 3,
          column: 8,
          endColumn: 10,
          endLine: 3
        },
        {
          message: "Expected a space before '/>', but not found.",
          line: 4,
          column: 7,
          endColumn: 9,
          endLine: 4
        }
      ]
    },
    {
      code: '<template>\n  <div foo ></div>\n  <div foo/>\n</template>',
      output: '<template>\n  <div foo></div>\n  <div foo />\n</template>',
      errors: [
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 11,
          endColumn: 13,
          endLine: 2
        },
        {
          message: "Expected a space before '/>', but not found.",
          line: 3,
          column: 11,
          endColumn: 13,
          endLine: 3
        }
      ]
    },
    {
      code: '<template>\n  <div foo="1" ></div>\n  <div foo="1"/>\n</template>',
      output:
        '<template>\n  <div foo="1"></div>\n  <div foo="1" />\n</template>',
      errors: [
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 15,
          endColumn: 17,
          endLine: 2
        },
        {
          message: "Expected a space before '/>', but not found.",
          line: 3,
          column: 15,
          endColumn: 17,
          endLine: 3
        }
      ]
    },
    {
      code: `
        <template ></template >
        <script ></script >
        <style ></style >
      `,
      output: `
        <template></template>
        <script></script>
        <style></style>
      `,
      errors: [
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 18,
          endColumn: 20,
          endLine: 2
        },
        {
          message: "Expected no space before '>', but found.",
          line: 2,
          column: 30,
          endColumn: 32,
          endLine: 2
        },
        {
          message: "Expected no space before '>', but found.",
          line: 3,
          column: 16,
          endColumn: 18,
          endLine: 3
        },
        {
          message: "Expected no space before '>', but found.",
          line: 3,
          column: 26,
          endColumn: 28,
          endLine: 3
        },
        {
          message: "Expected no space before '>', but found.",
          line: 4,
          column: 15,
          endColumn: 17,
          endLine: 4
        },
        {
          message: "Expected no space before '>', but found.",
          line: 4,
          column: 24,
          endColumn: 26,
          endLine: 4
        }
      ]
    },
    {
      code: '<template >\n  <div>\n  </div>\n  <div />\n</template >',
      output: '<template >\n  <div >\n  </div >\n  <div/>\n</template >',
      options: [
        {
          startTag: 'always',
          endTag: 'always',
          selfClosingTag: 'never'
        }
      ],
      errors: [
        {
          message: "Expected a space before '>', but not found.",
          line: 2,
          column: 7,
          endColumn: 8,
          endLine: 2
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 3,
          column: 8,
          endColumn: 9,
          endLine: 3
        },
        {
          message: "Expected no space before '/>', but found.",
          line: 4,
          column: 7,
          endColumn: 10,
          endLine: 4
        }
      ]
    },
    {
      code: `
        <template></template>
        <script></script>
        <style></style>
      `,
      output: `
        <template ></template >
        <script ></script >
        <style ></style >
      `,
      options: [
        {
          startTag: 'always',
          endTag: 'always',
          selfClosingTag: 'never'
        }
      ],
      errors: [
        {
          message: "Expected a space before '>', but not found.",
          line: 2,
          column: 18,
          endColumn: 19,
          endLine: 2
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 2,
          column: 29,
          endColumn: 30,
          endLine: 2
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 3,
          column: 16,
          endColumn: 17,
          endLine: 3
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 3,
          column: 25,
          endColumn: 26,
          endLine: 3
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 4,
          column: 15,
          endColumn: 16,
          endLine: 4
        },
        {
          message: "Expected a space before '>', but not found.",
          line: 4,
          column: 23,
          endColumn: 24,
          endLine: 4
        }
      ]
    }
  ]
})
