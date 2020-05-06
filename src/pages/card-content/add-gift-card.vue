<template>
  <div class="stored-add">
    <!-- v-loading不能放在最外层的节点，不然是全屏loading -->
    <p class="stored-add-title">基本信息</p>
    <el-form-renderer
      v-loading="storedLoading"
      ref="storedForm"
      :content="content"
      label-width="120px"
    >
      <el-form-item label="使用条件">
        <el-radio-group v-model="useRestrictions">
          <el-radio label="有限制">有限制</el-radio>
          <el-radio label="无门槛">无门槛</el-radio>
        </el-radio-group>
        <el-row v-if="useRestrictions == '有限制'">
          <div style="margin-top:10px;">
            <el-checkbox label="最低消费"
              >最低消费
              <span style="margin-left:20px;"
                >满<el-input
                  style="width: 100px;"
                  v-model="fullReduction"
                ></el-input
                >元可用</span
              ></el-checkbox
            >
          </div>
          <div>
            <el-checkbox label="不与其它优惠共享">不与其它优惠共享</el-checkbox>
          </div>
        </el-row>
      </el-form-item>
      <el-form-item label="有效期">
        <el-radio-group v-model="validityTerm">
          <el-radio :label="3" style="margin-top: 10px;margin-bottom: 10px;"
            >永久有效</el-radio
          >
          <br />
          <el-radio :label="6" style="margin-bottom: 10px;">固定区间</el-radio>
          <el-date-picker
            v-model="value4"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <br />
          <el-radio :label="9" style="margin-bottom: 10px;margin-top: 10px;"
            >固定时长</el-radio
          >
          <span style="font-size: 14px;">领取后</span>
          <el-input style="width: 100px;" v-model="effectTiem"></el-input>
          <span style="font-size: 14px;">天后生效，有效期</span>
          <el-input style="width: 100px;" v-model="effectiveTiem"></el-input>
          <span style="font-size: 14px;">天</span>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用说明">
        <el-input
          style="width: 400px;"
          v-model="instructions"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注说明">
        <el-input
          style="width: 400px;"
          v-model="notes"
          type="textarea"
        ></el-input>
      </el-form-item>
      <p class="stored-add-title">核销买单</p>

      <el-form-item label="核销展示方式">
        <el-radio-group v-model="writeOffMethod">
          <el-radio :label="3" style="margin-top: 10px;">
            <template>
              仅卡号
              <div
                style="margin-top: 10px;width:150px;height:150px;background: #ccc;padding:10px;"
              >
                <p
                  style="color:#606266;max-width:130px;max-height:130px;text-align:center;line-height: 130px;vertical-align: middle;"
                >
                  ABC-0000-0000
                </p>
              </div>
            </template>
          </el-radio>
          <el-radio :label="6" style="margin-top: 10px;">
            卡号和二维码
            <div
              style="margin-top: 10px;width:150px;height:150px;background: #ccc;padding:10px;"
            >
              <img
                src="@/assets/img/ewm.jpg"
                alt=""
                style="margin-left:15px;max-width:100px;max-height:100px;"
              />
              <p style="text-align:center;color:#606266;margin-top: 4px;">
                000-0000-0000
              </p>
            </div>
          </el-radio>
          <el-radio :label="9" style="margin-top: 10px;">
            卡号和条形码
            <div
              style="margin-top: 10px;width:150px;height:150px;background: #ccc;padding:10px;"
            >
              <img
                src="@/assets/img/txm.jpg"
                alt=""
                style="margin-top:40px;max-width:130px;max-height:130px;line-height: 130px;vertical-align: middle;"
              />
              <p style="text-align:center;color:#606266;margin-top: 4px;">
                000-0000-0000
              </p>
            </div></el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!isView">
        <el-button type="primary" @click="save" :loading="saveLoading"
          >保存</el-button
        >
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form-renderer>
  </div>
</template>

<script>
import {tagList, tagTypeList, ruleList, commonList} from '@/const/api'
import UploadToAli from '@femessage/upload-to-ali'

const RULE = {
  0: '≥',
  1: '>',
  2: '<',
  3: '≤',
  4: '=',
  5: '!='
}
const stored_TYPE = 1
const RADIO = 'radio-group'

export default {
  name: 'stored-edit',
  components: {
    UploadToAli
  },
  data() {
    return {
      useRestrictions: '无门槛',
      instructions: '',
      value4: [],
      validityTerm: 3,
      writeOffMethod: 3,
      effectTiem: '',
      effectiveTiem: '',
      notes: '',
      fullReduction: '',
      content: [
        {
          $type: 'input',
          $id: 'couponName',
          label: '卡劵名称',
          $el: {
            placeholder: '请输入卡券名称',
            maxlength: 12
          },
          rules: [{required: true, message: '请输入卡券名称', trigger: 'blur'}]
        },
        {
          $type: 'input',
          $id: 'cardValue',
          label: '卡券面额',
          $el: {
            placeholder: '请输入卡券面额'
          },
          rules: [{required: true, message: '请输入卡券面额', trigger: 'blur'}]
        },
        {
          $type: 'input',
          $id: 'cardPrice',
          label: '售价',
          $el: {
            placeholder: '请输入售价'
          },
          rules: [{required: true, message: '请输入售价', trigger: 'blur'}]
        },
        {
          id: 'headImg',
          label: '上传封面',
          $type: 'UploadToAli',
          $default: '',
          // 全局注册的第三方组件
          component: UploadToAli
        },
        {
          id: 'logoImg',
          label: '上传logo',
          $type: 'UploadToAli',
          $default: '',
          // 全局注册的第三方组件
          component: UploadToAli
        },
        {
          id: 'applyStore',
          type: 'select',
          label: '适用门店',
          el: {
            placeholder: '请选择适用门店',
            multiple: true
          },
          rules: [{required: true, message: '请选择适用门店', trigger: 'blur'}],
          options: [
            {
              label: '门店一',
              value: '门店一'
            },
            {
              label: '门店二',
              value: '门店二'
            }
          ]
        },
        {
          id: 'shopScope',
          type: 'select',
          label: '可用商品范围',
          el: {
            placeholder: '请选择可用商品范围',
            multiple: true
          },
          rules: [
            {required: true, message: '请选择可用商品范围', trigger: 'blur'}
          ],
          options: []
        }
      ],
      conditionVisible: false,
      saveLoading: false,
      storedLoading: false,
      rules: [],
      tagRule: RULE,
      tagTypeList: [],
      conditionList: [],
      detailInfo: {}
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
    // this.getTagType()
    // // 编辑/查看都获取详情数据
    // if (this.id) this.getstoredDetail()
    // // 查看禁用
    // if (this.isView) {
    //   this.content.forEach(val => {
    //     if (val.$type !== RADIO) val.$el.disabled = true
    //   })
    // }
    this.$axios
      .$get(`${commonList}?collection=goods&clean=true`)
      .then(res => {
        let data = res.payload
        data.map(item => {
          let obj = {
            label: item.name,
            value: item.name
          }
          this.content[6].options.push(obj)
        })
      })
      .catch(e => {
        // this.saveLoading = false
      })
  },
  methods: {
    // 新增/编辑自定义标签
    save() {
      this.$refs.storedForm.validate(valid => {
        if (!valid) return
        let data = Object.assign(
          {
            couponID: new Date().getTime(),
            validityTerm: this.validityTerm,
            writeOffMethod: this.writeOffMethod,
            effectTiem: this.effectTiem,
            effectiveTiem: this.effectiveTiem,
            value4: this.value4.join('~'),
            cardType: '礼品卡',
            couponState: '启用',
            grantNum: 0,
            notes: this.notes,
            instructions: this.instructions,
            useRestrictions: this.useRestrictions,
            stockNum: 0
          },
          this.$refs.storedForm.getFormValue()
        )

        this.$store.commit('addcouponData', data)
        this.$message.success('操作成功')
        this.$router.push('list')
        console.log(
          'this.$refs.storedForm.getFormValue()',
          this.$store.state.couponData
        )
      })
    }
  }
}
</script>
<style lang="less">
.stored-add {
  border: 1px solid #ebebeb;
  &-label {
    width: 120px;
    text-align: right;
  }
  .el-input {
    width: 400px;
  }
  .el-select {
    width: 400px;
  }
  .el-form-item {
    &-label {
      width: 120px;
      text-align: right;
    }
  }
  &-title {
    position: relative;
    padding-left: 10px;
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    background: #ebebeb;
  }
}
</style>
