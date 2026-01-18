<template>
  <div class="nav-wrap">
    <div class="nav-inner w-1400">
      <div class="nav-ctx">
        <!-- 全部分类下拉 -->
        <!-- <el-popover
          popper-class="w-nav-popover"
          placement="bottom-start"
          title=""
          width="150"
          trigger="hover"
          content=""
        > -->
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
            <span class="all-title">All Categories</span>
            <!--              <div class="side-nav">-->
            <!--                &lt;!&ndash; <asideChannelNav /> &ndash;&gt;-->
            <!--                &lt;!&ndash; <asideChannelNav2 v-if="config.asideClassifyType == 2" />-->
            <!--                    <asideChannelNav3 v-if="config.asideClassifyType == 3" />-->
            <!--                    <asideChannelNav4 v-if="config.asideClassifyType == 4" /> &ndash;&gt;-->
            <!--              </div>-->
          </div>
        </router-link>
        <!-- <div class="pop-child">
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
        </el-popover> -->

        <div class="nav-box">
          <div
            v-for="(item, index) in nav_list"
            :key="index"
            class="nav-item"
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
      cates: [],
    };
  },
  computed: {
    ...mapState([""]),

    nav_list() {
      let route_news = "";
      let arr = [
        { title: "Hospital", route: "/product-cates" },
        { title: "Clinic", route: "/product-cates" },
        { title: "Nursing Home", route: "/product-cates" },
        { title: "Home Care", route: "/product-cates" },
        { title: "Health & Beauty", route: "/product-cates" },
        { title: "Ophthalmic", route: "/product-cates" },
        { title: "Dental", route: "/product-cates" },
        { title: "Lab", route: "/product-cates" },
        { title: "Veterinary", route: "/product-cates" },
        { title: "Safety", route: "/product-cates" },
        { title: "Other", route: "/product-cates" },
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
      console.log(item, "item");
      // this.$router.push(`/product-cates?ids=${item.id}`);
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
  height: 54px;
  width: 100%;

  // height: 40px;
  .nav-inner {
    margin: 0 auto;

    .nav-ctx {
      display: flex;
      align-items: flex-end;

      .all-box {
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 236px;
        height: 54px;
        background: #ec6a2b;
        border-radius: 12px 12px 0px 0px;
        color: #ffffff;
        font-size: 20px;
        .all-icon {
          width: 26px;
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
          top: 49px;
          z-index: 100000;
          width: 204px;
        }
      }

      .nav-box {
        transition: 0.5s;
        // width: 100%;
        flex: 2;
        display: flex;
        justify-content: space-around;

        .nav-item {
          text-align: center;
          position: relative;
          cursor: pointer;
          font-size: 18px;
          color: #fff;
          height: 49px;
          line-height: 49px;

          &:last-child {
            margin-right: 0;
          }

          .nav-title {
            width: 100%;
            text-align: center;
            font-weight: 600;
            font-size: 20px;
            color: #00306B;
            text-align: center;

            &.active {
              font-weight: bold;
              color: #00306B;
            }

            &.router-link-exact-active {
              font-weight: bold;
              color: #00306B;
            }
          }

          .text:hover {
            color: #3b64fc;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
