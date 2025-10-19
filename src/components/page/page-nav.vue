<template>
  <div class="nav-wrap">
    <div class="nav-inner w-1400">
      <div class="nav-ctx">
        <!-- 全部分类下拉 -->
        <el-popover
          popper-class="w-nav-popover"
          placement="bottom-start"
          title=""
          width="150"
          trigger="hover"
          content=""
        >
          <router-link
            slot="reference"
            class="u-act u-my flex"
            to="/product-cates"
          >
            <div
              class="all-box"
              @mouseover="on_mouseover"
              @mouseleave="on_mouseleave"
            >
              <img src="@img/common/fenlei.png" class="all-icon" />
              <span class="all-title">全部商品分类</span>
              <!--              <div class="side-nav">-->
              <!--                &lt;!&ndash; <asideChannelNav /> &ndash;&gt;-->
              <!--                &lt;!&ndash; <asideChannelNav2 v-if="config.asideClassifyType == 2" />-->
              <!--                    <asideChannelNav3 v-if="config.asideClassifyType == 3" />-->
              <!--                    <asideChannelNav4 v-if="config.asideClassifyType == 4" /> &ndash;&gt;-->
              <!--              </div>-->
            </div>
          </router-link>
          <div class="pop-child">
            <div
              class="child-item"
              v-for="(sub, index) in cates"
              :key="index"
              @click="navtoRoute(sub)"
              style="cursor: pointer"
            >
              {{ sub.title }}
            </div>
          </div>
        </el-popover>

        <div class="nav-box">
          <div class="nav-item" v-for="(item, index) in nav_list" :key="index">
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
      cates: [],
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
        { title: "首页", route: "/" },
        { title: "协议专区", route: "/product-xieyi" },
        { title: "批量询价", route: "/batch-xunjia" },
        { title: "信田甄选", route: "/product-zhenxuan" },
        { title: "场景专区", route: "/scene" },
        { title: "品牌馆", route: "/product-brand" },
        { title: "内容资讯", route: route_news || "/news" },
      ];
      return arr;
    },
  },
  watch: {},

  created() {
    this.getCate();
  },

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
    getCate() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_channel",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.cates = res.data;
        }
      });
    },
    navtoRoute(item) {
      this.$router.push(`/product-cates?ids=${item.id}`);
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
  height: 48px;
  background: transparent;
  width: 100%;
  // border-bottom: 1px solid #eee;

  // height: 40px;
  .nav-inner {
    margin: 0 auto;

    .nav-ctx {
      display: flex;
      align-items: flex-end;
      height: 48px;

      .all-box {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 324px;
        height: 48px;
        background: rgba(0, 0, 0, 0.2);
        background: transparent;
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
        transition: 0.5s;
        // width: 100%;
        flex: 2;
        display: flex;
        justify-content: flex-start;

        .nav-item {
          margin-right: 90px;
          text-align: center;
          position: relative;
          cursor: pointer;
          // min-width: 108px;
          font-size: 16px;
          color: #000;
          color: #fff;
          height: 47px;
          line-height: 47px;

          &:last-child {
            margin-right: 0;
          }

          &:hover {
            // background: rgba(0, 0, 0, .8);
          }

          .nav-title {
            height: 47px;
            display: inline-flex;
            font-family: Microsoft YaHei, Microsoft YaHei;
            // font-weight: bold;
            font-size: 16px;
            color: #ffffff;

            &.active {
              color: #FF5058;
              font-weight: bold;
            }

            &.router-link-exact-active {
              color: #FF5058;
              font-weight: bold;

              // &::after {
              //   content: "";
              //   position: absolute;
              //   bottom: 2px;
              //   left: 50%;
              //   transform: translate(-50%);

              //   width: 57px;
              //   height: 3px;
              //   background: #2E4C87;
              //   border-radius: 10px 10px 10px 10px;
              // }
            }
          }

          .text:hover {
            color: #FF5058;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
