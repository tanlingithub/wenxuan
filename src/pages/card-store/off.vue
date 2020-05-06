<template>
  <div class="off">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="支持扫码核销" prop="idd">
        <el-input v-model="ruleForm.idd"></el-input>
      </el-form-item>
      <el-form-item label="核销备注">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">扫码核销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {commonDeleteOne} from '@/const/api'
export default {
  data() {
    return {
      ruleForm: {
        idd: '',
        remark: ''
      },
      rules: {
        idd: [
          {
            required: true,
            message: '请输入核销码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      if (!this.ruleForm.idd) {
        this.$message.error('核销码不可为空')
      } else {
        this.$axios
          .post(commonDeleteOne('cardSendStore'), {
            id: parseInt(this.ruleForm.idd)
          })
          .then(res => {
            this.$message.success('核销成功')
            this.$router.push({
              path: '/card-store/list'
            })
          })
      }
    }
  }
}
</script>

<style></style>
