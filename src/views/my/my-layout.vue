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
              v-if="
                (!group.blacklist || group.blacklist.indexOf(staffType) < 0) &&
                (!group.blacklistT || group.blacklistT.indexOf(userType) < 0)
              "
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
                  v-if="
                    !item.blacklist || item.blacklist.indexOf(staffType) < 0
                  "
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

import page_breadcrumb from "@/components/page/page-breadcrumb.vue";

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
              title: "售后服务",
              route: "refund-list",
            },
            {
              title: "我的询价",
              route: "batch-xunjia-list",
            },

            {
              title: "我的账单",
              route: "store-man",
            },
          ],
        },
        {
          title: "我关注的",
          route: "",
          icon: require("@img/my/nav-2.png"),
          child: [
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
          title: "账号中心",
          route: "",
          icon: require("@img/my/nav-3.png"),
          child: [
            {
              title: "我的发票",
              route: "invoice-list",
              blacklist: [1, 2, 3],
            },
            {
              title: "个人信息",
              route: "my-info",
            },
            {
              title: "地址管理",
              route: "address-list",
            },
            {
              title: "修改密码",
              route: "change-password",
            },
            {
              title: "子账号管理",
              route: "sub-account-list",
            }
          ],
        },
        {
          title: "企业管理",
          route: "",
          icon: require("@img/my/nav-4.png"),
          blacklistT: [1],
          child: [
            {
              title: "人员管理",
              route: "enterprise-member-man",
            },
          ],
        },
        // {
        //   title: "评价晒单",
        //   route: "my-review-list",
        // },

        // {
        //   title: "意见反馈",
        //   route: "feedback",
        // },
        // {
        //   title: "我的优惠券",
        //   route: "myCoupon",
        // },
        // {
        //   title: "领券中心",
        //   route: "couponCenter",
        // },
        // {
        //   title: "账户资金",
        //   route: "",
        // },
        // {
        //   title: "我的佣金",
        //   route: "myCommission",
        // },
        // {
        //   title: "我的业绩",
        //   route: "myYeJi",
        // },

        // {
        //   title: "我的团队",
        //   route: "myTeam",
        // },
        // {
        //   title: "分润统计",
        //   route: "myFenRun",
        // },
        // {
        //   title: "在线充值",
        //   route: "yueChongzhi",
        // },
        // {
        //   title: "余额明细",
        //   route: "yueMingxi",
        // },

        // {
        //   title: "积分商城",
        //   route: "pointsMall",
        // },
      ],
      activeRoute: "",
      openeds: ["order-list"],
      staffType: 0,
      userType: 0,
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
    console.log(this.vuex_user);
    console.log(this.vuex_user.staffType);
    this.staffType = this.vuex_user.staffType;
    this.userType = this.vuex_user.type;
    console.log(this.userType);
    this.$forceUpdate();
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
  background: #F3F3F3;
  padding-top: 20px;

  .inner {
    margin: 0 auto;
    min-height: 70vh;

    .page-ctx {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
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
        font-family: Microsoft YaHei, Microsoft YaHei;
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
              font-family: Microsoft YaHei, Microsoft YaHei;
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
                font-family: Microsoft YaHei, Microsoft YaHei;
                font-weight: 400;
                font-size: 14px;
                color: #666666;

                &.active {
                  color: #F74747;
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

            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 12px;
            color: #808080;

            &.link {
              margin-bottom: 16px;

              &:hover {
                color: #F74747;
              }
            }

            &.main-title {
              margin-bottom: 24px;
              cursor: pointer;
              padding-left: 50px;
              user-select: none;
              font-family: OPPOSans, OPPOSans;
              font-weight: 400;
              font-size: 14px;
              color: #333333;
            }

            &.active {
              // background: #ffffff;
              // background: #fffaf7;
              color: #F74747;

              &:before {
                // content: "";
                // position: absolute;
                // left: 0;
                // top: 0;
                // bottom: 0;
                // width: 3px;
                // background-color: #F74747;
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
