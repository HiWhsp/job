<template>
  <div class="nav-wrap">
    <div class="nav-inner w-1400">
      <div class="nav-ctx">
        <div class="u-act u-my flex">
          <div class="all-box" @mouseover="on_mouseover" @mouseleave="on_mouseleave">
            <img src="@img/common/fenlei.png" class="all-icon" />
            <router-link to="/product-cates" class="all-title">All Categories</router-link>
          </div>

          <!-- 分类悬浮框 -->
          <div
            v-show="show_fenlei || popoverVisible"
            class="categories-popover"
            @mouseover="on_mouseover"
            @mouseleave="on_mouseleave"
          >
            <div class="categories-list">
              <div v-for="(item, index) in vuex_category_tree" :key="index" class="category-item">
                <div class="category-title">
                  <el-popover
                    placement="right-start"
                    trigger="hover"
                    popper-class="category-sub-popover"
                    :open-delay="100"
                    :append-to-body="true"
                    @show="onPopoverShow"
                    @hide="onPopoverHide"
                  >
                    <template #reference>
                      <span class="category-name" @click="navToCategory(item)">
                        {{ item.title }}
                        <i class="el-icon-arrow-right"></i>
                      </span>
                    </template>

                    <div
                      class="sub-categories-wrapper"
                      v-if="item.channels && item.channels.length > 0"
                    >
                      <div class="sub-categories-header">{{ item.title }}</div>
                      <div class="sub-categories">
                        <div
                          v-for="(subItem, subIndex) in item.channels"
                          :key="subIndex"
                          class="sub-category-item"
                          @click="navToCategory(item, subItem)"
                        >{{ subItem.title }}</div>
                      </div>
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="nav-box">
          <div v-for="(item, index) in vuex_top_title" :key="index" class="nav-item">
            <router-link :to="item.route" class="nav-title">{{ item.title }}</router-link>
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
      popoverVisible: false,
      hideTimer: null
    };
  },
  computed: {
    ...mapState(["vuex_category_tree", "vuex_top_title"]),

    nav_list() {
      let route_news = "";
      let arr = this.vuex_category_tree.filter(item => item.isHot == 1);
      return arr;
      // let arr = [
      //   { title: "Hospital", route: "/product-cates" },
      //   { title: "Clinic", route: "/product-cates" },
      //   { title: "Nursing Home", route: "/product-cates" },
      //   { title: "Home Care", route: "/product-cates" },
      //   { title: "Health & Beauty", route: "/product-cates" },
      //   { title: "Ophthalmic", route: "/product-cates" },
      //   { title: "Dental", route: "/product-cates" },
      //   { title: "Lab", route: "/product-cates" },
      //   { title: "Veterinary", route: "/product-cates" },
      //   { title: "Safety", route: "/product-cates" },
      //   { title: "Other", route: "/product-cates" }
      // ];
      // return arr;
    }
  },
  watch: {},

  created() {
    this.getCate();
  },
  mounted() {
    // 监听全局鼠标移动，用于检查鼠标是否在popover上
    document.addEventListener("mousemove", this.handleGlobalMouseMove);
  },
  beforeDestroy() {
    document.removeEventListener("mousemove", this.handleGlobalMouseMove);
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
  },

  methods: {
    check_nav_class(item) {
      let item_route = item.route;
      if (item_route[0] == "/") {
        item_route = item_route.substr(1);
      }
      let obj = {
        active: item_route == this.$route.name,
        active: item.route == this.$route.path
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
          action: "product_channel"
        }
      }).then(res => {
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
      //获取配置信息
      //判断当前模板是否需要鼠标悬浮显示下拉导航
      if (this.$route.name != "index") {
        this.show_fenlei = true;
      } else {
        this.show_fenlei = true; // 允许在首页也显示
      }
    },
    on_mouseleave() {
      // 清除之前的定时器
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
      }

      // 延迟检查，给鼠标移动到popover的时间
      this.hideTimer = setTimeout(() => {
        // 如果popover不在显示，且鼠标不在popover上，则关闭悬浮框
        if (!this.popoverVisible) {
          const popover = document.querySelector(".category-sub-popover");
          // 检查popover是否还存在且可见
          if (!popover || !popover.offsetParent) {
            this.show_fenlei = false;
          }
        }
      }, 200);
    },
    onPopoverShow() {
      // 清除关闭定时器
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
      this.popoverVisible = true;
      this.show_fenlei = true;
    },
    onPopoverHide() {
      // 只是标记popover已隐藏，不立即关闭悬浮框
      // 如果鼠标还在悬浮框内，悬浮框应该保持显示
      // 只有当鼠标真正离开悬浮框区域时，才会通过 on_mouseleave 关闭
      this.popoverVisible = false;
    },
    handleGlobalMouseMove(e) {
      // 当popover隐藏但悬浮框还在显示时，检查鼠标是否还在相关区域
      if (!this.popoverVisible && this.show_fenlei) {
        const target = e.target;
        const categoriesPopover = document.querySelector(".categories-popover");
        const allBox = document.querySelector(".all-box");

        // 检查鼠标是否在悬浮框或All Categories上
        const isOverCategories =
          categoriesPopover &&
          (categoriesPopover.contains(target) || categoriesPopover === target);
        const isOverAllBox =
          allBox && (allBox.contains(target) || allBox === target);

        // 如果鼠标不在相关元素上，延迟关闭
        if (!isOverCategories && !isOverAllBox) {
          if (this.hideTimer) {
            clearTimeout(this.hideTimer);
          }
          this.hideTimer = setTimeout(() => {
            // 再次检查，确保鼠标真的不在相关区域
            const currentTarget = document.elementFromPoint(
              e.clientX,
              e.clientY
            );
            const stillOverCategories =
              categoriesPopover &&
              (categoriesPopover.contains(currentTarget) ||
                categoriesPopover === currentTarget);
            const stillOverAllBox =
              allBox &&
              (allBox.contains(currentTarget) || allBox === currentTarget);

            if (!stillOverCategories && !stillOverAllBox) {
              this.show_fenlei = false;
            }
          }, 150);
        } else {
          // 如果鼠标在相关元素上，清除关闭定时器
          if (this.hideTimer) {
            clearTimeout(this.hideTimer);
            this.hideTimer = null;
          }
        }
      }
    },
    navToCategory(item, subItem) {
      const ids = subItem ? `${item.id}-${subItem.id}` : item.id;
      // 跳转到分类页面
      this.$router.push({
        path: "/product-cates",
        query: {
          ids,
        }
      });
      this.show_fenlei = false;
      this.popoverVisible = false;
    }
  }
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
      position: relative;

      .u-act.u-my.flex {
        position: relative;
      }

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
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 18px;
          color: #ffffff;
          text-decoration: none;

          &:hover {
            color: #ffffff;
          }
        }

        .side-nav {
          position: absolute;
          top: 49px;
          z-index: 100000;
          width: 204px;
        }
      }

      // 分类悬浮框样式
      .categories-popover {
        position: absolute;
        top: 54px;
        left: 0;
        width: 1600px;
        max-height: 600px;
        background: #ffffff;
        border: 1px solid #e4e7ed;
        border-top: none;
        border-radius: 0 0 12px 12px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        z-index: 9;
        overflow: visible;

        .categories-list {
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          max-height: 560px;
          overflow-y: auto;
          overflow-x: visible;

          .category-item {
            position: relative;
            z-index: 1;

            &:nth-child(4n) {
              border-right: none;
            }

            .category-title {
              display: flex;
              align-items: center;
              padding: 12px 20px;
              cursor: pointer;
              font-size: 14px;
              color: #333333;
              transition: all 0.3s;

              .category-name {
                display: inline-block;
                cursor: pointer;
                font-size: 20px;

                &:hover {
                  color: #ec6a2b;
                }
              }

              i {
                font-size: 12px;
                color: #909399;
                margin-left: auto;
              }
            }
          }
        }
      }

      // el-popover 内容样式
      :deep(.category-sub-popover) {
        padding: 0 !important;
        min-width: 250px;
        max-width: 1000px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10001 !important;
        overflow: hidden;
      }

      // 确保 el-popover 的容器有足够高的 z-index
      :deep(.el-popper) {
        z-index: 10001 !important;
      }

      .no-sub-categories {
        padding: 10px;
        text-align: center;
        color: #909399;
        font-size: 12px;
      }

      .nav-box {
        transition: 0.5s;
        flex: 2;
        display: flex;
        gap: 30px;
        padding-left: 25px;

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
            color: #00306b;
            text-align: center;

            &.active {
              font-weight: bold;
              color: #00306b;
            }

            &.router-link-exact-active {
              font-weight: bold;
              color: #00306b;
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
.sub-categories-wrapper {
  padding: 5px 10px;
  .sub-categories-header {
    font-size: 20px;
    font-weight: bold;
    color: #ec6a2b;
  }

  .sub-categories {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 35px;
    width: 100%;

    .sub-category-item {
      cursor: pointer;
      font-size: 20px;
      color: #1E262E;
      transition: all 0.3s;
      white-space: nowrap;

      &:hover {
        color: #ec6a2b;
      }
    }
  }
}
</style>
