<template>
  <div class="footer-wrap">
    <div class="footer-tip">
      <div class="footer-icons w-1400">
        <div class="icon-item" v-for="(item, index) in footerTips" :key="index">
          <div class="icon-box">
            <img :src="item.icon" alt="" />
          </div>
          <div class="info-box">
            <div class="title">{{ item.title }}</div>
            <div class="desc">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div class="web-footer w-1400">
        <!-- 底部链接 -->
        <div class="link-wrap">
          <div
            class="link-group"
            v-for="(group, index) in footer_link_group"
            :key="index"
          >
            <div class="group-title">
              {{ group.title }}
            </div>
            <div
              class="link-item"
              v-for="(sub, index) in group.newList"
              :key="index"
            >
              <a :href="sub.url" v-if="sub.url" target="_blank">
                {{ sub.title }}
              </a>
              <router-link :to="'/help?id=' + sub.id">
                {{ sub.title }}
              </router-link>
              <!-- <div v-else>{{ sub.title }}</div> -->
            </div>
          </div>
          <div class="link-group">
            <div class="group-title">联系我们</div>
            <div class="link-item">
              <img src="@img/foot/link1.png" alt="" />
              <a href="tel:13800138000">{{ vuex_config.comKefu }}</a>
            </div>
            <div class="link-item">
              <img src="@img/foot/link2.png" alt="" />
              <a href="tel:13800138000">{{ vuex_config.comEmail }}</a>
            </div>
            <div class="link-item">
              <img src="@img/foot/link3.png" alt="" />
              <a href="tel:13800138000">{{ vuex_config.comAddress }}</a>
            </div>
          </div>
        </div>

        <!-- 网站信息 -->
        <div class="logo-wrap link-info">
          <div class="top-info">
            <div class="icon-box">
              <img :src="vuex_config.accountImg" alt="" />
              <div class="icon-title">微信公众号</div>
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
      footerTips: [],
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
          this.footer_link_group.forEach((item) => {
            this.$api({
              url: "/service.php",
              method: "get",
              data: {
                action: "news_getIndexFooter",
                channelId: item.id,
                page: 1,
                pageNum: 1000,
                orderType: 0, //排序情况：0-自然排序 1-最新
              },
            }).then((res) => {
              if (res.code == 200) {
                item.newList = res.data;
              }
            });
          });
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
  // background: url("~@img/footer-bg.jpg") no-repeat center / cover;
  background: #0c2b5d;
  color: #fff;
  overflow: hidden;
}

.footer-tip {
  width: 100%;
  padding: 40px 0;
  background: #0c2b5d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .footer-icons {
    display: flex;

    .icon-item {
      flex: 1;
      text-align: left;
      display: flex;
      align-items: center;

      .icon-box {
        img {
          width: 47px;
          height: 52px;
        }
      }

      .info-box {
        flex: 1;
        padding-left: 15px;

        .title {
          margin-bottom: 10px;
          font-size: 18px;
          font-family: PingFang SC, PingFang SC;
          font-weight: bold;
          color: #ffffff;
        }

        .desc {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #d0d0d0;
        }
      }
    }
  }

  .footerRow {
    padding: 0 80px;
  }

  .footerItem {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .footerIcon {
    width: 46.43px;
    height: 52px;
    margin-right: 20px;
  }

  .txt {
    font-size: 16px;
    color: #ffffff;
    width: 150px;
    width: 200px;
    word-break: break-all;
    text-align: left;
  }
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
  height: 80px;
  line-height: 80px;
  padding: 0;

  .beian {
    text-align: center;
  }

  a {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fff;
    color: #9f9f9f;
  }

  /deep/ a {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fff;
    color: #9f9f9f;
  }
}

@media screen and (max-width: 1024px) {
  .footer-tip {
    padding: 15px;

    .footer-icons {
      width: 100%;
      flex-direction: column;

      .icon-item {
        margin-bottom: 15px;

        .info-box {
          .title {
            font-size: 1.4rem;
          }

          .desc {
            font-size: 1.2rem;
          }
        }
      }
    }
  }

  .page-footer {
    padding: 15px;

    .web-footer {
      width: 100%;
      flex-direction: column;

      .link-wrap {
        width: 100%;
        padding-right: 0;
        margin-bottom: 15px;
        justify-content: space-between;

        .link-group {
          .group-title {
            font-size: 1.4rem;
          }

          .link-item a {
            font-size: 1.2rem;
          }
        }
      }

      .logo-wrap {
        width: 100%;
      }
    }
  }

  .link-info .top-info .icon-box img {
    width: 10rem;
    height: 10rem;
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/zujian/pageFooter.less"></style>
