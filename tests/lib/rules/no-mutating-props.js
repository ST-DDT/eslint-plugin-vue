/**
 * @fileoverview disallow mutation of component props
 * @author 2018 Armano
 */
'use strict'

const rule = require('../../../lib/rules/no-mutating-props')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

ruleTester.run('no-mutating-props', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <div v-if="foo"></div>
            <div v-if="prop1 = [1, 2]"></div>
            <div v-if="prop2++"></div>
            <div v-text="prop3.shift()"></div>
            <div v-text="prop4.slice(0).shift()"></div>
            <div v-if="this.prop5 = [1, 2] && this.someProp"></div>
            <div v-if="this.prop6++ && this.someProp < 10"></div>
            <div v-text="this.prop7.shift()"></div>
            <div v-text="this.prop8.slice(0).shift()"></div>
          </div>
        </template>
        <script>
          export default {
            props: ['foo']
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <input v-model="prop1.text">
            <input v-model="prop2">
            <input v-model="this.prop3.text">
            <input v-model="this.prop4">
            <input :value="prop5.text" @input="$emit('input', $event.target.value)">
            <div v-for="prop5 of data">
              <input v-model="prop5">
            </div>
            <div v-for="(prop6, index) of data">
              <input v-model="prop6">
            </div>
            <template v-for="(test, index) of data">
              <template v-for="(prop6, index) of data">
                <input v-model="prop6">
                <div v-text="prop6.shift()"></div>
              </template>
            </template>
          </div>
        </template>
        <script>
          export default {
            props: ['prop5', 'prop6', 'prop7', 'prop8']
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <input v-model="prop1.text">
            <input v-model="prop2">
            <input v-model="this.prop3.text">
            <input v-model="this.prop4">
          </div>
        </template>
        <script>
          export default {
            props: ['prop5', 'prop6', 'prop7', 'prop8']
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <input v-for="i in prop.slice()">
            <input v-for="i in prop.foo.slice()">
          </div>
        </template>
        <script>
          export default {
            props: ['prop']
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              todo: {
                type: Object,
                required: true
              },
              items: {
                type: Array,
                default: []
              }
            },
            methods: {
              openModal() {
                this.$emit('someEvent', this.todo)
                const a = this.items.slice(0).push('something') // no mutation because of \`slice(0)\`
              }
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="prop">
            <div v-for="prop in data">
              <MyComp @click="prop.foo++"></MyComp>
              <input v-model="prop">
            </div>
            <input v-model="prop()">
            <input v-model="foo">
            <input @click="prop().foo++">
            <input v-model="foo[this]">
            <input v-model="foo[this.prop]">
            <input v-model="this">
            <MyComp @click="bar = {prop: foo++}"></MyComp>
          </div>
        </template>
        <script>
          export default {
            props: ['prop'],
            methods: {
              onKeydown() {
                const vm = this
                foo.prop = 1
                vm()()()
                vm.prop()()
                prop++
                prop = 1
                const bar = {prop: foo}
                prop[this] ++
              }
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <button @click="foo++"></button>
            <button @click="foo+=1"></button>
            <button @click="foo.push($event)"></button>
            <input v-model="foo">
            <input v-model="this.foo">
          </div>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <input v-model="prop1.text">
            <input v-model="this.prop2.text">
            <button @click="prop3.text = '1'"></button>
            <button @click="prop3.count++"></button>
            <button @click="prop3.list.push(1)"></button>
            <button @click="prop3.parent.text = '2'"></button>
            <button @click="delete prop3.parent.text"></button>
          </div>
        </template>
        <script>
          export default {
            props: ['prop1', 'prop2', 'prop3'],
            methods: {
                onKeydown() {
                  this.prop3.text = '2'
                  this.prop3.count ++
                  this.prop3.list.push(1)
                  this.prop3.parent.text = '2'
                  delete this.prop3.parent.text
                }
            }
          }
        </script>
      `,
      options: [{ shallowOnly: true }]
    },

    // setup
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup(props) {
              props ++
              props = 1
              props.push(1)
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup({a}) {
              a ++
              a = 1
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup({...props}) {
              props ++
              props = 1
              props.push(1)
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            ssss(props) {
              props.a ++
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup(props) {
              const a = props.a
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup() {
              props.a++
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup(...props) {
              props.a++
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup([props]) {
              props.a++
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        // not <script setup>
        const {value} = defineProps({
          value: Object,
        })
        value.value++
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        // not <script setup>
        const {value} = defineProps({
          value: Object,
        })
        value.value++
        </script>
        <script setup>
        value.value++
        </script>
      `
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1579
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['prop'],
          setup(props) {
            props.prop.sortAscending()
          }
        }
      </script>`
    },

    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup(props) {
                props.prop1.text = '2'
                props.prop1.count ++
                props.prop1.list.push(1)
                props.prop1.parent.text = '2'
            }
          }
        </script>
      `,
      options: [{ shallowOnly: true }]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup({a,b,c, d: [e, , f]}) {
              a.foo ++
              b.foo = 1
              c.push(1)

              c.x.push(1)
              delete c.y
              e.foo++
              f.foo++
            }
          }
        </script>
      `,
      options: [{ shallowOnly: true }]
    },

    {
      // script setup with shadow
      filename: 'test.vue',
      code: `
        <template>
          <input v-model="foo">
          <input v-model="bar">
          <input v-model="Infinity">
        </template>
        <script setup>
        import { ref } from 'vue'
        import { bar } from './my-script'
        defineProps({
          foo: String,
          bar: String,
          Infinity: Number
        })
        const foo = ref('')
        </script>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <div v-if="prop1 = [1, 2]"></div>
            <div v-if="prop2++"></div>
            <div v-text="prop3.shift()"></div>
            <div v-text="prop4.slice(0).shift()"></div>
            <div v-if="this.prop5 = [1, 2] && this.someProp"></div>
            <div v-if="this.prop6++ && this.someProp < 10"></div>
            <div v-text="this.prop7.shift()"></div>
            <div v-text="this.prop8.slice(0).shift()"></div>
            <div v-if="delete prop9.a"></div>
          </div>
        </template>
        <script>
          export default {
            props: ['prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'prop6', 'prop7', 'prop8', 'prop9']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop1" prop.',
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 38
        },
        {
          message: 'Unexpected mutation of "prop2" prop.',
          line: 5,
          column: 24,
          endLine: 5,
          endColumn: 31
        },
        {
          message: 'Unexpected mutation of "prop3" prop.',
          line: 6,
          column: 26,
          endLine: 6,
          endColumn: 39
        },
        {
          message: 'Unexpected mutation of "prop5" prop.',
          line: 8,
          column: 24,
          endLine: 8,
          endColumn: 60
        },
        {
          message: 'Unexpected mutation of "prop6" prop.',
          line: 9,
          column: 24,
          endLine: 9,
          endColumn: 36
        },
        {
          message: 'Unexpected mutation of "prop7" prop.',
          line: 10,
          column: 26,
          endLine: 10,
          endColumn: 44
        },
        {
          message: 'Unexpected mutation of "prop9" prop.',
          line: 12,
          column: 24,
          endLine: 12,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <div v-text="prop1?.shift?.()"></div>
            <div v-text="prop2?.slice?.(0)?.shift?.()"></div>
            <div v-if="this?.prop3"></div>
            <div v-if="this?.prop4 < 10"></div>
            <div v-text="this?.prop5?.shift?.()"></div>
            <div v-text="this?.prop6?.slice?.(0)?.shift?.()"></div>
          </div>
        </template>
        <script>
          export default {
            props: ['prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'prop6']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop1" prop.',
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 42
        },
        {
          message: 'Unexpected mutation of "prop5" prop.',
          line: 8,
          column: 26,
          endLine: 8,
          endColumn: 48
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <div v-text="(prop1?.shift)?.()"></div>
            <div v-text="(this?.prop2)?.shift?.()"></div>
            <div v-text="(this?.prop3?.shift)?.()"></div>
          </div>
        </template>
        <script>
          export default {
            props: ['prop1', 'prop2', 'prop3']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop1" prop.',
          line: 4,
          column: 26,
          endLine: 4,
          endColumn: 44
        },
        {
          message: 'Unexpected mutation of "prop2" prop.',
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 50
        },
        {
          message: 'Unexpected mutation of "prop3" prop.',
          line: 6,
          column: 26,
          endLine: 6,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <input v-model="prop1.text">
            <input v-model="prop2">
            <input v-model="this.prop3.text">
            <input v-model="this.prop4">
          </div>
        </template>
        <script>
          export default {
            props: ['prop1', 'prop2', 'prop3', 'prop4']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop1" prop.',
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 39
        },
        {
          message: 'Unexpected mutation of "prop2" prop.',
          line: 5,
          column: 29,
          endLine: 5,
          endColumn: 34
        },
        {
          message: 'Unexpected mutation of "prop3" prop.',
          line: 6,
          column: 29,
          endLine: 6,
          endColumn: 44
        },
        {
          message: 'Unexpected mutation of "prop4" prop.',
          line: 7,
          column: 29,
          endLine: 7,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              todo: {
                type: Object,
                required: true
              },
              items: {
                type: Array,
                default: []
              }
            },
            methods: {
              openModal() {
                ++this.items
                this.todo.type = 'completed'
                this.items.push('something')
                delete this.todo.type
              }
            }
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "items" prop.',
          line: 16,
          column: 17,
          endLine: 16,
          endColumn: 29
        },
        {
          message: 'Unexpected mutation of "todo" prop.',
          line: 17,
          column: 17,
          endLine: 17,
          endColumn: 45
        },
        {
          message: 'Unexpected mutation of "items" prop.',
          line: 18,
          column: 17,
          endLine: 18,
          endColumn: 45
        },
        {
          message: 'Unexpected mutation of "todo" prop.',
          line: 19,
          column: 17,
          endLine: 19,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo', 'bar', 'baz'],
            methods: {
              openModal() {
                this?.foo?.push?.('something')
                ;(this?.bar)?.push?.('something')
                ;(this?.baz?.push)?.('something')
              }
            }
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "foo" prop.',
          line: 7,
          column: 17,
          endLine: 7,
          endColumn: 47
        },
        {
          message: 'Unexpected mutation of "bar" prop.',
          line: 8,
          column: 18,
          endLine: 8,
          endColumn: 50
        },
        {
          message: 'Unexpected mutation of "baz" prop.',
          line: 9,
          column: 18,
          endLine: 9,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <template v-for="(test, index) of data">
              <template v-for="(prop, index) of data">
                <input v-model="prop">
              </template>
              <input v-model="prop">
            </template>
          </div>
        </template>
        <script>
          export default {
            props: ['prop']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop" prop.',
          line: 8,
          column: 31,
          endLine: 8,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <template v-for="prop of data">
              <input v-model="this.prop">
              <div v-text="prop.shift()"></div>
              <div v-text="this.prop.shift()"></div>
            </template>
          </div>
        </template>
        <script>
          export default {
            props: ['prop']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop" prop.',
          line: 5,
          column: 31,
          endLine: 5,
          endColumn: 40
        },
        {
          message: 'Unexpected mutation of "prop" prop.',
          line: 7,
          column: 28,
          endLine: 7,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <MyComponent :data.sync="this.prop" />
            <MyComponent :data.sync="prop" />
            <MyComponent :data="this.prop" />
            <MyComponent :data="prop" />
            <template v-for="prop of data">
              <MyComponent :data.sync="prop" />
              <MyComponent :data.sync="this.prop" />
            </template>
          </div>
        </template>
        <script>
          export default {
            props: ['prop']
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "prop" prop.',
          line: 4,
          column: 38,
          endLine: 4,
          endColumn: 47
        },
        {
          message: 'Unexpected mutation of "prop" prop.',
          line: 5,
          column: 38,
          endLine: 5,
          endColumn: 42
        },
        {
          message: 'Unexpected mutation of "prop" prop.',
          line: 10,
          column: 40,
          endLine: 10,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>
            <div v-if="prop1 = [1, 2]"></div>
            <div v-if="prop2++"></div>
            <div v-text="prop3.shift()"></div>
            <div v-text="prop4.slice(0).shift()"></div>
            <div v-if="this.prop5 = [1, 2] && this.someProp"></div>
            <div v-if="this.prop6++ && this.someProp < 10"></div>
            <div v-text="this.prop7.shift()"></div>
            <div v-text="this.prop8.slice(0).shift()"></div>
            <div v-if="delete prop9.a"></div>
            <div v-if="delete this.prop10"></div>
          </div>
        </template>
        <script>
          export default {
            props: ['prop1', 'prop2', 'prop3', 'prop4', 'prop5', 'prop6', 'prop7', 'prop8', 'prop9', 'prop10'],
            method: {
              deleteProp() {
                delete this.prop9.a
                delete this.prop10
              }
            }
          }
        </script>
      `,
      options: [{ shallowOnly: true }],
      errors: [
        {
          message: 'Unexpected mutation of "prop1" prop.',
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 38
        },
        {
          message: 'Unexpected mutation of "prop2" prop.',
          line: 5,
          column: 24,
          endLine: 5,
          endColumn: 31
        },
        {
          message: 'Unexpected mutation of "prop5" prop.',
          line: 8,
          column: 24,
          endLine: 8,
          endColumn: 60
        },
        {
          message: 'Unexpected mutation of "prop6" prop.',
          line: 9,
          column: 24,
          endLine: 9,
          endColumn: 36
        },
        {
          message: 'Unexpected mutation of "prop10" prop.',
          line: 13,
          column: 24,
          endLine: 13,
          endColumn: 42
        },
        {
          message: 'Unexpected mutation of "prop10" prop.',
          line: 22,
          column: 17,
          endLine: 22,
          endColumn: 35
        }
      ]
    },

    // setup
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup(props) {
              props.a ++
              props.b = 1
              props.c.push(1)
              delete props.d
            }
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 25
        },
        {
          message: 'Unexpected mutation of "b" prop.',
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 26
        },
        {
          message: 'Unexpected mutation of "c" prop.',
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 30
        },
        {
          message: 'Unexpected mutation of "d" prop.',
          line: 8,
          column: 15,
          endLine: 8,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup({a,b,c, d: [e, , f]}) {
              a.foo ++
              b.foo = 1
              c.push(1)

              c.x.push(1)
              delete c.y
              e.foo++
              f.foo++
            }
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 23
        },
        {
          message: 'Unexpected mutation of "b" prop.',
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 24
        },
        {
          message: 'Unexpected mutation of "c" prop.',
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 24
        },
        {
          message: 'Unexpected mutation of "c" prop.',
          line: 9,
          column: 15,
          endLine: 9,
          endColumn: 26
        },
        {
          message: 'Unexpected mutation of "c" prop.',
          line: 10,
          column: 15,
          endLine: 10,
          endColumn: 25
        },
        {
          message: 'Unexpected mutation of "d" prop.',
          line: 11,
          column: 15,
          endLine: 11,
          endColumn: 22
        },
        {
          message: 'Unexpected mutation of "d" prop.',
          line: 12,
          column: 15,
          endLine: 12,
          endColumn: 22
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup({a: foo, b: [...bar], c: baz = 1}) {
              foo.x ++
              delete foo.y
              bar.x = 1
              baz.push(1)
            }
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 23
        },
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 27
        },
        {
          message: 'Unexpected mutation of "b" prop.',
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 24
        },
        {
          message: 'Unexpected mutation of "c" prop.',
          line: 8,
          column: 15,
          endLine: 8,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup({...props}) {
              props.a ++
              props.b = 1
              props.c.push(1)
              delete props.d
            }
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 25
        },
        {
          message: 'Unexpected mutation of "b" prop.',
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 26
        },
        {
          message: 'Unexpected mutation of "c" prop.',
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 30
        },
        {
          message: 'Unexpected mutation of "d" prop.',
          line: 8,
          column: 15,
          endLine: 8,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup(props) {
              props[a] ++
            }
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "[a]" prop.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup({[a]: c}) {
              c.foo ++
            }
          }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "[a]" prop.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 23
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `
        <script setup>
          const props = defineProps()
        </script>

        <template>
          <input v-model="props[foo]" >
        </template>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "[foo]" prop.',
          line: 7,
          column: 27,
          endLine: 7,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <input v-model="value">
          <input v-model="props.value">
        </template>
        <script setup>
        const props = defineProps({
          value: String,
        })
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "value" prop.',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 32
        },
        {
          message: 'Unexpected mutation of "value" prop.',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        const props = defineProps({
          value: String,
        })
        props.value++
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "value" prop.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        const {value} = defineProps({
          value: Object,
        })
        value.value++
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "value" prop.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const props = withDefaults(defineProps<Props>(), {
          msg: 'hello'
        })
        props.value++
        </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Unexpected mutation of "value" prop.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup(props) {
              props.a ++
              props.b = 1
              props.c.push(1)
              delete props.d

              function foo() {
                props.a ++
              }
            }
          }
        </script>

      `,
      options: [{ shallowOnly: true }],
      errors: [
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 25
        },
        {
          message: 'Unexpected mutation of "b" prop.',
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 26
        },
        {
          message: 'Unexpected mutation of "d" prop.',
          line: 8,
          column: 15,
          endLine: 8,
          endColumn: 29
        },
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 11,
          column: 17,
          endLine: 11,
          endColumn: 27
        }
      ]
    },

    {
      // script setup with shadow
      filename: 'test.vue',
      code: `
        <template>
          <input v-model="foo">
          <input v-model="bar">
          <input v-model="window">
          <input v-model="Infinity">
        </template>
        <script setup>
        import { ref } from 'vue'
        const { Infinity, obj } = defineProps({
          foo: String,
          bar: String,
          Infinity: String,
          window: String,
          obj: Object
        })
        const foo = ref('')
        obj.id = 2
        </script>
      `,
      errors: [
        {
          message: 'Unexpected mutation of "bar" prop.',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 30
        },
        {
          message: 'Unexpected mutation of "window" prop.',
          line: 5,
          column: 27,
          endLine: 5,
          endColumn: 33
        },
        {
          message: 'Unexpected mutation of "Infinity" prop.',
          line: 6,
          column: 27,
          endLine: 6,
          endColumn: 35
        },
        {
          message: 'Unexpected mutation of "obj" prop.',
          line: 18,
          column: 9,
          endLine: 18,
          endColumn: 19
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `
        <template>
          <button @click="props.a ++"/>
          <button @click="a ++"/>
          <button @click="props.b.push(1)"/>
          <button @click="b.push(1)"/>
          <input v-model="props.a"/>
          <input v-model="props.a.b"/>
        </template>
        <script setup>
          const props = defineProps({
            a: Number,
            b: Array,
          })
          props.a ++
        </script>
      `,
      options: [{ shallowOnly: true }],
      errors: [
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 37
        },
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 31
        },
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 7,
          column: 27,
          endLine: 7,
          endColumn: 34
        },
        {
          message: 'Unexpected mutation of "a" prop.',
          line: 15,
          column: 11,
          endLine: 15,
          endColumn: 21
        }
      ]
    }
  ]
})
