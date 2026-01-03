<template>
  <div class="page">
    <div class="banner-wrap">
      <img :src="banners[0].image" alt="" />
    </div>
    <div class="inner w-1400">
      <div class="page-ctx">
        <div class="product-wrap">
          <productList :list="product_list" />
        </div>

        <div class="pagination-box" v-if="count" style="margin-top: 50px">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="count"
            :current-page="pagination.page"
            :page-size="pagination.pageNum"
            @current-change="mix_current_change"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageBreadcrumb from "@/views/layout/comps/page_breadcrumb.vue";
import productList from "@/components/product/productList.vue"; //

import { mapState } from "vuex";

export default {
  name: "category",
  components: {
    pageBreadcrumb,
    productList,
  },
  data() {
    return {
      product_list: [],
      pagination: {
        page: 1,
        pageNum: 16,
      },
      count: 0,
    };
  },
  computed: {
    ...mapState(["vuex_map_banners"]),
    banners() {
      return this.vuex_map_banners["中科优选"] || [];
    },
  },

  watch: {
    $route() {
      this.pagination.page = 1;
      this.setView();
    },
  },

  created() {
    this.setView();
  },

  methods: {
    async setView() {
      this.query_product();
    },
    query_product() {
      let channelId_arr = (this.$route.query.ids || "").split("-");
      let channelId = channelId_arr.pop();
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: channelId,
          // page: 1,
          // pageNum: 8,
          ...this.pagination,
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          let { list, count, pages } = data;
          this.product_list = list;
          this.count = count;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  background: #f4f4f4;
  text-align: left;

  .banner-wrap {
    img {
      width: 100%;
    }
  }
  .inner {
    .page-ctx {
      padding-top: 20px;
      padding-bottom: 50px;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/shipei.less"></style>
