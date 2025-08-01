/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-lone-template')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2019,
    sourceType: 'module'
  }
})

tester.run('no-lone-template', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-if="foo">...</template>
        <template v-else-if="bar">...</template>
        <template v-else>...</template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-for="e in list">...</template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-slot>...</template>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <CoolButton>
         <template slot="foo">...</template>
        </CoolButton>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <CoolButton>
         <template slot-scope="foo">...</template>
        </CoolButton>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <CoolButton>
         <template scope="foo">...</template>
        </CoolButton>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template id="a">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template :id="a">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template ref="b">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template :ref="b">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <template>...</template>
      </template>
      `,
      errors: [
        {
          message: '`<template>` require directive.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template/>
      </template>
      `,
      errors: [
        {
          message: '`<template>` require directive.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-on:id="a">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }],
      errors: [
        {
          message: '`<template>` require directive.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-bind="id">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }],
      errors: [
        {
          message: '`<template>` require directive.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template v-bind:[foo]="id">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }],
      errors: [
        {
          message: '`<template>` require directive.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <template class="b">...</template>
      </template>
      `,
      options: [{ ignoreAccessible: true }],
      errors: [
        {
          message: '`<template>` require directive.',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 29
        }
      ]
    }
  ]
})
