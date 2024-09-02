<template>
  <div class="page-footer">
    <div class="logo-wrap">
      <div class="left-logo">
        <img src="@/static/common/foot-logo.png" alt="" />
      </div>
    </div>

    <div class="web-footer">
      <div class="footer-left">
        <div class="left-info">
          <div class="left-item">
            <div class="left-label">
              <router-link to="/about" class="group-title">
                About Us
              </router-link>
            </div>
            <div class="left-text">
              GreatWhip is a dynamic and high standard brand, we are committed to providing our customers with the best
              products and services, 7/24 full service.
            </div>
          </div>
        </div>
      </div>

      <div class="footer-center">
        <div class="nav-group">
          <div class="group-item">
            <div class="group-title">
              <router-link to="/contact" class="group-title">
                Contact Us
              </router-link>
            </div>


            <div class="info-box">
              <div class="info-item">
                <img src="@/static/common/foot-tel.png" alt="">
                <span> {{ vuex_config.comPhone }}</span>
              </div>
              <div class="info-item">
                <img src="@/static/common/foot-email.png" alt="">
                <span> {{ vuex_config.comAddress }}</span>
              </div>
              <div class="links">
                <a href="">
                  <img src="@/static/common/foot-link1.png" alt="">
                </a>
                <a href="">
                  <img src="@/static/common/foot-link2.png" alt="">
                </a>
                <a href="">
                  <img src="@/static/common/foot-link3.png" alt="">
                </a>
              </div>
            </div>
          </div>

          <div class="group-item">
            <div class="group-title">
              <router-link :to="vuex_product_cate_1.route" class="group-title">
                <!-- Cream Charger -->
                {{ vuex_product_cate_1.title }}
              </router-link>
            </div>
            <div class="group-title">
              <router-link :to="vuex_product_cate_2.route" class="group-title">
                <!-- Cream Dispenser -->
                {{ vuex_product_cate_2.title }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-right">
        <button class="btn-ripple fit-text btn-dingyue" @click="$router.push('/contact?apply=1')">Distributor</button>
      </div>
    </div>

    <div class="beian-box">
      <div class="beian-ctx">
        <div class="beian" v-html="vuex_config.comBeian">

        </div>
        <!-- <a href="https://beian.miit.gov.cn/" target="_blank">© Copyright 2024 COMPANY NAME. All Rights Reserved.</a> -->
        <!-- <a href="https://beian.miit.gov.cn/" target="_blank"> {{ vuex_config.comBeian }} </a> -->
        <!-- <span>{{ vuex_config.comBeian }}</span> -->
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
    return {};
  },
  computed: {
    ...mapState(["vuex_product_cate_1", 'vuex_product_cate_2']),

    groupList() {
      let arr = [
        { title: "关于石磨坊", route: "/companyProfile" },
        { title: "加入⽯磨坊", route: "/job", },
        { title: "联系我们", route: "/contact", },
        { title: "帮助中心", route: "/help", },
        { title: "使用条款", route: "/terms", },
      ];

      return arr;
    },
  },
  watch: {},

  created() { },

  methods: {
    toNav(item) {
      this.$router.push(item.route)
    }
  },
};
</script>

<style scoped lang="less">
.page-footer {
  width: 100%;
  min-height: 402px;
  padding-top: 40px;
  // background: #4CA5E4;
  background: #F9FAFC;
  color: #fff;
}



.logo-wrap {
  width: @width;
  margin: 0 auto;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 43px;

  .left-logo {
    text-align: left;

    img {
      width: 141px;
      height: 82px;
    }
  }
}

.web-footer {
  width: @width;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 60px;


  .footer-left {
    width: 640px;
    padding-right: 180px;

    .left-info {

      .left-item {
        margin-bottom: 10px;

        .left-label {
       
          a {
            font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 22px;
          color: #333333;
          }
        }

        .left-text {
          margin-top: 24px;
          font-family: OPPOSans, OPPOSans;
          font-weight: bold;
          font-size: 14px;
          color: #888888;
          line-height: 24px;
        }
      }
    }
  }

  .footer-center {
    flex: 1;
    display: flex;
    justify-content: space-evenly;
    padding-right: 100px;

    .nav-group {
      flex: 1;

      display: flex;
      justify-content: space-between;

      .group-title {
        margin-bottom: 24px;
        cursor: pointer;
        font-family: Poppins, Poppins;
        font-weight: bold;
        font-size: 22px;
        color: #333333;

        a {
          cursor: pointer;
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 22px;
          color: #333333;
        }
      }

      .info-box {
        .info-item {
          margin-bottom: 18px;

          img {
            margin-right: 8px;
            width: 20px;
            height: 20px;
          }

          span {
            font-family: OPPOSans, OPPOSans;
            font-weight: bold;
            font-size: 16px;
            color: #888888;
          }
        }

        .links {
          margin-top: 40px;

          img {
            margin-right: 20px;
            width: 40px;
            height: 40px;
          }
        }
      }
    }
  }

  .footer-right {
    .btn-dingyue {
      width: 150px;
      height: 40px;
      background: #4CA5E4;

      font-family: OPPOSans, OPPOSans;
      font-weight: bold;
      font-size: 14px;
      color: #FFFFFF;
    }
  }
}

.top-logo {
  img {
    width: 201px;
  }
}

.desc-box {
  margin-top: 15px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 14px;
  color: #dae8e2;
}

.info-box {
  margin-top: 10px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 14px;
  color: #dae8e2;
}

.nav-box {
  .flex-between();
  width: 1600px;
  margin: 60px auto;
  border-top: 1px solid #41b48a;
  border-bottom: 1px solid #41b48a;
  height: 48px;
  line-height: 48px;

  .nav-item {
    flex: 1;

    a {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 48px;
      color: #ffffff;
    }
  }
}

.qrcode-box {
  .flex-center();
  padding-bottom: 60px;

  .qrcode-item {
    &:last-child {
      margin-left: 40px;
    }

    img {
      width: 190px;
      height: 190px;
      border-radius: 6px;
    }

    .text {
      margin-top: 15px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 16px;
      color: #dae8e2;
    }
  }
}

.beian-box {
  border-top: 1px solid #ddd;
  background: #F9FAFC;

  .beian-ctx {
    width: @width;
    margin: 0 auto;
    height: 50px;
    line-height: 50px;
    padding: 0;
    text-align: center;
    text-align: left;

    font-family: OPPOSans, OPPOSans;
    font-weight: bold;
    font-size: 14px;
    color: rgba(153, 153, 153, 0.6);

    a {
      font-family: OPPOSans, OPPOSans;
      font-weight: bold;
      font-size: 14px;
      color: rgba(153, 153, 153, 0.6);
    }

    /deep/ a,
    p,
    span,
    div {
      font-family: OPPOSans, OPPOSans;
      font-weight: bold;
      font-size: 14px;
      color: rgba(153, 153, 153, 0.6);
    }

    .beian {
      font-family: OPPOSans, OPPOSans;
      font-weight: bold;
      font-size: 14px;
      color: rgba(153, 153, 153, 0.6);
    }
  }


}
</style>

<style scoped lang="less" src="@/assets/h5css/zujian/pageFooter.less"></style>
