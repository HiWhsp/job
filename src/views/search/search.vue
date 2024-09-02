<template>
  <div class="wrap">
    <div class="inner">
      <listGood :list_goods="list_goods" />
      <div
        v-if="list_goods.length"
        class="pagination-box"
        style="margin-top: 80px"
      >
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.page"
          :page-size="pagination.pageNum"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>

      <el-empty
        v-if="!list_goods.length"
        description="搜索结果为空..."
      ></el-empty>
    </div>
  </div>
</template>

<script>


import { mapState } from "vuex";

import listGood from "@/components/goods/listGood.vue"; //商品列表

export default {
  name: "index",
  components: {
    listGood,
  },

  data() {
    return {
      list_goods: [],
      keyword: this.$route.query.keyword || "",

      pagination: {
        page: 1,
        pageNum: 15,
      },
      count: 0,
    };
  },
  computed: {
    ...mapState(["baseInfo", "defaultAvatar", "opts_category"]),
  },

  //导航激活
  beforeRouteUpdate(to, from, next) {
    //console.log("组件复用 from", from);
    //console.log("组件复用 to", to);

    next();
    this.keyword = to.query.keyword;

    this.setView();
  },

  created() {
    this.setView();
  },

  methods: {
    setView() {
      this.$api("product_plist", {
        keyword: this.keyword,
        ...this.pagination,
      }).then((res) => {
        //console.log("商品", res);
        let { code, data, count } = res;
        if (code == 200) {
          this.list_goods = data;
          this.count = count;
        }
      });
    },

    //分页
    handleCurrentChange(page) {
      //console.log("页面变化", page);

      this.setView();
    },
  },
};
</script>

<style scoped  lang="less">
.wrap {
  min-height: 50vh;
  margin-top: 30px;
  .inner {
    width: @width;
    margin: 0 auto;
    padding-bottom: 100px;
  }
}
</style>
