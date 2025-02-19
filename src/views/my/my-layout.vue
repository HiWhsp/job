<template>
  <div class="page-user-wrap">
    <div class="main-title w-1400">会员中心</div>
    <div class="inner w-1400">
      <div class="page-ctx">
        <div class="menu-wrap">
          <div class="nav-wrap">
            <div v-for="(group, gindex) in page_menu" :key="gindex" class="nav-group">
              <div v-if="group.child && group.child.length" class="sub-child">
                <div class="child-title">{{ group.title }}</div>
                <div v-for="(item, index) in group.child" :key="index"
                     :class="$route.name == item.route ? 'active' : ''" class="sub-item" @click="do_toggle_nav(item)">
                  <div class="sub-title">
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="view-wrap">
          <!--          <page_breadcrumb :option="nav_option"/>-->
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {SHOP_TYPE} from '@/config/env.js'

import page_breadcrumb from '@/components/page/page-breadcrumb.vue'

import {mapState} from "vuex";

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
          title: "我的交易",
          route: "",
          child: [
            {
              title: "订单管理",
              route: "order-list",
            },
            {
              title: "我的收藏",
              route: "favorite-list",
            },
            {
              title: "地址管理",
              route: "address-list",
            },
          ]
        },

        {
          title: "我的资产",
          route: "",
          child: [
            {
              title: "我的积分",
              route: "points-record",
            }
          ]
        },

        {
          title: "个人设置",
          route: "",
          child: [
            {
              title: "基本信息",
              route: " my-info",
            },
            {
              title: "会员管理",
              route: "change-password",
            },
            {
              title: "账户安全",
              route: "change-password",
            },
          ]
        },
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

    page_menu() {
      let navList = [];
      navList = this.all_menu;
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

<style lang="less" scoped>
.page-user-wrap {
  background: #fff;
  padding-top: 35px;

  .main-title {
    height: 52px;
    line-height: 52px;
    background: #F4F4F4;
    font-weight: 400;
    font-size: 20px;
    color: #000000;
    padding-left: 20px;
  }

  .inner {
    margin: 0 auto;
    min-height: 70vh;

    .page-ctx {
      padding-top: 30px;
      display: flex;
      justify-content: space-between;
    }

    .menu-wrap {
      width: 360px;
      height: 100%;
      background: #F8F8F8;
      padding-bottom: 65px;

      .nav-wrap {
        .nav-group {

          .sub-child {
            border-bottom: 1px solid #e5e5e5;

            .child-title {
              height: 52px;
              line-height: 52px;
              padding-right: 20px;
              margin-left: 20px;
              font-weight: 700;
              font-size: 16px;
              color: #2C3E50;
              border-bottom: 1px solid #e5e5e5;
            }

            .sub-item {
              height: 52px;
              line-height: 52px;

              padding: 0 20px;
              cursor: pointer;

              .sub-title {
                font-family: Microsoft YaHei, Microsoft YaHei;
                font-weight: 400;
                font-size: 14px;
                color: #666666;
              }

              &.active {
                .sub-title {
                  color: #000;
                  font-weight: bold;
                }
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

<style lang="less" scoped src="@/assets/h5css/user/index.less"></style>
