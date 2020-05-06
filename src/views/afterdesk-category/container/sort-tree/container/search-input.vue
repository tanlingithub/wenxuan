<template>
  <el-autocomplete
    v-model="inputValue"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入内容"
    @select="handleSelect"
    value-key="name"
  >
    <i slot="prefix" class="el-input__icon el-icon-search"></i>
  </el-autocomplete>
</template>
<script>
import {Autocomplete} from 'element-ui'
import {getBackCategorys} from '@/service/spaas-commodity-center.js'

export default {
  components: {
    ElAutocomplete: Autocomplete
  },
  data() {
    return {
      inputValue: ''
    }
  },
  watch: {
    inputValue(val) {
      if (val === null || val === '') {
        // 清空输入触发事件
        this.$emit('emptyInput')
      }
    }
  },
  methods: {
    async querySearchAsync(queryString, cb) {
      const list = await this.getSelectList()
      cb(list)
    },
    handleSelect(item) {
      this.$emit('select', item)
    },
    // 请求选择列表
    async getSelectList() {
      const res = await getBackCategorys({name: this.inputValue})
      const {code, payload} = res
      if (code == 0 && payload) {
        return payload
      } else {
        return []
      }
    }
  }
}
</script>
