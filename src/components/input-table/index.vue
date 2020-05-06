<template>
  <div class="el-input-table">
    <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :span-method="arraySpanMethod"
    >
      <el-table-column align="center" min-width="300px" :label="listTitle">
        <template slot-scope="{row, column, $index}">
          <input-change
            v-model="row[props.value]"
            @change="updataValue(row, column, $index, $event)"
            class="edit-input"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" :label="operateTitle" width="120">
        <template slot-scope="{row, column, $index}">
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteItem(row, column, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template slot="append">
        <div>
          <el-button type="text" style="width: 100%;" @click="handleAdd">{{
            addButtonText
          }}</el-button>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script>
import InputChange from '../input-change/index'

export default {
  name: 'ElInputTable',
  components: {
    InputChange
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    listTitle: {
      type: String,
      default: ''
    },
    operateTitle: {
      type: String,
      default: '操作'
    },
    addButtonText: {
      type: String,
      default: '添加'
    },
    props: {
      default() {
        return {
          value: 'value'
        }
      }
    }
  },
  computed: {
    list: {
      get: function() {
        return this.value || []
      },
      set: function(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    // 删除列表
    deleteItem(row, column, $index) {
      this.list.splice($index, 1)
      // 更新删除值
      this.$nextTick(() => {
        this.$emit('input', this.list)
      })
    },
    // 合并指定单元格
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      if (row.type === 'button') {
        return [1, 2]
      }
    },
    // 添加列表项
    handleAdd() {
      let newList = this.list.map(info => info.value)
      newList.push('')
    },
    // 修改值的时候，更新value值
    updataValue(row, column, $index, val) {
      console.error(row)
      console.warn(column)
      console.log($index)
      console.log(val)
      return
      this.$nextTick(() => {
        this.$emit('input', this.list)
      })
    }
  }
}
</script>
