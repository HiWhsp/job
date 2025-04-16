<template>
  <div class="page-user-wrap">
    <div class="inner">
      <div class="page-ctx">
        <div class="user-left">
          <div v-for="(it, i) in filter_userMenu" :key="i" class="nav-wrap">
            <div v-for="(item, index) in it" :key="index" class="nav-item">
              <div v-if="!item.route || item.is_main" :class="$route.name == item.route ? 'active' : ''"
                   :style="{'paddingLeft': item.route == 'my-index' ? '10px' : '25px'}"
                   class="nav-title main-title" @click="do_toggle_nav(item)">
                <img v-if="item.route == 'my-index'" alt="" src="@/static/prod/vip.png">
                {{ item.title }}
              </div>
              <div v-else :class="$route.name == item.route ? 'active' : ''" class="nav-title link"
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
            title: "供应商专区",
            route: "my-index",
            is_main: true
          },
          {
            title: "商品列表",
            route: "G_product_list",
          },
          {
            title: "新增商品",
            route: "G_product_add",
          },
          {
            title: "我的订单",
            route: "G_order_list",
          },
          {
            title: "收款账户管理",
            route: "G_account_list",
          },
          {
            title: "修改密码",
            route: "G_change_password",
          }
        ],
        [
          {
            title: "数据统据",
            route: "",
            is_main: true
          },
          {
            title: "商品销量统计",
            route: "G_purchase_count",
          },
          {
            title: "退出登录",
            route: "loginOut",
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
      navList = this.userMenu
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
      if (!item.route || item.route === 'my-index') {
        // let route = item.sub[0].route;
        // this.$router.push("/" + route);
      } else if (item.title === '退出登录') {
        this.$store.commit("clear_loginInfo");
        this.$router.push("/login");
      } else {
        this.$router.push("/" + item.route);
      }
    },


  },
};
</script>

<style lang="less" scoped>
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

<style lang="less" scoped src="@/assets/h5css/user/index.less"></style>
