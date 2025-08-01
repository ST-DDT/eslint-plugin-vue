/**
 * @author Yosuke Ota
 */
'use strict'

const { RuleTester } = require('../../eslint-compat')
const rule = require('../../../lib/rules/no-extra-parens')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('no-extra-parens', rule, {
  valid: [
    `<template>
      <button
        :class="{
          a: b || c,
          [d + e]: f
        }"
      />
    </template>`,
    `<template>
      <button
        :class="a + b + c * d"
        :class="[a + b + c * d]"
      />
    </template>`,
    `<template>
      <button
        :[(a+b)+c]="foo"
      />
    </template>`,
    `<template>
      <button
        :[(a+b)]="foo"
      />
    </template>`,

    '<template><button :class="(a+b | bitwise)" /></template>',
    '<template><button>{{ (foo + bar | bitwise) }}</button></template>',
    '<template><button>{{ (foo | bitwise) | filter }}</button></template>',
    '<template><button>{{ (function () {} ()) }}</button></template>',
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind('a')
    }
    </style>`,
    `
    <style>
    .text {
      color: v-bind(a)
    }
    </style>`
  ],
  invalid: [
    {
      code: `
      <template>
        <button
          :class="a + b + (c * d)"
          :class="[a + b + (c * d)]"
        />
      </template>`,
      output: `
      <template>
        <button
          :class="a + b + c * d"
          :class="[a + b + c * d]"
        />
      </template>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 28
        },
        {
          messageId: 'unexpected',
          line: 5,
          column: 28,
          endLine: 5,
          endColumn: 29
        }
      ]
    },
    {
      code: `
      <template>
        <button
          :class="{
            a: (b || c),
            // [(d + e)]: f // valid in eslint v6.0
          }"
        />
      </template>`,
      output: `
      <template>
        <button
          :class="{
            a: b || c,
            // [(d + e)]: f // valid in eslint v6.0
          }"
        />
      </template>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 17
        }
        // valid in eslint v6.0
        // {
        //   messageId: 'unexpected',
        //   line: 6
        // }
      ]
    },
    {
      code: `
      <template>
        <button
          :class="(a+b)+c"
        />
      </template>`,
      output: `
      <template>
        <button
          :class="a+b+c"
        />
      </template>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 20
        }
      ]
    },
    {
      code: '<template><button :class="(a+b)" /></template>',
      output: '<template><button :class="a+b" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          column: 27,
          line: 1,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: '<template><button :class="(a+b) | filter" /></template>',
      output: '<template><button :class="a+b | filter" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: '<template><button :class="((a+b | bitwise))" /></template>',
      output: '<template><button :class="(a+b | bitwise)" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: '<template><button>{{ (foo + bar) }}</button></template>',
      output: '<template><button>{{ foo + bar }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          column: 22,
          line: 1,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><button>{{ (foo + bar) | filter }}</button></template>',
      output: '<template><button>{{ foo + bar | filter }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><button>{{ ((foo + bar | bitwise)) }}</button></template>',
      output:
        '<template><button>{{ (foo + bar | bitwise) }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: '<template><button>{{ ((foo | bitwise)) | filter }}</button></template>',
      output:
        '<template><button>{{ (foo | bitwise) | filter }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: '<template><button>{{ (foo(bar|bitwise)) }}</button></template>',
      output: '<template><button>{{ foo(bar|bitwise) }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><button>{{ ([foo|bitwise]) }}</button></template>',
      output: '<template><button>{{ [foo|bitwise] }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><button>{{ ({foo:bar|bitwise}) }}</button></template>',
      output: '<template><button>{{ {foo:bar|bitwise} }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: '<template><button>{{ ((function () {} ())) }}</button></template>',
      output: '<template><button>{{ (function () {} ()) }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: '<template><button>{{ ((function () {})()) }}</button></template>',
      output: '<template><button>{{ (function () {})() }}</button></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    // CSS vars injection
    {
      code: `
      <style>
      .text {
        color: v-bind('(a)')
      }
      </style>`,
      output: `
      <style>
      .text {
        color: v-bind('a')
      }
      </style>`,
      errors: [
        {
          messageId: 'unexpected',
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 25
        }
      ]
    }
  ]
})
