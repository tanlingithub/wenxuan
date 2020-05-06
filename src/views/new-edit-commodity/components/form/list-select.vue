<template>
  <div class="list-select-container" v-loading="loading">
    <div class="box-card">
      <slot name="header"></slot>
      <div class="input-container">
        <el-input placeholder="请输入内容" v-model="filterText" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <scrollbar wrap-class="list-wrap" :noresize="false">
        <div v-if="list && list.length">
          <div
            v-for="(item, index) in list"
            :key="index"
            :class="{
              'list-item clearfix': true,
              'is-active': value === item[props.value]
            }"
            v-if="item.enabled === true"
            @click="handleItem(item)"
          >
            {{ item[props.label] }}
            <i
              v-if="item[props.children]"
              class="right-icon el-icon-arrow-right"
            ></i>
            <i
              v-else-if="value === item[props.value] && !item[props.children]"
              class="right-icon el-icon-check"
            ></i>
          </div>
        </div>
        <div v-else class="panel-empty">暂无数据</div>
      </scrollbar>
    </div>
  </div>
</template>

<script>
import Scrollbar from '@/components/scrollbar/index.js'

export default {
  props: {
    value: {},
    options: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default() {
        return {
          label: 'label',
          value: 'value',
          children: 'children'
        }
      }
    }
  },
  components: {
    Scrollbar
  },
  data() {
    return {
      filterText: '',
      list: [] // 搜索列表
    }
  },
  watch: {
    filterText(val) {
      this.$nextTick(() => {
        this.filterData(this.filterText)
      })
    },
    options(val) {
      this.list = val
    }
  },
  methods: {
    // 数据过滤
    filterData(val) {
      this.list = this.options.filter(
        info => info[this.props.label].indexOf(val) !== -1
      )
    },
    // 选中当前的值
    handleItem(item) {
      this.$emit('select', item)
      this.$emit('input', item[this.props.value])
    }
  }
}
</script>

<style lang="less">
.list-select-container {
  padding: 18px 20px;
  border: 1px solid @--border-color-base;

  .input-container {
    padding-bottom: 10px;
  }

  .is-active {
    color: @--color-primary;
    background: @--background-color-base;
    padding: 0 20px;
  }

  .list-wrap {
    overflow-x: hidden !important;
    margin-bottom: 0 !important;
    height: 400px;

    .el-scrollbar__view {
      height: 100%;
    }

    .list-item {
      cursor: pointer;
      // margin: 0 10px;
      height: 50px;
      line-height: 50px;

      &:not(:last-child) {
        border-bottom: 1px solid @--border-color-base;
      }
    }
  }

  .right-icon {
    float: right;
    display: block;
    height: 50px;
    line-height: 50px;
  }

  .panel-empty {
    margin: 0;
    height: 30px;
    line-height: 30px;
    padding: 20px 15px 0;
    color: @--color-text-secondary;
    text-align: center;
  }
}
</style>
