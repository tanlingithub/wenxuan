<template>
  <el-autocomplete
    :disabled="disabled"
    class="inline-input"
    v-model="tempValue"
    :fetch-suggestions="querySearch"
    :value-key="props.value"
    placeholder="请输入内容"
  ></el-autocomplete>
</template>

<script>
import {Autocomplete} from 'element-ui'

export default {
  components: {
    ElAutocomplete: Autocomplete
  },
  props: {
    value: {},
    list: {},
    disabled: {},
    props: {
      type: Object,
      default() {
        return {
          value: 'value'
        }
      }
    }
  },
  computed: {
    autoList() {
      return this.list || []
    },
    tempValue: {
      get: function() {
        return this.value
      },
      set: function(val) {
        for (let item of this.autoList) {
          if (item[this.props.value] === val) {
            this.$emit('change', item)
            break
          }
        }
        this.$emit('input', val)
      }
    }
  },
  methods: {
    querySearch(queryString, cb) {
      const autoList = this.autoList
      const results = queryString
        ? autoList.filter(this.createFilter(queryString))
        : autoList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return res => {
        return (
          res['' + this.props.value]
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        )
      }
    }
  }
}
</script>
