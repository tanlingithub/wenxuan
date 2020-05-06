<template>
  <!-- 类目信息 -->
  <div class="category-info-container" v-loading="loadingDetail">
    <div class="header">
      <span>
        查看类目信息
      </span>
      <span v-if="ifEdit" class="submit-button">
        <el-button
          type="text"
          class="el-icon-check button-primary"
          @click="saveInfo"
        ></el-button>
        <el-button
          type="text"
          class="el-icon-close button-danger"
          @click="cancelChange"
        ></el-button>
      </span>
      <el-button
        type="text"
        v-else
        class="el-icon-edit-outline edit-icon"
        @click="ifEdit = true"
      ></el-button>
    </div>

    <el-row class="block__body-row" :gutter="0">
      <el-col :span="8">
        <span class="block__body-item">
          <span class="item-left">类目编号：</span>
          <el-input
            v-if="ifEdit"
            style="width: 200px;"
            v-model="detailInfo.id"
            disabled
          />
          <span v-else class="item-right">{{ detailInfo.id }}</span>
        </span>
      </el-col>
      <el-col :span="8">
        <span class="block__body-item">
          <span class="item-left">类目名称：</span>
          <el-input
            v-if="ifEdit"
            style="width: 200px;"
            v-model="editInfo.name"
            clearable
          />
          <span v-else class="item-right">{{ detailInfo.name }}</span>
        </span>
      </el-col>
      <el-col :span="8">
        <span class="block__body-item">
          <span class="item-left">是否启用：</span>
          <el-switch v-if="ifEdit" v-model="editInfo.enabled"> </el-switch>
          <span v-else class="item-right">{{
            detailInfo.enabled ? '是' : '否'
          }}</span>
        </span>
      </el-col>
    </el-row>

    <el-row class="block__body-row" :gutter="0">
      <el-col :span="8">
        <span class="block__body-item">
          <span class="item-left">叶子节点：</span>
          <el-radio-group v-if="ifEdit" v-model="editInfo.leaf">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <span v-else class="item-right">{{
            detailInfo.leaf ? '是' : '否'
          }}</span>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getBackCategorysDetail,
  putBackCategorysDetail
} from '@/service/spaas-commodity-center.js'

export default {
  name: 'CategoryInfo',
  props: {
    categoryId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      detailInfo: {},
      loadingDetail: false,
      editInfo: {},
      ifEdit: false
    }
  },
  watch: {
    categoryId(val) {
      this.getDetailInfo(val)
    }
  },
  mounted() {
    this.getDetailInfo(this.categoryId)
  },
  methods: {
    // 请求类目详情
    getDetailInfo(id) {
      this.loadingDetail = true
      getBackCategorysDetail(id)
        .then(({code, payload}) => {
          if (code === '0' && payload) {
            this.detailInfo = payload
            const {name, enabled, leaf} = payload
            this.editInfo = {
              name,
              enabled,
              leaf
            }
          }
        })
        .finally(_ => {
          this.loadingDetail = false
        })
    },
    // 保存详情信息
    saveInfo() {
      this.loadingDetail = true
      putBackCategorysDetail({
        ...this.detailInfo,
        ...this.editInfo
      })
        .then(({code, msg}) => {
          if (code === '0' && msg === 'ok') {
            this.ifEdit = false
            this.detailInfo = {
              ...this.detailInfo,
              ...this.editInfo
            }
            this.$nextTick(() => {
              this.$emit('change', this.detailInfo)
            })
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败，请重试')
          }
        })
        .finally(_ => {
          this.loadingDetail = false
        })
    },
    // 取消更改信息
    cancelChange() {
      this.ifEdit = false
      const {name, enabled, leaf} = this.detailInfo
      this.editInfo = {
        name,
        enabled,
        leaf
      }
    }
  }
}
</script>

<style lang="less">
.category-info-container {
  padding: 10px 20px;

  .header {
    height: 50px;
    font-size: 18px;
    margin-bottom: 10px;

    > span:not(:last-child) {
      margin-right: 15px;
    }
  }

  .block__body-row {
    display: flex;
    align-items: center;

    .block__body-item {
      display: flex;
      align-items: center;

      .item-left {
        color: @--color-text-primary;
      }

      .item-right {
        color: @--color-text-secondary;
      }
    }

    &:not(:last-of-type) {
      margin-bottom: 25px;
    }
  }

  .edit-icon {
    font-size: 19px;
  }

  .submit-button {
    .button-primary {
      font-size: 19px;
      color: @--color-primary;
    }

    .button-danger {
      font-size: 19px;
      color: @--color-danger;
    }

    > span:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
