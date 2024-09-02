<template>
  <div class="page">
    <div class="main-title">
      <div class="left">我的足迹</div>
    </div>

    <div class="page-ctx">
      <div class="product-box">
        <div class="product-titles flex">
          <div class="product-check flex" @click="do_toggle_all()" :class="{ checked: checkedAll }">
            <img src="@/static/common/check0.png" alt="" class="img-check check-0" />
            <img src="@/static/common/check1.png" alt="" class="img-check check-1" />
            <span>全选</span>
          </div>
          <div class="product-delete" @click="do_delete_checked()">移除选中</div>
        </div>

        <div class="product-data-box" v-if="count">
          <!-- <div class="product-list">
            <div class="product-item" v-for="(item, index) in list" :key="index">
              <div class="img-check-box" @click.stop="do_toggle_item(item)" :class="{ checked: item.checked }">
                <img src="@/static/common/check0.png" alt="" class="img-check check-0" />
                <img src="@/static/common/check1.png" alt="" class="img-check check-1" />
              </div>

              <div class="goods-img scale-box" @click="mix_to_product(item)">
                <el-image :src="item.img">
                  <div slot="error" class="image-slot">
                    <img :src="item.default_img" />
                  </div>
                </el-image>
              </div>
              <div class="goods-title" @click="mix_to_product(item)">
                <div class="text-1">
                  {{ item.title }}
                </div>
                <div class="text-2">
                  <span> {{vuex_huobi}} </span>
                  <b>{{ item.priceSale }}</b>
                </div>
              </div>
            </div>
          </div> -->


          <div class="product-wrap">
            <productList :list="product_list" :is_show_check="true" @toggle_check="toggle_check" />
          </div>

          <div class="pagination-box" style="margin-top: 40px;text-align: right;">
            <el-pagination background layout="total, prev, pager, next" @current-change="changePage"
              :current-page.sync="pagination.page" :page-size="pagination.pageNum" :total="count"></el-pagination>
          </div>
        </div>

        <div class="product-empty" v-if="!count">
          <el-empty description="没有查询到相关信息..."></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import productList from "@/components/product/productList.vue";

import { mapState } from "vuex";
export default {
  name: "favourite-jilu",
  components: {
    productList
  },
  data() {
    return {
      product_list: [],
      checkedAll: false,

      pagination: {
        page: 1,
        pageNum: 8,
      },
      count: 0,
    };
  },
  computed: {
    checked_list() {
      return this.product_list.filter((v) => v.checked);
    },
    checked_number() {
      return this.checked_list.length;
    },
  },
  created() {
    this.setView();
  },

  methods: {
    setView() {
      this.query_browse()
    },
    query_browse() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          history: 1,
          ...this.pagination,
        },
      }).then((res) => {
        let { code, data, count } = res;
        if (code == 200) {
          let { count, list } = data;
          list.forEach((v) => {
            v.checked = false;
          });
          this.product_list = list;
          this.count = count;
        }
      });
    },

    to_product(item) {
      this.$router.push({
        path: "/product-detail",
        query: {
          id: item.inventoryId,
        },
      });
    },

    do_toggle_all() {
      this.checkedAll = !this.checkedAll;
      this.product_list.forEach((v) => (v.checked = this.checkedAll));
    },


    do_toggle_item(item) {
      //console.log("切换勾选", { ...item });

      item.checked = !item.checked;

      let hasNotChecked = this.product_list.some((v) => !v.checked);
      if (hasNotChecked) {
        this.checkedAll = false;
      } else {
        this.checkedAll = true;
      }
    },

    do_delete_checked() {
      if (!this.checked_number) {
        alertErr("请选择要删除的商品记录");
        return;
      }
      let ids = this.checked_list.map((v) => v.id).join();

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_bathDelOperate",
          operateType: 2,//行为类型：1-关注 2-足迹 此接口默认为 1-关注
          productIds: ids
        },
      }).then((res) => {
        alert(res)
        if (res.code == 200) {
          this.setView();
        }
      });
    },

    toggle_check(item) {
      item.checked = !item.checked
    },

  },
};
</script>

<style scoped lang="less">
.img-check {
  cursor: pointer;

  &.check-0 {
    display: block;
  }

  &.check-1 {
    display: none;
  }
}

.checked {
  cursor: pointer;

  .check-0 {
    display: none !important;
  }

  .check-1 {
    display: block !important;
  }
}

.product-item {}

.page {
  padding-bottom: 80px;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-family: Poppins, Poppins;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }
}

.page-ctx {
  margin-top: 14px;
  padding: 46px 32px;
  background: #fff;
}


.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}

.product-data-box {
  margin-top: 20px;
}

.product-box {
  .product-titles {
    // margin-bottom: 20px;
    padding: 0 24px;
    border: 1px solid #E5E5E5;
    height: 44px;
    background: #F5F5F5;


    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;


    .product-check {
      user-select: none;
      cursor: pointer;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;


      &.checked {
        color: #4CA5E4;
      }

      img {
        width: 13px;
        margin-right: 8px;
      }
    }

    .product-delete {
      margin-left: 40px;
      cursor: pointer;

      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

    }
  }

  .product-list {
    border-top: none;
    display: flex;
    flex-wrap: wrap;

    .product-item {
      position: relative;
      margin-right: 32px;
      margin-top: 32px;
      width: 249px;
      border: 1px solid #e5e5e5;
      overflow: hidden;

      &:nth-child(4n) {
        margin-right: 0;
      }

      &:nth-child(-n + 4) {
        margin-top: 0;
      }

      .img-check-box {
        .flex-center();
        position: absolute;
        z-index: 10;
        left: 10px;
        top: 10px;
        width: 35px;
        height: 35px;
        cursor: pointer;

        .img-check {
          width: 13px;
        }
      }

      .goods-img {
        cursor: pointer;

        img {
          width: 249px;
          height: 249px;
        }

        /deep/ img {
          width: 249px;
          height: 249px;
        }
      }

      .goods-title {
        flex: 1;
        text-align: left;
        padding: 15px;

        .text-1 {
          .ellipsis-1();
          cursor: pointer;
          margin-bottom: 15px;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
          line-height: 24px;
        }

        .text-2 {
          font-size: 14px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #4CA5E4;

          b {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/browse-history.less"></style>
