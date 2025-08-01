/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/brace-style')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('brace-style', rule, {
  valid: [
    `<template><div :attr="function foo() {
      return true;
    }" /></template>`,
    {
      code: `<template><div :attr="function foo() { return true; }" /></template>`,
      options: ['1tbs', { allowSingleLine: true }]
    },
    `<template><div :[(function(){return(1)})()]="a" /></template>`
  ],
  invalid: [
    {
      code: `
        <template>
          <div :attr="function foo()
          {
            return true;
          }" />
        </template>`,
      output: `
        <template>
          <div :attr="function foo() {
            return true;
          }" />
        </template>`,
      errors: [
        {
          message:
            'Opening curly brace does not appear on the same line as controlling statement.',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 12
        }
      ]
    },
    {
      code: `
        <template>
          <div :attr="function foo() { return true; }" />
        </template>`,
      output: `
        <template>
          <div :attr="function foo() {
 return true;\u{20}
}" />
        </template>`,
      errors: [
        {
          message: 'Statement inside of curly braces should be on next line.',
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 39
        },
        {
          message:
            'Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.',
          line: 3,
          column: 53,
          endLine: 3,
          endColumn: 54
        }
      ]
    },
    {
      code: '<template><div :[(function(){return(1)})()]="(function(){return(1)})()" /></template>',
      output: `<template><div :[(function(){return(1)})()]="(function(){
return(1)
})()" /></template>`,
      errors: [
        {
          message: 'Statement inside of curly braces should be on next line.',
          line: 1,
          column: 57,
          endLine: 1,
          endColumn: 58
        },
        {
          message:
            'Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.',
          line: 1,
          column: 67,
          endLine: 1,
          endColumn: 68
        }
      ]
    }
  ]
})
