<template>
  <div class="page-user-wrap">
    <div class="inner w-1400">
      <page_breadcrumb :option="nav_option" />

      <div class="page-ctx">
        <div class="menu-wrap">
          <div class="left-title">个人中心</div>
          <div class="title-line"></div>
          <div class="nav-wrap">
            <div
              class="nav-group"
              v-for="(group, gindex) in page_menu"
              :key="gindex"
            >
              <div class="group-title-box flex">
                <div class="icon-box">
                  <img :src="group.icon" alt="" />
                </div>
                <div class="group-title">
                  {{ group.title }}
                </div>
                <div class="arrow-box">
                  <img
                    class="arrow-right"
                    src="@img/my/arrow-right.png"
                    alt=""
                  />
                  <!-- <img class="arrow-down" src="@img/my/arrow-down.png" alt=""> -->
                </div>
              </div>
              <div class="sub-child" v-if="group.child && group.child.length">
                <div
                  class="sub-item"
                  v-for="(item, index) in group.child"
                  :key="index"
                  @click="do_toggle_nav(item)"
                >
                  <div
                    class="sub-title"
                    :class="$route.name == item.route ? 'active' : ''"
                  >
                    {{ item.title }}
                  </div>
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
        // {
        //   title: "个人中心",
        //   route: "my-index",
        //   is_main: true,
        // },
        {
          title: "订单管理",
          route: "",
          icon: require("@img/my/nav-1.png"),
          child: [
            {
              title: "我的订单",
              route: "order-list",
            },
            {
              title: "我的售后",
              route: "refund-list",
            },
            {
              title: "我的评价",
              route: "my-review-list",
            },
          ],
        },
        {
          title: "我的活动",
          route: "",
          icon: require("@img/my/nav-2.png"),
          child: [
            {
              title: "我的充值",
              route: "balance-list",
            },
            {
              title: "我的兑换卡",
              route: "card-list",
            },
            {
              title: "我的收藏",
              route: "favorite-list",
            },
            {
              title: "我的足迹",
              route: "browse-history",
            },
          ],
        },
        {
          title: "个人资料",
          route: "",
          icon: require("@img/my/nav-3.png"),
          child: [
            {
              title: "地址管理",
              route: "address-list",
            },
            {
              title: "我的发票",
              route: "invoice-list",
            },
            {
              title: "个人资料",
              route: "my-info",
            },
            {
              title: "修改密码",
              route: "change-password",
            },
          ],
        },
        // {
        //   title: "其他",
        //   route: "",
        //   icon: require('@img/my/nav-3.png'),
        //   child: [
        //     {
        //       title: "我的积分",
        //       route: "points-record",
        //     },
        //     {
        //       title: "我的优惠券",
        //       route: "coupon-list",
        //     },
        //     {
        //       title: "领券中心",
        //       route: "coupon-center",
        //     },
        //   ]
        // },
      ],
      activeRoute: "",
      openeds: ["order-list"],
    };
  },
  computed: {
    // ...mapState(["",]),
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
      padding-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .menu-wrap {
      width: 220px;
      min-width: 220px;
      margin-bottom: 50px;
      background: #f9f9f9;
      background: #fff;
      padding-bottom: 20px;

      .left-title {
        padding: 18px 0;
        text-align: center;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
      }

      .title-line {
        margin: 0 auto;
        width: 196px;
        background: #f0f0f0;
        height: 1px;
      }

      .nav-wrap {
        .nav-group {
          // margin-bottom: 10px;
          &::after {
            content: "";
            display: inline-block;
            margin: 0 auto;
            width: 196px;
            height: 1px;
            background: #f0f0f0;
          }

          &:last-child {
            &::after {
              display: none;
            }
          }

          .group-title-box {
            padding: 14px 14px;
            cursor: pointer;

            .icon-box {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 32px;
              height: 22px;

              img {
                height: 14px;
              }
            }

            .group-title {
              flex: 1;
              font-family: Poppins, Poppins;
              font-weight: bold;
              font-size: 16px;
              color: #333333;
            }

            .arrow-box {
              img {
              }

              .arrow-down {
                width: 14.22px;
              }

              .arrow-right {
                height: 14.22px;
              }
            }
          }

          .sub-child {
            .sub-item {
              padding: 8px 45px;
              cursor: pointer;

              .sub-title {
                font-family: Poppins, Poppins;
                font-weight: 400;
                font-size: 14px;
                color: #1F1F1F;

                &.active {
                  color: #009f39;
                }
              }
            }
          }
        }

        .nav-item {
          overflow: hidden;

          .nav-title {
            position: relative;
            cursor: pointer;
            padding-left: 30px;
            padding-left: 70px;
            text-align: left;

            font-family: Poppins, Poppins;
            font-weight: 400;
            font-size: 12px;
            color: #808080;

            &.link {
              margin-bottom: 16px;

              &:hover {
                color: #009f39;
              }
            }

            &.main-title {
              margin-bottom: 24px;
              cursor: pointer;
              padding-left: 50px;
              user-select: none;
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 14px;
              color: #333333;
            }

            &.active {
              // background: #ffffff;
              // background: #fffaf7;
              color: #009f39;

              &:before {
                // content: "";
                // position: absolute;
                // left: 0;
                // top: 0;
                // bottom: 0;
                // width: 3px;
                // background-color: #00306B;
              }
            }

            &[data-hide="hide"] {
              display: none;
            }
          }

          &:first-child {
            .main-title {
              margin-top: 0;
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
