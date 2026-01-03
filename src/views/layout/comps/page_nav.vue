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
              <span class="all-title">全部商品分类</span>
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
            :class="[
              'nav-item',
              item.title === $route.query.tags ? 'active' : '',
            ]"
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
      let arr = [{ title: "首页", route: "/" }];
      if (this.vuex_top_title.length) {
        // console.log(this,'this','????????????')
        // console.log(this.vuex_top_title,'this.vuex_news_cates','????????????')
        // console.log(this.vuex_top_title,'this.vuex_top_title','????????????')
        
        arr = arr.concat(this.vuex_top_title);
      }
      arr.push({ title: "领券中心", route: "/coupon-center" });
      //  = [
      // { title: "首页", route: "/" },
      // { title: "医院诊所", route: "/product-xieyi" },
      // { title: "医疗美容", route: "/batch-xunjia" },
      // { title: "母婴会所", route: "/product-zhenxuan" },
      // { title: "养老护理", route: "/scene" },
      // { title: "宠物医院", route: "/product-brand" },
      // { title: "牙科诊所", route: route_news },
      // { title: "其他", route: "/scene" },
      //   { title: "领券中心", route: "/coupon-center" },
      // ];
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
  height: 50px;
  background: #7853b2;
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
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 324px;
        height: 50px;
        background: #5b339a;
        font-size: 18px;
        color: #ffffff;
        padding-left: 32px;

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
          // margin-right: 70px;
          text-align: center;
          position: relative;
          cursor: pointer;
          // min-width: 108px;
          font-size: 18px;
          color: #fff;
          height: 49px;
          line-height: 49px;
          width: calc(100% / 9);

          &:last-child {
            margin-right: 0;
          }
          &.active {
            background: #5b339a;
          }
          &:hover {
            // background: rgba(0, 0, 0, .8);
          }

          .nav-title {
            width: 100%;
            text-align: center;
            height: 49px;
            display: inline-flex;
            display: inline-block;

            font-family: Microsoft YaHei, Microsoft YaHei;
            // font-weight: bold;
            font-size: 18px;
            color: #ffffff;
            text-align: center;

            &.active {
              // color: #3b64fc;
              font-weight: bold;
              color: #ffc208;
            }

            &.router-link-exact-active {
              // color: #3b64fc;
              font-weight: bold;
              color: #ffc208;

              // &::after {
              //   content: "";
              //   position: absolute;
              //   bottom: 2px;
              //   left: 50%;
              //   transform: translate(-50%);

              //   width: 57px;
              //   height: 3px;
              //   background: #3b64fc;
              //   border-radius: 10px 10px 10px 10px;
              // }
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
  