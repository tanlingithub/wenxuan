<template>
  <div class="group-edit">
    <el-form-renderer
      v-loading="isLoading"
      ref="groupForm"
      :content="content"
      label-width="100px"
    >
      <el-form-item label="约束条件">
        <el-button @click="dialogVisible = true">添加条件</el-button>
        <div class="condition-box">
          <p v-for="(i, index) in form.logicRule" :key="index">
            <el-input placeholder="请输入" v-model="i.label"></el-input>
            <el-select v-model="i.condition" placeholder="请选择">
              <el-option
                v-for="item in FULL_CONDITION_MAP_LIST"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              placeholder="请输入"
              v-model="i.value"
              v-if="!i.enumList"
            ></el-input>
            <el-select v-else v-model="i.value" placeholder="请选择">
              <el-option
                v-for="item in i.enumList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button
              type="text"
              icon="el-icon-remove"
              @click="deleteData(index)"
            ></el-button>
          </p>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save" :loading="saveLoading"
          >保存</el-button
        >
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>

      <tag-info
        ref="tagInfo"
        :visible.sync="conditionVisible"
        :rules="rules"
        @selected="getTagRules"
      ></tag-info>
    </el-form-renderer>
    <el-dialog title="添加条件" :visible.sync="dialogVisible" width="800px">
      <div class="condition-dialog">
        <el-data-tree
          ref="tree"
          @node-click="handleNodeClick"
          v-bind="treeConfig"
          @loaded="treeLoaded"
          class="condition-tree"
        ></el-data-tree>
        <div class="condition-items">
          <el-form>
            <el-form-item>
              <el-checkbox-group v-model="totalSelectCondition">
                <el-checkbox
                  v-for="i in previewTreeData"
                  :label="i.id"
                  :key="i.id"
                  name="condition"
                  >{{ i.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="filterConditionData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {FULL_CONDITION_MAP_LIST, TAG_TYPE_LIST} from '@/const/common.js'
import ElDataTree from '@femessage/el-data-tree'
import TagInfo from '@/container/member/tag-info'

import {
  memberGroupList,
  ruleList,
  createMemberGroup,
  memberGroupDetail,
  compoundTagInfo,
  conditionTree,
  addCompound,
  commonAddOne,
  commonFindOne,
  commonUpdateOne
} from '@/const/api'

const RULE = {
  1: '<',
  2: '≤',
  3: '=',
  4: '>',
  5: '≥'
}
const TYPE_RULE = {
  6: '是',
  7: '否'
}

export default {
  name: 'group-edit',
  components: {
    TagInfo,
    ElDataTree
  },
  data() {
    return {
      content: [
        {
          $type: 'input',
          $id: 'name',
          label: '分组名称',
          $el: {placeholder: '请输入', maxLength: 15},
          rules: [{required: true, message: '请输入分组', trigger: 'blur'}]
        },
        {
          $type: 'input',
          $id: 'info',
          label: '分组描述',
          $el: {placeholder: '请输入', type: 'textarea', maxLength: 50}
        },
        {
          $type: 'radio-group',
          $id: 'status',
          label: '状态',
          $default: '1',
          $options: [{label: '启用', value: '1'}, {label: '禁用', value: '0'}]
        },
        {
          $type: 'radio-group',
          $id: 'logicRule',
          label: '条件关系',
          $default: '0',
          $options: [
            {label: '且（满足以下所有约束条件才成立）', value: '0'},
            {label: '或（满足以下1个条件即成立）', value: '1'}
          ]
        }
      ],
      conditionVisible: false,
      dialogVisible: false,
      saveLoading: false,
      isLoading: false,
      rules: [],
      TAG_TYPE_LIST,
      FULL_CONDITION_MAP_LIST,
      form: {
        tagName: '',
        tagType: '',
        description: '',
        rule: '',
        logicRule: [
          // {
          //   label: "",
          //   condition: "",
          //   value: ""
          // }
        ]
      },
      totalSelectCondition: [],
      previewTreeData: [],
      fullTreeData: [],
      treeConfig: {
        title: '分类管理',
        parentKey: 'parentId',
        dataPath: 'data.payload',
        hasTitle: false,
        showFilter: false,
        hasOperation: false,
        treeAttrs: {
          nodeKey: 'id',
          highlightCurrent: true,
          autoExpandParent: true,
          showCheckbox: false,
          expandOnClickNode: false,
          renderAfterExpand: true,
          defaultExpandAll: true,
          props: {
            label: 'label',
            children: 'none'
          }
        },
        url: conditionTree,
        hasNew: false,
        hasEdit: false,
        hasDelete: false
      },
      tagRule: RULE,
      typeRule: TYPE_RULE,
      conditionList: []
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    isView() {
      return !!this.$route.query.isView
    }
  },
  mounted() {
    if (this.id) this.getGroupDetail()
  },
  methods: {
    // 获取分组详情
    getGroupDetail() {
      this.isLoading = true
      this.$axios
        .$post(commonFindOne('memberGroup'), {id: this.$route.query.id})
        .then(resp => {
          resp.payload.memberGroup.logicRule = resp.payload.memberGroup.logicRule.toString()
          resp.payload.memberGroup.status = resp.payload.memberGroup.status
            ? '1'
            : '0'
          this.$refs.groupForm.updateForm(resp.payload.memberGroup)
          // this.rules = [...resp.payload.memberGroupRuleList]
          // this.rules.forEach((item, index) => {
          //   item.symbol = item.symbol.toString()
          //   this.$axios.$get(ruleList(item.relationId)).then(resp => {
          //     let data = JSON.parse(resp.payload)
          //     this.$set(this.conditionList, index, data)
          //   })
          // })
          this.form = resp.payload.memberGroupRuleList || {}
        })
        .catch(e => console.log(e))
        .finally(() => (this.isLoading = false))
    },
    getTagInfo() {
      this.loading = true

      this.$axios
        .$get(compoundTagInfo(this.ID))
        .then(res => {
          this.loading = false
          this.totalSelectCondition = res.payload.logicRule.map(i => i.id)
          this.form = res.payload
        })
        .catch(e => {
          this.loading = false
          this.$message.error(e.msg)
        })
    },
    filterConditionData() {
      let data = this.fullTreeData.reduce((total, item) => {
        return total
          .concat(
            (item.children || []).filter(i => {
              return this.totalSelectCondition.indexOf(i.id) > -1
            })
          )
          .map(i => ({...i, value: i.value || ''}))
      }, [])

      this.form.logicRule = this.form.logicRule.concat(data)
      this.dialogVisible = false
    },
    getTagRules(val) {
      const oldLen = [...this.rules].length
      this.rules = this.rules.concat(val)
      val.forEach((item, index) => {
        this.$axios.$get(ruleList(item.id)).then(resp => {
          let data = JSON.parse(resp.payload)
          this.$set(this.conditionList, index + oldLen, data)
        })
      })
    },
    handleNodeClick(data) {
      this.previewTreeData = data.children
    },
    treeLoaded(res) {
      this.fullTreeData = res
    },
    deleteData(index) {
      this.$confirm('确认移除吗？')
        .then(res => {
          res === 'confirm' && this.form.logicRule.splice(index, 1)
        })
        .catch(e => {})
    },
    // 删除约束条件
    removeCondition(i, val) {
      this.rules = this.rules.filter((val, index) => index !== i)
      this.conditionList = this.conditionList.filter(
        (val, index) => index !== i
      )
      this.$refs.tagInfo.deleteTag(val.id)
    },
    // 新增/编辑分组
    save() {
      this.$refs.groupForm.validate(valid => {
        if (!valid) return

        // 约束条件不得多于10
        if (this.rules.length && this.rules.length > 10) {
          this.$message.warning('最多添加10个条件')
          return
        }
        // 必须选择约束条件 && 条件得填充
        // if (
        //   !this.rules.length ||
        //   !this.rules.every(
        //     val =>
        //       (val.symbol && (val.type === 1 && val.tagId)) ||
        //       (val.type === 2 && val.tagNumber)
        //   )
        // ) {
        //   this.$message.warning('请完善约束条件!')
        //   return
        // }

        this.saveLoading = true
        // const methods = this.id ? '$put' : '$post'
        const methods = '$post'
        // const url = this.id ? memberGroupDetail(this.id) : createMemberGroup
        const url = this.$route.query.id
          ? `${commonUpdateOne('memberGroup')}`
          : `${commonAddOne('memberGroup')}`
        // 标签条件规则
        // let rules = this.rules.map((item, i) => {
        //   if (!this.conditionList) return
        //   let index = this.conditionList[i].findIndex(
        //     val => val.attributeId === item.id || item.relationId
        //   )
        //   const obj =
        //     item.type == 1
        //       ? {
        //           tagName: this.conditionList[i][index].attributeName
        //         }
        //       : {tagNumber: item.tagNumber || item.number}
        //   return Object.assign(
        //     {
        //       relationId: item.relationId || item.id,
        //       relationName: item.relationName || item.name,
        //       type: item.type,
        //       symbol: item.symbol
        //     },
        //     obj
        //   )
        // })
        let groupForm = this.$refs.groupForm.getFormValue()
        let data = {
          memberGroup: {
            name: groupForm.name,
            info: groupForm.info,
            status: +groupForm.status,
            logicRule: +groupForm.logicRule
          },
          id: new Date().getTime(),
          memberGroupRuleList: this.form
        }

        if (this.id) {
          data = {
            args: {
              id: this.id
            },
            update: {
              memberGroup: {
                name: groupForm.name,
                info: groupForm.info,
                status: +groupForm.status,
                logicRule: +groupForm.logicRule
              },
              memberGroupRuleList: this.form
            }
          }
        }

        this.$axios[methods](url, data)
          .then(resp => {
            if (resp.code !== '0') {
              this.$message.warning(resp.msg)
              return
            }
            this.$message.success('操作成功')
            this.$router.back()
          })
          .catch(e => console.log(e))
          .finally(() => (this.saveLoading = false))
      })
    }
  }
}
</script>
<style lang="less">
.group-edit {
  .condition-box {
    margin-top: 20px;
    p {
      margin-bottom: 5px;
      display: flex;
      .el-input {
        margin-right: 4px;
        width: 200px;
      }
      .el-select {
        min-width: 200px;
      }
    }
  }
  .condition-dialog {
    display: flex;
    .condition-tree {
      width: 200px;
    }
    .condition-items {
      flex: 1;
      border: 1px solid #ebeef5;
      border-left: none;
      padding: 30px;

      .el-checkbox {
        margin-left: 0;
        width: 25%;
      }
    }
  }
}
</style>
