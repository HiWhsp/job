<template>
  <div class="page-banner-nav">
    <!-- 面包屑 -->
    <div class="bread-wrap" :class="'page-' + $route.name">
      <div class="bread-box">
        <!-- <img src="@/assets/weizhi.png" alt="" /> -->
        <span class="weizhi">您的位置： </span>
        <router-link class="link-home" to="/"> 首页 </router-link>
        <div v-for="(item, index) in list_bread" :key="index" class="other-link">
          <span>&gt;</span>
          <a @click="clickBread(item)">{{ item.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  computed: {
    list_bread() {
      return [{ title: "个人中心" }];
    },
  },
  created() {},
  methods: {
    //tab
    toggleTab(item) {
      if (item.route) {
        this.$router.push(item.route);
      }
    },

    clickBread(item) {
      //console.log("item", { ...item });

      if (item.route != this.$route.path) {
        this.$router.push(item.route);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.link-home {
  color: #4CA5E4;
}

.bread-wrap {
  // background: #fff;
  // background: #f7f7f7;
  // background: #f7f7f7;
  .flex-between();
  width: 1200px;
  width: @width;
  margin: 0 auto;
  padding: 30px 0 30px 0;

  .bread-box {
    .flex();

    // border: 1px solid #EEEEEE;

    a {
      color: #666;
    }

    img {
      width: 15px;
      margin-right: 10px;
    }
    span {
      color: #666;
      margin: 0 5px;
    }

    .weizhi {
      margin: 0;
    }

    .other-link {
      a {
        color: #666;
        cursor: pointer;
      }
      &:last-child {
        a {
          color: #036dd1;
          color: #666;
        }
      }
    }
  }
}

@media screen and (max-width: 1199px) {
  .bread-wrap {
    background: #fff;
    background: #f7f7f7;
    .flex-between();
    width: 100%;
    margin: 0 auto;
    margin-bottom: 20px;
    padding: 5px 0;

    .bread-box {
      .flex();
      font-size: 12px;

      // border: 1px solid #EEEEEE;

      a {
        color: #666;
      }

      img {
        width: 15px;
        margin-right: 10px;
      }
      span {
        color: #666;
        margin: 0 5px;
      }

      .weizhi {
        margin: 0;
      }

      .other-link {
        a {
          color: #666;
          cursor: pointer;
        }
        &:last-child {
          a {
            color: #036dd1;
            color: #666;
          }
        }
      }
    }
  }
}
</style>
