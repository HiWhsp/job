<template>
  <div class="help-page">
    <div class="help-header">
      <p>帮助中心</p>
    </div>
    <div class="help-content">
      <div class="help-content-top">
        <img src="@/assets/img/company/help/icon.png" alt="" />
        <p>帮助中心</p>
      </div>
      <div class="help-content-bottom" v-html="vuex_config.help_center"></div>
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
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
@import "./help.less";
</style>
<style scoped lang="less" src="@/assets/h5css/help.less"></style>

