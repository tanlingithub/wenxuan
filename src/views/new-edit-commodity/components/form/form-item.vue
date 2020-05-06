<template>
  <div class="form-item form-item--medium clearfix">
    <label
      for="customProperty"
      :class="{'form-item__label': true, required: required}"
      style="width: 90px;"
      >{{ labelName }}</label
    >
    <div class="form-item__content" style="margin-left: 90px;">
      <div style="width:35%;">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    required: Boolean,
    labelName: {
      type: String,
      required: true,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.form-item {
  margin-bottom: 22px;

  &::before {
    display: table;
    content: '';
  }

  .form-item__label {
    vertical-align: middle;
    line-height: 36px;
    text-align: right;
    float: left;
    font-size: 14px;
    color: #2d303b;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }

  .required {
    &::before {
      content: '*';
      color: #e24156;
      margin-right: 4px;
    }
  }

  .form-item__content {
    line-height: 36px;
    position: relative;
    font-size: 14px;

    &::before {
      display: table;
      content: '';
    }
  }
}
</style>
