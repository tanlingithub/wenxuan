<template>
  <div class="select-type-container">
    <el-row
      :gutter="30"
      type="flex"
      justify="center"
      v-loading="categoryLoading"
    >
      <el-col :span="7">
        <list-select
          v-model="firstValue"
          :options="firstOptions"
          @select="selectFirstItem"
          v-loading="loadingFirstOptions"
          :props="defaultProps"
        >
          <template slot="header">
            <div class="title-info">
              <span v-show="showFirstInfo">请选择一级商品类目</span>
            </div>
          </template>
        </list-select>
      </el-col>
      <el-col :span="7">
        <list-select
          v-model="secondValue"
          :options="secondOptions"
          @select="selectSecondItem"
          v-loading="loadingSecondOptions"
          :props="defaultProps"
        >
          <template slot="header">
            <div class="title-info">
              <span v-show="showSecondInfo">请选择二级商品类目</span>
            </div>
          </template>
        </list-select>
      </el-col>
      <el-col :span="7">
        <list-select
          v-model="thirdValue"
          :options="thirdOptions"
          v-loading="loadingThirdOptions"
          @select="selectThirdItem"
          :props="defaultProps"
        >
          <template slot="header">
            <div class="title-info">
              <span v-show="showThirdInfo">请选择三级商品类目</span>
            </div>
          </template>
        </list-select>
      </el-col>
    </el-row>
    <div class="bottom-button">
      <el-button
        type="primary"
        @click="nextStep"
        :disabled="targetValue === null"
        class="next-button"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import ListSelect from './form/list-select.vue'
import {
  getAfterCategorysList,
  getCommodityPropertyParents
} from '@/service/spaas-commodity-center.js'

export default {
  data() {
    return {
      defaultProps: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      firstValue: null,
      secondValue: null,
      thirdValue: null,
      firstOptions: [],
      secondOptions: [],
      thirdOptions: [],
      categoryLoading: false,
      loadingFirstOptions: false, // 请求第一级属性
      loadingSecondOptions: false, // 请求二级属性
      loadingThirdOptions: false, // 请求三级属性
      targetValue: null // 选中的子节点
    }
  },
  computed: {
    showFirstInfo() {
      return this.firstValue === null
    },
    showSecondInfo() {
      return (
        this.firstValue !== null &&
        this.secondValue === null &&
        this.targetValue === null
      )
    },
    showThirdInfo() {
      return (
        this.firstValue !== null &&
        this.secondValue !== null &&
        this.thirdValue === null &&
        this.targetValue === null
      )
    }
  },
  components: {
    ListSelect
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 查询属性树
    fetchPropertiesTree() {
      this.loadingFirstOptions = true
      return getCommodityPropertyParents({id: ''})
        .then(res => {
          const {payload} = res
          if (payload) {
            // 添加空的children
            const parentIdOptions = payload.map(info => ({
              ...info,
              children: info.hasChildren ? [] : null
            }))
            this.firstOptions = parentIdOptions
          }
        })
        .finally(_ => {
          this.loadingFirstOptions = false
        })
    },
    // 查询第一级的父节点结构
    selectFirstItem(item) {
      const {id, children} = item
      this.firstValue = id
      this.secondOptions = []
      this.thirdOptions = []
      this.secondValue = null
      this.thirdValue = null

      if (children) {
        this.secondOptions = children.map(info => {
          return {
            ...info,
            children: info.leaf ? null : info.children
          }
        })
        this.targetValue = null
      } else {
        this.targetValue = id
      }
    },
    // 请求三级属性
    selectSecondItem(item) {
      const {id, children} = item

      this.thirdOptions = []
      this.secondValue = id
      this.thirdValue = null

      if (children) {
        this.thirdOptions = children.map(info => {
          return {
            ...info,
            children: info.leaf ? null : info.children
          }
        })
        this.targetValue = null
      } else {
        this.targetValue = id
      }
    },
    selectThirdItem(item) {
      const {id, children} = item
      this.thirdValue = id
      this.targetValue = id
    },
    // 点击下一步
    nextStep() {
      this.$emit('handle-next', this.targetValue)
    },
    getCategoryList() {
      this.firstOptions = []
      this.secondOptions = []
      this.thirdOptions = []

      this.categoryLoading = true
      getAfterCategorysList()
        .then(res => {
          const {code, payload} = res.data
          if (code === '0') {
            this.firstOptions = payload.map(info => {
              return {
                ...info,
                children: info.leaf ? null : info.children
              }
            })
          }
        })
        .catch(() => {})
        .finally(() => {
          this.categoryLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.select-type-container {
  padding: 30px 0;

  .bottom-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
  }

  .next-button {
    width: 150px;
    height: 40px;
  }

  .title-info {
    color: #f5a623;
    padding: 0 10px;
    height: 30px;
  }
}
</style>
