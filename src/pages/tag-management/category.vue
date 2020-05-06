<template>
  <div class="tag-management-category" v-loading="initLoading">
    <h3>标签类目</h3>
    <el-crud-tree
      ref="crudTree"
      :data="treeData"
      :colSpan="[9, 14]"
      @add-node="handleAddNode($event, false)"
      @edit-node="hanldeEditNode"
      @remove-node="handleRemoveNode"
    >
      <div slot="middle-title">
        <el-row style="padding:10px;">
          <el-button
            type="primary"
            size="mini"
            @click="handleAddNode($event, true)"
            >新增</el-button
          >
        </el-row>
      </div>
      <div slot="form">
        <el-card>
          <span slot="header" class="clearfix">
            <b>{{ cardTitle }}</b>
          </span>
          <el-form-renderer
            :content="content"
            label-width="100px"
            :disabled="!canEdit"
            ref="formRender"
          >
            <el-form-item>
              <el-button
                type="primary"
                size="small"
                @click="handleSave"
                :loading="saveLoading"
                >保存</el-button
              >
              <el-button size="small" @click="handleCancel">取消</el-button>
            </el-form-item>
          </el-form-renderer>
        </el-card>
      </div>
    </el-crud-tree>
  </div>
</template>
<script>
import {tagsCatalog, commonAdd, commonEdit, commonDetail} from '@/const/api'
import {preComfirm} from '@/const/point-management'

const STATUS_EUM = {
  new: '新增分类标签',
  edit: '编辑分类标签',
  '': '分类标签'
}

export default {
  name: 'tag-management-category',
  components: {
    'el-crud-tree': () => import('@/components/el-crud-tree/index'),
    'el-card': () => import('element-ui/packages/card/index')
  },
  data() {
    return {
      treeData: [],
      initLoading: false,
      saveLoading: false,
      tempData: '',
      pageState: '',
      isInit: false,
      isTop: false,
      content: [
        {
          $type: 'input',
          $id: 'catalogName',
          label: '分类标题',
          $el: {placeholder: '请输入', maxLength: 15},
          rules: [{required: true, message: '请输入', trigger: 'blur'}]
        },
        {
          $type: 'input',
          $id: 'catalogDescription',
          label: '分类描述',
          $el: {
            placeholder: '请输入',
            type: 'textarea'
          },
          rules: [{required: true, message: '请输入', trigger: 'blur'}]
        }
      ],
      canEdit: false
    }
  },
  computed: {
    cardTitle() {
      return STATUS_EUM[this.pageState]
    }
  },
  created() {
    this.fetchTreeData()
  },
  methods: {
    async fetchTreeData(params) {
      try {
        this.initLoading = true
        const {payload} = await this.$axios.$post(
          commonDetail + '?collection=tagsCatalog',
          {id: 'catalogByNemo'}
        )
        this.treeData = (payload && payload.data) || []
        if (!payload) {
          this.isInit = true
        }
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.initLoading = false
      }
    },
    handleAddNode(params, type) {
      this.isTop = type
      this.canEdit = true
      this.pageState = 'new'
      if (!type) {
        const {node, data} = params
        this.tempData = data //  引用
        this.isTop = type
      }
    },
    hanldeEditNode(params) {
      const {node, data} = params
      const config = {
        content: '确定对该类目进行编辑吗？'
      }
      config.callbackYes = () => {
        this.$refs.formRender.updateForm({
          catalogName: data.name,
          catalogDescription: data.des
        })
        this.tempData = data
        this.canEdit = true
        this.pageState = 'edit'
      }
      preComfirm.call(this, config)
    },
    handleRemoveNode(params) {
      const {node, data} = params
      const config = {
        content: '确定对该类目进行删除吗？'
      }

      config.callbackYes = async () => {
        try {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
          const curData = this.$refs.crudTree.$refs.tree.data

          await this.$axios.$post(commonEdit + '?collection=tagsCatalog', {
            args: {
              id: 'catalogByNemo'
            },
            update: {
              data: curData
            }
          })
        } catch (err) {
          this.$message.error(err)
        }
      }
      preComfirm.call(this, config)
    },
    handleSave() {
      const formR = this.$refs.formRender
      formR.validate(valid => {
        if (!valid) return

        const curFrom = formR.getFormValue()
        if (this.pageState == 'new') {
          if (!this.isTop) {
            const newChild = {
              id: new Date().getTime(),
              parentNode: this.tempData.parentNode,
              name: curFrom.catalogName,
              des: curFrom.catalogDescription,
              children: null
            }
            if (!this.tempData.children) {
              this.$set(this.tempData, 'children', [])
            }
            this.tempData.children.push(newChild)
          } else {
            this.treeData = this.treeData.concat([
              {
                id: new Date().getTime(),
                name: curFrom.catalogName,
                des: curFrom.catalogDescription,
                parentNode: null,
                children: null
              }
            ])
          }
        }

        if (this.pageState == 'edit') {
          this.tempData.name = curFrom.catalogName
          this.tempData.des = curFrom.catalogDescription
        }

        const saveLastReuqest = async () => {
          try {
            this.saveLoading = true
            const curData = this.$refs.crudTree.$refs.tree.data
            const url = this.isInit ? commonAdd : commonEdit
            const body = this.isInit
              ? {
                  id: 'catalogByNemo',
                  data: this.isTop ? this.treeData : curData
                }
              : {
                  args: {
                    id: 'catalogByNemo'
                  },
                  update: {
                    data: this.isTop ? this.treeData : curData
                  }
                }
            await this.$axios.$post(url + '?collection=tagsCatalog', body)
            this.fetchTreeData
            this.resetForm()
            this.canEdit = false
          } catch (err) {
            this.$message.error(err)
          } finally {
            this.saveLoading = false
          }
        }

        saveLastReuqest()

        // this.sendRequest(curFrom)
      })
    },
    async sendRequest(formValue) {
      try {
        this.saveLoading = true
        await this.$axios.$post('/catalog/save', formValue)
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.saveLoading = false
      }
    },
    handleCancel() {
      const config = {
        content: '确定取消当前操作吗？'
      }
      config.callbackYes = () => {
        this.resetForm()
        this.canEdit = false
      }
      preComfirm.call(this, config)
    },
    resetForm() {
      const {$refs} = this.$refs.formRender
      $refs.elForm.resetFields()
      this.isTop = false
      this.isInit = false
    }
  }
}
</script>
