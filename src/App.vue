<template>
  <div id="app">
    <pageHeader v-if="!vuex_h5" />
    <pageHeaderMobile v-if="vuex_h5" />
    <div class="layout-box">
      <router-view></router-view>
    </div>
    <pageFooter />
    <!-- <pageAside /> -->
    <!-- <pageKefu /> -->
  </div>
</template>

<script>

import pageHeader from "@/components/page/page-header.vue"; //顶部搜索
import pageHeaderMobile from "@/components/page/page-header-mobile.vue"; //顶部搜索
import pageFooter from "@/components/page/page-footer.vue";
// import pageAside from "@/components/page/page-aside.vue";
// import pageKefu from "@/components/page/page-kefu.vue";

import { mapState } from "vuex";
export default {
  components: {
    pageHeader,
    pageHeaderMobile,
    pageFooter,
    // pageAside,
    // pageKefu,
  },
  data() {
    return {

    };
  },
  computed: {

  },
  watch: {

  },
  beforeCreate() { },
  created() {

  },
  mounted() {
    this.initScale();
    this.queryConfig();
  },
  methods: {
    // scrollToTop() {
    //   let disallowScrollPages = ["product-detail"];
    //   if (disallowScrollPages.includes(this.$route.name)) {
    //   } else {
    //     document.querySelector("#app-wrap").scrollTop = 0;
    //   }
    // },
    initScale() {
      if (document && document.documentElement && document.documentElement.clientWidth) {
        let clientWidth = document.documentElement.clientWidth;
        if (clientWidth <= 1366 && clientWidth >= 1024) {
          // document.querySelector("body").style.overflowX = "auto";
          // var $target = document.querySelector('[name="viewport"]');
          // document
          //   .querySelector('[name="viewport"]')
          //   .setAttribute("content", "width=device-width,  initial-scale=0.15");
        }

        // 笔记本电脑端  150% 缩放比例的问题
        if (window.devicePixelRatio == 1.5) {
          let fontSize = 10 / window.devicePixelRatio;
          document.documentElement.style.fontSize = fontSize + "px";
        }
      }
    },

    queryConfig() {
      this.$api("index_config").then((res) => {
        if (res.data && res.data.com_logo) {
          document
            .querySelector('meta[property="og:image"]')
            .setAttribute("content", res.data.com_logo);
        }
      });
    },
  },
};
</script>

<style lang="less">
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


.el-rate__icon {
  color: #F7BB04 !important;
}


.el-textarea__inner:focus {
  border-color: #4CA5E4 !important;
}

.el-radio__input.is-checked .el-radio__inner {
  background: #4CA5E4 !important;
  border-color: #4CA5E4 !important;
}

.el-radio__input.is-checked+.el-radio__label {
  color: #000 !important;
}

.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #4CA5E4 !important;
}

.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #4CA5E4 !important;
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #4CA5E4 !important;
  border-color: #4CA5E4 !important;
}

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

  &>.scale-img {
    width: 100%;
    height: 100%;
    transition: 0.25s linear;
    cursor: pointer;
    object-fit: cover;
  }

  &:hover {
    &>.scale-img {
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

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #f4f4f5 !important;
  min-width: 30px !important;
  height: 30px;
  line-height: 30px;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #4CA5E4 !important;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #4CA5E4 !important;
  color: #fff !important;
}

.el-pager li.active {}

// //PC  加载中
// .el-loading-spinner {
//   background-image: url("~@img/loading.gif");
//   background-position: center;
// }

//通用 移动端适配开始
@media screen and (max-width: 1199px) {
  #app {
    padding-top: 50px !important;

    &.technologyPdf {
      padding-top: 0 !important;
    }

    &.productSpecification {
      padding-top: 0 !important;
    }

    &.productSpecificationPdf {
      padding-top: 0 !important;
    }
  }

  .page-app {
    * {
      max-width: 100vw;
    }
  }

  .layout-box {
    min-height: 40vh;
  }

  // 输入框
  body .el-input__inner {
    font-size: 14px;
    text-align: left;
  }

  body .el-input__inner::-webkit-input-placeholder {
    font-size: 14px;
  }

  body .el-textarea__inner::-webkit-input-placeholder {
    font-size: 14px;
  }

  body .el-textarea__inner {
    font-size: 14px;
  }

  .el-upload__tip {
    font-size: 14px !important;
  }

  // 下拉选
  .el-select-dropdown__empty {
    font-size: 12px;
    height: 32px;
    line-height: 32px;
  }

  .el-select-dropdown__wrap {
    max-height: 230px !important;
  }

  .el-select-dropdown__item {
    line-height: 32px !important;
    height: 32px !important;
    padding-left: 10px !important;
    font-size: 14px !important;
  }

  .el-input__suffix {
    width: 32px !important;
    height: 32px !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .el-select__caret {
    width: 12px;
    height: 12px;
    width: 32px !important;
    height: 32px !important;
    line-height: 0;
  }

  // 复选框样式
  .el-checkbox__inner {
    width: 14px !important;
    height: 14px !important;
  }

  .el-checkbox__inner::after {
    width: 3px !important;
    height: 8px !important;
    left: 4px !important;
  }

  .el-checkbox__label {
    font-size: 14px !important;
  }

  // 空列表
  .el-empty__image {
    width: 80px !important;
  }

  .el-empty__description {
    margin-top: 20px !important;
  }

  .el-empty__description p {
    font-size: 14px !important;
  }

  // 分页
  .el-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-pagination button,
  .el-pagination span:not([class*="suffix"]) {
    font-size: 12px !important;
  }

  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    width: 24px;
    height: 24px;
    line-height: 24px;
    font-size: 12px !important;
  }

  // 提示框
  .el-message {
    padding: 10px !important;
  }

  .el-icon-error:before {
    font-size: 14px !important;
  }

  .el-message__content {
    font-size: 14px !important;
  }

  .el-loading-spinner i {
    font-size: 20px !important;
  }

  .el-loading-text {
    font-size: 14px !important;
    margin-top: 10px !important;
  }

  // 大图预览  图片查看
  .el-image-viewer__actions {
    display: none;
  }

  .el-image-viewer__wrapper .el-image-viewer__close {
    top: 20px;
    right: 20px;
  }

  .el-image-viewer__wrapper .el-icon-close {
    font-size: 24px;
  }

  .el-image-viewer__next {
    width: 36px !important;
    height: 36px !important;

    .el-icon-arrow-left:before {
      font-size: 16px;
    }
  }

  .el-image-viewer__prev {
    width: 36px !important;
    height: 36px !important;

    .el-icon-arrow-right:before {
      font-size: 16px;
    }
  }

  // 弹窗样式
  .el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-dialog {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
  }
}

@media screen and (max-width: 1199px) {

  // 商品详情弹窗
  .pop-kefu-inner {
    padding: 25px !important;

    .kefu-tip {
      margin-bottom: 20px !important;
    }
  }

  .detail-qrcode {
    .flex-center();
    text-align: center;

    img {
      border: 1px solid #ddd;
      width: 150px !important;
      height: 150px !important;
    }
  }
}

@media screen and (max-width: 1199px) and (min-width: 768px) {
  #mobile_icon_div>div {
    width: 70px !important;
    height: 70px !important;
    display: flex;
    justify-content: center;
    align-items: center;

    &>div {
      margin: 0 !important;
      width: 35px !important;
      height: 35px !important;
    }
  }
}
</style>
