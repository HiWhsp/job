<template>
  <div class="page">
    <div class="inner w-1400">
      <div class="list">
        <div
          class="item"
          v-for="(item, index) in page_list"
          :key="index"
          @click="$router.push(item.path)"
        >
          {{ item.path }} - {{ item.meta && item.meta.title }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "category",
  components: {},
  data() {
    return {
      page_list: [
        // {
        //   path: "/register",
        //   name: "register",
        //   meta: {
        //     title: "注册",
        //   },
        // },
      ],
    };
  },
  mounted() {
    this.set_routes();
  },
  methods: {
    set_routes() {
      console.log("路由", this.$route);
      console.log("路由配置", this.$router);

      let page_list = [];
      this.$router.options.routes.forEach((v1) => {
        if (v1.children && v1.children.length) {
          v1.children.forEach((v2) => {
            page_list.push({ path: v2.path, meta: v2.meta });
          });
        } else {
          page_list.push({ path: v1.path, meta: v1.meta });
        }
      });

      this.page_list = page_list;
    },
  },
};
</script>
      
<style scoped lang="less">
.page {
  background: #f4f4f4;
  text-align: left;

  .inner {
    width: 1400px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 40px;
  }
}

.list {
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 25%;
    border: 1px solid #eee;
    padding: 15px;
    margin: 0 auto;
    cursor: pointer;
    &:hover {
      background: #409EFF;
    }
  }
}
</style>
    