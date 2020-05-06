<template>
  <div class="stored-add">
    <!-- v-loading不能放在最外层的节点，不然是全屏loading -->
    <p class="stored-add-title">卡劵发放</p>
    <el-form
      label-width="120px"
      :rules="rules"
      ref="cardForm"
      :model="upInfoForm"
    >
      <el-form-item label="选择卡券" prop="card">
        <el-select v-model="upInfoForm.dimensionType" placeholder="请选择">
          <el-option label="实体卡" value="实体卡"></el-option>
          <el-option label="电子卡" value="电子卡"></el-option>
        </el-select>
        <el-select v-model="upInfoForm.cardType" placeholder="请选择">
          <el-option label="礼品劵" value="礼品劵"></el-option>
          <el-option label="储值卡" value="储值卡"></el-option>
        </el-select>
        <el-select v-model="upInfoForm.cardItem" placeholder="请选择">
          <el-option label="200元好礼" value="200元好礼"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发放门店" prop="sendStore">
        <el-select
          v-model="upInfoForm.sendStore"
          @change="storeChange"
          placeholder="请选择"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item, index) in storeOptions"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上架卡段号" prop="upCardNumber">
        LPKDZ00000345~
        <el-input
          style="margin-right:20px;"
          v-model="upInfoForm.upCardNumber"
        ></el-input
        >(120张)
        <el-button type="primary" style="margin-left:20px;" @click="searchCard"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <!-- <el-data-table style="width: 80%; margin-left: 10%;" ref="customTable" v-bind="customTagConfig"></el-data-table> -->
    <div class="box" style="width: 80%; margin-left: 50px;margin-bottom:50px;">
      <el-editable
        v-loading="loading"
        border
        ref="cardTable"
        :data="cardTable"
        :editable-method="editableMethod"
        :columns="cardShareColums"
      ></el-editable>
      <el-pagination
        align="right"
        style="margin-top:10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.page"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
      <el-form label-width="0px">
        <el-form-item v-if="!isView">
          <el-button type="primary" @click="save" :loading="loading"
            >卡券发放</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  segmentList,
  tagList,
  tagTypeList,
  ruleList,
  commonAddOne
} from '@/const/api'
import {cardShareColums} from '@/const/card'
import UploadToAli from '@femessage/upload-to-ali'
import ElEditable from '@/components/el-editable'

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
const storeOptions = [
  {
    label: '广州门店',
    value: '广州门店'
  },
  {
    label: '东莞门店',
    value: '东莞门店'
  },
  {
    label: '深圳门店',
    value: '深圳门店'
  }
]

export default {
  name: 'stored-edit',
  components: {
    UploadToAli,
    ElEditable
  },
  data() {
    const checkPlatType = (rule, value, callback) => {
      // if (!this.productForm.platformPrimaryCategoryId || !this.productForm.platformSecondCategoryId || !this.productForm.platformThirdCategoryId) {
      if (
        !this.upInfoForm.dimensionType ||
        !this.upInfoForm.cardType ||
        !this.upInfoForm.cardItem
      ) {
        // callback('平台类型不可为空')
        return callback(new Error(false))
      }
      return callback()
    }
    return {
      storeOptions,
      flag: true,
      upInfoForm: {
        upCardNumber: '',
        dimensionType: '',
        cardType: '',
        cardItem: '',
        sendStore: ''
      },
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      cardShareColums,
      cardTable: [],
      conditionVisible: false,
      loading: false,
      storedLoading: false,
      rules: {
        card: [
          {
            required: true,
            message: '请输入具体卡券',
            trigger: 'change',
            validator: checkPlatType
          }
        ],
        sendStore: [{required: true, message: '请选择门店', trigger: 'change'}],
        upCardNumber: [{required: true, message: '请输入卡号', trigger: 'blur'}]
      },
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
  mounted() {},
  methods: {
    storeChange(v) {
      this.$refs.cardTable.data.forEach(item => {
        item.store = v
      })
    },
    editableMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex == 1) {
        return {
          $type: 'el-select',
          $options: storeOptions
        }
      }
    },
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    searchCard() {
      if (!this.upInfoForm.upCardNumber) {
        this.$message.error('卡短号不可为空')
        return
      }
      if (!this.upInfoForm.sendStore) {
        this.$message.error('默认发放门店不可为空')
        return
      }
      this.loading = true
      this.$axios.get(segmentList).then(res => {
        let resArr = res.data.payload.content
        if (this.upInfoForm.sendStore) {
          resArr.forEach(item => {
            item.store = this.upInfoForm.sendStore
          })
        } else {
          resArr.forEach(item => {
            item.store = ''
          })
        }
        this.cardTable = resArr
        this.page.total = res.data.payload.content.length
        this.loading = false
      })
    },
    save() {
      this.$refs.cardForm.validate(valid => {
        if (valid) {
          if (this.$refs.cardTable.data.length === 0) {
            this.$message.error('发放卡券不可为空')
            return
          }
          this.$axios
            .post(commonAddOne('cardSendStore'), {
              cardInfo: this.upInfoForm,
              cardTable: this.$refs.cardTable.data,
              id: new Date().getTime()
            })
            .then(res => {
              this.$message.success('发放卡券成功')
              this.$router.push({
                path: '/card-store/grant'
              })
            })
        }
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
    width: auto;
  }
  .el-select {
    width: auto;
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
