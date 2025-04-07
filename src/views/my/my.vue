<template>
  <div class="page-user-wrap">
    <div class="inner">
      <div class="page-ctx">
        <div class="user-left">
          <div class="nav-wrap" v-for="(it, i) in filter_userMenu" :key="i">
            <div class="nav-item" v-for="(item, index) in it" :key="index">
              <div class="nav-title main-title" v-if="!item.route || item.is_main" :style="{'paddingLeft': item.route == 'my-index' ? '10px' : '25px'}"
                   :class="$route.name == item.route ? 'active' : ''" @click="do_toggle_nav(item)">
                <img src="@/static/prod/vip.png" alt="" v-if="item.route == 'my-index'">
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
import {SHOP_TYPE} from '@/config/env.js'

export default {
  name: "my",
  components: {},
  data() {
    return {
      //个人中心导航
      userMenu: [
          [
            {
              title: "采购会员",
              route: "",
              is_main: true
            },
            {
              title: "我的订单",
              route: "order-list",
            },
            {
              title: "我的收藏",
              route: "collect",
            },
            {
              title: "个人信息",
              route: "my-info",
            },
            {
              title: "地址管理",
              route: SHOP_TYPE == 'foreign' ? "foreign-address-list" : "address-list",
            },
            {
              title: "修改密码",
              route: "change-password",
            }
          ],
          [
            {
              title: "数据统据",
              route: "",
              is_main: true
            },
            {
              title: "采购统计",
              route: "purchase-count",
            },
          ]
      ],

      activeRoute: "",
      openeds: [
        "order-list",
      ],
    };
  },
  computed: {
    nav_option() {
      let option = [
        {route: '/my-index', title: '用户中心'},
        {route: '', title: this.$route.meta.title}
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
    next();
    this.activeRoute = to.path.replace("/", "");
  },

  watch: {},
  created() {
  },

  mounted() {
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


  },
};
</script>

<style scoped lang="less">
.page-user-wrap {

  .inner {
    width: @width;
    margin: 0 auto;
    min-height: 70vh;
    padding-bottom: 50px;

    .page-ctx {
      padding-top: 30px;
      display: flex;
      justify-content: space-between;
    }

    .user-left {
      width: 220px;
      margin-bottom: 50px;

      .nav-wrap {
        margin-top: 10px;
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

            img {
              width: 24px;
              height: 24px;
            }

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
              background: #FCFAF7;
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
      .nav-wrap:first-child {
        margin-top: 0;
      }
    }

    .user-right {
      flex: 1;
      margin-left: 20px;
      min-height: 50vh;
      .page {
        width: 100%;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/index.less"></style>
