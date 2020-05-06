<template>
  <div class="attribute-container">
    <el-data-table ref="table" v-bind="tableConfig" @update="updateTableValue">
      <el-table-column label="所属属性组">
        <template slot="default" slot-scope="scope">
          <el-select
            v-model="scope.row.propertyGroupId"
            placeholder="请选择"
            @change="changePropertyGroup(scope.row, $event)"
          >
            <el-option
              v-for="item of currentPropertyGroupList"
              :key="item.i"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="属性类型">
        <template slot="default" slot-scope="scope">
          <el-select
            v-model="scope.row.propertyTypes"
            placeholder="请选择"
            @change="changeProperty(scope.row, $event)"
          >
            <el-option
              v-for="item of attributeTypes"
              :key="item.i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否必填">
        <template slot="default" slot-scope="scope">
          <el-select
            v-model="scope.row.required"
            placeholder="请选择"
            @change="changeRequire(scope.row, $event)"
          >
            <el-option
              v-for="item of ifRequired"
              :key="item.i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-data-table>
    <div class="associated-footer" v-show="showSave">
      <el-button @click="cancelChange">取消</el-button>
      <el-button type="primary" @click="saveChange">确认</el-button>
    </div>
    <el-dialog title="关联属性" :visible.sync="dialogVisible" width="60%">
      <associated
        :categoryId="categoryId"
        :ifUpdate="dialogVisible"
        @cancel-change="dialogVisible = false"
      ></associated>
    </el-dialog>
    <el-dialog title="关联属性组" :visible.sync="ifShowGroupDialog" width="60%">
      <associated-property-group
        :categoryId="categoryId"
      ></associated-property-group>
    </el-dialog>
  </div>
</template>

<script>
import {ATTRIBUTE_TYPES, WHETTHER} from '@/const/dictionary.js'
import Associated from './container/associated'
import AssociatedPropertyGroup from './container/associate-property-group'
import {backCategoryProperty} from '@/const/api'
import {
  getPropertyGroups,
  getAssociatedPropertyById,
  changePropertyBatch,
  deletePropertyBatch
} from '@/service/spaas-commodity-center'
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
    const currentUrl = backCategoryProperty({id: this.categoryId})
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
        hasDelete: false,
        isTree: true,
        hasEdit: false,
        customQuery: {
          relation: true
        },
        hasOperation: true,
        headerButtons: [
          {
            type: 'primary',
            text: '添加关联属性',
            atClick: row => {
              this.associatedLink(row.id)
              return Promise.resolve(false)
            }
          },
          {
            type: 'primary',
            text: '维护属性组',
            atClick: row => {
              this.showPropertyGroupDialog()
              return Promise.resolve(false)
            }
          }
        ],
        extraButtons: [
          {
            type: 'danger',
            text: '删除',
            class: 'delete-button',
            atClick: row => {
              this.deleteItem(row)
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
          }
        ]
      },
      ifShowGroupDialog: false, // 是否显示属性组弹窗
      changeDataList: [], // 修改项
      delDataList: [] // 删除项
    }
  },
  components: {
    Associated,
    AssociatedPropertyGroup
  },
  computed: {
    currentPropertyGroupList() {
      const emptyGroupArr = [this.emptyGroupItem]
      return emptyGroupArr.concat(this.propertyGroupList)
    },
    showSave() {
      return !!this.changeDataList.length || !!this.delDataList.length
    }
  },
  watch: {
    ifShowGroupDialog(val) {
      if (!val) {
        // 如果弹窗不显示，重新刷新数据
        this.getPropertyGroup()
      }
    },
    dialogVisible(val) {
      if (!val) {
        // 如果弹窗隐藏,则重新请求table数据
        this.updateTableData()
      }
    },
    categoryId() {
      this.$nextTick(() => {
        this.updateTableData()
        this.getPropertyGroup()
        this.changeDataList = []
        this.delDataList = []
      })
    }
  },
  mounted() {
    // 请求对应的属性组
    this.getPropertyGroup()
  },
  methods: {
    associatedLink(ele) {
      this.dialogVisible = true
    },
    // 显示关联属性组
    showPropertyGroupDialog() {
      this.ifShowGroupDialog = true
    },
    // 更改所属属性组
    changePropertyGroup(row, val) {
      // 将更改的属性存储到修改数组中
      this.changeDataListFn(row, {propertyGroupId: val})
    },
    // 更改属性类型
    changeProperty(row, val) {
      // 将更改的属性值存储到修改的数组中
      this.changeDataListFn(row, {propertyTypes: val})
    },
    // 更改是否必填
    changeRequire(row, val) {
      // 将更改的是否必填保存到修改的数组中
      // 判断数组中是否有，如果有的话，则修改，否则则新增
      this.changeDataListFn(row, {required: val})
    },
    changeDataListFn(row, val) {
      let newList = this.changeDataList.slice(0)
      let ifSelected = false // 是否已经在数组中
      for (let item of this.changeDataList) {
        if (item.id === row.id) {
          newList.push({
            ...item,
            ...val
          })
          ifSelected = true
        }
      }
      if (!ifSelected) {
        newList.push({
          ...row,
          ...val
        })
      }
      this.changeDataList = newList
    },
    // 请求属性组
    getPropertyGroup() {
      getPropertyGroups({categoryId: this.categoryId}).then(res => {
        const {payload} = res
        this.propertyGroupList = payload
      })
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
    // 取消更改
    cancelChange() {
      // 重新请求数据
      // 清空选中项，选中删除项
      this.updateTableData()
      this.changeDataList = []
      this.delDataList = []
    },
    // 批量保存更改
    saveChange() {
      const changeDataList = this.changeDataList.map(info => {
        return {
          ...info,
          id: info.id,
          categoryId: info.categoryId,
          propertyGroupId: info.propertyGroupId,
          propertyTypes: info.propertyTypes,
          required: info.required
        }
      })
      const delDataList = this.delDataList
      const changeIdStr = changeDataList.map(info => info.id).join(',')
      const propertyGroupsIds =
        delDataList
          .map(info => info.propertyAndPropertyGroupRelationId)
          .filter(info => info)
          .join(',') || ','
      let propertyIds = delDataList.map(info => info.id).join(',')
      const categoryId = this.categoryId
      const id = ''
      let promiseArr = []
      if (changeIdStr) {
        const newArr = changeDataList.map(({children, parent, ...obj}) => obj)
        // 更改ID数组
        promiseArr.push(changePropertyBatch(categoryId, changeIdStr, newArr))
      }
      if (propertyIds) {
        // 删除ID数组
        promiseArr.push(
          deletePropertyBatch(categoryId, propertyIds, propertyGroupsIds)
        )
      }
      Promise.all(promiseArr).then(arr => {
        const failAction = arr.filter(item => !item.payload)
        if (failAction.length) {
          this.$message.error('修改关联属性失败，请重试！')
        } else {
          this.$message.success('修改关联属性成功!')
          this.cancelChange()
        }
      })
    },
    // 删除表单项
    deleteItem(row) {
      const tableData = this.$refs.table.data
      const newTreeData = new TreeData()
      const arrayTree = newTreeData.treeToArray([row])
      const newData = tableData.filter(info => {
        for (let item of arrayTree) {
          if (info.id === item.id) {
            return false
          }
        }
        return true
      })
      let newDelDataList = this.delDataList
      arrayTree.forEach(info => {
        let ifIn = false
        // 去重
        for (let item of newDelDataList) {
          if (item.id === info.id) {
            ifIn = true
            break
          }
        }
        if (ifIn) return
        newDelDataList.push(info)
      })
      this.delDataList = newDelDataList
      this.$refs.table.data = newData
      // 遍历获取所有的子节点，
      return Promise.resolve(false)
    },
    // 更新table数据
    updateTableData() {
      const currentUrl = backCategoryProperty({id: this.categoryId})
      this.tableConfig.url = `${currentUrl}?timestamp=${new Date().getTime()}`
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

  .delete-button {
    color: @--color-danger;
  }
}
</style>
