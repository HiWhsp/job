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
        <div class="root-right-breadcrumb">
          <page_breadcrumb />
        </div>
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
  created() {
    //    this.initialization();
    //    let token = localStorage.getItem("token");
    //    if (!token && this.$route.name != "login") {
    //      this.$router.push("/login");
    //      return;
    //    } else {
    //      this.$store.dispatch("appInit", {
    //        callback: this.initCallback,
    //      }); //重新初始化
    //    }
  },

  methods: {
    // initialization() {
    //   this.$api({
    //     url: "/admin_service.php",
    //     method: "get",
    //     data: {
    //       action: "manager_getUserInfo",
    //     },
    //   }).then((res) => {
    //     if (res.code == 200) {
    //       if (res.data.roleInfo == null || !res.data.roleInfo) {
    //         alertErr("请重新登录！！！");
    //         this.$router.push("/login");
    //       }
    //     } else {
    //       alert(res);
    //     }
    //   });
    // },
    initCallback(data) {
      if (data.id) {
      } else {
        this.$router.push("/login");
      }
    },
    handleOpen(key, keyPath) {
      console.log("handleOpen", key, keyPath);
    },
    handleSelect(key, keyPath) {
      let key_str = keyPath[keyPath.length - 1];
      let route = this.key_map[key_str];

      console.log("handleSelect key", key);
      console.log("handleSelect keyPath", keyPath);
      console.log("handleSelect route", route);

      // debugger;
      this.$router.push("/" + route);
    },

    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    root_click() {
      console.log("点击内容区, 关闭选项弹窗");
      // this.$store.commit('vuex_closePop');
      // this.vuex_closePop();
    },
  },
};
</script>


<style lang="less">
#root {
  padding-top: 70px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #fff;

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
  height: 70px;
  z-index: 100;
}

.root-inner {
  height: calc(100vh - 70px);
}

.root-left {
  width: auto;
  height: calc(100vh - 70px);
  overflow-y: auto;
  background: #313133;
  background: #fff;
  width: 200px;

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
  background: #f8f8f8;
  background: #ececec;
  flex: 1;
  height: calc(100vh - 70px);
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
    padding: 0 10px;
  }
}

.root-left {
  &.dark {
    background: #192750;

    .menu-wrap {
      background: #192750;
    }
  }

  &.white {
    background: #fff;

    .menu-wrap {
      background: #fff;
    }
  }
}
</style>