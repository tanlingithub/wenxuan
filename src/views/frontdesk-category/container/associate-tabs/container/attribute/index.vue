<template>
  <div class="attribute-container">
    <el-data-table ref="table" v-bind="tableConfig" @update="updateTableValue">
    </el-data-table>
    <el-dialog title="关联属性" :visible.sync="dialogVisible" width="60%">
      <associated
        :categoryId="categoryId"
        :ifUpdate="dialogVisible"
        @cancel-change="dialogVisible = false"
      ></associated>
    </el-dialog>
  </div>
</template>

<script>
import {ATTRIBUTE_TYPES, WHETTHER} from '@/const/dictionary.js'
import Associated from './container/associated'
import {frontCategoryProperty} from '@/const/api'
import {deleteFrontPropertyBatch} from '@/service/spaas-commodity-center'
import TreeData from '@/utils/tree-data'

const IF_REQUIRED = [
  {
    label: '是',
    value: true
  },
  {
    label: '否',
    value: false
  }
]
export default {
  props: {
    categoryId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    const emptyGroupItem = {
      name: '无',
      id: 0
    }
    const currentUrl = frontCategoryProperty({id: this.categoryId})
    return {
      emptyGroupItem,
      dialogVisible: false,
      attributeTypes: ATTRIBUTE_TYPES, // 属性类型
      ifRequired: IF_REQUIRED, // 是否必填
      propertyGroupList: [], // 所属属性组
      tableConfig: {
        url: currentUrl,
        dataPath: 'data.payload',
        columns: 'columns',
        hasPagination: false,
        hasNew: false,
        hasDelete: true,
        isTree: true,
        hasEdit: false,
        onDelete: this.deleteItem,
        customQuery: {
          relation: true
        },
        hasOperation: true,
        headerButtons: [
          {
            type: 'primary',
            text: '添加属性',
            atClick: row => {
              this.associatedLink(row.id)
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {
            prop: 'id',
            label: '属性编号'
          },
          {
            prop: 'propertyName',
            label: '属性名'
          },
          {
            prop: 'inputValues',
            label: '属性值'
          }
        ]
      }
    }
  },
  components: {
    Associated
  },
  computed: {
    currentPropertyGroupList() {
      const emptyGroupArr = [this.emptyGroupItem]
      return emptyGroupArr.concat(this.propertyGroupList)
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        // 更新数据请求, 更新URL后，data-table会进行数据刷新
        this.$refs.table.getList()
      }
    },
    categoryId() {
      this.$nextTick(_ => {
        this.tableConfig.url = frontCategoryProperty({id: this.categoryId})
      })
    }
  },
  methods: {
    associatedLink(ele) {
      this.dialogVisible = true
    },
    // 显示关联属性组
    showPropertyGroupDialog() {
      this.ifShowGroupDialog = true
    },
    // 更新Updata后的数据回调
    updateTableValue(data) {
      const $table = this.$refs.table
      const newTreeData = new TreeData()
      const treeArr = newTreeData.arrayToTree(data, {
        id: 'propertyId',
        parentId: 'parentId'
      })
      const tree2Array = $table.tree2Array(treeArr, false)
      // 将数据转为树结构
      $table.data = tree2Array
    },
    // 删除表单项
    deleteItem(row) {
      const tableData = this.$refs.table.data
      const newTreeData = new TreeData()
      const arrayTree = newTreeData.treeToArray([row])
      const deleteIdStr = arrayTree.map(info => info.id).join(',')
      const id = this.categoryId

      // 遍历获取所有的子节点，
      return new Promise((resolve, reject) => {
        deleteFrontPropertyBatch(id, deleteIdStr).then(res => {
          const {payload} = res
          if (payload) {
            resolve(true)
          } else {
            this.$message.error('删除属性值失败，请重试！')
            reject(false)
          }
        })
      })
    }
  }
}
</script>
<style lang="less">
.attribute-container {
  .srcUrl {
    width: 60px;
    height: 60px;
  }

  .associated-footer {
    padding: 10px 0 10px;
    background: #fff;
    text-align: center;
  }

  .text-danger-button {
    color: @--color-danger;
  }
}
</style>
