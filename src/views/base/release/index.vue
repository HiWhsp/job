<script>
import breadcrumb from "@/components/breadcrumb/index.vue";
export default {
  name: "index",
  components: {breadcrumb},
}
</script>

<template>
  <div class="container main">
    <breadcrumb
        :list="[{path: '/', name: '首页'}, { name: '服务内容'}, {path: '/release'}]"></breadcrumb>
  </div>
</template>

<style scoped lang="less">

</style>
