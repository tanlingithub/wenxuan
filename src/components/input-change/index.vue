<template>
  <el-input v-model="currentValue" />
</template>

<script>
import {debounce} from '../../utils/index'

export default {
  name: 'InputChange',
  props: {
    value: [String, Number],
    wait: {
      type: Number,
      default: 300
    }
  },

  data() {
    const debounceChange = debounce(() => {
      this.$emit('change', this.currentValue)
    }, this.wait)
    return {
      currentValue:
        this.value === undefined || this.value === null ? '' : this.value,
      debounceChange
    }
  },

  watch: {
    value(val, oldValue) {
      this.setCurrentValue(val)
    },
    currentValue(val, oldValue) {
      this.debounceChange(val)
    }
  },

  methods: {
    setCurrentValue(value) {
      if (this.currentValue !== value) {
        this.currentValue = value
      }
    }
  }
}
</script>
