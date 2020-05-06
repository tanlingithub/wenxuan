<template>
  <div class="breadcrumb">
    <div class="breadcrumb-inner" :style="mainStyle">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          class="default"
          :class="{active: index === breadCrumbList.length - 1}"
          :to="getPath(item, index)"
          v-for="(item, index) in breadCrumbList"
          :key="index"
          >{{ item.name }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

import {Breadcrumb, BreadcrumbItem} from 'element-ui'

export default {
  name: 'BreadCrumb',
  components: {
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem
  },
  props: {
    mainStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapState(['breadCrumbList'])
  },
  methods: {
    getPath(item, index) {
      return index === this.breadCrumbList.length - 1
        ? ''
        : item.url
        ? {path: item.url}
        : ''
    }
  }
}
</script>
<style lang="less">
.breadcrumb {
  padding: 22px 0;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;

  .breadcrumb-inner {
    padding: 0 20px;
    transition: max-width 0.3s ease;
  }

  .default {
    span {
      color: rgba(0, 0, 0, 0.45);
    }
  }

  .active {
    span {
      font-weight: bold !important;
    }
  }
}
</style>
