<!-- 添加并编辑属性 -->
<template>
  <div class="add-property-wrap">
    <el-form
      :model="propertyForm"
      :rules="propertyRules"
      ref="formDetail"
      v-loading="loadingDetail"
      label-width="100px"
    >
      <el-form-item label="属性名称" prop="propertyName">
        <el-input v-model="propertyForm.propertyName"></el-input>
      </el-form-item>
      <el-form-item label="父级属性" prop="parentIdArr">
        <div v-if="ifEdit">
          <el-cascader
            v-model="propertyForm.parentIdArr"
            @change="handleItemChange"
            v-loading="loadingParentIdOptions"
            :options="parentIdOptions"
            v-bind="cascaderBind"
          ></el-cascader>
          <el-button
            type="text"
            style="margin-left: 10px;"
            v-show="propertyForm.parentIdArr.length"
            size="small"
            @click="emptyParentIdArr"
            >清空</el-button
          >
          <el-button
            type="text"
            style="margin-left: 10px;"
            v-show="propertyId !== null"
            size="small"
            @click="resetParentIdArr"
            >取消</el-button
          >
        </div>

        <div v-else>
          <span>{{ propertyForm.parentPropertyName }}</span>
          <el-button type="text" size="small" @click="changeParent"
            >修改</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="输入方式" prop="inputType">
        <el-radio-group v-model="propertyForm.inputType">
          <el-radio
            v-for="(item, index) in INPUT_TYPE"
            :key="index"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="属性值" prop="inputValuesArr">
        <input-table v-model="propertyForm.inputValuesArr"></input-table>
      </el-form-item>
      <el-form-item align="center" class="bottom-list">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import InputTable from './components/input-table/index.vue'
import {INPUT_TYPE} from '@/const/dictionary.js'

import {
  postCommodityPropertys,
  putCommodityPropertys,
  getCommodityPropertysDetail,
  getCommodityPropertyParents
} from '@/service/spaas-commodity-center.js'

export default {
  components: {
    InputTable
  },
  props: {
    propertyId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      INPUT_TYPE, // 输入
      loadingDetail: false, // 是否在请求详情信息
      loadingParentIdOptions: false, // 是否在请求父级的parentId信息
      propertyRules: {
        propertyName: [
          {required: true, message: '请输入属性名称', trigger: 'blur'}
        ]
      }, // 输入框的值校验
      originalParentIdArr: [], // 未编辑前的
      propertyForm: {
        parentPropertyName: '根节点', // 父属性名称
        propertyName: '', // 属性名称
        inputType: 1, // 默认选中枚举选择
        parentIdArr: [], // 选中的父级属性列表
        inputValuesArr: [''] // 属性值数组eg: [1,2]
      },
      cascaderBind: {
        'change-on-select': true,
        'show-all-levels': false,
        placeholder: '请选择',
        props: {
          label: 'propertyName',
          value: 'id',
          children: 'children'
        }
      },
      parentIdOptions: [],
      ifEdit: true // 是否编辑parentId
    }
  },
  created() {
    // 请求父级属性值
    this.fetchPropertiesTree()
  },
  mounted() {
    if (this.propertyId !== null) {
      // 是否可以编辑父属性
      this.ifEdit = false
      this.fetchPropertyDetail(this.propertyId)
    }
  },
  methods: {
    // 取消，清空表单
    handleCancel() {
      // this.$refs.formDetail.resetFields()
      this.$router.back()
    },
    // 确定
    submitForm() {
      this.$refs.formDetail.validate(valid => {
        if (valid) {
          const {
            propertyName, // 属性名称
            inputType, // 默认选中枚举选择
            parentIdArr, // 选中的父级属性列表
            inputValuesArr // 属性值数组eg: [1,2]
          } = this.propertyForm
          const parentId = parentIdArr.slice(-1).join('') || 0
          const inputValues = inputValuesArr
            .filter(info => info !== '')
            .join(',')
          const formatValue = {
            propertyName,
            parentId,
            inputType,
            inputValues // value1,value2
          }
          // 判断当前是编辑还是新增
          if (this.propertyId !== null) {
            // 判断选择的父节点以及本身的属性是否相同
            if (this.propertyId == parentId) {
              this.$message.error('选中的父级属性不能与当前属性相同')
              return
            }
            // 编辑
            putCommodityPropertys({...formatValue, id: this.propertyId}).then(
              res => {
                const {msg, payload} = res
                if (msg === 'ok' && payload) {
                  this.$message({
                    message: '修改属性成功',
                    type: 'success'
                  })
                  // 返回上一页
                  this.handleCancel()
                } else {
                  this.$message.error('修改属性失败，请重试')
                }
              }
            )
          } else {
            // 新增
            postCommodityPropertys(formatValue).then(res => {
              const {msg, payload} = res
              if (msg === 'ok' && payload) {
                this.$message({
                  message: '添加属性成功',
                  type: 'success'
                })
                // 返回上一页
                console.log(666)
                this.handleCancel()
                // this.$refs.formDetail.resetFields()
              } else {
                this.$message.error('添加属性失败，请重试')
              }
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: '请填写完整信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 请求编辑详情数据
    fetchPropertyDetail(id) {
      this.loadingDetail = true
      getCommodityPropertysDetail({id})
        .then(res => {
          const {payload} = res
          if (payload) {
            const {
              parentId,
              propertyName,
              propertyDesc,
              inputType,
              inputValues,
              parentProperty
            } = payload || {}
            // 将树进行遍历，然后找出父节点
            const parentIdArr =
              parentId !== null && parentId !== 0 ? [parentId] : []
            const parentPropertyNameStr =
              parentId === null || parentId === 0
                ? '根节点'
                : parentProperty.propertyName || ''
            const inputValuesArr =
              inputValues !== null ? inputValues.split(',') : []
            this.originalParentIdArr = parentIdArr.slice(0) // 保存修改前的数组

            this.propertyForm = {
              propertyName, // 属性名称
              inputType, // 默认选中枚举选择
              parentIdArr, // 选中的父级属性列表
              parentPropertyName: parentPropertyNameStr, // 父属性名称
              inputValuesArr // 属性值数组eg: [1,2]
            }
          }
        })
        .finally(_ => {
          this.loadingDetail = false
        })
    },
    // 查询属性树
    fetchPropertiesTree() {
      this.loadingParentIdOptions = true
      return getCommodityPropertyParents({id: 0})
        .then(res => {
          const {payload} = res
          if (payload) {
            // 添加空的children
            const parentIdOptions = payload.map(info => ({
              ...info,
              children: []
            }))
            this.parentIdOptions = parentIdOptions
          }
        })
        .finally(_ => {
          this.loadingParentIdOptions = false
        })
    },
    // 选中节点，按需加载下一级。目前限制住两级
    handleItemChange(idList) {
      // 目前限制住两级
      if (idList.length > 2) return
      const firstId = idList[0]
      getCommodityPropertyParents({id: firstId}).then(res => {
        const {payload} = res
        if (payload) {
          const newPayload = payload.map(info => {
            delete info.children
            return info
          })
          // 将当前的数据添加到父节点中
          this.parentIdOptions = this.parentIdOptions.map(info => {
            if (info.id === firstId) {
              return {
                ...info,
                children: newPayload
              }
            }
            return info
          })
        }
      })
    },
    // 编辑属性
    changeParent() {
      this.ifEdit = true
    },
    // 清空选中的值
    emptyParentIdArr() {
      this.propertyForm.parentIdArr = []
    },
    // 恢复选中的值
    resetParentIdArr() {
      this.propertyForm.parentIdArr = this.originalParentIdArr.slice(0)
      // 取消编辑
      this.ifEdit = false
    }
  }
}
</script>
<style lang="less">
.add-property-wrap {
  padding: 20px 50px;
  max-width: 800px;

  .bottom-list {
    padding-top: 20px;
  }
}

.el-cascader-menu__item {
  padding-right: 35px;
}
</style>
