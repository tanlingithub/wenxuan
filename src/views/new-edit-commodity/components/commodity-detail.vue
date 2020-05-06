<template>
  <div class="commodity-detail-container">
    <basic-info ref="basicInfo" :propertyList="propertyList" />
    <detail-info ref="detailInfo" />
    <price-info ref="priceInfo" :initList="sizePropertyList" />
    <div class="foot-container">
      <el-button class="save-btn" type="primary" @click="addNewCommodity">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import BasicInfo from './form/basic-info'
import DetailInfo from './form/detail-info'
import PriceInfo from './form/price-info'
import {
  postCommodityGoods,
  getCategoryProperty
} from '@/service/spaas-commodity-center'
import {treeToArray} from '../../../utils/tree-utils'
import {ATTRIBUTE_TYPES} from '@/const/dictionary.js'

export default {
  components: {
    BasicInfo,
    DetailInfo,
    PriceInfo
  },
  data() {
    return {
      propertyList: null, // 自定义属性列表
      sizePropertyList: null // 销售商品规格
    }
  },
  props: {
    categoryId: {
      required: true
    }
  },
  created() {
    // 请求属性列表树，并将其扁平化
    this.fetchPropertyTree()
  },
  methods: {
    // 新建商品
    async addNewCommodity() {
      // this.$refs.basicInfo.resetFormValue();
      const basicInfoValue = await this.$refs.basicInfo.getFormValue()
      const detailInfoValue = await this.$refs.detailInfo.getFormValue()
      const priceInfoValue = await this.$refs.priceInfo.getFormValue()

      // 因为都很快拿到数据，所以就不用Promise.all写了
      if (basicInfoValue && detailInfoValue) {
        const {goodsPropertyValue = []} = basicInfoValue
        const {extGoodsPropertyValue = []} = priceInfoValue
        const newList = goodsPropertyValue.concat(extGoodsPropertyValue)

        const res = await postCommodityGoods({
          categoryId: this.categoryId,
          ...basicInfoValue,
          ...detailInfoValue,
          ...priceInfoValue,
          goodsPropertyValue: newList,
          status: 4
        })
        const {payload, code} = res.data
        if (payload && code === '0') {
          this.$emit('handle-next')
        } else {
          this.$notify.error('保存失败，请重试')
        }
      } else {
        this.$notify.error('请填写完整信息')
      }
    },
    // 请求属性列表树
    fetchPropertyTree() {
      const params = {
        size: 999,
        relation: true,
        page: 1
      }
      getCategoryProperty({id: this.categoryId}, params).then(res => {
        const {code, payload} = res.data
        if (code === '0' && payload) {
          // 将树扁平化
          const propertyList = treeToArray(
            payload,
            {parentId: 'parentId', level: 0, children: 'children'},
            true
          )
          this.propertyList = propertyList
          // 设置默认值列表
          this.sizePropertyList = propertyList.filter(
            info => info.propertyTypes
          )
        }
      })
    }
  }
}
</script>

<style lang="less">
.commodity-detail-container {
  padding: 20px;

  .el-textarea {
    width: 35%;
  }

  .foot-container {
    padding: 20px 0;
    display: flex;
    justify-content: center;

    .save-btn {
      width: 200px;
    }
  }
}
</style>
