<template>
  <div class="help-page">
    <div class="help-header">
      <p>平台协议</p>
    </div>
    <div class="help-content">
      <div class="help-content-top">
        <img src="@/assets/img/company/help/icon2.png" alt="" />
        <p>平台协议</p>
      </div>
      <div class="help-content-bottom" v-html="vuex_config.pingtai_xieyi"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Help",
  computed: {
    ...mapState("vuex_config"),
  },
};
</script>

<style lang="less" scoped>
@import "./help.less";
</style>
