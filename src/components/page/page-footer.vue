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
        </div>

        <!-- 网站信息 -->
        <div class="logo-wrap link-info">
          <div class="site-info v-flex-start">
            <div class="info-box">
              <div class="phone-icon-box">
                <img src="@img/foot/foot-mobile.png" alt="" />
              </div>
              <div class="text-box">
                <div class="mobile-text">服务热线</div>
                <div class="mobile">{{ vuex_config.comPhone }}</div>
                <div class="time-text">服务时间</div>
                <div class="time">{{ vuex_config.timeRange }}</div>
              </div>
            </div>

            <div class="icon-box">
              <img :src="vuex_config.accountImg" alt="" />
              <div class="icon-title">小程序</div>
            </div>
          </div>
        </div>
      </div>

      <div class="beian-box">
        <div class="beian" v-html="vuex_config.comBeian">
          <a href="https://beian.miit.gov.cn/">{{ vuex_config.comBeian }} </a>
        </div>
        <div class="contact-info flex-center">
          <div class="contact-item">公司地址：{{ vuex_config.comAddress }}</div>
          <div class="contact-item">联系人：{{ vuex_config.comDesc }}</div>
          <div class="contact-item">手机：{{ vuex_config.comPhone }}</div>
          <div class="contact-item">邮箱：{{ vuex_config.comEmail }}</div>
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
      footerTips: [
        {
          icon: require("@/assets/img/foot/foot-1.png"),
          title: "正品保障",
          desc: "正品保障，诚信服务",
        },
        {
          icon: require("@/assets/img/foot/foot-2.png"),
          title: "一站式服务",
          desc: "一站式服务",
        },
        {
          icon: require("@/assets/img/foot/foot-3.png"),
          title: "全网比价",
          desc: "全网比价 惠到实处",
        },
        {
          icon: require("@/assets/img/foot/foot-4.png"),
          title: "无忧售后",
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
          channelId: 52,
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
.footer-tip {
  width: 100%;
  padding: 40px 0;
  background: #044fa0;
  background: #202020;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ddd;

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
          // font-weight: bold;
          color: #ffffff;
          color: #222;
        }

        .desc {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #d0d0d0;
          color: #878787;
        }
      }
    }
  }
}

.page-footer {
  padding-top: 40px;
  // background: url("~@img/footer-bg.jpg") no-repeat center / cover;
  background: #ffffff;
  color: #222;
}

.web-footer {
  margin: 0 auto;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

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
        font-size: 16px;
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        color: #000000;
      }

      .link-item {
        text-align: left;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        line-height: 32px;

        a {
          font-weight: normal;
          font-family: MicrosoftYaHei, MicrosoftYaHei;
          font-weight: normal;
          font-size: 14px;
          color: #666666;
          line-height: 30px;

          &:hover {
            color: #009f39;
          }
        }
      }
    }
  }
}

.link-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .site-info {
    .info-box {
      margin-right: 120px;
      display: flex;
      align-items: flex-start;

      .phone-icon-box {
        img {
          width: 48.43px;
        }
      }
      .text-box {
        padding-left: 12px;
        .mobile-text {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
        .mobile {
          margin: 10px 0 25px 0;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 26px;
          color: #ff7600;
        }
        .time-text {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
        .time {
          margin-top: 10px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #707070;
        }
      }
    }

    .icon-box {
      img {
        width: 100px;
        height: 100px;
      }

      .icon-title {
        margin-top: 16px;
        text-align: center;
      }
    }
  }
}

.beian-box {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  padding: 36px 0;
  background: #009F39;

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

.contact-info {
  margin-top: 16px;
  .contact-item {
    margin: 0 5px;
    color: #fff;
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
