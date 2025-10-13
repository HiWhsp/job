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
          font-weight: normal;
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
        font-weight: normal;

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
          display: flex;
          align-items: flex-start;
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
            font-weight: normal;

            a {
              font-family: OPPOSans, OPPOSans;
              font-weight: bold;
              font-size: 16px;
              color: #888888;
              font-weight: normal;
            }
          }

          .desc-box {
            .desc-item {
              margin-bottom: 10px;
              font-family: OPPOSans, OPPOSans;
              font-weight: bold;
              font-size: 16px;
              color: #888888;
              font-weight: normal;
            }
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
    display: flex;
          justify-content: center;
          align-items: center;
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


.tip-box {
  margin-bottom: 20px;

  .tip-ctx {
    width: @width;
    margin: 0 auto;
    text-align: center;
    text-align: left;

    font-family: OPPOSans, OPPOSans;
    font-weight: bold;
    font-size: 14px;
    color: rgba(153, 153, 153, 0.6);
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


.left-articles {
  .article-item {
    margin-top: 10px;

    a {
      color: #666;
      font-size: 14px;

      &:hover {
        color: #4CA5E4;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/zujian/pageFooter.less"></style>
