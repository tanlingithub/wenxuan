<template>
  <div class="segment-edit">
    <!-- v-loading不能放在最外层的节点，不然是全屏loading -->
    <p class="segment-edit-title">卡号段设置</p>
    <el-form
      v-loading="segmentLoading"
      ref="segmentForm"
      label-width="100px"
      :model="segmentForm"
    >
      <el-form-item label="卡卷类型" prop="cardType">
        <el-radio-group v-model="segmentForm.cardType">
          <el-radio label="储值卡"></el-radio>
          <el-radio label="礼品卡"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="卡卷类型" prop="cardMedium">
        <el-radio-group v-model="segmentForm.cardMedium">
          <el-radio label="实体卡"></el-radio>
          <el-radio label="电子卡"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="卡券位数" prop="cardNumLength">
        <!-- <el-input type="number" min="2" max="20" v-model="segmentForm.cardNumLength"></el-input> -->
        <el-input-number
          v-model="segmentForm.cardNumLength"
          :min="2"
          :max="20"
        ></el-input-number>
        <span>位，2-20位</span>
      </el-form-item>
      <el-form-item label="卡券前缀">
        <el-input
          v-model="segmentForm.cardNumFront"
          :maxlength="segmentForm.cardNumLength - 2"
        ></el-input>
        <span
          >{{ cardNumFrontLen }}/{{
            segmentForm.cardNumLength - 2
          }},支持英文大小写</span
        >
      </el-form-item>
      <el-form-item label="卡券号范围">
        <span
          >数字最多({{
            segmentForm.cardNumLength - cardNumFrontLen
          }})位，从</span
        >
        <el-input
          v-model="segmentForm.cardNumFirst"
          :maxlength="segmentForm.cardNumLength - cardNumFrontLen"
        ></el-input>
        <span>连续发号，前方补零</span>
      </el-form-item>
      <el-form-item v-if="!isView">
        <el-button type="primary" @click="save" :loading="saveLoading"
          >保存</el-button
        >
        <!-- <el-button @click="$router.back()">取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  tagList,
  tagTypeList,
  ruleList,
  firstTag,
  childrenTag,
  saveBigTag,
  editBigTag,
  bigTagDetail,
  commonAdd,
  segmentAdd
} from '@/const/api'

export default {
  name: 'add-segement',
  data() {
    return {
      content: [
        {
          $type: 'input',
          $id: 'cardNumLength',
          label: '卡劵位数',
          $el: {
            placeholder: '请输入数字',
            maxlength: 15
          },
          rules: [{required: true, message: '请输入分组', trigger: 'blur'}]
        },
        {
          $type: 'radio-group',
          $id: 'cardType',
          label: '卡卷类型',
          $default: '0',
          $options: [
            {label: '储值卡', value: '0'},
            {label: '礼品卡', value: '1'}
          ]
        },
        {
          $type: 'radio-group',
          $id: 'cardMedium',
          label: '卡介质',
          $default: '0',
          $options: [
            {label: '实体卡', value: '0'},
            {label: '电子卡', value: '1'}
          ]
        }
      ],
      segmentForm: {
        cardType: '储值卡',
        cardMedium: '实体卡',
        cardNumLength: 2,
        cardNumFront: '',
        cardNumFirst: ''
      },
      saveLoading: false,
      segmentLoading: false,
      rules: [],
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
    },
    cardNumFrontLen() {
      return this.segmentForm.cardNumFront.length
    }
  },
  watch: {
    cardNumFrontLen(newValue, oldValue) {
      console.log(newValue)
    }
  },
  mounted() {
    // this.getTagType()
    // // 编辑/查看都获取详情数据
    // if (this.id) this.getCustomDetail()
    // // 查看禁用
    // if (this.isView) {
    //   this.content.forEach(val => {
    //     if (val.$type !== RADIO) val.$el.disabled = true
    //   })
    // }
  },
  methods: {
    dataReform(data) {
      let minNumScope = (
        String(
          Array(
            data.cardNumLength -
              this.cardNumFrontLen -
              data.cardNumFirst.length +
              1
          ).join('0')
        ) + String(data.cardNumFirst)
      ).slice(-(data.cardNumLength - this.cardNumFrontLen))
      let maxNumScope = (
        Array(data.cardNumLength - this.cardNumFrontLen).join('9') + 9
      ).slice(-(data.cardNumLength - this.cardNumFrontLen))
      let cardNumScopeCount = maxNumScope - minNumScope
      let cardNumScope =
        data.cardNumFront + minNumScope + '-' + data.cardNumFront + maxNumScope
      let starCardNumber = data.cardNumFront + minNumScope
      let newData = {
        cardType: data.cardType,
        cardMedium: data.cardMedium,
        cardNumLength: data.cardNumLength,
        cardNumFront: data.cardNumFront,
        cardNumFirst: data.cardNumFirst,
        cardSegmentNumber: cardNumScope,
        starCardNumber: starCardNumber,
        segmentsNum: cardNumScopeCount,
        usedSegment: 0,
        usedSolidNum: 0,
        firstCardNumber: '',
        updataAt: new Date().getTime(),
        createdAt: new Date().getTime(),
        id: Date.parse(new Date()),
        segementID: new Date().getTime()
      }
      console.log('newData', newData)
      this.$store.commit('addSegment', newData)

      // this.$axios
      //   .$post(`${commonAdd}?collection=segments`, newData)
      //   .then(res => {
      //     this.$message.success('操作成功')
      //     this.saveLoading = false
      //     this.$router.push('segment-list')
      //     console.log('this.$store.state', this.$store.state.segmentInfo)
      //   })
      //   .catch(e => {
      //     this.saveLoading = false
      //   })

      this.$message.success('操作成功')
      this.saveLoading = false
      this.$router.push('segment-list')
      console.log('this.$store.state', this.$store.state.segmentInfo)
    },
    // 新增/编辑自定义标签
    save() {
      this.$refs.segmentForm.validate(valid => {
        if (!valid) return

        this.saveLoading = true
        const methods = this.id ? '$put' : '$post'
        // const url = this.id ? editBigTag : segmentAdd
        const url = segmentAdd

        let data = this.segmentForm
        this.dataReform(this.segmentForm)
      })
    }
  }
}
</script>
<style lang="less">
.custom-edit {
  &-restrictions {
    margin-top: 10px;

    .el-input {
      width: auto;
    }
  }
}
.segment-edit {
  border: 1px solid #ebebeb;

  .el-form {
    margin-right: 20px;
  }

  &-group {
    line-height: 36px;
    margin-bottom: 20px;

    .button {
      margin-right: 10px;
    }
  }
  .el-input {
    width: 200px;
  }

  &-label {
    width: 100px;
    text-align: right;
  }

  &-title {
    position: relative;
    padding-left: 10px;
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    background: #ebebeb;
  }

  &-button {
    margin: 20px;
  }

  .group-list {
    .el-tag {
      margin: 10px 10px 0 0;
    }
  }

  /deep/.el-input-number {
    width: 200px;
  }
  .removeImg {
    position: absolute;
    left: 190px;
    top: 5px;
  }
}
</style>
