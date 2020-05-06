<template>
  <div class="type-container">
    <div class="container-title">
      {{ title }}
    </div>
    <div class="type-detail">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypeContainer',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
.type-container {
  .container-title {
    position: relative;
    padding: 15px 30px;
    font-size: 16px;

    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 5px;
      height: 20px;
      background-color: @--color-primary;
      top: 50%;
      left: 10px;
      margin-top: -10px;
    }
  }

  .type-detail {
    padding: 10px 20px;
  }
}
</style>
