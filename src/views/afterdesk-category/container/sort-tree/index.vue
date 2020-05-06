<template>
  <div class="sort-tree-container">
    <SearchInput
      class="search-input-container"
      @select="selectItem"
      @emptyInput="getRootList"
    />
    <div class="button-container">
      <el-button @click="dialogVisible = true" type="primary" size="small">
        新增根类目
      </el-button>
    </div>
    <el-tree
      :data="data"
      node-key="id"
      draggable
      :load="getSelectList"
      @node-click="nodeClickFn"
      v-loading="loadRootData"
      :allow-drop="ifAllowDrop"
      @node-drop="nodeDropSuccess"
      lazy
      :props="defaultProps"
    >
      <span class="custom-tree-node" slot-scope="{node, data}">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            class="icon-button"
            type="text"
            v-show="!Boolean(+data.leaf) && node.level < 3"
            @click.stop="() => appendItem(data)"
          >
            <i class="el-icon-circle-plus-outline"></i>
          </el-button>
          <el-button
            type="text"
            class="delete-button"
            @click.stop="() => removeItem(data)"
          >
            <i class="el-icon-circle-close-outline"></i>
          </el-button>
        </span>
      </span>
    </el-tree>

    <!-- 新增类目 -->
    <el-dialog
      title="新增类目"
      :visible.sync="dialogVisible"
      @close="clearValue"
    >
      <el-form-renderer
        :content="content"
        label-width="100px"
        ref="addCategoryForm"
      >
        <div class="category-btn">
          <el-button @click="clearValue">取消</el-button>
          <el-button type="primary" @click="saveForm">确定</el-button>
        </div>
      </el-form-renderer>
    </el-dialog>
  </div>
</template>

<script>
import SearchInput from './container/search-input'
import {
  getBackCategorys,
  postAfterCategorysList,
  getBackCategorysTreeGeneral,
  delAfterCategorysList,
  putAfterCategorysList
} from '@/service/spaas-commodity-center.js'

export default {
  name: 'SortTree',
  components: {
    SearchInput
  },
  data() {
    return {
      data: [],
      content: [
        {
          $id: 'name',
          $type: 'input',
          label: '类目名称',
          $el: {
            style: 'width:35%',
            placeholder: '请输入'
          },
          rules: [
            {
              message: '请输入类目名称',
              required: true,
              trigger: 'change',
              whitespace: true
            }
          ]
        },
        {
          $id: 'enabled',
          $type: 'switch',
          label: '是否启用',
          $el: {
            placeholder: '请输入'
          }
        },
        {
          $id: 'leaf',
          $type: 'radio-group',
          label: '叶子节点',
          $default: '0',
          $el: {
            placeholder: '请输入'
          },
          $options: [
            // 注意：element radio-group 通过 label 而不是 value 来匹配值
            {label: '是', value: '1'},
            {label: '否', value: '0'}
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data, node) => {
          return Boolean(+data.leaf) || node.level > 2
        }
      },
      dialogVisible: false, // 显示新增类目弹窗
      parentNode: {}, // 选中的父节点
      loadRootData: false // 请求根节点列表
    }
  },
  methods: {
    appendItem(data) {
      this.dialogVisible = true
      this.parentNode = data
    },
    // Input选中值触发的数据
    async selectItem(item) {
      const {id} = item
      this.loadRootData = true
      const res = await getBackCategorysTreeGeneral({id})
      this.loadRootData = false
      const {code, payload} = res
      if (code == 0 && payload) {
        this.data = payload
      }
    },
    // 删除某一项
    removeItem(item) {
      const {id, children} = item
      let confrimMess =
        children && children.length
          ? '当前节点下包含叶子节点，是否全部删除？'
          : '是否删除当前节点?'
      this.$confirm(confrimMess, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delAfterCategorysList({id}).then(res => {
            const {msg, code} = res.data || {}
            if (code === '0') {
              this.$message.success('删除成功')
              this.getRootList()
            } else {
              this.$confirm(msg || '叶子节点下边挂靠商品无法删除', '警告', {
                type: 'warning'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 请求选择列表
    async getSelectList(node, resolve) {
      const {id} = node.data
      if (!id) this.loadRootData = true
      const res = await getBackCategorys({parentId: id})
      this.loadRootData = false
      const {code, payload} = res
      if (code == 0 && payload) {
        const sortPayload = payload.sort(this.compare('sort'))
        if (!id && sortPayload[0]) {
          // 默认选中第一个
          this.nodeClickFn(sortPayload[0])
        }
        resolve(sortPayload)
      } else {
        resolve([])
      }
    },
    // 获取根节点数据
    async getRootList() {
      this.loadRootData = true
      const res = await getBackCategorys({parentId: 0})
      this.loadRootData = false
      const {code, payload} = res
      if (code == 0 && payload) {
        const sortPayload = payload.sort(this.compare('sort'))
        if (sortPayload[0]) {
          this.nodeClickFn(sortPayload[0])
        }
        this.data = sortPayload
      } else {
        this.data = []
      }
      this.clearValue()
    },
    // 升序排序
    compare(propertyName) {
      return (before, next) => {
        const beforeValue = before[propertyName]
        const nextValue = next[propertyName]
        if (beforeValue > nextValue) {
          return 1
        } else if (beforeValue < nextValue) {
          return -1
        } else {
          return 0
        }
      }
    },
    // 清除弹窗中选中的数据
    clearValue() {
      this.dialogVisible = false
      this.parentNode = {}
      try {
        this.$refs.addCategoryForm.resetFields()
      } catch {}
    },
    // 保存添加节点
    saveForm() {
      const {level, path, id} = this.parentNode
      const value = this.$refs.addCategoryForm.getFormValue()
      this.$refs.addCategoryForm.validate(valid => {
        if (!valid) {
          return false
        } else {
          const categoryForm = {
            ...value,
            leaf: Boolean(+value.leaf), //是否叶子节点
            enabled: !!value.enabled,
            level: level !== undefined ? Number(level) + 1 : 0, // 默认为根节点
            path: path ? `/${path}` : '/', // 默认为根节点
            parentId: id || 0 // 默认为根节点
          }
          postAfterCategorysList({CategoryForm: categoryForm}).then(
            async res => {
              if (res.data.code === '0') {
                this.$message.success('添加成功')
                this.getRootList()
              } else if (res.data.code == '400') {
                this.alertMeassage(
                  `类目节点名称<span  style="color:red"> ${
                    value.name
                  } </span>重复`,
                  'warning',
                  true
                )
              } else {
                this.$message.error('操作失败，请重试')
              }
            }
          )
        }
      })
    },
    alertMeassage(message, status = 'success', htmlType = false) {
      return new Promise((resolve, reject) => {
        if (message) {
          this.$message({
            message: message,
            dangerouslyUseHTMLString: htmlType,
            type: status
          })
          resolve()
        } else {
          reject()
        }
      })
    },
    // 点击节点事件触发
    nodeClickFn(item) {
      const {id} = item
      this.$emit('selectNode', item)
    },
    // 是否允许放置节点
    ifAllowDrop(draggingNode, dropNode, type) {
      if (type === 'inner') return false
      const {parentId} = draggingNode.data
      const nextParentId = dropNode.data.parentId
      return parentId === nextParentId
    },
    // 放置成功的事件
    nodeDropSuccess(before, after, inner) {
      const {parent} = after
      const dataList =
        parent && parent.childNodes
          ? parent.childNodes.map((info, index) => {
              const detail = info.data || {}
              return {
                ...detail,
                sort: index
              }
            })
          : []
      if (!dataList.length) return
      putAfterCategorysList({catagoryList: dataList}).then(res => {
        let {data} = res
        if (data.code == '0' && data.payload) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sort-tree-container {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .search-input-container {
    padding: 15px 10px;
    width: 100%;
  }

  .button-container {
    padding: 5px 10px 20px;
  }

  .category-btn {
    text-align: center;
    margin-top: 100px;
  }

  .delete-button {
    color: @--color-danger;
    margin-left: 6px;
  }
}
</style>
