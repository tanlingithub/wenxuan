<template>
  <div class="association-base-container">
    <el-data-table
      ref="table"
      v-bind="tableconfig"
      :url="getBrandManagementCategoryUrl"
    >
    </el-data-table>
    <el-dialog
      title="添加基础类目"
      :visible.sync="dialogVisible"
      @close="clearValue"
    >
      <TreeTransfer
        :data="notAssociated"
        v-model="value"
        ref="associated"
        :titles="titles"
        :props="defaultProps"
        class="set-transfer-content"
      >
      </TreeTransfer>
      <el-row class="associated-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="getRightUncheckedData"
          >确认</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import TreeTransfer from '@/components/transfer-tree/index.vue'
import {
  frontCategorys_List,
  getBrandManagementCategory,
  delBrandManagementCategory,
  postBrandManagementCategory
} from '@/service/spaas-commodity-center.js'
export default {
  props: {
    categoryId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      value: [],
      titles: ['基础类目', '已关联'],
      dialogVisible: false,
      notAssociated: [],
      defaultProps: {
        key: 'id',
        label: 'name',
        children: 'children'
      },
      tableconfig: {
        dataPath: 'data.payload',
        columns: 'columns',
        hasPagination: false,
        hasNew: false,
        isTree: true,
        hasEdit: false,
        hasOperation: true,
        headerButtons: [
          {
            type: 'primary',
            text: '添加基础类目',
            atClick: row => {
              this.dialogVisible = true
              return Promise.resolve(false)
            }
          }
        ],
        columns: [
          {
            prop: 'baseCategoryId',
            label: '类目编码'
          },
          {
            prop: 'name',
            label: '类目名称'
          }
        ],
        onDelete: selected => {
          return delBrandManagementCategory({
            categoryId: 72,
            id: selected.id
          }).then(res => {
            let {data} = res
            if (data.code == '0' && data.payload) {
              this.$message.success('删除成功')
              this.getNotAssociated()
            } else {
              this.$message.error('修改失败')
            }
          })
        }
      }
    }
  },
  components: {
    TreeTransfer
  },
  created() {
    this.getNotAssociated()
  },
  computed: {
    getBrandManagementCategoryUrl() {
      //relation=true已关联/false未关联
      return `${frontCategorys_List}/${this.categoryId}/back?relation=true`
    }
  },
  methods: {
    clearValue() {
      this.value = []
    },
    getNotAssociated() {
      getBrandManagementCategory({id: this.categoryId}).then(res => {
        this.notAssociated = res.data.payload
      })
    },
    getRightUncheckedData(data) {
      postBrandManagementCategory({
        categoryId: this.categoryId,
        categoryList: this.filterCategory(
          this.$refs.associated.getRightUncheckedData()
        )
      }).then(res => {
        let {data} = res
        if (data.code == '0' && data.payload) {
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.$refs.table.getList()
          this.getNotAssociated()
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    filterCategory(v) {
      return v.map((ele, i, arr) => {
        ele.frontCategoryId = Number(this.categoryId)
        ele.baseCategoryId = ele.id
        if (ele.children && ele.children.length) {
          return this.filterCategory(ele.children), ele
        } else {
          return ele
        }
      })
    }
  }
}
</script>
<style lang="less">
.association-base-container {
  .srcUrl {
    width: 60px;
    height: 60px;
  }

  .associated-footer {
    padding: 10px 0 10px;
    background: #fff;
    text-align: center;
  }

  .set-transfer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 30px;
  }

  .text-danger-button {
    color: @--color-danger;
  }
}
</style>
