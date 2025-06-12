<template>
  <div class="page-footer">
    <div class="web-footer">
      <div class="footer-left">
        <div class="left-info">
          <div class="left-item">
            <img class="left-logo" src="@img/common/ellsenn-logo.png" alt="" />
            <div class="left-articles">
              <div class="article-item">
                <img src="@img/footer/phone.png" alt="" />
                <router-link to="/">
                  {{ vuex_config.mobile }}
                </router-link>
              </div>
              <div class="article-item">
                <img src="@img/footer/email.png" alt="" />
                <router-link to="/">
                  {{ vuex_config.email }}
                </router-link>
              </div>
              <div class="article-item">
                <img src="@img/footer/map.png" alt="" />
                <router-link to="/">
                  {{ vuex_config.address }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-center">
        <div class="nav-group">
          <div class="group-item">
            <div class="group-title">研究报告</div>
            <div class="info-box">
              <div class="info-item">
                <router-link to="/terms?id=102">拆解报告</router-link>
              </div>
              <div class="info-item">
                <router-link to="/terms?id=103">销量报告</router-link>
              </div>
              <div class="info-item">
                <router-link to="/terms?id=104">技术报告</router-link>
              </div>
              <div class="info-item">
                <router-link to="/terms?id=105">应用报告</router-link>
              </div>
              <div class="info-item">
                <router-link to="/terms?id=106">定制研究</router-link>
              </div>
            </div>
          </div>
          <div class="group-item">
            <div class="group-title">新闻洞察</div>
            <div class="info-box"></div>
          </div>
          <div class="group-item">
            <div class="group-title">维深测评</div>
            <div class="info-box"></div>
          </div>
          <div class="group-item">
            <div class="group-title">产业活动</div>
            <div class="info-box"></div>
          </div>
          <div class="group-item">
            <div class="group-title">维深榜单</div>
            <div class="info-box"></div>
          </div>
          <div class="group-item">
            <div class="group-title">关于我们</div>
            <div class="info-box"></div>
          </div>
          <div class="group-item">
            <div class="group-title">关注我们</div>
            <div class="info-box">
              <div class="card-group">
                <div class="card-img">
                  <img :src="vuex_config.gzh_logo" alt="" />
                  <span>扫码关注微信公众号</span>
                </div>
                <div class="card-img">
                  <img :src="vuex_config.qrcode" alt="" />
                  <span>扫码咨询合作事宜</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="beian-box">
      <div class="beian-ctx">
        <div>{{ vuex_config.beian }}</div>
        <div>
          <img src="@img/footer/beian.png" alt="" />
          {{ vuex_config.jinggonganbei }}
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
