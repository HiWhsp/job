<template>
  <div class="page-footer">
    <div class="web-footer">
      <div class="footer-left">
        <img src="@/assets/image/home/logo.png" alt="">
      </div>
      <div class="footer-center">
        <div class="nav-group">
          <div class="group-item">
            <div class="group-title">
              <router-link to="/contact" class="group-title">
                <img src="" alt="">
                DREAM CAR MODEL Social
              </router-link>
            </div>
            <div class="info-box">
              <div class="info-item">
                <img src="" alt="">
                <span>– DREAM CAR MODEL</span>
              </div>
              <div class="info-item">
                <img src="" alt="">
                <span>– DREAM CAR MODEL</span>
              </div>
              <div class="info-item">
                <img src="" alt="">
                <span>– DREAM CAR MODEL</span>
              </div>
            </div>
          </div>
          <div class="group-item">
            <div class="group-title">
              <router-link to="/contact" class="group-title">
                <img src="" alt="">
                快速查找
              </router-link>
            </div>
            <div class="info-box">
              <div class="info-item" >
                <a href="/about">关于我们</a>
              </div>
              <div class="info-item">
                <a href="/product-cates">限定商品</a>
              </div>
              <div class="info-item">
                <a href="/specialOffer">特价商品</a>
              </div>
              <div class="info-item">
                <a href="/connect">联系我们</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="group-item">
          <div class="group-title">
            <router-link to="/contact" class="group-title">
              <img src="" alt="">
              微信公众号
            </router-link>
          </div>
          <div class="info-box">
            <div class="info-item">
              <img src="" alt="" class="qrcode">
              <span>Dream Car Model</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="beian-box">
      <div class="beian-ctx">
        <div class="beian" v-html="vuex_config.comBeian"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "web-footer",
  components: {},
  props: [],
  data() {
    return {
      info_return: {},
      info_ship: {},
      email: "",
    };
  },
  computed: {
    ...mapState(["vuex_product_cate_1", "vuex_product_cate_2"]),
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
    setView() {
      //退货政策
      //配送方式
      // this.query_refund_ship()
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_detail",
          id: 100,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.info_return = res.data.info;
        }
      });
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_detail",
          id: 101,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.info_ship = res.data.info;
        }
      });
    },
    toNav(item) {
      this.$router.push(item.route);
    },
  },
};
</script>

<style scoped lang="less">
.page-footer {
  width: 100%;
  padding-top: 40px;
  background: #000;
  color: #fff;
  border-top: 1px solid #999;
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
  padding-bottom: 60px;

  .footer-left {
    margin-right: 236px;

    img {
      width: 248px;
      height: 60px;
    }
  }

  .footer-center {
    flex: 1;
    display: flex;
    justify-content: space-evenly;

    .nav-group {
      flex: 1;
      display: flex;
      justify-content: space-between;

      .group-item {
        flex: 1;
      }

      .group-title {
        margin-bottom: 24px;
        cursor: pointer;
        font-weight: 400;
        font-size: 16px;
        color: #fff;

        img {
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }

        a {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #FFFFFF;
        }
      }

      .info-box {
        .info-item {
          cursor: pointer;
          margin-left: 25px;
          display: flex;
          align-items: flex-start;
          margin-bottom: 18px;

          img {
            margin-right: 8px;
            width: 20px;
            height: 20px;
          }

          span,a {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.62);
            line-height: 18px;
            text-align: left;
            font-style: normal;
            text-transform: none;
          }
        }
      }
    }
  }

  .footer-right {
    .group-item {
      flex: 1;
    }

    .group-title {
      margin-bottom: 24px;
      cursor: pointer;
      font-weight: 400;
      font-size: 16px;
      color: #fff;
      img {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }

      a {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 16px;
        color: #FFFFFF;
      }
    }

    .info-box {
      .info-item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 18px;

        img {
          width: 100px;
          height: 100px;
        }

        span {
          margin-top: 10px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.62);
          line-height: 18px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
    }
  }
}

.top-logo {
  img {
    width: 201px;
  }
}


.beian-box {
  border-top: 1px solid #ddd;
  background: #000;
  height: 66px;

  .beian-ctx {
    width: @width;
    margin: 0 auto;
    height: 50px;
    line-height: 50px;
    padding: 0;
    text-align: center;
    text-align: center;

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
