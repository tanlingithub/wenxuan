<template>
  <div class="app-container">
    <el-table
      :data="list"
      v-loading="ajaxingData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :span-method="arraySpanMethod"
    >
      <el-table-column align="center" min-width="300px" :label="listTitle">
        <template slot-scope="{row}">
          <el-input
            v-if="row.edit"
            v-model="row.tempName"
            clearable
            class="edit-input"
            size="small"
          />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="operateTitle" width="200">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="text"
            size="small"
            @click="saveItem(row, row._index)"
            >保存</el-button
          >
          <el-button
            v-else
            type="text"
            size="small"
            icon="el-icon-edit"
            @click="editItem(row, row._index)"
            >编辑</el-button
          >
          <el-button
            v-if="row.edit"
            type="text"
            size="small"
            class="el-alert--error"
            @click="cancelEdit(row, row._index)"
            >取消</el-button
          >
          <el-button
            v-else
            type="text"
            size="small"
            icon="el-icon-delete"
            class="el-alert--error"
            @click="deleteItem(row, row._index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template slot="append">
        <div>
          <el-button type="text" style="width: 100%;" @click="handleAdd"
            >添加属性组</el-button
          >
        </div>
      </template>
    </el-table>
  </div>
</template>

<script>
import {
  getPropertyGroups,
  postPropertyGroups,
  deletePropertyGroups,
  putPropertyGroups
} from '@/service/spaas-commodity-center'

export default {
  name: 'InputTable',
  props: {
    listTitle: {
      type: String,
      default: '属性组名称'
    },
    operateTitle: {
      type: String,
      default: '操作'
    },
    categoryId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      emptyItem: {
        name: '',
        tempName: ''
      },
      list: [],
      ajaxingData: false // 是否在进行数据请求
    }
  },
  watch: {
    categoryId() {
      this.$nextTick(_ => {
        this.getList()
      })
    }
  },
  mounted() {
    // 请求属性组数据
    this.getList()
  },
  methods: {
    getList() {
      getPropertyGroups({categoryId: this.categoryId}).then(res => {
        const {payload} = res
        const newValue = payload || []

        this.list = newValue.map((info, _index) => ({
          ...info,
          tempName: info.name,
          _index
        }))
      })
    },
    // 删除列表
    deleteItem(row) {
      const {_index, id} = row
      if (id !== undefined) {
        deletePropertyGroups({id, categoryId: this.categoryId}).then(res => {
          const {payload} = res
          if (payload) {
            this.list = this.list.filter(info => info._index !== _index)
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败，请重试')
          }
        })
      } else {
        this.list = this.list.filter(info => info._index !== _index)
      }
    },
    // 合并指定单元格
    arraySpanMethod({row, column, _index, columnIndex}) {
      if (row.type === 'button') {
        return [1, 2]
      }
    },
    // 添加列表项
    handleAdd() {
      this.list.push({
        ...this.emptyItem,
        edit: true,
        _index: this.list.length
      })
    },
    // 保存修改
    saveItem(row, _index) {
      const {id} = row
      let tempName = ''
      const newList = this.list.map(info => {
        if (info._index === _index) {
          tempName = info.tempName
          return {
            ...info,
            name: info.tempName,
            edit: false
          }
        }
        return info
      })
      if (!tempName) {
        this.$message.error('请输入对应的属性组名称')
        return
      }
      if (id !== undefined) {
        // 修改
        putPropertyGroups({
          id,
          name: tempName,
          categoryId: this.categoryId
        }).then(res => {
          const {payload} = res
          if (payload) {
            this.$message.success('保存属性组成功！')
            this.list = newList
          } else {
            this.$message.error('保存属性组失败，请重试')
          }
        })
      } else {
        // 新增
        postPropertyGroups({
          name: tempName,
          categoryId: this.categoryId
        }).then(res => {
          const {payload} = res
          if (payload) {
            this.$message.success('保存属性组成功！')
            // 重新请求数据
            this.getList()
            // this.list = newList
          } else {
            this.$message.error('保存属性组失败，请重试')
          }
        })
      }
    },
    // 编辑单个项
    editItem(row, _index) {
      const newList = this.list.map(info => {
        if (info._index === _index) {
          return {
            ...info,
            edit: true
          }
        }
        return info
      })
      this.list = newList
    },
    // 取消编辑
    cancelEdit(row, _index) {
      const newList = this.list.map(info => {
        if (info._index === _index) {
          return {
            ...info,
            tempName: info.name,
            edit: false
          }
        }
        return info
      })
      this.list = newList
    }
  }
}
</script>
