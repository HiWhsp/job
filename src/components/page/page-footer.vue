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
        <div class="footer-center">
          <div class="nav-group" v-for="(group, index) in groupList" :key="index">
            <div class="group-title">
              {{ group.title }}
            </div>
            <div class="nav-item" v-for="(sub, index) in group.child" :key="index">
              <router-link :to="sub.route" v-if="sub.route">
                {{ sub.title }}
              </router-link>
              <div v-else>{{ sub.title }}</div>
            </div>
          </div>
        </div>

        <!-- 网站信息 -->
        <div class="footer-left link-info">
          <div class="top-info v-flex-start">
            <div class="info-box ">
              <div class="title">
                <img src="@img/foot/foot-logo.png" alt="">
              </div>
              <div class="text">
                {{ vuex_config.com_kefu }}
              </div>
              <div class="time">工作时间：周一至周五（9:00-10:00）节假日除外</div>
              <div class="phone">
                <img src="@img/foot/foot-mobile.png" alt="">
                <span>
                  {{ vuex_config.comPhone }}
                </span>
              </div>
            </div>

            <div class="icon-box">
              <img :src="vuex_config.zhishang_back" alt="" />
              <div class="icon-title">
                微信公众号
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="beian-box">
        <div class="beian" v-html="vuex_config.comBeian">
          <a href="https://beian.miit.gov.cn/">{{ vuex_config.comBeian }} </a>
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
          title: "售后无忧",
          desc: "专业团队 无忧售后",
        },
      ],
    };
  },
  computed: {
    ...mapState(["", "opt_news_cate"]),

    groupList() {
      // return this.vuex_news_cates.slice(0, 5);

      //关于我们
      let child_about = [
        { title: "文章1", route: "/companyProfile" },
        { title: "文章2", route: "/contactUs" },
      ];

      let arr = [
        { title: "购物指南", route: "/companyProfile", child: child_about },
        { title: "购物指南", route: "/companyProfile", child: child_about },
        { title: "购物指南", route: "/companyProfile", child: child_about },
        { title: "购物指南", route: "/companyProfile", child: child_about },
        { title: "购物指南", route: "/companyProfile", child: child_about },

        // ...this.vuex_news_cates,
      ];

      return arr;
    },
  },
  watch: {},

  created() { },

  methods: {},
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
  background: #044FA0;
  background: #202020;
  color: #fff;
  overflow: hidden;
}

.footer-tip {
  width: 100%;
  padding: 40px 0;
  background: #044FA0;
  background: #202020;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #FFF;

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
          font-weight: 500;
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

  .footer-center {
    flex: 1;
    display: flex;
    justify-content: space-evenly;
    justify-content: space-between;
    align-items: flex-start;
    padding-right: 140px;

    .nav-group {
      .group-title {
        text-align: left;
        margin-bottom: 15px;
        font-size: 18px;
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        color: #ffffff;
      }

      .nav-item {
        text-align: left;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        line-height: 32px;

        a {
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #dddddd;
          line-height: 32px;
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
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
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

      .text {
        margin-top: 15px;
        font-size: 24px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #f48533;
      }

      .time {
        margin-top: 5px;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #dddddd;
      }

      .phone {
        margin: 5px 0;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #dddddd;
      }

      .fax {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #dddddd;
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
      .flex-center();
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
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  height: 60px;
  line-height: 60px;
  padding: 0;

  .beian {
    text-align: center;
  }

  a {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fff;
    color: #9F9F9F;
    
  }

  /deep/ a {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #fff;
    color: #9F9F9F;
  }
}

@media screen and (max-width:1024px) {
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

      .footer-center {
        width: 100%;
        padding-right: 0;
        margin-bottom: 15px;
        justify-content: space-between;

        .nav-group {
          .group-title {
            font-size: 1.4rem;
          }

          .nav-item a {
            font-size: 1.2rem;
          }
        }
      }

      .footer-left {
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
