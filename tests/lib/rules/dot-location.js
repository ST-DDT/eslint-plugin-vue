/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/dot-location')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('dot-location', rule, {
  valid: [
    `<template>
      <div
        :attr="foo.
          bar"
      />
    </template>`,
    {
      code: `
      <template>
        <div
          :attr="foo
            .bar"
        />
      </template>`,
      options: ['property']
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div
          :attr="foo
            .bar"
        />
      </template>`,
      output: `
      <template>
        <div
          :attr="foo.
            bar"
        />
      </template>`,
      errors: [
        {
          message: 'Expected dot to be on same line as object.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    {
      code: `
      <template>
        <div
          :attr="foo.
            bar"
        />
      </template>`,
      output: `
      <template>
        <div
          :attr="foo
            .bar"
        />
      </template>`,
      options: ['property'],
      errors: [
        {
          message: 'Expected dot to be on same line as property.',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 22
        }
      ]
    }
  ]
})
