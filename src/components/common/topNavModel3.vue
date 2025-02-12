<template>
  <div class="wrap top-nav-3" :class="1">
    <div class="inner w-1400">
      <div class="center">
        <!-- 全部分类下拉 -->
        <div class="quanbu" @mouseover="on_mouseover" @mouseleave="on_mouseleave">
          <!-- <img src="@pro/common/fenlei.png" class="img-1" /> -->
          <span>全部商品分类</span>

          <template>
            <div class="side-nav top-nav-3-side" v-if="show_fenlei">
              <!-- 侧边分类 -->
              <asideChannelNav v-if="config.asideClassifyType == 1" />
              <asideChannelNav2 v-if="config.asideClassifyType == 2" />
              <asideChannelNav3 v-if="config.asideClassifyType == 3" />
              <asideChannelNav4 v-if="config.asideClassifyType == 4" />
            </div>
          </template>
        </div>

        <!-- 导航列表 -->
        <div class="nav-box nav-box-3">
          <div
          data-title="导航样式3"
          class="nav-item nav-item-type-3" v-for="(item, index) in list_nav" :key="index">
            <!-- <span class="nav-title text" :class="item.route == $route.name ? 'active' : ''">{{ item.title }}</span> -->


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
import asideChannelNav2 from "@/components/channel/asideChannelNav2.vue";
import asideChannelNav3 from "@/components/channel/asideChannelNav3.vue";
import asideChannelNav4 from "@/components/channel/asideChannelNav4.vue";

import { mapState } from "vuex";

export default {
  name: "aside-classify",
  components: {
    asideChannelNav,
    asideChannelNav2,
    asideChannelNav3,
    asideChannelNav4,
  },
  props: [],
  data() {
    return {
      show_fenlei: false,
      activeNavIndex: 0,
    };
  },
  computed: {
    ...mapState(["config", "list_channel", "navMap",]),

    list_nav() {
      let cus_navs = [];
      if (this.vuex_config.custom_nav && this.vuex_config.custom_nav.nav_list) {
        cus_navs = this.vuex_config.custom_nav.nav_list;
      }
      return cus_navs;


      let youchang_title = this.vuex_config.youchang_title || "有偿信息";
      var arr = [];

    //debugger;;
      if (this.vuex_navs && this.vuex_navs.length) {
        arr = this.vuex_navs;
      } else {
        arr = [
          { title: "商城首页", route: "" },
          { title: "新品上市", route: "newProduct" },
          { title: "购物指南", route: "" },
          { title: "商城公告", route: "newsList" },
          { title: "关于我们", route: "" },
          { title: youchang_title, route: "youchangNews" },
          { title: "联系我们", route: "" },
        ];

        if (this.vuex_config.lipin_in_open == 1) {
          arr.push({ title: "礼品信息收集", route: "lipinTab" });
        }

        if (this.vuex_config.store_in_open == 1) {
          //商家入驻
          arr.push({ title: "商家入驻", route: "joinBusiness" });
        }
        if (this.vuex_config.info_in_open == 1) {
          //信息发布
          arr.push({ title: "发布信息", route: "", link: "//fabu.hljyr.cn" });
        }
      }

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

    jump_nav(item) {
      console.log({ ...item });

      if(item.route.includes('http')) {
        window.open(item.route, '_blank')
      }
      return



      if (this.vuex_navs && this.vuex_navs.length) {
        this.click_vuex_navs(item);
      } else {
        let title = item.title;
        if (title == "商城首页") {
          this.$router.push("/");
        } else if (title == "购物指南") {
          this.$router.push(this.navMap.shopping_guide.route);
        } else if (title == "关于我们") {
          this.$router.push(this.navMap.about_us.route);
        } else if (title == "联系我们") {
          this.$router.push(this.navMap.contact_us.route);
        } else {
          this.$router.push("/" + item.route);
        }
      }
    },

    click_vuex_navs(item) {
      this.$router.push(item.link || item.route || "");
    },

    on_mouseover() {
      this.show_fenlei = true;
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
  background: var(--main_color);

  width: 100%;
  border-bottom: 1px solid var(--main_color);
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
        width: 204px;
        height: 47px;
        background: var(--main_color);
        background: #e4393c;
        background: rgba(0, 0, 0, 0.2);

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
          flex: 1;
          position: relative;
          cursor: pointer;
          // min-width: 108px;
          font-size: 16px;
          color: #fff;
          color: #000;
          height: 47px;
          line-height: 47px;

          &:hover {
            background: rgba(0, 0, 0, .8);
          }
       

          .nav-title {
            font-size: 16px;
            color: #fff;
            &.active {
              color: #fff;
              font-weight: bold;
            }

            &.router-link-exact-active {
              color: #fff;
              font-weight: bold;
            }
          }

          .text:hover {
            color: #fff;
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
  border-bottom: 1px solid var(--main_color);
  .inner {
    .center {
      .quanbu {
        background: var(--main_color);
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
            color: var(--main_color);
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
