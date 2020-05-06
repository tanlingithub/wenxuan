<template>
  <div class="success-container">
    <div class="icon">
      <i class="el-icon-success"></i>
    </div>
    <div class="message">成功新增商品！</div>
    <div class="button-list">
      <el-button @click="backToList">返回列表</el-button>
      <el-button type="primary" @click="continueAdd">继续发布</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    backToList() {
      this.$router.push({
        path: '/commodity-list/associated/commodity-list-onshelves'
      })
    },
    // 继续添加
    continueAdd() {
      this.$router.replace({
        path: '/new-commodity',
        query: {}
      })
      this.$emit('handle-continue')
    }
  }
}
</script>

<style lang="less">
.success-container {
  padding-top: 100px;
  text-align: center;

  .icon {
    margin-bottom: 24px;
    font-size: 72px;
    line-height: 72px;

    > i {
      color: @--color-success;
    }
  }

  .message {
    margin-bottom: 16px;
    color: @--color-text-primary;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  .button-list {
    margin-top: 32px;
    text-align: center;
  }
}
</style>
