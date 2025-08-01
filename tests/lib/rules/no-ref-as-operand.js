/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-ref-as-operand')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-ref-as-operand', rule, {
  valid: [
    `
    import { ref } from 'vue'
    const count = ref(0)
    console.log(count.value) // 0

    count.value++
    console.log(count.value) // 1
    `,
    `
    <script>
      import { ref } from 'vue'
      export default {
        setup() {
          const count = ref(0)
          console.log(count.value) // 0

          count.value++
          console.log(count.value) // 1
          return {
            count
          }
        }
      }
    </script>
    `,
    `
    <script>
      import { ref } from '@vue/composition-api'
      export default {
        setup() {
          const count = ref(0)
          console.log(count.value) // 0

          count.value++
          console.log(count.value) // 1
          return {
            count
          }
        }
      }
    </script>
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    if (count.value) {}
    switch (count.value) {}
    var foo = -count.value
    var foo = +count.value
    count.value++
    count.value--
    count.value + 1
    1 - count.value
    count.value || other
    count.value && other
    var foo = count.value ? x : y
    `,
    `
    import { ref } from 'vue'
    const foo = ref(true)
    if (bar) foo
    `,
    `
    import { ref } from 'vue'
    const foo = ref(true)
    var a = other || foo // ignore
    var b = other && foo // ignore

    let bar = ref(true)
    var a = bar || other
    var b = bar || other
    `,
    `
    import { ref } from 'vue'
    let count = not_ref(0)

    count++
    `,
    `
    import { ref } from 'vue'
    const foo = ref(0)
    const bar = ref(0)
    var baz = x ? foo : bar
    `,
    `
    import { ref } from 'vue'
    // Probably wrong, but not checked by this rule.
    const {value} = ref(0)
    value++
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    function foo() {
      let count = 0
      count++
    }
    `,
    `
    import { ref } from 'unknown'
    const count = ref(0)
    count++
    `,
    `
    import { ref } from 'vue'
    const count = ref
    count++
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    foo = count
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    const foo = count
    `,
    `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        const foo = shallowRef({})
        foo[bar] = 123
      </script>
    `,
    `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        const foo = shallowRef({})
        const isComp = foo.effect
      </script>
    `,
    `
      <script>
      import { ref } from 'vue'
      let foo;

      if (!foo) {
        foo = ref(5);
      }
      </script>
    `,
    `
      <script>
      import { ref } from 'vue'
      let foo = undefined;

      if (!foo) {
        foo = ref(5);
      }
      </script>
    `,
    `
      <script>
      import { ref } from 'vue'
      const foo = ref(0)
      func(foo)
      function func(foo) {}
      </script>
    `,
    `
      <script>
      import { ref } from 'vue'
      const foo = ref(0)
      tag\`\${foo}\`
      function tag(arr, ...args) {}
      </script>
    `,
    `
    <script setup>
    const model = defineModel();
    console.log(model.value);
    function process() {
      if (model.value) console.log('foo')
    }
    function update(value) {
      model.value = value;
    }
    </script>
    `,
    `
    <script setup>
    const [model, mod] = defineModel();
    console.log(model.value);
    function process() {
      if (model.value) console.log('foo')
    }
    function update(value) {
      model.value = value;
    }
    </script>
    `,
    `
    <script setup>
    const emit = defineEmits(['test'])
    const [model, mod] = defineModel();

    function update() {
      emit('test', model.value)
    }
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, ctx) {
        const counter = ref(0)

        ctx.emit('incremented', counter.value)

        return {
          counter
        }
      }
    })
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, { emit }) {
        const counter = ref(0)

        emit('incremented', counter.value)

        return {
          counter
        }
      }
    })
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, { emit }) {
        const counter = ref(0)

        emit('incremented', counter.value, 'xxx')

        return {
          counter
        }
      }
    })
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, { emit }) {
        const counter = ref(0)

        emit('incremented', 'xxx')

        return {
          counter
        }
      }
    })
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, { emit }) {
        const counter = ref(0)

        emit('incremented')

        return {
          counter
        }
      }
    })
    </script>
    `
  ],
  invalid: [
    {
      code: `
      import { ref } from 'vue'
      let count = ref(0)

      count++ // error
      console.log(count + 1) // error
      console.log(1 + count) // error
      `,
      output: `
      import { ref } from 'vue'
      let count = ref(0)

      count.value++ // error
      console.log(count.value + 1) // error
      console.log(1 + count.value) // error
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 12
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 24
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 7,
          column: 23,
          endLine: 7,
          endColumn: 28
        }
      ]
    },
    {
      code: `
      <script>
        import { ref } from 'vue'
        export default {
          setup() {
            let count = ref(0)

            count++ // error
            console.log(count + 1) // error
            console.log(1 + count) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      output: `
      <script>
        import { ref } from 'vue'
        export default {
          setup() {
            let count = ref(0)

            count.value++ // error
            console.log(count.value + 1) // error
            console.log(1 + count.value) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 18
        },
        {
          messageId: 'requireDotValue',
          line: 9,
          column: 25,
          endLine: 9,
          endColumn: 30
        },
        {
          messageId: 'requireDotValue',
          line: 10,
          column: 29,
          endLine: 10,
          endColumn: 34
        }
      ]
    },
    {
      code: `
      <script>
        import { ref } from '@vue/composition-api'
        export default {
          setup() {
            let count = ref(0)

            count++ // error
            console.log(count + 1) // error
            console.log(1 + count) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      output: `
      <script>
        import { ref } from '@vue/composition-api'
        export default {
          setup() {
            let count = ref(0)

            count.value++ // error
            console.log(count.value + 1) // error
            console.log(1 + count.value) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 18
        },
        {
          messageId: 'requireDotValue',
          line: 9,
          column: 25,
          endLine: 9,
          endColumn: 30
        },
        {
          messageId: 'requireDotValue',
          line: 10,
          column: 29,
          endLine: 10,
          endColumn: 34
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      const foo = ref(true)
      if (foo) {
        //
      }
      `,
      output: `
      import { ref } from 'vue'
      const foo = ref(true)
      if (foo.value) {
        //
      }
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 14
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      const foo = ref(true)
      switch (foo) {
        //
      }
      `,
      output: `
      import { ref } from 'vue'
      const foo = ref(true)
      switch (foo.value) {
        //
      }
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      const foo = ref(0)
      var a = -foo
      var b = +foo
      var c = !foo
      var d = ~foo
      `,
      output: `
      import { ref } from 'vue'
      const foo = ref(0)
      var a = -foo.value
      var b = +foo.value
      var c = !foo.value
      var d = ~foo.value
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 16,
          endLine: 4,
          endColumn: 19
        },
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 19
        },
        {
          messageId: 'requireDotValue',
          line: 6,
          column: 16,
          endLine: 6,
          endColumn: 19
        },
        {
          messageId: 'requireDotValue',
          line: 7,
          column: 16,
          endLine: 7,
          endColumn: 19
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      let foo = ref(0)
      foo += 1
      foo -= 1
      baz += foo
      baz -= foo
      `,
      output: `
      import { ref } from 'vue'
      let foo = ref(0)
      foo.value += 1
      foo.value -= 1
      baz += foo.value
      baz -= foo.value
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 10
        },
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 10
        },
        {
          messageId: 'requireDotValue',
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 17
        },
        {
          messageId: 'requireDotValue',
          line: 7,
          column: 14,
          endLine: 7,
          endColumn: 17
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      const foo = ref(true)
      var a = foo || other
      var b = foo && other
      `,
      output: `
      import { ref } from 'vue'
      const foo = ref(true)
      var a = foo.value || other
      var b = foo.value && other
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 18
        },
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 18
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      let foo = ref(true)
      var a = foo ? x : y
      `,
      output: `
      import { ref } from 'vue'
      let foo = ref(true)
      var a = foo.value ? x : y
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: `
      <script>
        import { ref } from 'vue'
        let count = ref(0)
        export default {
          setup() {
            count++ // error
            console.log(count + 1) // error
            console.log(1 + count) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      output: `
      <script>
        import { ref } from 'vue'
        let count = ref(0)
        export default {
          setup() {
            count.value++ // error
            console.log(count.value + 1) // error
            console.log(1 + count.value) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 18
        },
        {
          messageId: 'requireDotValue',
          line: 8,
          column: 25,
          endLine: 8,
          endColumn: 30
        },
        {
          messageId: 'requireDotValue',
          line: 9,
          column: 29,
          endLine: 9,
          endColumn: 34
        }
      ]
    },
    {
      code: `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        let count = ref(0)
        let cntcnt = computed(()=>count.value+count.value)

        const state = reactive({
          foo: 1,
          bar: 2
        })

        const fooRef = toRef(state, 'foo')

        let value = 'hello'
        const cref = customRef((track, trigger) => {
          return {
            get() {
              track()
              return value
            },
            set(newValue) {
              clearTimeout(timeout)
              timeout = setTimeout(() => {
                value = newValue
                trigger()
              }, delay)
            }
          }
        })

        const foo = shallowRef({})

        count++ // error
        cntcnt++ // error

        const s = \`\${fooRef} : \${cref}\` // error x 2

        const n = foo + 1 // error
      </script>
      `,
      output: `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        let count = ref(0)
        let cntcnt = computed(()=>count.value+count.value)

        const state = reactive({
          foo: 1,
          bar: 2
        })

        const fooRef = toRef(state, 'foo')

        let value = 'hello'
        const cref = customRef((track, trigger) => {
          return {
            get() {
              track()
              return value
            },
            set(newValue) {
              clearTimeout(timeout)
              timeout = setTimeout(() => {
                value = newValue
                trigger()
              }, delay)
            }
          }
        })

        const foo = shallowRef({})

        count.value++ // error
        cntcnt.value++ // error

        const s = \`\${fooRef.value} : \${cref.value}\` // error x 2

        const n = foo.value + 1 // error
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 33,
          column: 9,
          endLine: 33,
          endColumn: 14
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `computed()`.',
          line: 34,
          column: 9,
          endLine: 34,
          endColumn: 15
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `toRef()`.',
          line: 36,
          column: 22,
          endLine: 36,
          endColumn: 28
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `customRef()`.',
          line: 36,
          column: 34,
          endLine: 36,
          endColumn: 38
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `shallowRef()`.',
          line: 38,
          column: 19,
          endLine: 38,
          endColumn: 22
        }
      ]
    },
    {
      code: `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        const foo = shallowRef({})
        foo.bar = 123
      </script>
      `,
      output: `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        const foo = shallowRef({})
        foo.value.bar = 123
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 12
        }
      ]
    },
    {
      code: `
      <script>
        import { ref } from 'vue'
        const foo = ref(123)
        const bar = foo?.bar
      </script>
      `,
      output: `
      <script>
        import { ref } from 'vue'
        const foo = ref(123)
        const bar = foo.value?.bar
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 21,
          endLine: 5,
          endColumn: 24
        }
      ]
    },
    {
      code: `
      <script>
      import { ref } from 'vue'
      let foo = undefined;

      if (!foo) {
        foo = ref(5);
      }
      let bar = foo;
      bar = 4;
      </script>
      `,
      output: `
      <script>
      import { ref } from 'vue'
      let foo = undefined;

      if (!foo) {
        foo = ref(5);
      }
      let bar = foo;
      bar.value = 4;
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 10,
          column: 7,
          endLine: 10,
          endColumn: 10
        }
      ]
    },
    {
      code: `
      <script>
      let model = defineModel();
      console.log(model);
      function process() {
        if (model) console.log('foo')
      }
      function update(value) {
        model = value;
      }
      </script>
      `,
      output: `
      <script>
      let model = defineModel();
      console.log(model);
      function process() {
        if (model.value) console.log('foo')
      }
      function update(value) {
        model.value = value;
      }
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `defineModel()`.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 18
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `defineModel()`.',
          line: 9,
          column: 9,
          endLine: 9,
          endColumn: 14
        }
      ]
    },
    {
      code: `
      <script setup>
      let [model, mod] = defineModel();
      console.log(model);
      function process() {
        if (model) console.log('foo')
      }
      function update(value) {
        model = value;
      }
      </script>
      `,
      output: `
      <script setup>
      let [model, mod] = defineModel();
      console.log(model);
      function process() {
        if (model.value) console.log('foo')
      }
      function update(value) {
        model.value = value;
      }
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `defineModel()`.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 18
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `defineModel()`.',
          line: 9,
          column: 9,
          endLine: 9,
          endColumn: 14
        }
      ]
    },
    {
      code: `
      <script setup>
      import { ref } from 'vue'
      const emits = defineEmits(['test'])
      const count = ref(0)

      function update() {
        emits('test', count)
      }
      </script>
      `,
      output: `
      <script setup>
      import { ref } from 'vue'
      const emits = defineEmits(['test'])
      const count = ref(0)

      function update() {
        emits('test', count.value)
      }
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 8,
          column: 23,
          endLine: 8,
          endColumn: 28
        }
      ]
    },
    {
      code: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, ctx) {
          const counter = ref(0)

          ctx.emit('incremented', counter)

          return {
            counter
          }
        }
      })
      </script>
      `,
      output: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, ctx) {
          const counter = ref(0)

          ctx.emit('incremented', counter.value)

          return {
            counter
          }
        }
      })
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 10,
          column: 35,
          endLine: 10,
          endColumn: 42
        }
      ]
    },
    {
      code: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, { emit }) {
          const counter = ref(0)

          emit('incremented', counter)

          return {
            counter
          }
        }
      })
      </script>
      `,
      output: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, { emit }) {
          const counter = ref(0)

          emit('incremented', counter.value)

          return {
            counter
          }
        }
      })
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 10,
          column: 31,
          endLine: 10,
          endColumn: 38
        }
      ]
    },
    {
      code: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, { emit }) {
          const counter = ref(0)

          emit('incremented', 'xxx', counter)

          return {
            counter
          }
        }
      })
      </script>
      `,
      output: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, { emit }) {
          const counter = ref(0)

          emit('incremented', 'xxx', counter.value)

          return {
            counter
          }
        }
      })
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 10,
          column: 38,
          endLine: 10,
          endColumn: 45
        }
      ]
    },
    // Auto-import
    {
      code: `
      let count = ref(0)

      count++ // error
      console.log(count + 1) // error
      console.log(1 + count) // error
      `,
      output: `
      let count = ref(0)

      count.value++ // error
      console.log(count.value + 1) // error
      console.log(1 + count.value) // error
      `,
      languageOptions: {
        globals: {
          ref: 'readonly'
        }
      },
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 12
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 19,
          endLine: 5,
          endColumn: 24
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 6,
          column: 23,
          endLine: 6,
          endColumn: 28
        }
      ]
    }
  ]
})
