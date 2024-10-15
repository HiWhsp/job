<template>
  <div class="page-user-wrap">
    <div class="inner">
      <div class="page-ctx">
        <div class="user-left">
          <div class="nav-wrap">
            <div
              class="nav-item"
              v-for="(item, index) in filter_userMenu"
              :key="index"
            >
              <div
                class="nav-title main-title"
                v-if="!item.route || item.is_main"
                :class="currentRoute == item.route ? 'active' : ''"
                @click="do_toggle_nav(item)"
              >
                {{ item.title }}
              </div>
              <div
                v-else
                class="nav-title link"
                :class="currentRoute == item.route ? 'active' : ''"
                @click="do_toggle_nav(item)"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
        <div class="user-right">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SHOP_TYPE } from "@/config/env.js";

export default {
  name: "my",
  components: {},
  data() {
    return {
      //个人中心导航
      userMenu: [
        // 会员中心
        {
          title: "会员中心",
          route: "",
        },
        {
          title: "会员中心",
          route: "/member-Center",
        },
        //订单中心
        {
          title: "订单中心",
          route: "",
        },
        {
          title: "订单列表",
          route: "/order-list",
        },
        {
          title: "售后订单",
          route: "/after-sales-order",
        },
        {
          title: "购物车",
          route: "/cart",
        },
        {
          title: "发票信息",
          route: "/invoice-info",
        },
        {
          title: "激光加工订单",
          route: "/laser-order",
        },
        //我的活动
        {
          title: "我的活动",
          route: "",
        },
        {
          title: "我的优惠券",
          route: "/coupon-list",
        },
        {
          title: "领券中心",
          route: "/couponCenter",
        },
        {
          title: "我的积分",
          route: "/pointsDetail",
        },
        {
          title: "积分商城",
          route: "/integralWinGoods",
        },

        //反馈问题
        {
          title: "我的关注",
          route: "",
        },
        {
          title: "我的收藏",
          route: "/my-collection",
        },

        //个人设置
        {
          title: "个人设置",
          route: "",
        },
        {
          title: "收货地址",
          route:
            SHOP_TYPE == "foreign" ? "foreign-address-list" : "address-list",
        },

        {
          title: "个人资料",
          route: "/my-info",
        },

        {
          title: "修改密码",
          route: "/change-password",
        },

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
      ],
      currentRoute: '-a'
    };
  },
  created() {
    this.currentRoute = this.$route.path;
  },
  computed: {
    nav_option() {
      let option = [
        { route: "/my-index", title: "用户中心" },
        { route: "", title: this.$route.meta.title },
      ];
      return option;
    },
    filter_userMenu() {
      let navList = [];
      navList = this.userMenu;
      return navList;
    },
  },
  methods: {
    do_toggle_nav(item) {
      if (!item.route) {
        // let route = item.sub[0].route;
        // this.$router.push("/" + route);
      } else {
        this.currentRoute = item.route;
        this.$router.push(item.route);
      }
    },
  },
};
</script>

<style scoped lang="less">
.page-user-wrap {
  background: #f4f4f6;

  .inner {
    margin: 0 260px;
    padding: 32px 0 29px;

    .page-ctx {
      display: flex;
      gap: 20px;
      border-radius: 4px;
    }

    .user-left {
      width: 220px;
      flex-shrink: 0;

      .nav-wrap {
        background: #fff;
        padding-bottom: 20px;
        padding-top: 15px;

        .nav-item {
          overflow: hidden;

          .nav-title {
            position: relative;
            cursor: pointer;
            padding-left: 40px;
            text-align: left;

            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 12px;
            color: #808080;

            &.link {
              margin-bottom: 4px;
              height: 32px;
              line-height: 32px;
              font-family: Roboto, Roboto;
              font-weight: 400;
              font-size: 14px;
              color: #808080;
              font-style: normal;
              text-transform: none;

              &:hover {
                color: @theme;
              }
            }

            &.main-title {
              margin-bottom: 14px;
              cursor: pointer;
              padding-left: 25px;
              user-select: none;
              font-weight: 400;

              font-family: Roboto, Roboto;
              font-weight: 400;
              font-size: 16px;
              color: #333333;
              font-style: normal;
              text-transform: none;
            }

            &.active {
              background: #f8f9fb;
              color: @theme;

              &:before {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background-color: @theme;
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

    .user-right {
      flex: 1;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/index.less"></style>
