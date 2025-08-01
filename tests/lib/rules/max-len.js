/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/max-len')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2017,
    sourceType: 'module'
  }
})

tester.run('max-len', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `<template><div></div></template>`
    },
    {
      filename: 'test.vue',
      code: `<script></script>`
    },
    {
      filename: 'test.vue',
      code: `
<template>
  <div class="foo">
    TEXT1
    TEXT2
    <!-- html comment
      html comment
      html comment -->
  </div>
</template>
<script>
// inline comment
export default {name:'A'}
/* multiline comment
  multiline comment
  multiline comment */
</script>
`
    },
    {
      filename: 'test.vue',
      code: `
<template><div class="foo">TEXT1     TEXT2<!-- html comment --></div></template>
<script>export default { name:'A' } /*     comment */ // inline comment</script>
`
    },
    {
      filename: 'test.vue',
      code: `
<template><div class="foo">120 columns ............................................................... </div></template>
<script>export default { name:'A' } /* 120 columns ......................................................... */</script>
`,
      options: [{ code: 120 }]
    },
    {
      filename: 'test.vue',
      code: `
<template><div class="foo">120 columns ............................................................... </div></template>
<script>export default { name:'A' } /* 80 columns .................. */</script>
`,
      options: [{ template: 120 }]
    },
    {
      filename: 'test.vue',
      code: `
<template><div class="foo">120 columns - The script and template are on the same line </div></template><script></script>
`,
      options: [{ template: 120 }]
    },
    // ignores
    // - ignorePattern
    {
      filename: 'test.vue',
      code: `
<template>
  <div class="foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
       :class="{
         'foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo': bbbb
       }">
  </div>
</template>
<script>
export default { name: 'foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' }
</script>
`,
      options: [{ ignorePattern: 'foooooooooooooooooo' }]
    },
    // - ignoreComments
    {
      filename: 'test.vue',
      code: `
<template>
  <!-- HTML full line comment ............................................... -->
  <div class="foo"
       :class="{
         'foo': foo, // trailing comment ........................................
         'bar': bar, /* comment */ // trailing comments .........................
         /* full line comment ................................................ */
       }"> <!-- HTML trailing comment ....................................... -->
  </div> <!-- comment --><!-- HTML trailing comments ........................ -->
</template>
<script>
var a // trailing comment .......................................................
var b /* comment */ // trailing comments ........................................
/* full line comment ......................................................... */
</script>
`,
      options: [{ ignoreComments: true }]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a // trailing comment .......................................................
var b /* comment */ // trailing comments ........................................
/* full line comment ......................................................... */
</script>
<template>
  <!-- HTML full line comment ............................................... -->
  <div class="foo"
       :class="{
         'foo': foo, // trailing comment ........................................
         'bar': bar, /* comment */ // trailing comments .........................
         /* full line comment ................................................ */
       }"> <!-- HTML trailing comment ....................................... -->
  </div> <!-- comment --><!-- HTML trailing comments ........................ -->
</template>
`,
      options: [{ ignoreComments: true }]
    },
    // - ignoreUrls: true
    {
      filename: 'test.vue',
      code: `
<template>
  <div style="background-image: url('https://www.example.com/long/long/long/long/long')">
  </div>
</template>
<script>
var a = 'https://www.example.com/long/long/long/long/long/long/long/long/long/long'
</script>
`,
      options: [{ ignoreUrls: true }]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a = 'https://www.example.com/long/long/long/long/long/long/long/long/long/long'
</script>
<template>
  <div style="background-image: url('https://www.example.com/long/long/long/long/long')">
  </div>
</template>
`,
      options: [{ ignoreUrls: true }]
    },
    // - ignoreStrings: true
    {
      filename: 'test.vue',
      code: `
<template>
  <div :class="[
         {
           'expr-loooooooooooooooooooooooooooooooooooooooooooooooooooooong': foo,
         },
         'str-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
       ]">
  </div>
</template>
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
</script>
`,
      options: [{ ignoreStrings: true }]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
</script>
<template>
  <div :class="[
         {
           'expr-loooooooooooooooooooooooooooooooooooooooooooooooooooooong': foo,
         },
         'str-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
       ]">
  </div>
</template>
`,
      options: [{ ignoreStrings: true }]
    },
    // - ignoreTemplateLiterals: true
    {
      filename: 'test.vue',
      code: `
<template>
  <div :class="[
         \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`,
       ]">
  </div>
</template>
<script>
var b = \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`
</script>
`,
      options: [{ ignoreTemplateLiterals: true }]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var b = \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`
</script>
<template>
  <div :class="[
         \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`,
       ]">
  </div>
</template>
`,
      options: [{ ignoreTemplateLiterals: true }]
    },
    // - ignoreRegExpLiterals: true
    {
      filename: 'test.vue',
      code: `
<template>
  <div :class="{
         'foo': /regexploooooooooooooooooooooooooooooooooooooooooooong/.test(bar)
       }">
  </div>
</template>
<script>
var a = /regexploooooooooooooooooooooooooooooooooooooooooooooooooooooong/.test(b)
</script>
`,
      options: [{ ignoreRegExpLiterals: true }]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a = /regexploooooooooooooooooooooooooooooooooooooooooooooooooooooong/.test(b)
</script>
<template>
  <div :class="{
         'foo': /regexploooooooooooooooooooooooooooooooooooooooooooong/.test(bar)
       }">
  </div>
</template>
`,
      options: [{ ignoreRegExpLiterals: true }]
    },
    // - ignoreHTMLAttributeValues: true
    {
      filename: 'test.vue',
      code: `
<template>
  <div class="foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo">
  </div>
</template>
`,
      options: [{ ignoreHTMLAttributeValues: true }]
    },
    // - ignoreHTMLTextContents: true
    {
      filename: 'test.vue',
      code: `
<template>
  <div>
    foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
    foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo<input>
  </div>
</template>
`,
      options: [{ ignoreHTMLTextContents: true }]
    },
    // ignore `<style>` and custom block
    {
      filename: 'test.vue',
      code: `
<docs>loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong</docs>
<template><div /></template>
<script>export default {}</script>
<style>.looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong{}</style>
`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
<template><div class="foo">TEXT1      TEXT2<!-- html comment --></div></template>
<script>export default { name:'A' } /* multiline    */ // inline comment</script>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 2,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>export default { name:'A' } /* multiline    */ // inline comment</script>
<template><div class="foo">TEXT1      TEXT2<!-- html comment --></div></template>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 2,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<template><div class="foo">121 columns ................................................................ </div></template>
<script>export default { name:'A' } /* 121 columns .......................................................... */</script>
`,
      options: [{ code: 120 }],
      errors: [
        {
          message: 'This line has a length of 121. Maximum allowed is 120.',
          line: 2,
          column: 1
        },
        {
          message: 'This line has a length of 121. Maximum allowed is 120.',
          line: 3,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<template><div class="foo">121 columns ................................................................ </div></template>
<script>export default { name:'A' } /* 81 columns ................... */</script>
`,
      options: [{ template: 120 }],
      errors: [
        {
          message: 'This line has a length of 121. Maximum allowed is 120.',
          line: 2,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<template><div class="foo">121 columns - The script and template are on the same line. </div></template><script></script>
`,
      options: [{ template: 120 }],
      errors: [
        {
          message: 'This line has a length of 121. Maximum allowed is 120.',
          line: 2,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<template><div class="foo">121 columns - The script and template are on the same line. </div></template><script></script>
`,
      options: [{ code: 120, template: 80 }],
      errors: [
        {
          message: 'This line has a length of 121. Maximum allowed is 120.',
          line: 2,
          column: 1
        }
      ]
    },
    // ignores
    // - ignorePattern: off
    {
      filename: 'test.vue',
      code: `
<template>
  <div class="foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"
       :class="{
         'foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo': bbbb
       }">
  </div>
</template>
<script>
export default { name: 'foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo' }
</script>
`,
      errors: [
        {
          message: 'This line has a length of 82. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 84. Maximum allowed is 80.',
          line: 5,
          column: 1
        },
        {
          message: 'This line has a length of 94. Maximum allowed is 80.',
          line: 10,
          column: 1
        }
      ]
    },
    // - ignoreComments: false
    {
      filename: 'test.vue',
      code: `
<template>
  <!-- HTML full line comment ............................................... -->
  <div class="foo"
       :class="{
         'foo': foo, // trailing comment ........................................
         'bar': bar, /* comment */ // trailing comments .........................
         /* full line comment ................................................ */
       }"> <!-- HTML trailing comment ....................................... -->
    <!-- leading comment ............................................. --><input>
  </div> <!-- comment --><!-- HTML trailing comments ........................ -->
</template>
<script>
var a // trailing comment .......................................................
var b /* comment */ // trailing comments ........................................
/* full line comment ......................................................... */
</script>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 6,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 7,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 8,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 9,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 10,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 11,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 14,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 15,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 16,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a // trailing comment .......................................................
var b /* comment */ // trailing comments ........................................
/* full line comment ......................................................... */
</script>
<template>
  <!-- HTML full line comment ............................................... -->
  <div class="foo"
       :class="{
         'foo': foo, // trailing comment ........................................
         'bar': bar, /* comment */ // trailing comments .........................
         /* full line comment ................................................ */
       }"> <!-- HTML trailing comment ....................................... -->
    <!-- leading comment ............................................. --><input>
  </div> <!-- comment --><!-- HTML trailing comments ........................ -->
</template>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 4,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 5,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 8,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 11,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 12,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 13,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 14,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 15,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 16,
          column: 1
        }
      ]
    },
    // - ignoreComments: true
    {
      filename: 'test.vue',
      code: `
<template>
  <!-- HTML full line comment ............................................... -->
  <div class="foo"
       :class="{
         'foo': foo, // trailing comment ........................................
         'bar': bar, /* comment */ // trailing comments .........................
         /* full line comment ................................................ */
       }"> <!-- HTML trailing comment ....................................... -->
    <!-- leading comment ............................................. --><input>
  </div> <!-- comment --><!-- HTML trailing comments ........................ -->
</template>
<script>
var a // trailing comment .......................................................
var b /* comment */ // trailing comments ........................................
/* full line comment ......................................................... */
</script>
`,
      options: [{ ignoreComments: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 10,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a // trailing comment .......................................................
var b /* comment */ // trailing comments ........................................
/* full line comment ......................................................... */
</script>
<template>
  <!-- HTML full line comment ............................................... -->
  <div class="foo"
       :class="{
         'foo': foo, // trailing comment ........................................
         'bar': bar, /* comment */ // trailing comments .........................
         /* full line comment ................................................ */
       }"> <!-- HTML trailing comment ....................................... -->
    <!-- leading comment ............................................. --><input>
  </div> <!-- comment --><!-- HTML trailing comments ........................ -->
</template>
`,
      options: [{ ignoreComments: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 15,
          column: 1
        }
      ]
    },
    // - ignoreTrailingComments: true
    {
      filename: 'test.vue',
      code: `
<template>
  <!-- HTML full line comment ............................................... -->
  <div class="foo"
       :class="{
         'foo': foo, // trailing comment ........................................
         'bar': bar, /* comment */ // trailing comments .........................
         /* full line comment ................................................ */
       }"> <!-- HTML trailing comment ....................................... -->
    <!-- leading comment ............................................. --><input>
  </div> <!-- comment --><!-- HTML trailing comments ........................ -->
</template>
<script>
var a // trailing comment .......................................................
var b /* comment */ // trailing comments ........................................
/* full line comment ......................................................... */
</script>
`,
      options: [{ ignoreTrailingComments: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 8,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 10,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 16,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a // trailing comment .......................................................
var b /* comment */ // trailing comments ........................................
/* full line comment ......................................................... */
</script>
<template>
  <!-- HTML full line comment ............................................... -->
  <div class="foo"
       :class="{
         'foo': foo, // trailing comment ........................................
         'bar': bar, /* comment */ // trailing comments .........................
         /* full line comment ................................................ */
       }"> <!-- HTML trailing comment ....................................... -->
    <!-- leading comment ............................................. --><input>
  </div> <!-- comment --><!-- HTML trailing comments ........................ -->
</template>
`,
      options: [{ ignoreTrailingComments: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 5,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 8,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 13,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 15,
          column: 1
        }
      ]
    },
    // - ignoreUrls: false
    {
      filename: 'test.vue',
      code: `
<template>
  <div style="background-image: url('https://www.example.com/long/long/long/long/long')">
  </div>
</template>
<script>
var a = 'https://www.example.com/long/long/long/long/long/long/long/long/long/long'
</script>
`,
      errors: [
        {
          message: 'This line has a length of 89. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 83. Maximum allowed is 80.',
          line: 7,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a = 'https://www.example.com/long/long/long/long/long/long/long/long/long/long'
</script>
<template>
  <div style="background-image: url('https://www.example.com/long/long/long/long/long')">
  </div>
</template>
`,
      errors: [
        {
          message: 'This line has a length of 83. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 89. Maximum allowed is 80.',
          line: 6,
          column: 1
        }
      ]
    },
    // - ignoreStrings: false
    {
      filename: 'test.vue',
      code: `
<template>
  <div class="attr-value-loooooooooooooooooooooooooooooooooooooooooooooooooooong"
       :class="[
         {
           'expr-loooooooooooooooooooooooooooooooooooooooooooooooooooooong': foo,
         },
         'str-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
       ]">
  </div>
</template>
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
</script>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 6,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 8,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 13,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
</script>
<template>
  <div class="attr-value-loooooooooooooooooooooooooooooooooooooooooooooooooooong"
       :class="[
         {
           'expr-loooooooooooooooooooooooooooooooooooooooooooooooooooooong': foo,
         },
         'str-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
       ]">
  </div>
</template>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 6,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 9,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 11,
          column: 1
        }
      ]
    },
    // - ignoreStrings: true
    {
      filename: 'test.vue',
      code: `
<template>
  <div class="attr-value-loooooooooooooooooooooooooooooooooooooooooooooooooooong"
       :class="[
         {
           'expr-loooooooooooooooooooooooooooooooooooooooooooooooooooooong': foo,
         },
         'str-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
       ]">
  </div>
</template>
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
</script>
`,
      options: [{ ignoreStrings: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
</script>
<template>
  <div class="attr-value-loooooooooooooooooooooooooooooooooooooooooooooooooooong"
       :class="[
         {
           'expr-loooooooooooooooooooooooooooooooooooooooooooooooooooooong': foo,
         },
         'str-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
       ]">
  </div>
</template>
`,
      options: [{ ignoreStrings: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 6,
          column: 1
        }
      ]
    },
    // - ignoreTemplateLiterals: false
    {
      filename: 'test.vue',
      code: `
<template>
  <div :class="[
         'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
         \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`,
       ]">
  </div>
</template>
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
var b = \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`
</script>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 4,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 5,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 10,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 11,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
var b = \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`
</script>
<template>
  <div :class="[
         'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
         \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`,
       ]">
  </div>
</template>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 4,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 8,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 9,
          column: 1
        }
      ]
    },
    // - ignoreTemplateLiterals: true
    {
      filename: 'test.vue',
      code: `
<template>
  <div :class="[
         'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
         \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`,
       ]">
  </div>
</template>
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
var b = \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`
</script>
`,
      options: [{ ignoreTemplateLiterals: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 4,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 10,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a = 'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
var b = \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`
</script>
<template>
  <div :class="[
         'str-loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
         \`template-looooooooooooooooooooooooooooooooooooooooooooooooooooooooong\`,
       ]">
  </div>
</template>
`,
      options: [{ ignoreTemplateLiterals: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 8,
          column: 1
        }
      ]
    },
    // - ignoreRegExpLiterals: false
    {
      filename: 'test.vue',
      code: `
<template>
  <div :class="{
         'foo': /regexploooooooooooooooooooooooooooooooooooooooooooong/.test(bar)
       }">
  </div>
</template>
<script>
var a = /regexploooooooooooooooooooooooooooooooooooooooooooooooooooooong/.test(b)
</script>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 4,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 9,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<script>
var a = /regexploooooooooooooooooooooooooooooooooooooooooooooooooooooong/.test(b)
</script>
<template>
  <div :class="{
         'foo': /regexploooooooooooooooooooooooooooooooooooooooooooong/.test(bar)
       }">
  </div>
</template>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 7,
          column: 1
        }
      ]
    },
    // - ignoreHTMLAttributeValues: false
    {
      filename: 'test.vue',
      code: `
<template>
  <div class="foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo">
  </div>
</template>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        }
      ]
    },
    // - ignoreHTMLTextContents: false
    {
      filename: 'test.vue',
      code: `
<template>
  <div>
    foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
    foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo<input>
  </div>
</template>
`,
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 4,
          column: 1
        },
        {
          message: 'This line has a length of 88. Maximum allowed is 80.',
          line: 5,
          column: 1
        }
      ]
    },
    // code
    {
      filename: 'test.vue',
      code: `<template><div> 41 cols </div></template>`,
      options: [40],
      errors: [
        {
          message: 'This line has a length of 41. Maximum allowed is 40.',
          line: 1,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div> 41 cols </div></template>`,
      options: [{ code: 40 }],
      errors: [
        {
          message: 'This line has a length of 41. Maximum allowed is 40.',
          line: 1,
          column: 1
        }
      ]
    },
    // tabWidth
    {
      filename: 'test.vue',
      code: `<template><div>\t41\tcols\t</div></template>`,
      options: [40, 4],
      errors: [
        {
          message: 'This line has a length of 45. Maximum allowed is 40.',
          line: 1,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div>\t41\tcols\t</div></template>`,
      options: [{ code: 40, tabWidth: 4 }],
      errors: [
        {
          message: 'This line has a length of 45. Maximum allowed is 40.',
          line: 1,
          column: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div>\t41\tcols\t</div></template>`,
      options: [{ code: 40, tabWidth: 3 }],
      errors: [
        {
          message: 'This line has a length of 44. Maximum allowed is 40.',
          line: 1,
          column: 1
        }
      ]
    },
    // comments
    {
      filename: 'test.vue',
      code: `
<template>
<!-- 41 cols                            *
41 cols                                 *
-->
<div /> <!-- 41 cols comment                  -->
</template>
<script>
// 41 cols                              *
var a;  // 41 cols comment                      *

/* 41 cols                              *
41 cols                                 *
*/
</script>
`,
      options: [{ comments: 40 }],
      errors: [
        {
          message:
            'This line has a comment length of 41. Maximum allowed is 40.',
          line: 3,
          column: 1
        },
        {
          message:
            'This line has a comment length of 41. Maximum allowed is 40.',
          line: 4,
          column: 1
        },
        {
          message:
            'This line has a comment length of 41. Maximum allowed is 40.',
          line: 9,
          column: 1
        },
        {
          message:
            'This line has a comment length of 41. Maximum allowed is 40.',
          line: 12,
          column: 1
        },
        {
          message:
            'This line has a comment length of 41. Maximum allowed is 40.',
          line: 13,
          column: 1
        }
      ]
    },
    // .js
    {
      filename: 'test.js',
      code: `
var a = '81 columns                                                            ';
var b = \`81 columns                                                            \`;
/* 81 columns                                                                  */
      `,
      options: [],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 2,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 4,
          column: 1
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
var a = '81 columns          ignoreStrings                                     ';
var b = \`81 columns                                                            \`;
/* 81 columns                                                                  */
      `,
      options: [{ ignoreStrings: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 4,
          column: 1
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
var a = '81 columns                                                            ';
var b = \`81 columns                                                            \`;
/* 81 columns                                                                  */
      `,
      options: [{ ignoreComments: true }],
      errors: [
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 2,
          column: 1
        },
        {
          message: 'This line has a length of 81. Maximum allowed is 80.',
          line: 3,
          column: 1
        }
      ]
    },
    // only script comment
    {
      filename: 'test.js',
      code: `
// 41 cols                              *
/* 41 cols                              *
41 cols                                 *
*/
`,
      options: [{ comments: 40 }],
      errors: [
        {
          message:
            'This line has a comment length of 41. Maximum allowed is 40.',
          line: 2,
          column: 1
        },
        {
          message:
            'This line has a comment length of 41. Maximum allowed is 40.',
          line: 3,
          column: 1
        },
        {
          message:
            'This line has a comment length of 41. Maximum allowed is 40.',
          line: 4,
          column: 1
        }
      ]
    }
  ]
})
