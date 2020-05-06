<template>
  <div class="other-info">
    <type-container title="其它信息">
      <div class="other-message">
        <div class="label-container" style="width: 90px;">
          上架时间
        </div>
        <ul class="radio-list">
          <li class="radio-item">
            <el-radio v-model="radio" label="1">立即上架售卖</el-radio>
          </li>
          <li class="radio-item">
            <el-radio v-model="radio" label="2">自定义上架时间</el-radio>
            <el-date-picker
              v-model="value1"
              class="data-picker-container"
              size="small"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </li>
          <li class="radio-item">
            <el-radio v-model="radio" label="3">暂不售卖，放入仓库</el-radio>
          </li>
        </ul>
      </div>
    </type-container>
  </div>
</template>

<script>
import TypeContainer from './type-container'

export default {
  components: {
    TypeContainer
  },
  data() {
    return {
      radio: '1',
      value1: ''
    }
  }
}
</script>

<style lang="less" scoped>
.other-info {
  .other-message {
    display: flex;

    .radio-list {
      .radio-item {
        list-style: none;
        margin-bottom: 20px;
      }

      .data-picker-container {
        margin-left: 20px;
      }
    }
  }
}
</style>
