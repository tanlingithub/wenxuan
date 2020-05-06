<template>
  <div class="associate-tabs-container">
    <el-tabs>
      <el-tab-pane label="配置属性关联">
        <Attribute :categoryId="categoryId" />
      </el-tab-pane>
      <el-tab-pane label="配置品牌关联">
        <Brand :categoryId="categoryId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Brand from './container/brand'
import Attribute from './container/attribute/index'

export default {
  name: 'AssociateTabs',
  props: {
    categoryId: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    Brand,
    Attribute
  }
}
</script>

<style lang="less" scoped>
.associate-tabs-container {
  padding: 20px;
}
</style>
