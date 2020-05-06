<!-- 编辑属性 -->
<template>
  <div>
    <add-property v-if="id" :propertyId="id" />
  </div>
</template>
<script>
import AddProperty from '@/views/add-edit-property/index.vue'
export default {
  components: {
    AddProperty
  },
  data() {
    return {
      id: ''
    }
  },
  created() {
    const {id} = this.$route.query || {}
    this.id = id
  }
}
</script>
