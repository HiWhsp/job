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
        <div class="link-info">
          <div class="site-info">
            <div class="icon-box">
              <img :src="vuex_config.comLogo" alt="" />
            </div>
            <div class="info-box">
              <div class="info-item">
                <div class="info-item-title">
                  <img src="@/assets/img/foot/phone-wx.png" alt="" />
                  <span>CONTACT US</span>
                </div>
                <div class="info-item-content">4000-888-8888</div>
              </div>
              <div class="info-item">
                <div class="info-item-title bold">
                  <span class="bold">FOLLOW US</span>
                </div>
                <div class="info-item-content">
                  <img src="@/assets/img/foot/fackbock.png" alt="" />
                  <img src="@/assets/img/foot/instagram.png" alt="" />
                  <img src="@/assets/img/foot/telegram.png" alt="" />
                  <img src="@/assets/img/foot/youtube.png" alt="" />
                </div>
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
  name: "page-footer",
  components: {},
  props: [],
  data() {
    return {
      footerTips: [
        {
          icon: require("@/assets/img/foot/foot-1.png"),
          title: "GENUINE PRODUCT",
          desc: "Worry-free after-sales service",
        },
        {
          icon: require("@/assets/img/foot/foot-2.png"),
          title: "ONE-STOP SERVICE",
          desc: "Worry-free after-sales service",
        },
        {
          icon: require("@/assets/img/foot/foot-3.png"),
          title: "DISCOUNTED PRICE",
          desc: "Worry-free after-sales service",
        },
        {
          icon: require("@/assets/img/foot/foot-4.png"),
          title: "AFTER-SALES SERVICE",
          desc: "Worry-free after-sales service",
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
.w-1400 {
  width: 1600px !important;
}
.footer-tip {
  width: 100%;
  padding: 60px 0 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 4px solid #ec6a2b;

  .footer-icons {
    display: flex;

    .icon-item {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon-box {
        margin-bottom: 10px;
        img {
          width: 40px;
          height: 40px;
        }
      }

      .info-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .title {
          margin-bottom: 10px;
          font-size: 18px;
          font-family: Poppins, Poppins;
          color: #000;
          font-weight: bold;
        }

        .desc {
          font-size: 14px;
          font-family: Poppins, Poppins;
          font-weight: 500;
          color: #5e5e5e;
        }
      }
    }
  }
}

.page-footer {
  padding-top: 40px;
  background: #00306b;
  color: #fff;
}

.web-footer {
  margin: 0 auto;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;

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
        font-size: 20px;
        font-family: Poppins, Poppins;
        font-weight: bold;
        color: #fff;
        line-height: 50px;
      }

      .link-item {
        text-align: left;
        font-size: 18px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        color: #fff;
        line-height: 40px;
        position: relative;
        padding-left: 13px;

        a {
          font-weight: normal;
          font-family: Poppins, Poppins;
          font-weight: normal;
          font-size: 18px;
          color: #fff;
          line-height: 30px;

          &:hover {
            color: #fff;
          }
        }

        &::before {
          content: "";
          display: block;
          width: 5px;
          height: 5px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}

.link-info {
  .site-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .info-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
      .info-item {
        display: flex;
        flex-direction: column;
        .info-item-title {
          display: flex;
          align-items: center;
          img {
            width: 26px;
            height: 26px;
            margin-right: 10px;
          }

          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 20px;
          color: #ffffff;
          line-height: 28px;

          &.bold {
            font-weight: bold;
            font-size: 24px;
          }
        }
        .info-item-content {
          font-family: Poppins, Poppins;
          font-weight: 600;
          font-size: 30px;
          color: #ec6a2b;
          line-height: 50px;

          img {
            width: 40px;
            height: 40px;
            margin-right: 15px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }

    .icon-box {
      width: 140px;
      height: 75px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.beian-box {
  text-align: center;
  border-top: 1px solid #4C6E97;
  padding: 25px 0;
  background: #00306B;

  .beian {
    text-align: center;
  }

  a {
    font-size: 14px;
    font-family: Poppins, Poppins;
    font-weight: 400;
    color: #fff;
  }

  /deep/ a {
    font-size: 14px;
    font-family: Poppins, Poppins;
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
</style>

<style scoped lang="less" src="@/assets/h5css/zujian/page_footer.less"></style>

<style scoped lang="less" src="@/assets/h5css/page/shipei.less"></style>
