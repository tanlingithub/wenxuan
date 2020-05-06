<template>
  <div class="brand-info" v-loading="brandloading">
    <div class="brand-info-base">
      <div class="baseMessge">
        <el-form-renderer
          :content="staffInfo"
          ref="brandInfo"
          class="staff-info-fl brand-baseInfo"
          label-width="100px"
        ></el-form-renderer>
        <div class="brand-info-baseGroup">
          <div class="brand-info-btns">
            <el-button @click="$router.back()">取消</el-button>
            <el-button type="primary" @click="saveFrom">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UploadToAli from '@femessage/upload-to-ali'
import {
  BRAND_LIST,
  putBrandManagement,
  postBrandManagement,
  getBrandManagement
} from '@/service/spaas-commodity-center.js'
export default {
  data() {
    return {
      title: '新增',
      brandloading: false,
      staffInfo: [
        {
          $id: 'chineseName',
          $type: 'input',
          label: '中文名称',
          $el: {
            placeholder: '请输入内容',
            style: 'width: 35%'
          },
          rules: [
            {
              message: '请输入中文名称',
              required: true,
              trigger: 'change',
              whitespace: true
            }
          ]
        },
        {
          $id: 'englishName',
          $type: 'input',
          label: '英文名称',
          $el: {
            placeholder: '请输入内容',
            style: 'width: 35%'
          }
        },
        {
          $id: 'attachmentPath',
          component: UploadToAli,
          label: '品牌LOGO',
          $el: {
            style: 'width: 35%'
          }
        },
        {
          $id: 'code',
          $type: 'input',
          label: '编码',
          $el: {
            placeholder: '请输入内容',
            style: 'width: 35%'
          }
        },
        {
          $id: 'introduction',
          $type: 'input',
          label: '品牌介绍',
          $el: {
            type: 'textarea',
            placeholder: '请输入内容',
            style: 'width:35%'
          }
        }
      ]
    }
  },
  computed: {
    getId() {
      return this.$route.query.id
    }
  },
  methods: {
    //发送
    saveFrom(params) {
      this.$refs.brandInfo.validate(valid => {
        if (!valid) return
        this.brandloading = true
        let getFormvalue = this.$refs.brandInfo.getFormValue()
        getFormvalue.enabled = Number(getFormvalue.enabled)
        if (this.getId) {
          putBrandManagement({id: this.getId, formvalue: getFormvalue})
            .then(res => {
              let {data} = res
              if (data.code == '0' && data.payload) {
                this.$message.success('修改成功')
                this.$router.back()
              }
              if (data.code === '400') {
                this.alertMessage(
                  `中文名称<span  style="color:red"> ${
                    getFormvalue.chineseName
                  } </span>重复`,
                  'warning',
                  true
                )
              }
            })
            .catch(err => {})
            .finally(() => {
              this.brandloading = false
            })
        } else {
          postBrandManagement({formvalue: getFormvalue})
            .then(res => {
              let {data} = res
              if (data.code == '0' && data.payload) {
                this.$message.success('保存成功'), this.$router.back()
              }
              if (data.code === '400') {
                this.alertMessage(
                  `中文名称<span  style="color:red"> ${
                    getFormvalue.chineseName
                  } </span>重复`,
                  'warning',
                  true
                )
              }
            })
            .catch(() => {})
            .finally(() => {
              this.brandloading = false
            })
        }
      })
    },
    alertMessage(mess, type, htmlType = false) {
      return new Promise((resolve, reject) => {
        this.$message({
          message: mess,
          dangerouslyUseHTMLString: htmlType,
          type: type
        })
        resolve()
      })
    },
    updateEditForm() {
      this.title = '编辑'
      this.brandloading = true
      getBrandManagement({id: this.getId})
        .then(res => {
          let {...data} = res.data.payload
          if (res.data.code === '0') {
            this.$refs.brandInfo.updateForm({
              chineseName: data.chineseName, //中文名称
              englishName: data.englishName, //英文名称
              attachmentPath: data.attachmentPath, //头像
              code: data.code, //编码
              introduction: data.introduction //品牌介绍
            })
          }
        })
        .catch(() => {})
        .finally(() => {
          this.brandloading = false
        })
    }
  },
  mounted() {
    if (this.getId) {
      this.updateEditForm()
    }
  }
}
</script>
<style lang="less">
.brand-info {
  .brand-info-text {
    padding: 10px 0 20px 30px;
    background: #fff;
    margin: 0 -30px; //因main里边设置padding故-出去
    font-size: 15px;
  }

  .brand-info-btns {
    width: 35%;
    margin-left: 100px;
    padding: 10px 0;
    text-align: center;
  }

  .el-textarea {
    width: 35%;
  }

  .baseMessge {
    padding: 30px 0 40px 40px;
    background: #fff;
  }
}
</style>
