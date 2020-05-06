<template>
  <type-container title="详细描述">
    <el-form-renderer
      :content="detailContent"
      :disabled="disabled"
      label-width="90px"
      ref="detailInfo"
    >
    </el-form-renderer>
  </type-container>
</template>

<script>
import TypeContainer from './type-container'
import UploadToAliWrap from './upload-to-ali-wrap'
import DetailEditor from './detail-editor'
// `terminal_type` TINYINT(4) NOT NULL COMMENT '终端类型 1:PC 2:移动端',
const TERMINAL_TYPE = {
  PC: 1,
  移动端: 2
}

// `attachment_type` TINYINT(4) NOT NULL COMMENT '商品附件类型， 1:图片  2:视频',
const ATTACHMENT_TYPE = {
  图片: 1,
  视频: 2
}

export default {
  name: 'DetailInfo',
  components: {
    TypeContainer
  },
  props: {
    disabled: Boolean
  },
  data() {
    return {
      detailContent: [
        {
          $id: 'commodityImg',
          label: '商品图片',
          $el: {
            style: 'width:35%',
            placeholder: '请输入',
            max: 15,
            multiple: true,
            preview: true,
            info: '建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传15张'
          },
          rules: [{required: true, message: '请选择商品图片', trigger: 'blur'}],
          component: UploadToAliWrap
        },
        {
          $id: 'commodityVideo',
          label: '商品视频',
          $el: {
            style: 'width:35%',
            placeholder: '请输入',
            accept: 'video/*',
            size: Number.MAX_SAFE_INTEGER,
            info: '目前仅支持在手机端播放，建议时长9-30秒，建议视频宽高比16:9'
          },
          component: UploadToAliWrap
        },
        {
          $id: 'detailDesc',
          label: '详情描述',
          $el: {
            style: 'width:85%',
            placeholder: '请输入'
          },
          component: DetailEditor
        }
      ],
      pcDetail: {}, // 编辑的时候原来的PC信息
      mobileDetail: {}, // 编辑的时候原来的手机信息
      commodityVideo: {}, // 编辑的时候的原来video的信息
      commodityImg: [] // 编辑的时候原来的Img信息
    }
  },
  methods: {
    // 设置form的值
    setFormValue(params) {
      const {goodsDetail, goodsAttachment} = params || {}
      let detailDesc = []
      let commodityVideo = ''
      let commodityImg = []
      let commodityImgArr = []

      goodsDetail &&
        goodsDetail.forEach(info => {
          const {terminalType, detailContent} = info
          if (terminalType == TERMINAL_TYPE['PC']) {
            detailDesc[0] = detailContent
            this.pcDetail = info
          } else if (terminalType == TERMINAL_TYPE['移动端']) {
            detailDesc[1] = detailContent
            this.mobileDetail = info
          }
        })
      goodsAttachment &&
        goodsAttachment.forEach(info => {
          const {attachmentType, attachmentPath} = info
          if (attachmentType == ATTACHMENT_TYPE['图片']) {
            commodityImg.push(attachmentPath)
            commodityImgArr.push(info)
          } else if (attachmentType == ATTACHMENT_TYPE['视频']) {
            commodityVideo = attachmentPath
          }
        })
      this.commodityImg = commodityImgArr
      this.commodityVideo = commodityVideo

      this.$refs.detailInfo.updateForm({
        detailDesc,
        commodityVideo,
        commodityImg
      })
    },
    // 去除form的值
    async getFormValue() {
      const $detailInfo = this.$refs.detailInfo
      // `terminal_type` TINYINT(4) NOT NULL COMMENT '终端类型 1:PC 2:移动端',
      // `attachment_type` TINYINT(4) NOT NULL COMMENT '商品附件类型， 1:图片  2:视频',
      try {
        const valiDetailInfo = await $detailInfo.validate()
        if (valiDetailInfo) {
          const {
            commodityImg,
            commodityVideo,
            detailDesc
          } = $detailInfo.getFormValue()
          let goodsDetail = []
          let goodsAttachment = []
          commodityImg &&
            commodityImg.forEach(info => {
              const currentImg =
                this.commodityImg.find(
                  inner => inner.attachmentPath === info
                ) || {}
              goodsAttachment.push({
                ...currentImg,
                attachmentType: ATTACHMENT_TYPE['图片'],
                attachmentPath: info
              })
            })
          const deleteGoodsAttachmentIds = this.commodityImg
            .filter(info => {
              return !goodsAttachment.find(
                inner => inner.attachmentPath === info.attachmentPath
              )
            })
            .map(info => info.id)
            .join(',')
          if (commodityVideo) {
            goodsAttachment.push({
              ...this.commodityVideo,
              attachmentType: ATTACHMENT_TYPE['视频'],
              attachmentPath: commodityVideo
            })
          }
          const pcDetailContent =
            detailDesc && detailDesc[0] ? detailDesc[0] : ''
          const mobileDetailContent =
            detailDesc && detailDesc[1] ? detailDesc[1] : ''

          goodsDetail.push({
            ...this.pcDetail,
            terminalType: TERMINAL_TYPE['PC'],
            detailContent: pcDetailContent
          })
          goodsDetail.push({
            ...this.mobileDetail,
            terminalType: TERMINAL_TYPE['移动端'],
            detailContent: mobileDetailContent
          })
          // TODO 将删除的图片更改

          // 将返回form表单的值
          return {
            goodsDetail,
            goodsAttachment,
            deleteGoodsAttachmentIds
          }
        } else {
          this.$notify.error('请填写完整信息')
          return null
        }
      } catch (err) {}
    },
    // 重置form表单的值
    resetFormValue() {
      this.$refs.detailContent.resetFields()
    }
  }
}
</script>
