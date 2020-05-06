<script>
import {Table, TableColumn} from 'element-ui'
import {set, get} from 'lodash'
import mixinOptionExtensions from './mixin-package-option.js'

const TYPES = ['selection', 'index', 'expand']
const SLOT_DEFAULT = 'default-'
const SLOT_HEADER = 'header-'
let len = 0

/**
 * 转换为大小驼峰命名
 * abc-efg => abcEfg
 */
export const toCamelCase = str => {
  return str.indexOf('-') !== -1
    ? str.replace(/-([a-zA-Z])/g, ($0, $1) => $1.toUpperCase())
    : str
}

export default {
  name: 'Editable',
  components: {
    'el-table': Table,
    'el-table-column': TableColumn
  },
  mixins: [mixinOptionExtensions],
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    editableMethod: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      store: [],
      spanArr: [],
      spanObject: {},
      customSpanMethod: () => {}
    }
  },
  watch: {
    data: {
      handler: 'rowspan',
      immediate: true
    },
    columns: {
      handler: 'rowspan',
      immediate: true
    }
  },
  render(h) {
    len = 0 // 初始化值

    const slots = Object.keys(this.$slots)
      .reduce((arr, key) => arr.concat(this.$slots[key]), [])
      // 手动更正 context
      .map(vnode => {
        vnode.context = this._self
        return vnode
      })

    const columns = this.renderColumn(h, {
      columns: this.columns,
      editableMethod: this.editableMethod
    })

    return h(
      'el-table',
      {
        ref: 'table',
        props: Object.assign({}, this.$attrs, {
          data: this.data,
          rowClassName: 'editable-row-class',
          headerCellClassName: 'editable-header-cell-class',
          spanMethod: this.customSpanMethod
        }),
        on: this.$listeners
      },
      columns.concat(slots)
    )
  },
  mounted() {
    this.customSpanMethod =
      this.$attrs['span-method'] ||
      this.$attrs.spanMethod ||
      this.arraySpanMethod
  },
  methods: {
    renderColumn(h, data = {}) {
      return data.columns.map((col, index) => {
        let columnIndex

        // todo: 待优化
        len = col.children ? len : len + 1 // 用于计算 column 的 index
        columnIndex = len - 1 // 从0开始，所以减1

        let filterData = {
          props: col
        }
        let scopedSlot =
          this.$scopedSlots[SLOT_DEFAULT + col.type] ||
          this.$scopedSlots[SLOT_DEFAULT + col.prop]

        if ((!col.type || TYPES.indexOf(col.type) < 0) && !scopedSlot) {
          filterData.scopedSlots = {
            default: scope => {
              const config =
                (data.editableMethod &&
                  data.editableMethod({
                    row: scope.row,
                    column: scope.column,
                    rowIndex: scope.$index,
                    columnIndex: columnIndex
                  })) ||
                col.render

              const renderElement =
                (typeof config === 'object' &&
                  (config.$component || config.$type)) ||
                'el-input'
              return config
                ? h(
                    renderElement,
                    {
                      props: Object.assign({}, config.$el, {
                        value: get(scope.row, col.prop)
                      }),
                      on: {
                        input: val => {
                          // 处理空值时修改很慢的问题
                          get(scope.row, col.prop) === undefined
                            ? this.$set(scope.row, col.prop, val) // todo: 这里存在bug, 如果 prop 为 . 拼接的 key
                            : set(scope.row, col.prop, val)
                        },
                        change: val => {
                          this.handleChange({
                            prop: col.prop,
                            value: val,
                            row: scope.row,
                            column: scope.column,
                            rowIndex: scope.$index,
                            columnIndex: columnIndex
                          })
                        }
                      }
                    },
                    [
                      (() => {
                        const optType =
                          config.$type && config.$type.indexOf('el-') === 0
                            ? config.$type.slice(3)
                            : config.$type
                        let optRenderer =
                          optType && this[`${toCamelCase(optType)}_opt`]
                        if (
                          typeof optRenderer === 'function' &&
                          Array.isArray(config.$options)
                        ) {
                          return config.$options.map(optRenderer)
                        }
                      })()
                    ]
                  )
                : col.formatter
                ? col.formatter(
                    scope.row,
                    scope.column,
                    get(scope.row, col.prop),
                    scope.$index
                  )
                : get(scope.row, col.prop)
            }
          }
        }
        if (scopedSlot) {
          filterData.scopedSlots = {
            default: scopedSlot
          }
        }
        if (this.$scopedSlots[SLOT_HEADER + col.prop]) {
          filterData.scopedSlots.header = this.$scopedSlots[
            SLOT_HEADER + col.prop
          ]
        }
        return h(
          'el-table-column',
          filterData,
          col.children && [
            this.renderColumn(h, {
              columns: col.children,
              editableMethod: this.editableMethod
            })
          ]
        )
      })
    },
    rowspan() {
      const data = this.data

      const getSpanObject = (arr, con = {}) => {
        return arr.reduce((sum, col) => {
          if (col.children && col.children.length) {
            getSpanObject(col.children, sum)
            return sum
          }

          if (!col.isMergeCell) {
            return sum
          }

          sum[col.prop] = []

          let position
          let spanArr = sum[col.prop]

          data.forEach((item, index) => {
            if (index === 0) {
              spanArr.push(1)
              position = 0
            } else {
              if (data[index][col.prop] === data[index - 1][col.prop]) {
                spanArr[position] += 1
                spanArr.push(0)
              } else {
                spanArr.push(1)
                position = index
              }
            }
          })
          return sum
        }, con)
      }

      this.spanObject = getSpanObject(this.columns)
    },
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      const spanArr = this.spanObject[column.property]
      if (spanArr) {
        const _row = spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    handleChange(data) {
      const index = this.store.findIndex(
        item =>
          item.rowIndex === data.rowIndex &&
          item.columnIndex === data.columnIndex
      )
      this.$emit('cell-change', data)
      if (index > -1) {
        this.store.splice(index, 1, data)
        return
      }
      this.store.push(data)
    },
    setCellValue(key, rowIndex, value) {
      const row = this.data[rowIndex]
      set(row, key, value)
    },
    clearStore() {
      this.store = []
    },
    getValue() {
      return this.store
    }
  }
}
</script>
<style lang="less">
.el-table {
  color: #26344c;

  .editable-header-cell-class {
    height: 46px;
    font-weight: 400;
    color: rgba(105, 109, 116, 1);
    background: rgba(236, 238, 243, 1);
  }

  .editable-row-class {
    height: 46px;

    &:nth-child(odd):hover > td,
    &:nth-child(odd).hover-row > td {
      background-color: rgb(255, 255, 255);
    }

    &:nth-child(even) {
      background-color: rgb(248, 249, 251);

      &:hover > td,
      &.hover-row > td {
        background-color: rgb(248, 249, 251);
      }
    }
  }
}
</style>
