<template>
  <div class="page">
    <div class="page-top">
      <div class="page-bread">
        <div class="bread-box w-1400">
          <router-link to="/">Home</router-link>
          <span class="arrow">/</span>
          <a class="link">Contact Us</a>
        </div>
      </div>
    </div>
    <div class="inner">
      <div class="page-ctx">
        <!-- 团队卡片部分 -->
        <div class="team-cards">
          <div class="team-card" v-for="(team, index) in teams" :key="index">
            <div class="card-background" :class="team.bgClass"></div>
            <div class="card-content">
              <div class="card-icon">
                <img :src="require(`@img/contact/${team.icon}.png`)" alt="" />
              </div>
              <div class="right">
                <div class="card-title">{{ team.name }}</div>
                <div class="card-email">{{ team.email }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageBreadcrumb from "@/views/layout/comps/page_breadcrumb.vue";

import { mapState } from "vuex";
import contactForm from "@/components/contact/contact-form.vue";

export default {
  name: "index",
  components: {
    pageBreadcrumb,
    contactForm
  },
  data() {
    return {
      form: {
        feed_type: "",
        content: ""
      },
      teams: [
        {
          name: "Marketing Team",
          email: "MEDOOO@123.com",
          icon: "icon1",
          bgClass: "bg-marketing"
        },
        {
          name: "Sales Service Team",
          email: "MEDOOO@123.com",
          icon: "icon2",
          bgClass: "bg-sales"
        },
        {
          name: "Purchasing Team",
          email: "MEDOOO@123.com",
          icon: "icon3",
          bgClass: "bg-purchasing"
        },
        {
          name: "Technical Support Team",
          email: "MEDOOO@123.com",
          icon: "icon4",
          bgClass: "bg-technical"
        }
      ]
    };
  },
  computed: {
    ...mapState(["vuex_map_banners"]),
    banners() {
      return this.vuex_map_banners["联系我们"] || [];
    },
    nav_option() {
      let option = [
        { route: "/contact", title: "联系我们", title: "Contact Us" }
      ];
      return option;
    }
  },

  watch: {},

  created() {
    this.setView();
  },
  mounted() {
    if (this.$route.query.apply == 1) {
      this.$nextTick(() => {
        this.scrollToTarget(".contact-form-box .detail-title");
      });
    }
  },
  methods: {
    //滚动到指定位置
    scrollToTarget(clsName) {
      // var element = document.querySelector(".wenxian-box");
      var element = document.querySelector(clsName);
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
    },

    setView() {}
  }
};
</script>

<style scoped lang="less">
.page-top {
  position: relative;

  .page-bread {
    height: 83px;
    line-height: 83px;
    background: #fbfbfb;
  }

  .bread-box {
    display: flex;
    align-items: flex-start;
    a {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 16px;
      color: #5e5e5e;
    }
    .arrow {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 18px;
      color: #5e5e5e;
      margin: 0 6px;
    }
    .link {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 18px;
      color: #5e5e5e;
    }
  }
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
      border-radius: 10px;
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
        z-index: 1;

        &.bg-marketing {
          background-image: url('~@img/contact/bg1.png');
        }

        &.bg-sales {
          background-image: url('~@img/contact/bg2.png');
        }

        &.bg-purchasing {
          background-image: url('~@img/contact/bg3.png');  
        }

        &.bg-technical {
          background-image: url('~@img/contact/bg4.png');
        }
      }

      .card-content {
        position: relative;
        z-index: 2;
        padding: 40px 30px;
        height: 100%;
        display: flex;
        align-items: center;
        gap: 23px;

        .card-icon {
          width: 118px;
          height: 118px;
          img {
            width: 100%;
            height: 100%;
          }
        }

        .card-title {
          font-size: 24px;
          font-weight: 500;
          color: #ec6a2b;
          margin-bottom: 12px;
          line-height: 33px;
        }

        .card-email {
          font-size: 36px;
          color: #1E262E;
          font-weight: bold;
          line-height: 50px;
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
  .info-item {
    flex: 1;
    padding: 0 10px;
    text-align: center;

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
      color: #0d398a;
    }

    .desc {
      font-family: Poppins, Poppins;
      // font-weight: bold;
      font-size: 16px;
      color: #555555;
    }
  }
}

.contact-form-box {
  margin-top: 123px;
}
</style>


<style scoped lang="less" src="@/assets/h5css/mobile/contact.less"></style>