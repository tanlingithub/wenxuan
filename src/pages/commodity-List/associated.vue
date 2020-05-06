<template>
  <div class="associated-tab">
    <list-container :routes="routes"></list-container>
    <nuxt-child class="container" ref="nuxtChild"></nuxt-child>
  </div>
</template>
<script>
import ListContainer from '@/container/list-container'
export default {
  data() {
    return {
      routes: [
        {
          name: '上架中',
          path: '/commodity-list/associated/commodity-list-onshelves'
        },
        {
          name: '已下架',
          path: '/commodity-list/associated/commodity-list-shelves'
        }
      ]
    }
  },
  components: {
    ListContainer
  }
}
</script>
<style lang="less" scoped>
.associated-tab {
  background: #fff;
  // padding: 20px 20px 20px;
}

.el-tabs__content {
  margin-top: 20px;
}

.container {
  padding: 20px;
}
</style>
