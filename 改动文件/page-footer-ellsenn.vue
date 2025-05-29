<template>
  <div class="page-footer">
    <!-- <div class="logo-wrap">
      <div class="left-logo">
        <img :src="vuex_config.comLogo" alt="" />
      </div>
    </div> -->

    <div class="web-footer">
      <div class="footer-left">
        <div class="left-info">
          <div class="left-item">
            <div class="left-label">
              <router-link to="/about" class="group-title">
                关于我们
              </router-link>
            </div>
            <div class="left-text">
              我们希望我们的完美模型能给世界各地的收藏家带来惊喜，这样他们也能体验到拥有独家物品的不可思议的情感。通过传统与创新之间的微妙平衡，我们努力表达意大利制造的所有优雅、风格和创造力…
            </div>

            <div class="left-articles">
              <div class="article-item">
                <router-link to="/terms?id=100">
                  {{ info_return.title }}
                </router-link>
              </div>
              <div class="article-item">
                <router-link to="/terms?id=101">
                  {{ info_ship.title }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-center">
        <div class="nav-group">
          <div class="group-item">
            <div class="group-title">
              <router-link to="/contact" class="group-title">
                联系我们
              </router-link>
            </div>

            <div class="info-box">
              <div class="info-item">
                <span>
                  <a target="_blank" :href="'https://wa.me/' + vuex_config.comPhone">
                    {{ vuex_config.comPhone }}
                  </a>
                </span>
              </div>

              <div class="info-item">
                支付方式
            
              </div>

              <div class="info-item">
                <!-- <img src="@img/common/foot-addr.png" alt=""> -->
                <div class="desc-box">
                  <div class="desc-item" v-for="(item, index) in address_list">
                    {{ item }}
                  </div>
                </div>

                <!-- <span> 
                  {{ vuex_config.comAddress }}
                </span> -->
              </div>

              <div class="links" >
                <a href="">
                  <!-- <img src="@img/common/foot-link1.png" alt=""> -->
                </a>
                <a href="">
                  <!-- <img src="@img/common/foot-link2.png" alt=""> -->
                </a>
                <a href="">
                  <!-- <img src="@img/common/foot-link3.png" alt=""> -->
                </a>
              </div>
            </div>
          </div>

          <div class="group-item">
            <div class="group-title">
              时事通讯
            </div>
        
          </div>
        </div>
      </div>
  
    </div>

    <div class="beian-box">
      <div class="beian-ctx">
        <div >
          深圳市维深信息技术版权所有V-Eglish-------京Icp备17078888号-1
        </div>
        <div>V-Eglish-------京公网安备 11010502048888号</div>
        <!-- <a href="https://beian.miit.gov.cn/" target="_blank">© Copyright 2024 COMPANY NAME. All Rights Reserved.</a> -->
        <!-- <a href="https://beian.miit.gov.cn/" target="_blank"> {{ vuex_config.comBeian }} </a> -->
        <!-- <span>{{ vuex_config.comBeian }}</span> -->
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
      info_return: {

      },
      info_ship: {

      },
    };
  },
  computed: {
    // ...mapState(['']),
    address_list() {
      let arr = (this.vuex_config.comAddress || '').split('||')
      return arr
    }
  },
  watch: {},

  created() {
    this.setView()
  },

  methods: {
    setView() {
      //退货政策
      //配送方式
      // this.query_refund_ship()
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_detail",
          id: 100
        }
      })
        .then((res) => {
          if (res.code == 200) {
            this.info_return = res.data.info;
          }
        });
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_detail",
          id: 101
        }
      })
        .then((res) => {
          if (res.code == 200) {
            this.info_ship = res.data.info;
          }
        });
    },
    toNav(item) {
      this.$router.push(item.route)
    }
  },
};
</script>


<style scoped lang="less" src="./page-footer-ellsenn.less"></style>
<style scoped lang="less" src="@/assets/h5css/zujian/pageFooter.less"></style>
