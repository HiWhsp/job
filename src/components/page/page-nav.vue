<template>
  <div class="nav-wrap">
    <div class="nav-inner w-1400">
      <div class="nav-ctx">
        <div
          class="all-box"
          @mouseover="on_mouseover"
          @mouseleave="on_mouseleave"
        >
          <img src="@img/common/fenlei.png" class="all-icon" />
          <span class="all-title">全部商品分类</span>
          <div class="side-nav">
            <!-- <asideChannelNav /> -->
            <!-- <asideChannelNav2 v-if="config.asideClassifyType == 2" />
                <asideChannelNav3 v-if="config.asideClassifyType == 3" />
                <asideChannelNav4 v-if="config.asideClassifyType == 4" /> -->
          </div>
        </div>
        <div class="nav-box">
          <div
            class="nav-item"
            v-for="(item, index) in nav_list"
            :key="index"
            :class="{ active: item.active_routes.includes($route.name) }"
          >
            <router-link :to="item.route" class="nav-title">
              {{ item.title }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { mapState } from "vuex";

export default {
  name: "aside-classify",
  components: {},
  props: [],
  data() {
    return {
      show_fenlei: false,
      activeNavIndex: 0,
    };
  },
  computed: {
    ...mapState([""]),

    nav_list() {
      let route_news = "";
      if (this.vuex_news_cates.length) {
        route_news = "/news?cid=" + this.vuex_news_cates[0].id;
      }
      var arr = [
        { title: "首页", route: "/", active_routes: ["/"] },
        {
          title: "热卖产品",
          route: "/product-remai",
          active_routes: ["product-remai"],
        },
        {
          title: "中科优选",
          route: "/product-youxuan",
          active_routes: ["product-youxuan"],
        },
        {
          title: "充值中心",
          route: "/balance",
          active_routes: ["balance"],
        },
        { title: "兑换卡", route: "/card", active_routes: ["card"] },
        // { title: "内容资讯", route: route_news },
      ];
      return arr;
    },
  },
  watch: {},

  created() {},

  methods: {
    check_nav_class(item) {
      let item_route = item.route;
      if (item_route[0] == "/") {
        item_route = item_route.substr(1);
      }
      let obj = {
        active: item_route == this.$route.name,
        active: item.route == this.$route.path,
      };
      return obj;
    },

    to_nav(item) {
      console.log({ ...item });
      if (item.route.includes("http")) {
        window.open(item.route, "_blank");
      }
    },

    on_mouseover() {
      //this.show_fenlei = true;
      //获取配置信息
      //判断当前模板是否需要鼠标悬浮显示下拉导航
      if (this.$route.name != "index") {
        this.show_fenlei = true;
      } else {
        this.show_fenlei = false;
      }
    },
    on_mouseleave() {
      this.show_fenlei = false;
    },
  },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped lang="less">
.nav-wrap {
  height: 50px;
  background: #009f39;
  width: 100%;
  // border-bottom: 1px solid #eee;

  // height: 40px;
  .nav-inner {
    margin: 0 auto;

    .nav-ctx {
      display: flex;
      align-items: flex-end;
      height: 50px;

      .all-box {
        width: 226px;
        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;
        position: relative;
        height: 50px;
        background: #008730;
        font-size: 18px;
        color: #ffffff;

        .all-icon {
          width: 24px;
        }

        .all-title {
          margin-left: 18px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: bold;
          font-size: 18px;
          color: #ffffff;
        }

        .side-nav {
          position: absolute;
          top: 47px;
          z-index: 100000;
          width: 204px;
        }
      }

      .nav-box {
        margin-left: 30px;
        transition: 0.5s;
        // width: 100%;
        flex: 1;
        display: flex;
        justify-content: flex-start;

        .nav-item {
          margin-right: 50px;
          text-align: center;
          position: relative;
          cursor: pointer;
          // min-width: 108px;
          font-size: 16px;
          color: #000;
          color: #fff;
          height: 47px;
          line-height: 47px;
          background: #009f39;

          &:last-child {
            margin-right: 0;
          }
          &:hover {
            // background: rgba(0, 0, 0, .8);
          }

          &.active {
            background: #008730;
            font-weight: bold;
            .nav-title {
              font-weight: bold;
            }
          }
          .nav-title {
            display: inline-flex;
            justify-content: center;
            min-width: 148px;
            padding: 0;
            height: 47px;

            font-family: Microsoft YaHei, Microsoft YaHei;
            font-size: 16px;
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>
  