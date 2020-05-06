<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="PC端详情" name="PC端详情">
      <v-editor :disabled="disabled" v-model="pcContent" />
    </el-tab-pane>
    <el-tab-pane label="移动端详情" name="移动端详情">
      <v-editor :disabled="disabled" v-model="mobileContent" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {Tabs, TabPane} from 'element-ui'
import VEditor from '@femessage/v-editor'

export default {
  name: 'detailEditor',
  components: {
    ElTabs: Tabs,
    ElTabPane: TabPane,
    VEditor
  },
  props: {
    value: Array,
    disabled: Boolean
  },
  data() {
    this.setValue(this.value)
    return {
      activeName: 'PC端详情'
    }
  },
  computed: {
    pcContent: {
      get: function() {
        return this.value && this.value[0] !== undefined
          ? this.value[0].toString()
          : ''
      },
      set: function(val) {
        this.$emit('input', [val, this.mobileContent])
      }
    },
    mobileContent: {
      get: function() {
        return this.value && this.value[1] !== undefined
          ? this.value[1].toString()
          : ''
      },
      set: function(val) {
        this.$emit('input', [this.pcContent, val])
      }
    }
  },
  methods: {
    setValue(list) {
      const pcContent = list && list[0] ? list[0] : ''
      const mobileContent = list && list[1] ? list[1] : ''
      this.pcContent = pcContent
      this.mobileContent = mobileContent
    }
  }
}
</script>
