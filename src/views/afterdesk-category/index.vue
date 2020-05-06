<template>
  <div class="after-desk-category-container">
    <el-row :gutter="0">
      <el-col :span="5">
        <SortTree
          ref="sortTree"
          class="tree-container"
          @selectNode="selectNode"
        />
      </el-col>
      <el-col :span="19" v-if="categoryId !== null">
        <div class="detail-container">
          <CategoryInfo :categoryId="categoryId" @change="changeInfo" />
          <AssociateTabs :categoryId="categoryId" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SortTree from './container/sort-tree/index'
import CategoryInfo from './container/category-info'
import AssociateTabs from './container/associate-tabs/index'

export default {
  name: 'newAfter',
  components: {
    SortTree,
    CategoryInfo,
    AssociateTabs
  },
  data() {
    return {
      categoryId: null
    }
  },
  methods: {
    // 选中node节点
    selectNode(node) {
      const {id} = node
      this.categoryId = id
    },
    // 更改信息详情
    changeInfo(info) {
      this.$refs.sortTree.getRootList()
    }
  }
}
</script>

<style lang="less">
.after-desk-category-container {
  .tree-container {
    margin-right: 20px;
    padding-right: 10px;
    border-right: 1px solid @--border-color-base;
  }

  .detail-container {
    background-color: #fff;
  }
}
</style>
