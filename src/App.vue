<template>
  <div id="root-wrap">
    <router-view></router-view>
    <FloatingSidebar />
  </div>
</template>

<script>
import FloatingSidebar from '@/components/common/FloatingSidebar.vue'

export default {
  components: {
    FloatingSidebar
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="less">
* {
  box-sizing: border-box;
  list-style: none;
  padding: 0;
  margin: 0;
}
body {
  background-color: #fff;
  font-size: 14px;
  text-align: left;
}
.el-message{
  .el-message__icon{
    font-size: 20px;

  }
  .el-message__content{
    font-size: 20px;
  }
}
</style>
