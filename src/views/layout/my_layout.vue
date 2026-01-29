<template>
  <div class="page-user-wrap">
    <div class="inner w-1400">
      <!-- <page_breadcrumb :option="nav_option" /> -->

      <div class="page-ctx">
        <div class="menu-wrap">
          <div class="left-title">
            <img src="@img/my/member-center.png" alt />
            Member Center
          </div>
          <div class="nav-wrap">
            <div
              class="nav-item"
              v-for="(item, index) in flat_menu"
              :key="index"
              @click="do_toggle_nav(item)"
            >
              <div class="nav-content" :class="{ active: $route.name === item.route }">
                <div class="icon-box">
                  <img :src="item.icon" alt />
                </div>
                <div class="nav-title">{{ item.title }}</div>
                <!-- <div class="arrow-box">
                  <img class="arrow-right" src="@img/my/arrow-right.png" alt />
                </div>-->
              </div>
            </div>

            <!-- <div class="nav-item" v-for="(item, index) in page_menu" :key="index">
              <div class="nav-title main-title" v-if="!item.route || item.is_main"
                :class="$route.name == item.route ? 'active' : ''" @click="do_toggle_nav(item)">
                {{ item.title }}
              </div>
              <div v-else class="nav-title link" :class="$route.name == item.route ? 'active' : ''"
                @click="do_toggle_nav(item)">
                {{ item.title }}
              </div>
            </div>-->
          </div>

          <div class="btn-wrap" @click="go_enterpriseCert">PERSONAL REGISTER</div>
        </div>

        <div class="view-wrap">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page_breadcrumb from "@/views/layout/comps/page_breadcrumb.vue";

import { mapState } from "vuex";

export default {
  name: "my",
  components: {
    page_breadcrumb
  },
  data() {
    return {
      //个人中心导航
      all_menu: [
        {
          title: "My Order",
          route: "order-list",
          icon: require("@img/my/nav-1.png")
        },
        {
          title: "My coupons",
          route: "coupon-list",
          icon: require("@img/my/nav-2.png")
        },
        {
          title: "My Collection",
          route: "favorite-list",
          icon: require("@img/my/nav-3.png")
        },
        {
          title: "My Footprints",
          route: "footprint-list",
          icon: require("@img/my/nav-4.png")
        },
        {
          title: "My Comment",
          route: "my-review-list",
          icon: require("@img/my/nav-5.png")
        },
        {
          title: "After-sale service",
          route: "refund-list",
          icon: require("@img/my/nav-6.png")
        },
        {
          title: "My address",
          route: "address-list",
          icon: require("@img/my/nav-7.png")
        },
        {
          title: "My Profile",
          route: "my-info",
          icon: require("@img/my/nav-8.png")
        },
        // {
        //   title: "企业认证",
        //   route: "enterprise-cert",
        //   icon: require("@img/my/nav-6.png"),
        //   // showCondition: (user) => !(user.renzheng == 2 && user.userType == 2),
        //   showCondition: user => user.userType == 0 || user.userType == 1
        // },
        {
          title: "Commission-only Reps",
          route: "commission-only-reps",
          icon: require("@img/my/nav-9.png"),
          showCondition: user => user.userType == 1
        },
        {
          title: "business information",
          route: "business-information",
          icon: require("@img/my/nav-12.png"),
          showCondition: user => user.userType == 2
        },
        {
          title: "Apply To Be The Commission-only Rep",
          route: "part-time-sales",
          icon: require("@img/my/nav-9.png"),
          // showCondition: (user) => !(user.renzheng == 2 && user.userType == 2),
          showCondition: user => user.userType == 0
        },
        {
          title: "Customer Management",
          route: "customer-management",
          icon: require("@img/my/nav-10.png"),
          showCondition: user => user.userType == 2
        },
        {
          title: "Sales Performance",
          route: "sales-performance",
          icon: require("@img/my/nav-11.png"),
          showCondition: user => user.userType == 2
        }
      ],
      activeRoute: "",
      openeds: ["order-list"]
    };
  },
  computed: {
    ...mapState(["vuex_user"]),
    nav_option() {
      let option = [
        { route: "/my-index", title: "用户中心", title2: "Personal Center" },
        {
          route: "",
          title: this.$route.meta.title,
          title: this.$route.meta.title
        }
      ];
      return option;
    },

    page_menu() {
      let navList = [];
      navList = this.all_menu;
      return navList;
    },

    flat_menu() {
      // 根据用户状态过滤菜单
      return this.all_menu.filter(item => {
        if (item.showCondition) {
          return item.showCondition(this.vuex_user);
        }
        return true; // 没有条件限制的菜单项始终显示
      });
    }
  },

  //导航激活
  beforeRouteUpdate(to, from, next) {
    //console.log("组件复用 from", from);
    //console.log("组件复用 to", to);

    next();

    this.activeRoute = to.path.replace("/", "");
  },

  methods: {
    do_toggle_nav(item) {
      if (!item.route) {
        // let route = item.sub[0].route;
        // this.$router.push("/" + route);
      } else {
        this.$router.push("/" + item.route);
      }
    },
    go_enterpriseCert() {
      this.$router.push("/register-personal");
    }
  }
};
</script>

<style scoped lang="less">
.page-user-wrap {
  background: #f9fafc;
  padding-top: 35px;

  .inner {
    margin: 0 auto;
    min-height: 70vh;

    .page-ctx {
      // padding-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .menu-wrap {
      width: 340px;
      margin-bottom: 50px;
      border-radius: 8px;
      overflow: hidden;

      .left-title {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #00306b;
        padding: 16px 0;
        text-align: center;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 24px;
        color: #ffffff;
        img {
          width: 22px;
          margin-right: 10px;
        }
      }

      .nav-wrap {
        background: #fff;
        border: 1px solid #dedede;
        .nav-item {
          cursor: pointer;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #f8f9fa;
          }

          .nav-content {
            display: flex;
            align-items: center;
            padding: 22px 20px;

            &:last-child {
              border-bottom: none;
            }

            &.active {
              .nav-title {
                color: #ec6a2b;
                font-weight: 600;
              }

              .icon-box img {
                opacity: 1;
              }

              .arrow-box .arrow-right {
                opacity: 1;
              }
            }

            .icon-box {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 24px;
              height: 24px;
              margin-right: 16px;

              img {
                width: 22px;
                height: 22px;
              }
            }

            .nav-title {
              flex: 1;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 20px;
              font-weight: 600;
              color: #333333;
            }

            .arrow-box {
              display: flex;
              align-items: center;
              justify-content: center;

              .arrow-right {
                width: 8px;
                height: 8px;
                opacity: 0.5;
              }
            }
          }
        }
      }

      .btn-wrap {
        cursor: pointer;
        margin-top: 26px;
        width: 338px;
        height: 80px;
        background: #4891e9;
        border-radius: 10px 10px 10px 10px;

        font-family: Poppins, Poppins;
        font-weight: 600;
        font-size: 24px;
        color: #ffffff;
        line-height: 80px;
        text-align: center;
      }
    }

    .view-wrap {
      flex: 1;
      margin-left: 24px;
      min-height: 50vh;
      padding-bottom: 50px;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/index.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
