<template>
  <el-breadcrumb class="v-breadcrumb" :separator="attrs.separator" v-if="chain">
    <el-breadcrumb-item
      class="v-breadcrumb-item"
      v-for="(item, index) in chain"
      :key="item.id"
    >
      <router-link
        class="link"
        v-if="
          !item.disabled &&
            item.redirectPath !== currentNode.path &&
            index !== chain.length - 1
        "
        :to="{path: item.path || item.redirectPath}"
        >{{ replaceHolder(item.title) }}</router-link
      >
      <span class="link disabled" v-else>{{ replaceHolder(item.title) }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import {Breadcrumb, BreadcrumbItem} from 'element-ui'
import Tree from './tree.js'
import data from './config'
// 占位符标识
const breadcrumbHodlderTxt = 'breadcrumb_hodlderTxt_'

export default {
  name: 'VBreadcrumb',
  components: {
    elBreadcrumb: Breadcrumb,
    elBreadcrumbItem: BreadcrumbItem
  },
  props: {
    url: String,
    attrs: {
      type: Object,
      default() {
        return {
          separator: '/'
        }
      }
    },
    setCustomChain: {
      type: Function
    }
  },
  data() {
    return {
      treeData: new Tree(data)
    }
  },
  computed: {
    currentNode() {
      return this.treeData.findNodeByType(this.$route.path, 'path')
    },
    chain() {
      if (this.setCustomChain && typeof this.setCustomChain === 'function') {
        return this.setCustomChain(this.treeData, this.$route.path, 'path')
      }
      let chain = this.treeData.getFullChainByType(this.$route.path, 'path')
      chain = chain ? chain.filter(item => !item.hide) : []
      return chain.length > 0 ? chain : false
    },
    ...mapGetters({
      getBreadcrumbPlaceholder: 'permission/getBreadcrumbPlaceholder'
    })
  },
  methods: {
    replaceHolder(txt) {
      if (txt.indexOf(breadcrumbHodlderTxt) < 0) {
        // 如果没有占位符，直接返回
        return txt
      }

      // 解析占位符
      const index = txt.replace(breadcrumbHodlderTxt, '')
      if (!(+index >= 0)) {
        throw new Error('请输入正常的位置参数')
        return
      }

      // 返回vuex中保存相应占位符的字符串
      return this.getBreadcrumbPlaceholder(index)
    },

    // 设置面包屑组件占位符
    // array eg [{index: 0, replaceTxt: '构建发布'}]
    // index 占位符位置
    // replaceTxt 占位符替换文本
    setBreadcrumbPlaceholders(array) {
      this.setBreadcrumbPlaces(array)
    },
    ...mapMutations({
      setBreadcrumbPlaces: 'permission/setBreadcrumbPlaces'
    })
  }
}
</script>

<style lang="less">
.v-breadcrumb {
  line-height: 50px;

  .v-breadcrumb-item {
    .link {
      color: #2d303b;
      font-size: 14px;
      font-weight: normal;

      &.disabled {
        cursor: not-allowed;
      }
    }

    &:last-child {
      .link {
        color: #5d81f9;
      }
    }

    &:first-child {
      .link {
        color: #2d303b;
      }
    }
  }
}
</style>
