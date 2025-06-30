<template>
  <div id="app">
    <template v-if="!is_show_login_comp">
      <AdBanner />
      <page_header_ellsenn data-title="普通页面顶部" />
      <!-- <page_header_mobile /> -->

      <div class="layout-box">
        <router-view></router-view>
      </div>

      <page_footer_ellsenn data-title="普通页面底部" />
      <page_aside />
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import page_footer_ellsenn from "@/components/page/page-footer-ellsenn.vue";
import page_header_ellsenn from "@/components/page/page-header-ellsenn.vue";
import page_header_mobile from "@/components/page/page-header-mobile.vue"; //移动端顶部
import AdBanner from "@/components/common/AdBanner.vue"; //广告横幅
//
import page_aside from "@/components/page/page-aside.vue";
// import page_kefu from "@/components/page/page-kefu.vue";
export default {
  components: {
    AdBanner,
    page_header_ellsenn,
    page_header_mobile,
    page_footer_ellsenn,
    page_aside,
  },
  data() {
    return {
      is_show_login_comp: false,
    };
  },
  watch: {
    $route(to, from) {
      let href_pathname = location.pathname;
      let temp = false;
      if (href_pathname.indexOf("service-provider") > -1) {
        temp = true;
      } else {
        temp = ["/login", "/register", "/retrieve"].includes(href_pathname);
      }
      this.is_show_login_comp = temp;
    },
  },
  mounted() {
    this.initScale();
  },
  methods: {
    initScale() {
      if (document && document.documentElement && document.documentElement.clientWidth) {
        let clientWidth = document.documentElement.clientWidth;
        // 笔记本电脑端  150% 缩放比例的问题
        if (window.devicePixelRatio == 1.5) {
          let fontSize = 10 / window.devicePixelRatio;
          document.documentElement.style.fontSize = fontSize + "px";
        }
      }
    },
  },
};
</script>

<style lang="less">
.w-1400 {
  width: 1200px;
  margin: 0 auto;
}
.btn {
  cursor: pointer;
}
.tab-item {
  cursor: pointer;
}

.layout-box {
  background: #fff;
}

.poster-box .poster {
  object-fit: cover;
}

body {
  background-color: #fff;
  font-size: 14px;
  min-width: fit-content;
  width: 100%;
  text-align: left;
  overflow-x: hidden;
  height: 100vh;
  overflow-y: auto;

  &.lock {
    overflow: hidden;
  }
}

#app-wrap {
  height: 100vh !important;
  overflow-y: auto !important;

  &.lock {
    overflow-y: hidden !important;
  }
}

// 电脑端
@media screen and (min-width: 1199px) {
  body {
    height: inherit;
    overflow-y: initial;

    &.lock {
      overflow: auto;
    }
  }

  #app-wrap {
    height: inherit !important;
    overflow-y: initial !important;

    &.lock {
      overflow-y: initial !important;
    }
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background: #fff;

  &.lock {
    height: 100vh !important;
    overflow: hidden !important;
  }
}

// .el-textarea__inner:focus {
//   border-color: #009f39 !important;
// }

// .el-radio__input.is-checked .el-radio__inner {
//   background: #009f39 !important;
//   border-color: #009f39 !important;
// }

// .el-radio__input.is-checked + .el-radio__label {
//   color: #000 !important;
// }

// .el-checkbox__input.is-focus .el-checkbox__inner {
//   border-color: #009f39 !important;
// }

// .el-checkbox__input.is-checked + .el-checkbox__label {
//   color: #009f39 !important;
// }

// .el-checkbox__input.is-checked .el-checkbox__inner,
// .el-checkbox__input.is-indeterminate .el-checkbox__inner {
//   background: #009f39 !important;
//   border-color: #009f39 !important;
// }

.pagination-box {
  text-align: center;
}

.empty {
  min-height: 10vh;
  line-height: 10vh;
  text-align: center;
}

button {
  background: transparent;
}

.scale-wrap:hover .scale-target {
  transform: scale(1.1);
}

.scale-inner {
  overflow: hidden;
}

.scale-target {
  transition: 0.5s;
}

.img-cover img {
  object-fit: cover;
}

.cover img {
  object-fit: cover;
}

a {
  text-decoration: none;
  outline: none;
}

img {
  vertical-align: bottom;
}

button {
  transition: 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.hover-link {
  transition: 0.3s;

  &:hover {
    opacity: 0.7;
  }
}

.scale-box {
  overflow: hidden;

  & > .scale-img {
    width: 100%;
    height: 100%;
    transition: 0.25s linear;
    cursor: pointer;
    object-fit: cover;
  }

  &:hover {
    & > .scale-img {
      transform: scale(1.1);
    }
  }
}

.img-bg-ani {
  animation: bg_img_scale 8s infinite;
}

@keyframes bg_img_scale {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

//按钮 水波涟漪效果
.btn-ripple {
  vertical-align: bottom;
}

.btn-ripple:not(:disabled):hover {
  opacity: 1;
  position: relative;
  overflow: hidden;

  &::before {
    animation: ani_ripple 0.75s;
    z-index: 1;
    content: "";
    position: absolute;
    display: block;
    transition: all 0.6s;
    width: 100%;
    height: 0;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    padding-top: 100%;
    transform: translateX(-50%) translateY(-50%);
  }
}

@keyframes ani_ripple {
  0% {
    background: rgba(0, 0, 0, 0.25);
    transform: translateX(-50%) translateY(-50%) scale(0);
  }

  to {
    background: transparent;
    transform: translateX(-50%) translateY(-50%) scale(1);
  }
}

.el-pagination .btn-next,
.el-pagination .btn-prev {
  width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
  padding: 0 !important;
  .el-icon {
    font-size: 20px !important;
    color: #b2b2b2 !important;
  }
}

.el-pager li {
  background-color: transparent !important;
  width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
  padding: 0 !important;
}

.el-pager li {
  color: #b2b2b2 !important;
}

.el-pager li:not(.active):hover {
  color: #009f39 !important;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #009f39 !important;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #009f39 !important;
  color: #fff !important;
}

.el-pager li.active {
  background-color: #33ae60 !important;
  color: #fff !important;
  border-radius: 4px !important;
}

// //PC  加载中
// .el-loading-spinner {
//   background-image: url("~@img/loading.gif");
//   background-position: center;
// }
</style>
