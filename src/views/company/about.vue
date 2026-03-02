<template>
  <div class="page">
    <div class="page-top">
      <div class="banner-box">
        <div class="banner-img-box" v-if="banners.length == 1">
          <img :src="banners[0].image" alt="" />
        </div>
        <pageBanner v-if="banners.length > 1" />

        <div class="banner-content-wrap">
          <div class="banner-content">
            <div class="banner-title">
              About Us
            </div>
            <div class="banner-desc">
              Here is the introduction copy about us.Here is the introduction copy about us.Here is the introduction
              copy about us.Here is the introduction copy about us
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="inner">
      <div class="page-ctx">
        <pageBreadcrumb :option="nav_option" />

        <!-- 团队卡片部分 -->
        <div class="team-cards">
          <div class="team-card" v-for="(team, index) in teams" :key="index">
            <div class="card-background" :class="team.bgClass"></div>
            <div class="card-content">
              <div class="card-icon">
                <i :class="team.icon"></i>
              </div>
              <div class="card-title">{{ team.name }}</div>
              <div class="card-email">{{ team.email }}</div>
            </div>
          </div>
        </div>

        <div class="contact-info">
          <div class="info-list flex-between">
            <div class="info-item">
              <div class="icon-box">
                <img src="@img/about/icon1.png" alt="">
              </div>
              <div class="title">
                Wholesale
              </div>
              <div class="desc">
                <!-- {{ vuex_config.comAddress }} -->
                GreatWhip provides Wholesale cream chargers service worldwide, quality products and discounted prices,
                we have warehouses in US/UK/AU/EU, fast logistics and everything.
              </div>
            </div>
            <div class="info-item">
              <div class="icon-box">
                <img src="@img/about/icon2.png" alt="">
              </div>
              <div class="title">
                Dealer
              </div>
              <div class="desc">
                <!-- {{ vuex_config.comPhone }} -->
                You can become a distributor of GreatWhip, provide closer communication, and strive for each other's
                success. Active cooperation strategies and brand cooperation will be more conducive to the development
                of the cream charger industry.
              </div>
            </div>
            <div class="info-item">
              <div class="icon-box">
                <img src="@img/about/icon3.png" alt="">
              </div>
              <div class="title">
                OEM Service
              </div>
              <div class="desc">
                <!-- {{ vuex_config.comEmail }} -->
                We have advanced production equipment and are a leading manufacturer in the gas industry. We are full of
                confidence in the production and testing of products. You can customize your own brand at will. We will
                provide you with a full range of services.
              </div>
            </div>
          </div>

          <div class="msg-box">
            <div class="msg-title">
              About Us
            </div>
            <div class="msg-desc" >
              <!-- {{info.content}} -->
               <div class="html-box" v-html="info.content">

               </div>
            </div>
          </div>

          <div class="btns flex-center">
            <router-link to="/product-cates?id=780" class="btn-ripple btn flex-center">
              Cream Charger
            </router-link>

            <router-link to="/product-cates?id=792" class="btn-ripple btn flex-center">
              Cream Dispenser
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import pageBreadcrumb from '@/views/layout/comps/page_breadcrumb.vue'
import { mapState } from "vuex";
export default {
  name: "index",
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      info: {},
      teams: [
        {
          name: "Marketing Team",
          email: "MEDOOO@123.com",
          icon: "el-icon-user-solid",
          bgClass: "bg-marketing"
        },
        {
          name: "Sales Service Team",
          email: "MEDOOO@123.com",
          icon: "el-icon-suitcase",
          bgClass: "bg-sales"
        },
        {
          name: "Purchasing Team",
          email: "MEDOOO@123.com",
          icon: "el-icon-shopping-bag-2",
          bgClass: "bg-purchasing"
        },
        {
          name: "Technical Support Team",
          email: "MEDOOO@123.com",
          icon: "el-icon-connection",
          bgClass: "bg-technical"
        }
      ]
    };
  },
  computed: {
    ...mapState(['vuex_map_banners']),
    banners() {
      return this.vuex_map_banners['关于我们'] || []
    },
    nav_option() {
      let option = [
        { route: '/about', title: '关于我们', title: 'About Us' }
      ]
      return option
    }
  },
  watch: {},
  created() {
    this.setView()
  },
  methods: {
    setView() {
      this.query_about()
    },
    query_about() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_detail",
          id: 95,
        }
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.info = data.info;
        }
      });
    }
  },
};
</script>

<style scoped lang="less">
.page-top {
  position: relative;

  .banner-box {
    position: relative;

    .banner-img-box {
      img {
        width: 100%;
        height: 700px;
        object-fit: cover;
      }
    }

    .banner-content-wrap {
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding-top: 173px;

      .banner-content {
        width: 1400px;
        margin: 0 auto;
        text-align: left;

        .banner-title {
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 60px;
          line-height: 80px;
          color: #FFFFFF;
        }

        .banner-line {
          margin-top: 30px;
          width: 180px;
          height: 13px;
          background: #FFFFFF;
        }

        .banner-desc {
          margin-top: 30px;
          max-width: 800px;
          font-family: OPPOSans, OPPOSans;
          font-weight: 500;
          font-size: 23px;
          color: #FFFFFF;
          line-height: 40px;
        }
      }
    }
  }
}

.page {
  .inner {}
}

.page-ctx {
  width: 1400px;
  margin: 0 auto;

  padding-top: 35px;
  padding-bottom: 90px;

  // 团队卡片样式
  .team-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin-bottom: 80px;
    margin-top: 40px;

    .team-card {
      position: relative;
      height: 320px;
      border: 1px dashed #d4d4d4;
      border-radius: 4px;
      overflow: hidden;
      background: #ffffff;

      .card-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background-position: center;
        filter: blur(4px);
        opacity: 0.7;
        z-index: 1;

        &.bg-marketing {
          background: linear-gradient(135deg, rgba(255, 236, 210, 0.8) 0%, rgba(252, 182, 159, 0.8) 100%),
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23f0f0f0" width="400" height="300"/></svg>');
        }

        &.bg-sales {
          background: linear-gradient(135deg, rgba(168, 237, 234, 0.8) 0%, rgba(254, 214, 227, 0.8) 100%),
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23f0f0f0" width="400" height="300"/></svg>');
        }

        &.bg-purchasing {
          background: linear-gradient(135deg, rgba(210, 153, 194, 0.8) 0%, rgba(254, 249, 215, 0.8) 100%),
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23f0f0f0" width="400" height="300"/></svg>');
        }

        &.bg-technical {
          background: linear-gradient(135deg, rgba(137, 247, 254, 0.8) 0%, rgba(102, 166, 255, 0.8) 100%),
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23f0f0f0" width="400" height="300"/></svg>');
        }
      }

      .card-content {
        position: relative;
        z-index: 2;
        padding: 40px 30px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;

        .card-icon {
          width: 64px;
          height: 64px;
          background: #00306b;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          flex-shrink: 0;

          i {
            font-size: 32px;
            color: #ffffff;
          }
        }

        .card-title {
          font-size: 18px;
          font-weight: 500;
          color: #ec6a2b;
          margin-bottom: 12px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          line-height: 1.4;
        }

        .card-email {
          font-size: 14px;
          color: #1f1f1f;
          font-family: Microsoft YaHei, Microsoft YaHei;
          line-height: 1.4;
        }
      }
    }
  }

  .contact-info {
    padding-top: 70px;
    background: #fff;
  }
}

.info-list {
  align-items: flex-start !important;
  .info-item {
    flex: 1;
    padding: 0 10px;
    text-align: center;

    &+.info-item {
      margin-left: 100px;
    }

    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 80px;
      margin: 0 auto;

      img {
        width: 60px;
      }
    }

    .title {
      margin-top: 30px;
      margin-bottom: 30px;
      font-family: Poppins, Poppins;
      font-weight: bold;
      font-size: 25px;
      color: #0D398A;
    }

    .desc {
      font-family: OPPOSans, OPPOSans;
      // font-weight: bold;
      font-size: 16px;
      color: #555555;
    }
  }
}

.msg-box {
  margin-top: 110px;
  margin-bottom: 70px;
  padding: 70px 160px 110px;
  min-height: 200px;
  background: rgba(226, 226, 226, 0.2);

  .msg-title {
    text-align: center;
    font-family: Poppins, Poppins;
    font-weight: bold;
    font-size: 40px;
    color: #000000;
  }

  .msg-desc {
    margin-top: 46px;
    font-family: OPPOSans, OPPOSans;
    font-weight: 500;
    font-size: 21px;
    color: #444444;
    line-height: 40px;
    text-align: left;
  }
}


.btns {
  .btn {
    margin: 0 20px;
    width: 200px;
    height: 50px;
    border-radius: 0px 0px 0px 0px;
    border: 1px solid #00306B;

    font-family: OPPOSans, OPPOSans;
    font-weight: bold;
    font-size: 16px;
    color: #00306B;
    background: #FFFFFF;
    transition: .3s;

    &:hover {
      background: #00306B;
      color: #FFFFFF;
    }
  }
}
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/contact.less"></style>