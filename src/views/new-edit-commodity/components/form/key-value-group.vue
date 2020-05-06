<template>
  <div class="key-value-group">
    <div v-if="tempValue && tempValue.length">
      <div
        v-for="(item, index) in tempValue"
        :key="index"
        class="key-value-item"
      >
        <div class="key">
          <el-input
            :disabled="disabled"
            v-model="item[props.key]"
            @blur="emitValue"
            placeholder="属性名称: 如color"
          />
        </div>
        <div class="value">
          <el-input
            :disabled="disabled"
            v-model="item[props.value]"
            @blur="emitValue"
            placeholder="属性值: 如red"
          />
        </div>
        <div class="add-button" v-if="!disabled">
          <el-button
            type="text"
            class="danger-button"
            icon="el-icon-error"
            @click="deleteEmptyItem(index)"
          ></el-button>
        </div>
      </div>
    </div>
    <el-button v-if="!disabled" type="text" @click="addEmptyItem"
      >添加自定义</el-button
    >
  </div>
</template>

<script>
export default {
  name: 'KeyValueGroup',
  props: {
    value: {
      required: true
    },
    props: {
      type: Object,
      default() {
        return {
          key: 'key',
          value: 'value'
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tempValue: {
      get: function() {
        return this.value
      },
      set: function(newValue) {
        this.$emit('input', newValue)
      }
    }
  },
  methods: {
    // 添加空项
    addEmptyItem() {
      const emptyItem = {
        [this.props.key]: '',
        [this.props.value]: ''
      }
      let newValue = this.tempValue ? this.tempValue.slice(0) : []
      newValue.push(emptyItem)
      this.tempValue = newValue
    },
    // 强行触发更新事件
    emitValue() {
      this.$nextTick(() => {
        this.$emit('input', this.tempValue)
      })
    },
    // 移除某一项
    deleteEmptyItem(index) {
      this.tempValue.splice(index, 1)
    }
  }
}
</script>

<style lang="less">
.key-value-group {
  .key-value-item {
    display: flex;
    margin-bottom: 10px;

    .key {
      flex: 1;
    }

    .value {
      padding-left: 20px;
      flex: 2;
    }

    .add-button {
      padding-left: 10px;
      margin-right: -10px;
      width: 10px;
    }
  }

  .danger-button {
    color: @--color-danger;
  }
}
</style>
