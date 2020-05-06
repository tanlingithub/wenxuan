<template>
  <div class="associated">
    <el-data-table class="data-table" ref="table" v-bind="tableConfig">
      <el-table-column label="操作" width="300px">
        <template slot="default" slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :class="{
              'el-alert--error': judgeIfAssociate(scope.row) === '取消关联'
            }"
            @click="brandBtn(scope.row, scope.$index)"
            >{{ judgeIfAssociate(scope.row) }}</el-button
          >
        </template>
      </el-table-column>
    </el-data-table>
    <div class="associated-footer" v-show="showSave">
      <el-button @click="cancelChange">取消</el-button>
      <el-button type="primary" @click="saveFormValue">确认</el-button>
    </div>
  </div>
</template>

<script>
import {ATTRIBUTE_TYPES} from '@/const/dictionary.js'
import {backCategoryProperty} from '@/const/api.js'
import TreeDate from '@/utils/tree-data'
import {postPropertyBatch} from '@/service/spaas-commodity-center'

export default {
  props: {
    categoryId: {
      type: [String, Number],
      required: true
    },
    ifUpdate: {
      type: Boolean
    }
  },
  data() {
    const currentUrl = backCategoryProperty({id: this.categoryId})
    return {
      currentUrl,
      tableConfig: {
        url: currentUrl,
        dataPath: 'payload.content',
        columns: 'columns',
        hasNew: false,
        hasEdit: false,
        isTree: true,
        hasOperation: false,
        hasPagination: true,
        hasDelete: false,
        customQuery: {
          relation: false
        },
        tableAttrs: {
          'max-height': 400
        },
        columns: [
          {
            prop: 'propertyName',
            label: '属性名称'
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
            $el: {
              placeholder: '请输入属性名称'
            }
          }
        ]
      },
      associatedList: [],
      toggle: false
    }
  },
  computed: {
    showSave() {
      return !!this.associatedList.length
    }
  },
  watch: {
    ifUpdate(val) {
      if (val) {
        this.updateTableData()
      }
    },
    categoryId() {
      this.$nextTick(_ => {
        this.tableConfig.url = backCategoryProperty({id: this.categoryId})
      })
    }
  },
  methods: {
    setChangeArrtibute(data) {
      this.$set(data, 'isEnabled', !!data.isEnabled ? true : false)
    },
    brandBtn(data, index) {
      const newTreeDate = new TreeDate()
      const treeArray = newTreeDate.treeToArray([data])
      const associatedList = this.associatedList

      let ifAssociated = false // 是否已经被关联
      for (let item of associatedList) {
        if (item.id === data.id) {
          ifAssociated = true
          break
        }
      }
      // 如果数据在数组中的话，那则移除该数据
      if (ifAssociated) {
        // 移除当前以及子项的选中状态
        this.associatedList = associatedList.filter(info => {
          for (let item of treeArray) {
            if (info.id === item.id) {
              return false
            }
          }
          return true
        })
      } else {
        // 添加当前以及子项的选中状态

        // 将那些未选中的过滤出来
        let newAddsociated = treeArray.filter(info => {
          for (let item of associatedList) {
            if (info.id === item.id) {
              return false
            }
          }
          return true
        })
        this.associatedList = associatedList.concat(newAddsociated)
      }
      this.$nextTick(() => {
        this.$set(this.$refs.table.data, index, data)
      })
    },
    saveFormValue() {
      // 获取当前选中的项
      const saveArr = this.associatedList.map(info => {
        return {
          categoryId: this.categoryId,
          propertyId: info.id,
          propertyGroupId: null,
          propertyTypes: 3,
          required: true
        }
      })
      postPropertyBatch(this.categoryId, saveArr).then(res => {
        const {payload} = res
        if (payload) {
          this.$message.success('批量添加属性关联成功')
          // 进行数据刷新
          this.updateTableData()
          this.cancelChange()
        } else {
          this.$message.error('批量添加属性关联失败，请重试')
        }
      })
    },
    cancelChange() {
      // 清除
      // 将当前的选中数组置空
      this.associatedList = []
      this.$emit('cancel-change')
    },
    judgeIfAssociate(data) {
      for (let item of this.associatedList) {
        if (item.id === data.id) {
          return '取消关联'
        }
      }
      return '添加关联'
    },
    // 更新table数据
    updateTableData() {
      this.$refs.table.getList()
    }
  }
}
</script>
<style scoped lang="less">
.associated {
  .associated-footer {
    padding: 30px 0 0;
    background: #fff;
    text-align: center;
  }
}
</style>
