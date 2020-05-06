<template>
  <div class="property-manage-container">
    <el-data-table v-bind="tableConfig" ref="dataTable"></el-data-table>
  </div>
</template>
<script>
import {commodityPropertyList} from '@/const/api.js'
import {
  existRelationOrDelete,
  deleteProperties
} from '../../service/spaas-commodity-center.js'
import {INPUT_TYPE} from '@/const/dictionary.js'
import variables from '@/styles/variables.less'

export default {
  data() {
    return {
      tableConfig: {
        firstPage: 1,
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        hasDialog: false,
        hasPagination: true,
        hasOperation: true,
        isTree: true,
        url: commodityPropertyList,
        hasNew: false,
        hasEdit: false,
        hasView: false,
        hasDelete: false,
        single: false,
        headerButtons: [
          {
            type: 'primary',
            text: '新增属性',
            atClick: this.addProperty
          }
        ],
        extraButtons: [
          {
            text: '编辑',
            atClick: this.editItem
          },
          {
            text: '删除',
            style: {color: variables.dangerColor},
            atClick: this.deleteItem
          }
        ],
        columns: [
          {
            prop: 'propertyName',
            label: '属性名称'
          },
          {
            prop: 'inputType',
            label: '输入方式',
            formatter: row => {
              const {inputType} = row
              for (let item of INPUT_TYPE) {
                if (inputType == item.value) {
                  return item.label
                }
              }
              return inputType
            }
          },
          {
            prop: 'inputValues',
            label: '属性值'
          }
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'propertyName',
            label: '属性名称',
            $el: {
              placeholder: '请输入'
            }
          },
          {
            $type: 'select',
            $id: 'inputType',
            label: '输入方式',
            $options: INPUT_TYPE,
            inputFormat: row => {
              return row
            },
            outputFormat: row => {
              return row
            },
            $el: {
              placeholder: '请输入'
            }
          }
        ],
        form: []
      }
    }
  },
  methods: {
    // 删除单个表单项
    deleteItem(item) {
      this.$confirm('您确定要删除该属性吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const {id} = item
          existRelationOrDelete(id).then(res => {
            const {msg, payload, code} = res.data
            if (msg === 'ok' && payload) {
              this.$message.success('删除成功')
              this.$refs.dataTable.getList()
            } else if (code === '400') {
              this.$confirm(
                '该属性或其子属性包含类目关联关系，您确定要删除吗?',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              )
                .then(() => {
                  deleteProperties(id).then(res => {
                    const {msg, payload, code} = res.data
                    if (msg === 'ok' && payload) {
                      this.$message.success('删除成功')
                      this.$refs.dataTable.getList()
                    } else if (code === '400') {
                      this.$message.error('删除失败，请重试！')
                    } else {
                      this.$message.error('删除失败，请重试！')
                    }
                  })
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  })
                })
            } else {
              this.$message.error('删除失败，请重试！')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改单个表单项
    editItem(item) {
      const {id} = item
      this.$router.push({
        path: '/property-manage/edit-property',
        query: {
          id
        }
      })
      return Promise.resolve(false)
    },
    // 增加属性
    addProperty() {
      this.$router.push(`/property-manage/add-property`)
      return Promise.resolve(false)
    }
  }
}
</script>
