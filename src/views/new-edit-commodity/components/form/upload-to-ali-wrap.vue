<template>
  <div class="upload-container">
    <UploadToAli
      class="upload-button"
      v-model="currentValue"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <div v-show="info" class="info-container">{{ info }}</div>
  </div>
</template>

<script>
import UploadToAli from '@femessage/upload-to-ali'

export default {
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    info: {}
  },
  components: {
    UploadToAli
  },
  computed: {
    currentValue: {
      // getter
      get: function() {
        return this.value
      },
      // setter
      set: function(currentValue) {
        this.$emit('input', currentValue)
      }
    }
  }
}
</script>

<style lang="less">
.upload-container {
  .info-container {
    font-size: 13px;
    height: 20px;
    line-height: 20px;
    color: @--color-text-secondary;
  }

  .upload-button {
    width: 100% !important;
  }
}
</style>
