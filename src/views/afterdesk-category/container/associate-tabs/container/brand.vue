<template>
  <div class="brand-container">
    <el-data-table
      ref="table"
      v-bind="tableConfig"
      @update="brandUpdate"
      :onDelete="onDelete"
      :url="getCategoryBrandList"
    >
      <el-table-column label="编码">
        <template slot="default" slot-scope="scope">
          <span>{{ scope.row.brand.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌中文名称">
        <template slot="default" slot-scope="scope">
          <span>{{ scope.row.brand.chineseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌英文名称">
        <template slot="default" slot-scope="scope">
          <span>{{ scope.row.brand.englishName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌Logo">
        <template slot="default" slot-scope="scope">
          <img
            :src="scope.row.brand.attachmentPath"
            :class="{'set-attachmentPath': scope.row.brand.attachmentPath}"
          />
        </template>
      </el-table-column>
      <el-table-column label="启用状态">
        <template slot="default" slot-scope="scope">
          <el-switch
            v-model="scope.row.required"
            @change="setBrandStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-data-table>

    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      @close="clearValue"
      title="关联品牌"
    >
      <el-data-table
        ref="brandTable"
        v-bind="addBrandConfig"
        @update="update"
        :url="getFilterCategoryBrandList"
      >
        <el-table-column label="品牌编码">
          <template slot="default" slot-scope="scope">
            <span>{{ scope.row.brand.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中文名称">
          <template slot="default" slot-scope="scope">
            <span>{{ scope.row.brand.chineseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="英文名称">
          <template slot="default" slot-scope="scope">
            <span>{{ scope.row.brand.englishName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="品牌Logo">
          <template slot="default" slot-scope="scope">
            <img
              :src="scope.row.brand.attachmentPath"
              :class="{'set-attachmentPath': scope.row.brand.attachmentPath}"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot="default" slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :class="{'el-alert--error': scope.row.associated === '取消关联'}"
              @click="brandAssociatedBtn(scope.row, scope.$index)"
              >{{ scope.row.associated }}</el-button
            >
          </template>
        </el-table-column>
      </el-data-table>
      <div class="CategoryBtn" v-show="changeList.length">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  delCategoryBrandList,
  putCategoryBrandList,
  categoryBrandList,
  putCategoryBrandStatus
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
      dialogVisible: false,
      addBrandConfig: {
        columns: 'columns',
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        hasNew: false,
        hasEdit: false,
        hasOperation: false,
        hasPagination: true,
        hasDelete: false,
        columns: [],
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            $el: {
              placeholder: '请输入品牌名称'
            }
          }
        ]
      },
      tableConfig: {
        hasPagination: true,
        hasNew: false,
        hasEdit: false,
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        headerButtons: [
          {
            type: 'primary',
            text: '关联品牌',
            atClick: row => {
              this.dialogVisible = true
              return Promise.resolve(false)
            }
          }
        ],
        columns: [],
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '品牌名称',
            $el: {
              placeholder: '请输入内容'
            }
          }
        ]
      },
      changeList: [] // 更改的数组
    }
  },
  computed: {
    getCategoryBrandList() {
      return `${categoryBrandList}/backCategorys/${this.categoryId}/brands`
    },
    getFilterCategoryBrandList() {
      return `${categoryBrandList}/frontCategorys/vocational/brands?id=${
        this.categoryId
      }`
    }
  },
  methods: {
    setBrandStatus(v) {
      putCategoryBrandStatus({id: v.id, formValue: v}).then(res => {
        let {data} = res
        if (data.code == '0' && data.payload) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    clearValue() {
      this.$nextTick(() => {
        this.$refs.brandTable.resetSearch()
      })
    },
    saveForm() {
      //批量更新
      const formValue = this.changeList
      putCategoryBrandList({id: this.categoryId, formValue})
        .then(res => {
          let {data} = res
          if (data.code == '0' && data.payload) {
            this.$message.success('修改成功')
            this.$refs.table.getList()
            return true
          } else {
            this.$message.error('修改失败, 请重试')
            return false
          }
        })
        .catch(() => {})
        .finally(_ => {
          this.changeList = []
          this.dialogVisible = false
        })
    },
    brandAssociatedBtn(data, index) {
      this.$set(this.$refs.brandTable.data, index, {
        ...data,
        relation: data.relation ? false : true,
        associated: data.associated == '取消关联' ? '添加关联' : '取消关联'
      })
      let changeList = this.changeList.filter(
        info => info.brandId !== data.brandId
      )
      if (changeList.length === this.changeList.length) {
        changeList.push({
          ...data,
          relation: !data.relation
        })
      }
      this.changeList = changeList
    },
    update(data) {
      this.$refs.brandTable.data = data
        .filter(v => !!v.brand)
        .map(v => ((v.associated = !!v.relation ? '取消关联' : '添加关联'), v))
    },
    brandUpdate(data) {
      this.$refs.table.data = data.filter(v => !!v.brand)
    },
    onDelete(selected) {
      delCategoryBrandList({id: selected.id}).then(res => {
        let {data} = res
        if (data.code == '0' && data.payload) {
          this.$message.success('删除成功')
          this.$refs.brandTable.getList()
        }
      })
      return Promise.resolve(false)
    }
  }
}
</script>
<style lang="less">
.brand-container {
  .set-attachmentPath {
    width: 60px;
    height: 60px;
  }

  .CategoryBtn {
    text-align: center;
    margin-top: 30px;
  }

  .text-danger-button {
    color: @--color-danger;
  }
}
</style>
