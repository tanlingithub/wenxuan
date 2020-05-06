<template>
  <div class="app-container">
    <el-table
      :data="list"
      size="mini"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :span-method="arraySpanMethod"
    >
      <el-table-column align="center" min-width="300px" :label="listTitle">
        <template slot-scope="{row}">
          <el-input
            v-model="row.value"
            @blur="updataValue"
            class="edit-input"
            size="small"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" :label="operateTitle" width="120">
        <template slot-scope="{row}">
          <el-button
            type="text"
            class="el-alert--error"
            size="small"
            icon="el-icon-delete"
            @click="deleteItem(row, row.index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template slot="append">
        <div>
          <el-button
            size="small"
            type="text"
            style="width: 100%;"
            @click="handleAdd"
            >添加属性值</el-button
          >
        </div>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'InputTable',
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    listTitle: {
      type: String,
      default: '属性值'
    },
    operateTitle: {
      type: String,
      default: '操作'
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.getList(this.value)
  },
  methods: {
    getList(value = []) {
      const newValue = value.slice(0)
      const list = newValue.map((info, rowIndex) => ({value: info, rowIndex}))
      this.list = list
    },
    // 删除列表
    deleteItem(row) {
      const {rowIndex} = row
      this.list = this.list.filter(info => info.rowIndex !== rowIndex)
      // 更新删除值
      this.updataValue()
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
      this.getList(newList)
    },
    // 修改值的时候，更新value值
    updataValue() {
      this.$nextTick(() => {
        const newList = this.list.map(info => info.value)
        this.$emit('input', newList)
      })
    }
  },
  watch: {
    value(val) {
      // 如果跟当前选中值相同，则不更新
      this.$nextTick(() => {
        const componentValue = this.list
          .slice(0, -1)
          .map(info => info.value)
          .join(',')
        if (val.join(',') !== componentValue) {
          this.getList(val)
        }
      })
    }
  }
}
</script>
