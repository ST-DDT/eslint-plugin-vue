import globals from 'globals'
import eslintPluginEslintPlugin from 'eslint-plugin-eslint-plugin/configs/all'
import eslintPluginJsonc from 'eslint-plugin-jsonc'
import eslintPluginNodeDependencies from 'eslint-plugin-node-dependencies'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import vueEslintParser from 'vue-eslint-parser'
import noInvalidMeta from './eslint-internal-rules/no-invalid-meta.js'
import noInvalidMetaDocsCategories from './eslint-internal-rules/no-invalid-meta-docs-categories.js'
import requireEslintCommunity from './eslint-internal-rules/require-eslint-community.js'

// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import typegen from 'eslint-typegen'

export default typegen([
  {
    ignores: [
      '.nyc_output',
      'coverage',
      'node_modules',
      'tests/fixtures',
      'tests/integrations/eslint-plugin-import',

      '!.vitepress',
      'docs/.vitepress/dist',
      'docs/.vitepress/build-system/shim/vue-eslint-parser.mjs',
      'docs/.vitepress/build-system/shim/@typescript-eslint/parser.mjs',
      'docs/.vitepress/.temp',
      'docs/.vitepress/cache'
    ]
  },
  eslintPluginEslintPlugin,
  eslintPluginUnicorn.configs['flat/recommended'],
  ...eslintPluginNodeDependencies.configs['flat/recommended'],
  ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
  eslintPluginPrettierRecommended,
  {
    plugins: {
      internal: {
        rules: {
          'no-invalid-meta': noInvalidMeta,
          'no-invalid-meta-docs-categories': noInvalidMetaDocsCategories,
          'require-eslint-community': requireEslintCommunity
        }
      }
    }
  },

  // turn off some rules from shared configs in all files
  {
    rules: {
      'eslint-plugin/require-meta-default-options': 'off', // TODO: enable when all rules have defaultOptions
      'eslint-plugin/require-meta-docs-recommended': 'off', // use `categories` instead
      'eslint-plugin/require-meta-schema-description': 'off',

      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-array-callback-reference': 'off', // doesn't work well with TypeScript's custom type guards
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-optional-catch-binding': 'off', // not supported by current ESLint parser version
      'unicorn/prefer-at': 'off', //                 turn off to prevent make breaking changes (ref: #2146)
      'unicorn/prefer-node-protocol': 'off', //      turn off to prevent make breaking changes (ref: #2146)
      'unicorn/prefer-string-replace-all': 'off', // turn off to prevent make breaking changes (ref: #2146)
      'unicorn/prefer-top-level-await': 'off', //    turn off to prevent make breaking changes (ref: #2146)
      'unicorn/prevent-abbreviations': 'off'
    }
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.es6,
        ...globals.node,
        ...globals.vitest
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      'accessor-pairs': 2,
      camelcase: [2, { properties: 'never' }],
      'constructor-super': 2,
      eqeqeq: [2, 'allow-null'],
      'handle-callback-err': [2, '^(err|error)$'],
      'jsx-quotes': [2, 'prefer-single'],
      'new-cap': [2, { newIsCap: true, capIsNew: false }],
      'new-parens': 2,
      'no-array-constructor': 2,
      'no-caller': 2,
      'no-class-assign': 2,
      'no-cond-assign': 2,
      'no-const-assign': 2,
      'no-control-regex': 2,
      'no-delete-var': 2,
      'no-dupe-args': 2,
      'no-dupe-class-members': 2,
      'no-dupe-keys': 2,
      'no-duplicate-case': 2,
      'no-empty-character-class': 2,
      'no-empty-pattern': 2,
      'no-eval': 2,
      'no-ex-assign': 2,
      'no-extend-native': 2,
      'no-extra-bind': 2,
      'no-extra-boolean-cast': 2,
      'no-extra-parens': [2, 'functions'],
      'no-fallthrough': 2,
      'no-floating-decimal': 2,
      'no-func-assign': 2,
      'no-implied-eval': 2,
      'no-inner-declarations': [2, 'functions'],
      'no-invalid-regexp': 2,
      'no-irregular-whitespace': 2,
      'no-iterator': 2,
      'no-label-var': 2,
      'no-labels': [2, { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 2,
      'no-multi-spaces': [2, { ignoreEOLComments: true }],
      'no-multi-str': 2,
      'no-native-reassign': 2,
      'no-negated-in-lhs': 2,
      'no-new-object': 2,
      'no-new-require': 2,
      'no-new-symbol': 2,
      'no-new-wrappers': 2,
      'no-obj-calls': 2,
      'no-octal': 2,
      'no-octal-escape': 2,
      'no-path-concat': 2,
      'no-proto': 2,
      'no-redeclare': 2,
      'no-regex-spaces': 2,
      'no-return-assign': [2, 'except-parens'],
      'no-self-assign': 2,
      'no-self-compare': 2,
      'no-sequences': 2,
      'no-shadow-restricted-names': 2,
      'no-sparse-arrays': 2,
      'no-this-before-super': 2,
      'no-throw-literal': 2,
      'no-undef': 2,
      'no-undef-init': 2,
      'no-unexpected-multiline': 2,
      'no-unmodified-loop-condition': 2,
      'no-unneeded-ternary': [2, { defaultAssignment: false }],
      'no-unreachable': 2,
      'no-unsafe-finally': 2,
      'no-unused-vars': [2, { vars: 'all', args: 'none' }],
      'no-useless-call': 2,
      'no-useless-computed-key': 2,
      'no-useless-constructor': 2,
      'no-useless-escape': 0,
      'no-with': 2,
      'one-var': [2, { initialized: 'never' }],
      'use-isnan': 2,
      'valid-typeof': 2,
      'wrap-iife': [2, 'any'],
      yoda: [2, 'never'],
      'prefer-const': 2,

      'prettier/prettier': 'error',
      'eslint-plugin/require-meta-docs-description': [
        'error',
        { pattern: '^(enforce|require|disallow).*[^.]$' }
      ],
      'eslint-plugin/require-meta-fixable': [
        'error',
        { catchNoFixerButFixableProperty: true }
      ],
      'eslint-plugin/report-message-format': ['error', "^[A-Z`'{].*\\.$"],

      'no-debugger': 'error',
      'no-console': 'error',
      'no-alert': 'error',
      'no-void': 'error',

      'no-warning-comments': 'warn',
      'no-var': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'prefer-rest-params': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-spread': 'error',

      'dot-notation': 'error',
      'arrow-body-style': 'error',

      'no-restricted-properties': [
        'error',
        {
          object: 'context',
          property: 'parserServices',
          message: 'Use sourceCode.parserServices'
        },
        {
          object: 'context',
          property: 'getScope',
          message: 'Use utils.getScope'
        }
      ],

      'unicorn/consistent-function-scoping': [
        'error',
        { checkArrowFunctions: false }
      ],

      'internal/require-eslint-community': ['error']
    }
  },
  {
    files: ['./**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueEslintParser
    }
  },
  {
    files: ['lib/rules/*.js'],
    rules: {
      'eslint-plugin/require-meta-docs-url': [
        'error',
        { pattern: 'https://eslint.vuejs.org/rules/{{name}}.html' }
      ],
      'internal/no-invalid-meta': 'error',
      'internal/no-invalid-meta-docs-categories': 'error'
    }
  },
  {
    files: ['eslint-internal-rules/*.js'],
    rules: {
      'eslint-plugin/require-meta-docs-url': 'off',
      'internal/no-invalid-meta': 'error',
      'internal/no-invalid-meta-docs-categories': 'error'
    }
  },
  {
    files: ['**/*.json'],
    rules: {
      'prettier/prettier': 'off'
    }
  }
])
