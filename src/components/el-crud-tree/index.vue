<template>
  <div class="crud-tree-cata">
    <el-row type="flex" justify="space-between" :gutter="24">
      <el-col :span="colSpan[0]">
        <el-card class="curd-tree">
          <div class="header" v-if="isFliter">
            <el-input placeholder="请输入" v-model="filterText"></el-input>
          </div>
          <slot name="middle-title"></slot>
          <div class="main">
            <el-tree
              ref="tree"
              class="filter-tree"
              :expand-on-click-node="false"
              :data="lastTree"
              v-on="$listeners"
              v-bind="$attrs"
              :node-key="nodeKey"
              :props="props"
              :filter-node-method="filterNode"
              @node-drop="dragFinished"
              :draggable="isDrag"
            >
              <span
                class="custom-tree-node"
                slot-scope="{node, data}"
                @mouseenter="hoverCurId = data[nodeKey]"
                @mouseleave="hoverCurId = ''"
              >
                <span>{{ data.name }}</span>
                <span v-if="hoverCurId == data.id">
                  <el-button
                    v-if="hasEdit"
                    size="mini"
                    class="el-icon-edit-outline"
                    @click.stop="() => edit(node, data)"
                    :disabled="eidtAbledFunc(node, data)"
                    type="text"
                    >编辑</el-button
                  >
                  <el-button
                    v-if="hasDelete"
                    class="el-icon-remove-outline"
                    @click.stop="() => remove(node, data)"
                    :disabled="deleteAbledFunc(node, data)"
                    size="mini"
                    type="text"
                    >删除</el-button
                  >
                  <el-button
                    v-if="hasNew"
                    class="el-icon-circle-plus-outline"
                    @click.stop="() => append(node, data)"
                    size="mini"
                    type="text"
                    :disabled="addAbledFunc(node, data)"
                    >新增</el-button
                  >
                </span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="colSpan[1]">
        <slot name="form"></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {Tree, Card} from 'element-ui'
import cloneDeep from 'lodash/cloneDeep.js'
import {resolve} from 'url'
export default {
  name: 'curd-tree',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => {
        return {children: 'children', label: 'name', disabled: () => false}
      }
    },
    hasNew: {
      type: Boolean,
      default: true
    },
    hasEdit: {
      type: Boolean,
      default: true
    },
    hasDelete: {
      type: Boolean,
      default: true
    },
    isFliter: {
      type: Boolean,
      default: true
    },
    deleteAbledFunc: {
      type: Function,
      default: () => false
    },
    eidtAbledFunc: {
      type: Function,
      default: () => false
    },
    addAbledFunc: {
      type: Function,
      default: (node, data) => data.level == 3
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    isDrag: {
      type: Boolean,
      default: false
    },
    colSpan: {
      type: Array,
      default: () => [11, 12],
      validator: val =>
        val.reduce((sum, next) => (sum += next), 0) <= 24 && val.length == 2
    }
  },
  components: {
    'el-tree': Tree,
    'el-card': Card
  },
  data() {
    return {
      filterText: '',
      level: 0,
      lastTree: [],
      initClone: [],
      hoverCurId: '',
      isCanDrag: false
    }
  },
  watch: {
    data: {
      handler: function(val, old) {
        this.lastTree = cloneDeep(this.addLevel(val, 0))
        this.initClone = cloneDeep(this.lastTree)
      },
      immediate: true,
      deep: true
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    handleSort(type) {
      this.$emit(`node-sort`, {
        sortType: type,
        node: this.$refs.tree.getCurrentNode()
      })
    },
    append(node, data) {
      const params = Object.assign({}, data, node)
      this.$emit('add-node', params)
    },
    remove(node, data) {
      this.$emit('remove-node', {
        id: data.id,
        parentNodeId: node.parent.data.id,
        data,
        node
      })
    },
    edit(node, data) {
      this.$emit('edit-node', {node, data})
    },
    clearTreeSelected() {
      this.$refs.tree.setCurrentKey(null)
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.props.label].indexOf(value) !== -1
    },
    addLevel(data, cur = 0) {
      cur += 1
      return data.map(node => {
        const obj = {}
        obj['level'] = cur
        obj[this.props.children] =
          node[this.props.children] &&
          this.addLevel(node[this.props.children], cur)
        return Object.assign({}, node, obj)
      })
    },
    dragFinished(...arr) {
      var notice = '已取消操作'
      var infotype = 'notice'
      this.$confirm('确定拖拽此类目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const mostlevel = 3 //最多支持级数
          let level = 0
          let [fromNode, toNode, type] = arr
          level += toNode.level
          let addLevel = data => {
            if (data[this.props.children] && data[this.props.children].length) {
              level++
              data[this.props.children].every(item => {
                if (
                  item[this.props.children] &&
                  item[this.props.children].length
                ) {
                  level++
                  return false
                }
              })
            }
          }
          addLevel(fromNode.data)
          if (level > mostlevel) {
            notice = '类目树最多只支持3级，操作无效'
            infotype = 'warning'
            resolve(false)
          }
          this.$emit('drag-finished', {
            fromNode: arr[0],
            toNode: arr[1],
            type: arr[2]
          })
          this.isCanDrag = false
        })
        .catch(res => {
          this.lastTree = cloneDeep(this.initClone)
          this.$message({
            type: infotype,
            message: notice
          })
        })
    }
  },
  created() {},
  computed: {}
}
</script>

<style lang="less" scoped>
.curd-tree {
  min-width: 430px;
  overflow-y: auto;
  height: 100%;

  .header {
    margin-bottom: 20px;

    .button-group {
      margin-top: 15px;
    }

    .el-button-group {
      display: flex;
    }
  }

  .main {
    height: 400px;
    overflow-y: auto;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      overflow: auto;
    }
  }
}
</style>
