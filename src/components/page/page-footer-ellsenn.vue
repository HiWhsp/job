<template>
  <div class="page-footer">
    <div class="web-footer">
      <div class="footer-center">
        <div class="nav-group">
          <div class="group-item" @click="toNav({ route: '/help?type=1' }, '会员服务')">
            <div class="group-title">Member Services</div>
          </div>
          <div class="col-line"></div>
          <div class="group-item" @click="toNav({ route: '/help?type=2' }, '企业视窗')">
            <div class="group-title">Business Window</div>
          </div>
          <div class="col-line"></div>
          <div class="group-item" @click="toNav({ route: '/help?type=3' }, '关于我们')">
            <div class="group-title">About Us</div>
          </div>
          <div class="col-line"></div>
          <div class="group-item" @click="toNav({ route: '/help?type=4' }, '联系我们')">
            <div class="group-title">Contact Us</div>
          </div>
        </div>
      </div>
    </div>

    <div class="beian-box">
      <div class="beian-ctx">
        <div>{{ vuex_config.banquan }}</div>
        <div>
          <!-- <img src="@img/footer/beian.png" alt="" /> -->
          {{ vuex_config.beian_mainpage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
    ...mapState(["vuex_config"]),
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
    toNav(item, title) {
      localStorage.setItem("help_type", title);
      this.$router.push(item.route);
    },
  },
};
</script>

<style scoped lang="less" src="./page-footer-ellsenn.less"></style>
