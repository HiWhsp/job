<template>
  <div class="page-footer">
    <div class="web-footer">
      <div class="footer-center">
        <div class="nav-group">
          <div class="group-item">
            <div class="group-title">会员服务</div>
          </div>
          <div class="col-line"></div>
          <div class="group-item">
            <div class="group-title">企业视窗</div>
          </div>
          <div class="col-line"></div>
          <div class="group-item">
            <div class="group-title">关于我们</div>
          </div>
          <div class="col-line"></div>
          <div class="group-item">
            <div class="group-title">联系我们</div>
          </div>
        </div>
      </div>
    </div>

    <div class="beian-box">
      <div class="beian-ctx">
        <div>
          Copyright © 2025 Bjx.com.cn All Rights
          Reserved. 北京XXXXXX网络技术有限公司 版权所有
        </div>
        <div>
          <!-- <img src="@img/footer/beian.png" alt="" /> -->
          京ICP证080169号京ICP备09003304号-2京公网安备11010502034458号电子公告服务专项备案
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "web-footer",
  components: {},
  props: [],
  data() {
    return {
      info_return: {},
      info_ship: {},
    };
  },
  computed: {
    address_list() {
      let arr = (this.vuex_config.comAddress || "").split("||");
      return arr;
    },
  },
  watch: {},

  created() {
    this.setView();
  },

  methods: {
    setView() {},
    toNav(item) {
      this.$router.push(item.route);
    },
  },
};
</script>

<style scoped lang="less" src="./page-footer-ellsenn.less"></style>
