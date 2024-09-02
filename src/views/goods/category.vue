<template>
  <div class="page">
    <pageCategoryTop :pageOpt="pageOpt" />

    <div class="inner">
      <div class="category-box">
        <h1 class="main-title">产品中心</h1>
        <div class="line"></div>
        <div
          class="category-item"
          v-for="(item, index) in list_channel"
          :key="index"
          :class="{ active: item.id == select_level_1.id }"
          @click="toggleLevel(item)"
        >
          {{ item.title }}
        </div>
      </div>
      <div class="goods-wrap">
        <div class="goods-list">
          <router-link
            :to="`/product-detail/${item.skuId || item.inventoryId}`"
            class="goods-item scale-wrap"
            v-for="(item, index) in list_goods"
            :key="index"
          >
            <div class="img-box cover scale-inner">
              <img :src="item.img" alt="" class="scale-target" />
            </div>
            <div class="info-box">
              <div class="title">{{ item.title }}</div>
              <div class="price">{{vuex_huobi}} {{ item.priceSale }}</div>
            </div>
          </router-link>
        </div>

        <div class="pagination-box" v-if="count">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="count"
            :current-page="pagination.page"
            :page-size="pagination.pageNum"
            @current-change="changePage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
// import categoryGoodsListInfinity from "@/components/goods/categoryGoodsListInfinity.vue"; //优选

export default {
  name: "category",
  components: {
    // categoryGoodsListInfinity,
  },
  data() {
    return {
      id: this.$route.query.id || "",
      useCache: false, // 是否使用缓存

      select_level_1: {}, //所选1级分类
      activeNavIndex: 0, //导航

      list_channel: [],
      list_goods: [],

      pagination: {
        page: 1,
        pageNum: 12,
      },
      count: 0,
    };
  },
  computed: {
    ...mapState([""]),

    pageOpt() {
      let opt = {
        banner: "",
        list_bread: [
          {
            title: "产品中心",
            route: "",
          },
        ],
      };

      return opt;
    },
  },

  watch: {},

  created() {
    this.setView();
  },

  methods: {
    changePage(page) {
      this.pagination.page = page;
      this.queryGoods();
    },

    //切换一级分类
    toggleLevel(item) {
      this.pagination.page = 1;

      this.select_level_1 = item;
      this.queryGoods();
    },

    //初始化
    async setView() {
      if (this.useCache) {
        return;
      }

      let res_channel = await this.$api("product_channel");
      if (res_channel) {
        //console.log("获取分类", res_channel);
        let list = res_channel.data;
        this.list_channel = list.filter((v) => v.id != "847");

        if (!this.id) {
          this.activeNavIndex = 0;
        } else {
          this.activeNavIndex = list.findIndex((item) => item.id == this.id) || 0;
        }

        // 新增二级分类
        list.forEach((v) => {
          v.channels.unshift({
            title: "全部",
            id: v.id,
          });
        });

        this.select_level_1 = list[this.activeNavIndex] || {};
      }

      this.queryGoods();
    },

    //商品查询
    queryGoods() {
      //console.log("1级分类", { ...this.select_level_1 });
      this.$api("product_plist", {
        channel_id: this.select_level_1.id || "",
        ...this.pagination,
      }).then((res) => {
        let { code, data, pages, count } = res;
        this.list_goods = data;
        this.count = count;
      });
    },
  },
};
</script>

<style scoped lang="less">
.inner {
  .flex-between();
  align-items: flex-start;
  width: 1286px;
  margin: 0 auto;
  padding-bottom: 150px;
}

.category-box {
  width: 170px;
  background: #f5f5f5;
  text-align: left;
  .main-title {
    padding-left: 20px;
    height: 55px;
    line-height: 55px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
  }
  .line {
    width: 150px;
    margin: 0 auto;
    border-top: 1px solid #eeeeee;
  }
  .category-item {
    padding-left: 20px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    height: 50px;
    line-height: 50px;
    color: #333333;
    text-align: left;
    position: relative;
    cursor: pointer;

    &:hover {
      background: #fff;
    }

    &.active {
      background: #fff;
      &::before {
        position: absolute;
        left: 0;
        top: 10px;
        content: "";
        width: 3px;
        height: 30px;
        background: #4CA5E4;
      }
    }
  }
}

.goods-wrap {
  width: 1100px;
  text-align: left;
  // 商品列表
  .goods-list {
    padding-top: 6px;
    width: 1120px;
    margin: 0 auto;
    .flex();
    flex-wrap: wrap;
    .goods-item {
      width: 270px;
      padding: 6px;
      padding-bottom: 15px;
      margin-right: 12px;
      margin-bottom: 20px;
      transition: 0.3s;
      &:nth-child(4n) {
        margin-right: 0;
      }

      &:hover {
        box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.32);
      }

      .img-box {
        width: 257px;
        height: 257px;
        img {
          width: 257px;
          height: 257px;
        }
      }

      .info-box {
        padding-top: 5px;
        .title {
          .ellipsis-2();
          height: 48px;
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: 400;

          color: #333333;
        }
        .price {
          text-align: left;
          margin-top: 15px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 16px;
          color: #4CA5E4;
        }
      }
    }
  }
}
</style>
