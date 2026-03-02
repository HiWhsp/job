<template>
  <div class="page">

    <div class="page-top">
      <div class="page-bread w-1400">
        <div class="bread-box">
          <img src="@img/common/product-home.png" alt="" />
          <router-link to="/">Home</router-link>
          <span class="bread-divider">&gt;</span>
          <!-- <router-link to="/products">产品中心</router-link>
          <span class="bread-divider">&gt;</span> -->
          <a href="javascirpt:void(0);">产品搜索</a>
          <!-- <span class="bread-divider">&gt;</span>
          <router-link to="/">{{ activeCate.title }}</router-link> -->
        </div>
      </div>
    </div>

    <div class="page-box w-1400">
      <div class="page-inner w-1400">
        <div class="total-box">共{{ count }}条数据</div>
        <div class="ctx-box w-1400">
          <div class="bottom-list">
            <productList :list="product_list" />
            <!-- <div class="product-list">
              <div class="product-item" v-for="(item, index)  in  products" :key="index" @click="toDetail(item)">
                <div class="poster-box scale-box">
                  <img :src="item.img" alt="" class="poster scale-img">
                </div>
                <div class="info-box">
                  <div class="title">{{ item.title }}</div>
                  <div class="pirce-box">
                    <div class="price-info">
                      <div class="price-1">{{ item.priceSale }}</div>
                      <div class="price-2">{{ item.priceMarket }}</div>
                    </div>
                    <div class="yishou">
                      已售{{ item.orders }}
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            <div class="pagination-box" v-if="count" style="margin-top: 50px;">
              <el-pagination background layout="prev, pager, next" :total="count" :current-page="pagination.page"
                :page-size="pagination.pageNum" @current-change="mix_current_change"> </el-pagination>
            </div>
          </div>

          <div class="empty-box" v-if="!count">
            <el-empty  description="没有找到相关产品..."></el-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import productList from "@/components/product/productList.vue"; //

export default {
  name: "product-search",
  components: {
    productList
  },
  data() {
    return {
      count: 0,
      pagination: {
        page: 1,
        pageNum: 18,
      },
      product_list: []
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},

  beforeRouteUpdate(to, from, next) {
    next({
      query: to.query,
    });
    this.setView();
  },
  created() {
    this.setView();
  },
  methods: {
    toDetail(item) {
      // this.$router.push(`/product-detail?id=${item.inventoryId}`)
      window.open('/product-detail?id='+item.inventoryId,'__blank','',false)
    },

    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          // channelId: 780,
          page: 1,
          pageNum: 12,
          keyword: this.$route.query.keyword || ''
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
    changePage(page) {
      this.pagination.page = page;
      this.setView();
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background: #FFFFFF;
}

.page-top {
  position: relative;

  .page-top-banner {
    img {
      width: 100%;
    }
  }

  .page-bread {

    margin: 0 auto;
    height: 44px;
    //background: #f5f5f5;
    padding: 0 0px;

    .bread-box {
      height: 44px;
      display: flex;
      align-items: center;

      img {
        width: 15px;
        margin-right: 10px;
      }

      .bread-divider {
        margin: 0 10px;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #505050;
      }

      a {
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #505050;

        &:hover {
          color: #00306B;
        }
      }
    }
  }
}

.page {
  padding-top: 32px;

  .page-box {
    // background: #f7f7f7;
    // background: #fff;

    margin: 0 auto;
  }

  .page-inner {

    margin: 0 auto;
    padding: 20px 0;
    padding-bottom: 80px;
    text-align: left;

    .page-block {

      margin: 0 auto;
    }
  }
}

.total-box {
  margin-bottom: 32px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #808080;
}

.ctx-box {}



.bottom-list {}


.product-list {
  display: flex;
  flex-wrap: wrap;

  .product-item {
    margin-right: 16px;
    margin-top: 10px;
    width: 220px;
    height: 298px;
    background: #FFFFFF;
    cursor: pointer;

    &:nth-child(6n) {
      margin-right: 0;
    }

    &:nth-child(-n + 6) {
      margin-top: 0;
    }

    &:hover {
      .title {
        color: #00306B !important;
      }

    }

    .poster-box {
      width: 220px;
      height: 220px;

      .poster {
        width: 220px;
        height: 220px;
      }
    }

    .info-box {
      padding: 13px 15px 0;

      .title {
         white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }

      .pirce-box {
        margin-top: 15px;
          display: flex;
  align-items: center;
  justify-content: space-between;

        .price-info {

            display: flex;
  align-items: center;

          .price-1 {
            margin-right: 5px;
            font-family: Arial, Arial;
            font-weight: 400;
            font-size: 16px;
            color: #FF3A30;
          }

          .price-2 {
            text-decoration: line-through;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 14px;
            color: #505050;
          }
        }

        .yishou {
          font-weight: 400;
          font-size: 12px;
          color: #505050;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/product-search.less"></style>
