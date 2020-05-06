<template>
  <div class="tree-transfer">
    <p class="transfer-panel">
      <el-checkbox v-model="allChecked" @change="handleAllCheckedChange">
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      prefix-icon="el-icon-search"
      class="tree-transfer-input"
      maxlength="100"
    ></el-input>
    <div class="tree-transfer-content">
      <el-tree
        class="filter-tree"
        :data="dataAllList"
        :props="defaultProps"
        :show-checkbox="true"
        default-expand-all
        node-key="id"
        highlight-current
        :check-strictly="true"
        :filter-node-method="filterNode"
        ref="treeTransfer"
        @check="clickDeal"
        :default-checked-keys="defaultSelect"
      >
        <!-- :default-expand-all = 'false' //是否默认展开节点 -->
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    defaultSelect: {
      type: Array,
      default: () => []
    },
    title: String
  },
  data() {
    return {
      dataAllList: this.dataList,
      allChecked: false, //是否全选
      checked: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checktList: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeTransfer.filter(val)
    },
    dataList: {
      immediate: true, //表示dataList的值立即执行回调
      // deep：true,//深层侦听对象内部变幻的值
      handler(val, oldVal) {
        this.dataAllList = val
      }
    },
    defaultSelect() {
      this.$refs.treeTransfer.setCheckedKeys(
        this.getallHandleNode(this.defaultSelect)
      )
    }
  },
  computed: {
    checkedSummary() {
      //todo-优化选中内容变更
      const checkedLength = this.checked.length
      const dataLength = this.dataAllList.length
      return `${checkedLength}/${dataLength}`
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleAllCheckedChange(value) {
      if (this.allChecked) {
        this.checked = this.dataAllList
        this.$emit('selectAllNodeList', this.checked, this.allChecked)
        this.$refs.treeTransfer.setCheckedKeys(
          this.getallHandleNode(this.dataAllList)
        )
      } else {
        this.checked = []
        this.$refs.treeTransfer.setCheckedKeys([])
      }
      // this.checked = value ? this.dataAllList : [];
      // this.$refs.treeTransfer.setCheckedKeys((value ? this.getallHandleNode(this.dataAllList):[]))
    },
    clickDeal(currentObj, treeStatus) {
      //父节点勾选变化时子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      if (selected !== -1) {
        this.checktList.push(currentObj)
        this.selectedParent(currentObj)
        this.uniteChildSame(currentObj, true)
      } else {
        this.checktList.map((v, i) => {
          if (v.id == currentObj.id) {
            this.$delete(this.checktList, i)
          }
        })
        this.uniteChildSame(currentObj, false)
      }
      //此处有问题-数据不断push
      this.$emit('checked-change', this.checktList)
    },
    getallHandleNode(data) {
      let arr = []
      data.forEach((v, i) => {
        arr.push(v.id)
        if (v.children && v.children.length > 0) {
          let children = this.getallHandleNode(v.children)
          arr = arr.concat(children)
        }
      })
      return arr
    },
    // 设置子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      this.$refs.treeTransfer.setChecked(treeList.id, isSelected)
      if (treeList.children && treeList.children.length) {
        treeList.children.forEach((v, i) => {
          this.uniteChildSame(treeList.children[i], isSelected)
        })
      }
    },
    //设置父节点为选中
    selectedParent(currentObj) {
      let currentNode = this.$refs.treeTransfer.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.treeTransfer.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    }
  }
}
</script>

<style scoped lang="less">
.tree-transfer {
  border: 1px solid #ebeef5;
  min-height: 400px;
  max-height: 400px;
  overflow: auto;

  .transfer-panel {
    padding: 10px 0 0 10px;
  }

  &-input {
    margin: 20px 15px 0 15px;
    width: 90%;
  }

  &-content {
    padding: 15px 10px;
  }
}
</style>
