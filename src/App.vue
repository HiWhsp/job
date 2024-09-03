<template>
  <div id="app">
    <pageHeader/>
    <div class="layout-box">
      <router-view></router-view>
    </div>
    <pageFooter/>
  </div>
</template>

<script>

import pageHeader from "@/components/page/page-header.vue"; //顶部
import pageFooter from "@/components/page/page-footer.vue";

import {mapState} from "vuex";

export default {
  components: {
    pageHeader,
    pageFooter
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  beforeCreate() {
  },
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
body {
  background-color: #000;
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

.page {
  width: 1200px;
  padding: 21px 0 53px 0;
  margin: auto;
}
.layout-box {
  background-color: #F6F5F4;
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

.el-radio__input.is-checked + .el-radio__label {
  color: #000 !important;
}

.el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #4CA5E4 !important;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
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
</style>
