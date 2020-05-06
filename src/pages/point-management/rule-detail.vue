<template>
  <div class="point-manage-detail" v-loading="initLoading">
    <el-form-renderer
      label-width="180px"
      :content="content"
      ref="renderForm"
      class="render-form"
      :disabled="isView"
    >
      <el-form-item
        slot="id:lockPoint"
        prop="gradValue"
        :rules="[
          {
            validator: gradValueValid.call(this),
            trigger: 'blur'
          }
        ]"
      >
        <div slot="label"><span class="red-star">*</span> 积分值</div>
        <el-row>
          <el-radio v-model="formData.radioType" label="1">默认</el-radio>
          <span>（当前100任务值 = 1积分）</span>
        </el-row>
        <el-row>
          <el-radio v-model="formData.radioType" label="0">自定义</el-radio>
          <el-input
            placeholder="请输入"
            style="width:20%;"
            v-model.trim="formData.gradValue"
            :disabled="formData.radioType == '1'"
          ></el-input>
          <span>积分</span>
        </el-row>
      </el-form-item>
      <el-form-item
        prop="gradTime"
        slot="id:ruleCancel"
        :rules="[
          {
            validator: gradTimeValidate.call(this),
            trigger: 'blur'
          }
        ]"
      >
        <div slot="label">
          <span class="red-star">*</span>锁定积分有效期（天数）
        </div>
        <el-input
          placeholder="请输入"
          style="width:30%;"
          v-model="formData.gradTime"
        ></el-input>
        <span>到期未取消锁定，积分失效</span>
      </el-form-item>
      <el-form-item v-if="!isView">
        <el-button type="primary" @click="handleSave" :loading="savaLoading"
          >保存</el-button
        >
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form-renderer>
  </div>
</template>

<script>
import {
  preComfirm,
  gradValueValid,
  gradTimeValidate
} from '@/const/point-management'
import {
  pointRulesAdd,
  pointRulesDetail,
  commonAdd,
  commonEdit,
  commonDetail
} from '@/const/api'
export default {
  name: 'point-manage-detail',
  data() {
    return {
      formData: {
        radioType: '1',
        gradValue: '',
        gradTime: ''
      },
      savaLoading: false,
      initLoading: false,
      content: [
        {
          $type: 'input',
          $id: 'ruleName',
          label: '规则名称',
          $el: {
            type: 'text',
            placeholder: '请输入规则名称',
            maxlength: '30'
          },
          rules: [
            {
              required: true,
              message: '请输入规则名称',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'input',
          $id: 'ruleDescrip',
          label: '规则描述',
          $el: {
            type: 'textarea',
            placeholder: '请输入规则描述',
            maxlength: '30'
          },
          rules: [
            {
              required: true,
              message: '请输入规则描述',
              trigger: 'blur'
            }
          ]
        },
        {
          $type: 'input',
          $id: 'task',
          label: '关联任务',
          $el: {
            type: 'text',
            placeholder: '请输入关联任务',
            maxlength: '30'
          },
          rules: [
            {
              required: true,
              message: '请输入关联任务',
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'radio-group',
          id: 'lockPoint',
          label: '是否锁定积分',
          default: true,
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ],
          rules: [{required: true, message: '请选择', trigger: 'change'}]
        },
        {
          $type: 'input',
          $id: 'ruleCancel',
          label: '取消锁定条件',
          $el: {
            type: 'text',
            placeholder: '请选择关联任务',
            maxlength: '30'
          },
          rules: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            }
          ]
        }
      ]
    }
  },
  watch: {
    'formData.radioType': {
      handler: function(val) {
        if (val == '0') return
        this.formData.gradValue = ''
      }
    }
  },
  created() {
    const {id, type} = this.$route.query
    this.isView = type == 'view' && id
    this.isEdit = type == 'eidt' && id
    this.isNew = type == 'new' && !id
    this.gradValueValid = gradValueValid
    this.gradTimeValidate = gradTimeValidate
    id && this.fetchInitData(id)
  },
  methods: {
    handleSave() {
      this.$refs.renderForm.validate(valid => {
        if (!valid) return
        const curValue = this.$refs.renderForm.getFormValue()
        const realFrom = Object.assign({}, curValue, this.formData, {
          createdAt: new Date().getTime(),
          pointValue: parseInt(Math.random() * 100),
          isLock: Math.random() * 2 > 1 ? true : false
        })
        this.autoSendForm(realFrom)
      })
    },
    async autoSendForm(realFrom) {
      try {
        const apiMethods = this.isNew ? '$post' : '$put'
        const apiUrl = this.isNew
          ? commonAdd + '?collection=ruleDetail'
          : commonEdit + '?collection=ruleDetail'
        this.savaLoading = true
        // await this.$axios[apiMethods](pointRulesDetail, realFrom)
        await this.$axios.$post(
          apiUrl,
          this.isNew
            ? Object.assign({}, realFrom, {
                id: new Date().getTime()
              })
            : {
                args: {
                  id: this.$route.query.id
                },
                update: realFrom
              }
        )
        this.$router.go(-1)
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.savaLoading = false
      }
    },
    async fetchInitData(id) {
      try {
        this.initLoading = true
        // const {payload} = await this.$axios.$get(`${pointRulesDetail}?id=${id}`)
        const {payload} = await this.$axios.$post(
          commonDetail + '?collection=ruleDetail',
          {id}
        )
        this.$refs.renderForm.updateForm(payload)
        const {radioType, gradValue, gradTime} = payload
        this.formData.radioType = radioType
        this.formData.gradValue = gradValue
        this.formData.gradTime = gradTime
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.initLoading = false
      }
    },
    handleCancel() {
      const params = {
        content: '确认取消当前填写吗'
      }
      params.callbackYes = () => {
        this.$router.go(-1)
      }
      preComfirm.call(this, params)
    }
  }
}
</script>

<style lang="less">
.point-manage-detail {
  .render-form {
    width: 60%;
    margin: 0 auto;
    .red-star {
      color: #f56c6c;
    }
  }
}
</style>
