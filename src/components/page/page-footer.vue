<template>
  <div class="footer-wrap">
    <div class="page-footer">
      <div class="web-footer w-1400">
        <!-- 底部链接 -->
        <div class="link-wrap">
          <div class="link-group">
            <div class="group-title">服务热线</div>
            <img
              src="~@img/common/footer-phone.png"
              class="footer-phone"
              alt=""
            />
          </div>
          <div class="link-group">
            <div class="group-title">帮助中心</div>
            <div class="link-item">
              <a href="tel:13800138000">购物须知</a>
            </div>
            <div class="link-item">
              <a href="tel:13800138000">线下采购</a>
            </div>
            <div class="link-item">
              <a href="tel:13800138000">换货须知</a>
            </div>
          </div>
          <div class="link-group">
            <div class="group-title">联系我们</div>
            <div class="link-item">
              <a href="tel:13800138000">常见问题</a>
            </div>
            <div class="link-item">
              <a href="tel:13800138000">文件下载</a>
            </div>
            <div class="link-item">
              <a href="tel:13800138000">在线留言</a>
            </div>
          </div>
          <div class="link-group">
            <div class="group-title">联系我们</div>
            <div class="link-item">
              <a href="tel:13800138000">公司介绍</a>
            </div>
            <div class="link-item">
              <a href="tel:13800138000">联系我们</a>
            </div>
            <div class="link-item">
              <a href="tel:13800138000">资质认证</a>
            </div>
          </div>
        </div>

        <!-- 网站信息 -->
        <div class="logo-wrap link-info">
          <div class="top-info">
            <img src="@img/common/logo.png" class="logo" alt="" />
            <div class="icon-box">
              <img :src="vuex_config.accountImg" alt="" />
              <div class="icon-title">扫码关注我们</div>
            </div>
          </div>
        </div>
      </div>

      <div class="beian-box">
        <div class="beian" v-html="vuex_config.comBeian"></div>
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
      footerTips: [
        {
          icon: require("@/assets/img/foot/foot-1.png"),
          title: "正品保障",
          desc: "正品保障，诚信服务",
        },
        {
          icon: require("@/assets/img/foot/foot-2.png"),
          title: "货期保证",
          desc: "一站式服务",
        },
        {
          icon: require("@/assets/img/foot/foot-3.png"),
          title: "阳光采购",
          desc: "全网比价 惠到实处",
        },
        {
          icon: require("@/assets/img/foot/foot-4.png"),
          title: "诚信服务",
          desc: "专业团队 无忧售后",
        },
      ],
      footer_link_group: [],
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},

  created() {
    this.query_footer_link();
  },
  methods: {
    query_footer_link() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_getIndexFooter",
          channelId: 59,
          page: 1,
          pageNum: 1000,
          orderType: 0, //排序情况：0-自然排序 1-最新
        },
      }).then((res) => {
        if (res.code == 200) {
          this.footer_link_group = res.data;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.root {
  width: 100%;
  min-height: 172px;
}

.page-footer {
  padding-top: 40px;
  background: #435886;
  color: #fff;
  overflow: hidden;
}

.web-footer {
  margin: 0 auto;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .footer-left {
    width: 500px;
  }

  .link-wrap {
    flex: 1;
    display: flex;
    justify-content: space-evenly;
    justify-content: space-between;
    align-items: flex-start;
    padding-right: 140px;
    margin-top: 40px;

    .link-group {
      .group-title {
        text-align: left;
        margin-bottom: 15px;
        font-size: 18px;
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        color: #ffffff;
      }

      .link-item {
        text-align: left;
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #ffffff;
        line-height: 32px;
        display: flex;
        align-items: center;

        img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }

        a {
          font-weight: normal;
          font-size: 14px;
          color: #fff;
          line-height: 32px;

          &:hover {
            color: #f74747;
          }
        }
      }
      .footer-phone {
        width: 204px;
        height: 48px;
        margin-top: 30px;
      }
    }
  }

  .footer-right {
    .qrcode-item {
      img {
        width: 95px;
        height: 95px;
      }

      .text {
        margin-top: 15px;
        font-size: 14px;
        font-family: sans-serif;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
}

.link-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .top-info {
    display: flex;
    align-items: center;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .logo {
      width: 264px;
      height: 65px;
      margin-bottom: 30px;
    }
    .icon-box {
      img {
        width: 144px;
        height: 144px;
      }
      .icon-title {
        margin-top: 5px;
        text-align: center;
      }
    }

    .info-box {
      text-align: left;
      margin-right: 45px;

      .title {
        font-size: 18px;
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        color: #ffffff;
      }

      .time {
        margin-top: 15px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #9f9f9f;
      }

      .phone {
        margin-top: 15px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 20px;
        color: #9f9f9f;
        img {
          width: 16.75px;
        }
      }
    }
  }

  .bottom-info {
    display: flex;
    align-items: center;
    margin-top: 45px;

    .sns-item {
      cursor: pointer;
      margin-left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 35px;
      height: 35px;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #707070;

      img {
        height: 20px;
      }

      &:hover {
        background: @theme;
      }
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

.nav-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.beian-box {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  height: 70px;
  line-height: 70px;
  padding: 0;

  .beian {
    text-align: center;
  }

  a {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fff;
  }

  /deep/ a {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fff;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/zujian/pageFooter.less"></style>
