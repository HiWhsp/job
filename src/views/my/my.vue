<template>
  <div class="page-user-wrap">



    <div class="inner">
      <pageBreadcrumb :option="nav_option" />
      <div class="page-ctx">
        <div class="user-left">
          <div class="nav-wrap">
            <div class="nav-item" v-for="(item, index) in filter_userMenu" :key="index">
              <div class="nav-title main-title" v-if="!item.route || item.is_main"
                :class="$route.name == item.route ? 'active' : ''" @click="do_toggle_nav(item)">
                {{ item.title }}
              </div>
              <div v-else class="nav-title link" :class="$route.name == item.route ? 'active' : ''"
                @click="do_toggle_nav(item)">
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
import { SHOP_TYPE } from '@/config/env.js'

import pageBreadcrumb from '@/components/page/page-breadcrumb.vue'

import { mapState } from "vuex";

export default {
  name: "my",
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      //个人中心导航
      userMenu: [
        {
          title: "会员中心",
          route: "my-index",
          is_main: true,
        },
        // {
        //   title: "会员中心",
        //   route: "my-index",
        // },

        {
          title: "订单中心",
          route: "",
        },
        {
          title: "我的订单",
          route: "order-list",
        },
        // {
        //   title: "我的售后",
        //   route: "myRefund",
        // },
        {
          title: "评价晒单",
          route: "my-review-list",
        },

        // {
        //   title: "我的购物车",
        //   route: "cart",
        // },
        // {
        //   title: "我的售后",
        //   route: "myRefund",
        // },

        {
          title: "我的活动",
          route: "",
        },
        {
          title: "我的收藏",
          route: "favorite-list",
        },
        {
          title: "我的足迹",
          route: "browse-history",
        },

        {
          title: "个人设置",
          route: "",
        },
        {
          title: "地址管理",
          route: SHOP_TYPE == 'foreign' ? "foreign-address-list" : "address-list",
        },

        {
          title: "个人资料",
          route: "my-info",
        },

        {
          title: "修改密码",
          route: "change-password",
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
        // {
        //   title: "我的积分",
        //   route: "pointsDetail",
        // },
        // {
        //   title: "积分商城",
        //   route: "pointsMall",
        // },
      ],

      activeRoute: "",
      openeds: [
        "order-list",
      ],
    };
  },
  computed: {
    // ...mapState(["",]),
    nav_option() {
      let option = [
        { route: '/my-index', title: '用户中心', title: 'Personal Center' },
        { route: '', title: this.$route.meta.title, title: this.$route.meta.title }
      ]
      return option
    },

    filter_userMenu() {
      let navList = [];
      navList = this.userMenu;
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

  mounted() { },

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
  background: #F9FAFC;
  padding-top: 35px;

  .inner {
    width: @width;
    margin: 0 auto;
    min-height: 70vh;

    .page-ctx {
      padding-top: 30px;
      display: flex;
      justify-content: space-between;
    }

    .user-left {
      width: 240px;
      min-width: 240px;
      margin-bottom: 50px;

      .nav-wrap {
        background: #f9f9f9;
        background: #fff;
        padding-bottom: 20px;
        padding-top: 30px;


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
                color: #4CA5E4;
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
              color: #4CA5E4;

              &:before {
                // content: "";
                // position: absolute;
                // left: 0;
                // top: 0;
                // bottom: 0;
                // width: 3px;
                // background-color: #4CA5E4;
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
      flex: 2;
      margin-left: 35px;
      min-height: 50vh;
      padding-bottom: 50px;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/index.less"></style>
