<template>
  <div class="wrap" :class="1">
    <div class="inner w-1400">
      <div class="center">
        <!-- 全部分类下拉 -->
        <div v-if="false" class="quanbu" @mouseover="on_mouseover" @mouseleave="on_mouseleave">
          <img src="@img/common/fenlei.png" class="img-1" />
          <span>全部商品分类</span>
          <div class="side-nav">
            <!-- 侧边分类 -->
            <asideChannelNav />
            <!-- <asideChannelNav2 v-if="config.asideClassifyType == 2" />
              <asideChannelNav3 v-if="config.asideClassifyType == 3" />
              <asideChannelNav4 v-if="config.asideClassifyType == 4" /> -->
          </div>
        </div>

        <!-- 导航列表 -->
        <div class="nav-box nav-box-1">
          <div data-title="导航样式1" class="nav-item nav-item-type-1" v-for="(item, index) in page_nav_list" :key="index">
            <template v-if="!item.route.includes('http')">
              <router-link :to="item.route" class="nav-title">
                {{ item.title }}
              </router-link>
            </template>
            <template v-else>
              <div @click="jump_nav(item)">
                <span class="nav-title text" :class="check_nav_class(item)">{{
                  item.title
                }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import asideChannelNav from "@/components/channel/asideChannelNav.vue";
// import asideChannelNav2 from "@/components/channel/asideChannelNav2.vue";
// import asideChannelNav3 from "@/components/channel/asideChannelNav3.vue";
// import asideChannelNav4 from "@/components/channel/asideChannelNav4.vue";

import { mapState } from "vuex";

export default {
  name: "aside-classify",
  components: {
    asideChannelNav,
    // asideChannelNav2,
    // asideChannelNav3,
    // asideChannelNav4,
  },
  props: [],
  data() {
    return {
      show_fenlei: false,
      activeNavIndex: 0,
    };
  },
  computed: {
    ...mapState(["",]),

    page_nav_list() {
      let route_news = ''
      if (this.vuex_news_cates.length) {
        route_news = '/news?cid=' + this.vuex_news_cates[0].id
      }
      var arr = [
        { title: "首页", route: "/" },
        { title: "协议专区", route: "/product-xieyi" },
        { title: "批量询价", route: "/batch-xunjia" },
        { title: "信田甄选", route: "/product-zhenxuan" },
        { title: "场景专区", route: "/scene" },
        { title: "品牌馆", route: "/product-brand" },
        { title: "内容资讯", route: route_news },
      ];
      return arr;
    },
  },
  watch: {},

  created() { },

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

    jump_nav(item) {
      console.log({ ...item });
      if (item.route.includes('http')) {
        window.open(item.route, '_blank')
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
.wrap {
  height: 47px;
  background: #f00;

  width: 100%;
  border-bottom: 1px solid #f00;

  // height: 40px;
  .inner {
    margin: 0 auto;

    .center {
      display: flex;
      align-items: flex-end;
      height: 47px;

      .quanbu {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 224px;
        height: 52px;
        background: rgba(0, 0, 0, 0.2);
        background: #044FA0;
        background: transparent;

        font-size: 18px;
        color: #ffffff;

        .img-1 {
          width: 25px;
        }

        span {
          margin-left: 8px;
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
          // flex: 1;
          margin-left: 68px;
          text-align: center;
          position: relative;
          cursor: pointer;
          // min-width: 108px;
          font-size: 16px;
          color: #000;
          color: #fff;
          height: 47px;
          line-height: 47px;


          &:hover {
            // background: rgba(0, 0, 0, .8);
          }


          .nav-title {
            font-size: 16px;
            color: #333;
            color: #fff;

            &.active {
              color: #2E4C87;
              font-weight: bold;
            }

            &.router-link-exact-active {
              color: #2E4C87;
              font-weight: bold;
            }
          }

          .text:hover {
            color: #2E4C87;
            font-weight: bold;
          }
        }
      }
    }
  }
}

// 导航样式2  主背景白色

.wrap.nav-bg-white {
  background: #fff;
  border-bottom: 1px solid #f00;

  .inner {
    .center {
      .quanbu {
        background: #f00;
      }

      .nav-box {
        .nav-item {
          .nav-title {
            color: #000;

            &.active {
              color: #000;
              font-weight: bold;
            }
          }

          .text:hover {
            color: #f00;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
