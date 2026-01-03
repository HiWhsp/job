<template>
  <div class="page-user-wrap">
    <div class="inner w-1400">
      <!-- <page_breadcrumb :option="nav_option" /> -->

      <div class="page-ctx">
        <div class="menu-wrap">
          <div class="left-title">会员中心</div>
          <div class="nav-wrap">
            <div
              class="nav-item"
              v-for="(item, index) in flat_menu"
              :key="index"
              @click="do_toggle_nav(item)"
            >
              <div
                class="nav-content"
                :class="{ active: $route.name === item.route }"
              >
                <div class="icon-box">
                  <img :src="item.icon" alt="" />
                </div>
                <div class="nav-title">
                  {{ item.title }}
                </div>
                <div class="arrow-box">
                  <img
                    class="arrow-right"
                    src="@img/my/arrow-right.png"
                    alt=""
                  />
                </div>
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
            </div> -->
          </div>
        </div>
        <div class="view-wrap">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SHOP_TYPE } from "@/config/env.js";

import page_breadcrumb from "@/views/layout/comps/page_breadcrumb.vue";

import { mapState } from "vuex";

export default {
  name: "my",
  components: {
    page_breadcrumb,
  },
  data() {
    return {
      //个人中心导航
      all_menu: [
        {
          title: "我的订单",
          route: "order-list",
          icon: require("@img/my/nav-1.png"),
        },
        {
          title: "我的售后",
          route: "refund-list",
          icon: require("@img/my/nav-7.png"),
        },
        {
          title: "我的优惠券",
          route: "coupon-list",
          icon: require("@img/my/nav-2.png"),
        },
        {
          title: "我的收藏",
          route: "favorite-list",
          icon: require("@img/my/nav-3.png"),
        },
        {
          title: "我的足迹",
          route: "footprint-list",
          icon: require("@img/my/nav-8.png"),
        },
        {
          title: "收货地址",
          route: "address-list",
          icon: require("@img/my/nav-4.png"),
        },
        {
          title: "个人信息",
          route: "my-info",
          icon: require("@img/my/nav-5.png"),
        },
        {
          title: "企业认证",
          route: "enterprise-cert",
          icon: require("@img/my/nav-6.png"),
          // showCondition: (user) => !(user.renzheng == 2 && user.userType == 2),
          showCondition: (user) =>(user.userType==0||user.userType==1),

        },
        {
          title: "成为兼职销售代表",
          route: "part-time-sales",
          icon: require("@img/my/nav-7.png"),
          // showCondition: (user) => !(user.renzheng == 2 && user.userType == 2),
          showCondition: (user) => (user.userType==0||user.userType == 2),

        },
        {
          title: "客户管理",
          route: "customer-management",
          icon: require("@img/my/nav-6.png"),
          showCondition: (user) => user.renzheng == 2 && user.userType == 2,
        },
        {
          title: "销售业绩",
          route: "sales-performance",
          icon: require("@img/my/nav-7.png"),
          showCondition: (user) => user.renzheng == 2 && user.userType == 2,
        },
      ],
      activeRoute: "",
      openeds: ["order-list"],
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
          title: this.$route.meta.title,
        },
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
      return this.all_menu.filter((item) => {
        if (item.showCondition) {
          return item.showCondition(this.vuex_user);
        }
        return true; // 没有条件限制的菜单项始终显示
      });
    },
  },

  //导航激活
  beforeRouteUpdate(to, from, next) {
    //console.log("组件复用 from", from);
    //console.log("组件复用 to", to);

    next();

    this.activeRoute = to.path.replace("/", "");
  },

  watch: {},
  created() {
    // this.subArr = this.subNavArr[0];
  },

  mounted() {},

  methods: {
    do_toggle_nav(item) {
      if (!item.route) {
        // let route = item.sub[0].route;
        // this.$router.push("/" + route);
      } else {
        this.$router.push("/" + item.route);
      }
    },
  },
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
      width: 266px;
      margin-bottom: 50px;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;

      .left-title {
        background: #7853b2;
        padding: 16px 0;
        text-align: center;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 18px;
        color: #ffffff;
      }

      .nav-wrap {
        .nav-item {
          cursor: pointer;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #f8f9fa;
          }

          .nav-content {
            display: flex;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
              border-bottom: none;
            }

            &.active {
              .nav-title {
                color: #7853b2;
                font-weight: 500;
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
                width: 20px;
                height: 20px;
                opacity: 0.7;
              }
            }

            .nav-title {
              flex: 1;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 16px;
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
