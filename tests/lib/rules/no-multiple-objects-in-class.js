/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 */
'use strict'

const rule = require('../../../lib/rules/no-multiple-objects-in-class')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2015,
    sourceType: 'module'
  }
})

ruleTester.run('no-multiple-objects-in-class', rule, {
  valid: [
    `<template><div :class="[{'foo': isFoo}]" /></template>`,
    `<template><div :class="[{'foo': isFoo, 'bar': isBar}]" /></template>`,
    `<template><div v-foo:class="[{'foo': isFoo}, {'bar': isBar}]" /></template>`
  ],
  invalid: [
    {
      code: `<template><div v-bind:class="[{'foo': isFoo}, {'bar': isBar}]" /></template>`,
      errors: [
        {
          message: 'Unexpected multiple objects. Merge objects.',
          type: 'VAttribute',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 63
        }
      ]
    },
    {
      code: `<template><div :class="[{'foo': isFoo}, {'bar': isBar}]" /></template>`,
      errors: [
        {
          message: 'Unexpected multiple objects. Merge objects.',
          type: 'VAttribute',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 57
        }
      ]
    },

    // sparse array
    {
      code: `<template><div v-bind:class="[,{'foo': isFoo}, {'bar': isBar}]" /></template>`,
      errors: [
        {
          message: 'Unexpected multiple objects. Merge objects.',
          type: 'VAttribute',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 64
        }
      ]
    }
  ]
})
