<template>
  <div class="el-transfer-panel transfer-tree">
    <p class="el-transfer-panel__header">
      <el-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate"
      >
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>
    <scrollbar wrap-class="scrollbar-wrapper" :noresize="false">
      <div
        :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']"
      >
        <el-input
          class="el-transfer-panel__filter"
          v-model="query"
          size="small"
          :placeholder="placeholder"
          @mouseenter.native="inputHover = true"
          @mouseleave.native="inputHover = false"
          v-if="filterable"
        >
          <i
            slot="prefix"
            :class="['el-input__icon', 'el-icon-' + inputIcon]"
            @click="clearQuery"
          ></i>
        </el-input>
        <el-tree
          class="filter-tree"
          ref="filterTree"
          :data="treeData"
          empty-text=""
          :node-key="keyProp"
          :props="{
            label: labelProp,
            children: childrenProp,
            disabled: disabledProp,
            isLeaf: isLeafProp
          }"
          show-checkbox
          :default-checked-keys="checked"
          @check="treeNodeCheck"
          check-strictly
          default-expand-all
        >
        </el-tree>

        <p class="el-transfer-panel__empty" v-show="hasNoMatch">
          {{ t('el.transfer.noMatch') }}
        </p>
        <p
          class="el-transfer-panel__empty"
          v-show="data.length === 0 && !hasNoMatch"
        >
          {{ t('el.transfer.noData') }}
        </p>
      </div>
    </scrollbar>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import Locale from './mixins/locale'
import {arrayToTree, treeToArray} from '../../utils/tree-utils'
import Scrollbar from '@/components/scrollbar/index.js'
export default {
  mixins: [Locale],

  name: 'ElTransferPanel',

  componentName: 'ElTransferPanel',

  components: {
    Scrollbar,
    OptionContent: {
      props: {
        option: Object
      },
      render(h) {
        const getParent = vm => {
          if (vm.$options.componentName === 'ElTransferPanel') {
            return vm
          } else if (vm.$parent) {
            return getParent(vm.$parent)
          } else {
            return vm
          }
        }
        const panel = getParent(this)
        const transfer = panel.$parent || panel
        return panel.renderContent ? (
          panel.renderContent(h, this.option)
        ) : transfer.$scopedSlots.default ? (
          transfer.$scopedSlots.default({option: this.option})
        ) : (
          <span>
            {this.option[panel.labelProp] || this.option[panel.keyProp]}
          </span>
        )
      }
    }
  },

  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    renderContent: Function,
    placeholder: String,
    title: String,
    filterable: Boolean,
    format: Object,
    filterMethod: Function,
    defaultChecked: Array,
    props: Object
  },

  data() {
    return {
      checked: [], // 当前选中的数组
      allChecked: false, // 是否全选
      query: '', // input查询框
      inputHover: false,
      checkChangeByUser: true
    }
  },

  watch: {
    checked(val, oldVal) {
      this.updateAllChecked()
      this.$refs.filterTree.setCheckedKeys(val)
      if (this.checkChangeByUser) {
        const movedKeys = val
          .concat(oldVal)
          .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1)
        this.$emit('checked-change', val, movedKeys)
      } else {
        this.$emit('checked-change', val)
        this.checkChangeByUser = true
      }
    },

    data() {
      const checked = []
      const filteredDataKeys = this.filteredData.map(item => item[this.keyProp])
      this.checked.forEach(item => {
        if (filteredDataKeys.indexOf(item) > -1) {
          checked.push(item)
        }
      })
      this.checkChangeByUser = false
      this.checked = checked
    },

    checkableData() {
      this.updateAllChecked()
    },

    defaultChecked: {
      immediate: true,
      handler(val, oldVal) {
        if (
          oldVal &&
          val.length === oldVal.length &&
          val.every(item => oldVal.indexOf(item) > -1)
        )
          return
        const checked = []
        const checkableDataKeys = this.checkableData.map(
          item => item[this.keyProp]
        )
        val.forEach(item => {
          if (checkableDataKeys.indexOf(item) > -1) {
            checked.push(item)
          }
        })
        this.checkChangeByUser = false
        this.checked = checked
      }
    }
  },

  computed: {
    filteredData() {
      return this.data.filter(item => {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(this.query, item)
        } else {
          const label = item[this.labelProp] || item[this.keyProp].toString()
          return label.indexOf(this.query) > -1
        }
      })
    },

    treeData() {
      return arrayToTree(this.filteredData)
    },

    checkableData() {
      return this.filteredData.filter(item => !item[this.disabledProp])
    },

    checkedSummary() {
      const checkedLength = this.checked.length
      const dataLength = this.data.length
      const {noChecked, hasChecked} = this.format
      if (noChecked && hasChecked) {
        return checkedLength > 0
          ? hasChecked
              .replace(/\${checked}/g, checkedLength)
              .replace(/\${total}/g, dataLength)
          : noChecked.replace(/\${total}/g, dataLength)
      } else {
        return `${checkedLength}/${dataLength}`
      }
    },

    isIndeterminate() {
      const checkedLength = this.checked.length
      return checkedLength > 0 && checkedLength < this.checkableData.length
    },

    hasNoMatch() {
      return this.query.length > 0 && this.filteredData.length === 0
    },

    inputIcon() {
      return this.query.length > 0 && this.inputHover
        ? 'circle-close'
        : 'search'
    },

    labelProp() {
      return this.props.label || 'label'
    },

    keyProp() {
      return this.props.key || 'key'
    },

    childrenProp() {
      return this.props.children || 'children'
    },

    disabledProp() {
      return this.props.disabled || 'disabled'
    },
    isLeafProp() {
      return this.props.isLeaf || ''
    },
    hasFooter() {
      return !!this.$slots.default
    }
  },

  methods: {
    updateAllChecked() {
      const checkableDataKeys = this.checkableData.map(
        item => item[this.keyProp]
      )
      this.allChecked =
        checkableDataKeys.length > 0 &&
        checkableDataKeys.every(item => this.checked.indexOf(item) > -1)
    },

    handleAllCheckedChange(value) {
      this.checked = value
        ? this.checkableData.map(item => item[this.keyProp])
        : []
    },

    clearQuery() {
      if (this.inputIcon === 'circle-close') {
        this.query = ''
      }
    },

    // 当复选框被点击的时候触发
    treeNodeCheck(node, checkedVal) {
      const nodeKey = node[this.keyProp]
      const treeArray = treeToArray([node], {children: this.childrenProp})
      const nodeKeys = treeArray.map(info => info[this.keyProp])
      const {checkedKeys} = checkedVal
      let ifChecked = checkedKeys.some(key => key === nodeKey)
      if (ifChecked) {
        // 如果节点为选中状态，将所有的子都选中
        // 与选中的节点去重
        // 将不在选中数组的节点选取出来
        const notCheckKeys = nodeKeys.filter(
          info => !checkedKeys.some(key => key === info)
        )
        this.checked = checkedKeys.concat(notCheckKeys)
      } else {
        // 如果节点为非选中状态，则所有子节点都非选中
        const checkedKeyList = checkedKeys.filter(
          info => !nodeKeys.some(key => key === info)
        )
        this.checked = checkedKeyList
      }
    }
  }
}
</script>

<style lang="less">
.transfer-tree {
  .el-tree__empty-block {
    display: none;
  }
}
.scrollbar-wrapper {
  height: calc(100vh - 60px - 100px);
  overflow-x: hidden !important;
  margin-bottom: 0 !important;

  .el-scrollbar__view {
    height: 100%;
  }
}
</style>
