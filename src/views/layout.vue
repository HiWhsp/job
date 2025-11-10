<template>
  <div id="root">
    <div class="root-header">
      <page_header />
    </div>
    <div class="root-inner flex-between">
      <div class="root-left scrollbar white">
        <page_menu />
      </div>
      <div class="root-right">
        <!-- <div class="root-right-breadcrumb">
          <page_breadcrumb />
        </div> -->
        <div class="root-right-inner">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page_header from "@/components/page/page_header.vue";
import page_menu from "@/components/page/page_menu.vue";
import page_breadcrumb from "@/components/page/page_breadcrumb.vue";
import { mapState } from "vuex";
export default {
  components: {
    page_header,
    page_menu,
    page_breadcrumb,
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.dispatch("appInit");
  },

  methods: {
  },
};
</script>


<style lang="less">
#root {
  padding-top: 100px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #F8F8F8;

  &.root-login {
    padding-top: 0 !important;
  }
}
</style>

<style lang="less" scoped>
.root-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 100;
}

.root-inner {
  height: calc(100vh - 100px);
}

.root-left {
  width: auto;
  height: calc(100vh - 100px);
  overflow-y: auto;
  background: #313133;
  background: #fff;
  width: 110px;
  padding-top: 20px;

  &.scrollbar {
    overflow-y: auto;

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      border: 5px solid #409eff;
      background: #fff;
    }

    &::-webkit-scrollbar {
      width: 5px;
      height: 0px;
    }
  }
}

.root-right {
  position: relative;
  background: transparent;
  flex: 1;
  height: calc(100vh - 100px);
  overflow-y: auto;

  text-align: left;

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    border: 8px solid #409eff;
    background: #fff;
  }

  &::-webkit-scrollbar {
    width: 8px;
    height: 0px;
  }

  .root-right-breadcrumb {
    position: sticky;
    top: 0px;
    z-index: 10;
    padding: 10px;

    // margin-top: -10px;
    // margin-bottom: -10px;
    // margin-left: -10px;
    // margin-right: -10px;
    // padding: 10px;
    background: #ececec;
  }

  .root-right-inner {
    padding: 20px 0px;
  }
}

.root-left {
  &.dark {
    background: transparent;

    .menu-wrap {
      background: transparent;
    }
  }

  &.white {
    background: transparent;

    .menu-wrap {
      background: transparent;
    }
  }
}
</style>