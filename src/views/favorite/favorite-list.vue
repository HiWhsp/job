<template>
  <div class="page">
    <div class="main-title">
      <div class="left">MY COLLECTION</div>
    </div>

    <div class="page-ctx">
      <div class="fav-box">
        <div class="fav-titles flex">
          <div class="fav-check flex" @click="do_toggle_all()" :class="{ checked: checkedAll }">
            <img src="@img/common/check0.png" alt class="img-check check-0" />
            <img src="@img/common/check1.png" alt class="img-check check-1" />
            <span>All</span>
          </div>
          <div class="fav-delete" @click="do_delete_checked()">Delete Selected</div>
        </div>

        <div class="fav-data-box" v-if="count">
          <div class="fav-list">
            <div class="fav-item" v-for="(item, index) in product_list" :key="index">
              <div
                class="fav-check"
                @click.stop="do_toggle_item(item)"
                :class="{ checked: item.checked }"
              >
                <img src="@img/common/check0.png" alt class="img-check check-0" />
                <img src="@img/common/check1.png" alt class="img-check check-1" />
              </div>

              <div class="goods-img scale-box" @click="to_product(item)">
                <img class="scale-img" :src="item.thumb" alt />
                <!-- <el-image :src="item.thumb">
                  <div slot="error" class="image-slot">
                    <img :src="item.thumb" />
                  </div>
                </el-image>-->
              </div>

              <div class="goods-title">
                <div class="text-1" @click="to_product(item)">{{ item.title }}</div>
                <div class="text-2">{{ item.keyVals }}</div>
              </div>

              <div class="goods-price">
                {{ vuex_huobi }}{{ item.priceSale }}
                <span class="unit">/pack</span>
              </div>

              <div class="goods-actions">
                <button class="btn btn-cart btn-ripple" @click.stop="addCart(item)">ADD TO CART</button>
                <button class="btn btn-trash" @click.stop="do_fav_cancel_item(item)" title="Delete">
                  <img src="@/assets/img/other/shopcart-goods-delete.png" alt />
                </button>
              </div>
            </div>
          </div>

          <div class="pagination-box" style="margin-top: 40px; text-align: center">
            <el-pagination
              background
              layout="prev, pager, next"
              @current-change="mix_current_change"
              :current-page.sync="pagination.page"
              :page-size="pagination.pageNum"
              :total="count"
            ></el-pagination>
          </div>
        </div>
        <div class="fav-empty" v-if="!count">
          <el-empty description="没有查询到收藏信息..."></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "favourite-list",
  components: {},
  data() {
    return {
      product_list: [],
      checkedAll: false,

      pagination: {
        page: 1,
        pageNum: 10
      },
      count: 0
    };
  },

  computed: {
    checked_list() {
      return this.product_list.filter(v => v.checked);
    },
    checked_number() {
      return this.checked_list.length;
    }
  },

  created() {
    this.setView();
  },

  methods: {
    setView() {
      this.query_fav();
    },
    query_fav() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 0,
          shoucang: 1,
          ...this.pagination
        }
      }).then(res => {
        let { code, data, count } = res;
        if (code == 200) {
          let { count, list } = data;
          list.forEach(v => {
            v.checked = false;
          });
          this.product_list = list;
          this.count = count;
        }
      });
    },

    to_product(item) {
      // this.$router.push({
      //   path: "/product-detail",
      //   query: {
      //     id: item.inventoryId,
      //   },
      // });
      window.open(
        "/product-detail?id=" + item.inventoryId,
        "__blank",
        "",
        false
      );
    },

    do_toggle_all() {
      this.checkedAll = !this.checkedAll;
      this.product_list.forEach(v => (v.checked = this.checkedAll));
    },

    do_toggle_item(item) {
      //console.log("切换勾选", { ...item });
      item.checked = !item.checked;
      let hasNotChecked = this.product_list.some(v => !v.checked);
      if (hasNotChecked) {
        this.checkedAll = false;
      } else {
        this.checkedAll = true;
      }
    },

    do_delete_checked() {
      if (!this.checked_number) {
        alertErr("请选择要移除收藏的商品");
        return;
      }
      let ids = this.checked_list.map(v => v.id).join();
      this.confirm_cancel(ids);
    },

    //收藏 取消
    do_fav_cancel_item(item) {
      this.confirm_cancel(item.id);
    },

    confirm_cancel(ids) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_bathDelOperate",
          operateType: 1, //行为类型：1-关注 2-足迹 此接口默认为 1-关注
          productIds: ids
        }
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          this.setView();
        }
      });
    },

    // 加入购物车
    addCart(item) {
      if (typeof this.mix_get_login_status === "function") {
        if (!this.mix_get_login_status()) return;
      }
      const inventoryId = item.inventoryId || item.id;
      if (!inventoryId) {
        alertErr("商品信息不完整，无法加入购物车");
        return;
      }
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_add",
          inventoryId,
          num: 1
        }
      }).then(res => {
        if (res.code == 200) {
          const totalCount = (res.data && res.data.count) || 0;
          if (this.$store && this.$store.commit) {
            this.$store.commit("set_vuex_cart_number", totalCount);
          }
        }
      });
    }
  }
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

.page {
  padding-bottom: 80px;

  .main-title {
    display: flex;
    align-items: center;
    padding: 0 32px;
    text-align: left;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
    font-family: Poppins, Poppins;
    font-weight: bold;
    font-size: 20px;
    color: #333333;
    img {
      width: 22px;
      margin-right: 10px;
    }
  }

  .page-ctx {
    margin-top: 14px;
    padding: 30px;
    background: #fff;
  }
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}

.fav-box {
  .fav-titles {
    // margin-bottom: 20px;
    padding: 0 24px;

    border: 1px solid #e5e5e5;
    height: 83px;
    background: #fbfbfb;

    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 20px;
    color: #1e262e;
    gap: 18px;

    .fav-check {
      user-select: none;
      cursor: pointer;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 20px;
      color: #1e262e;

      &.checked {
        color: #1e262e;
      }

      img {
        width: 20px;
        margin-right: 8px;
      }
    }

    .fav-delete {
      cursor: pointer;

      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 20px;
      color: #1e262e;
    }
  }
}

.fav-list {
  border: 1px solid #e5e5e5;
  border-top: none;

  .fav-item {
    display: flex;
    align-items: center;
    padding: 22px 24px;
    border-bottom: 1px solid #e5e5e5;

    &:last-child {
      border-bottom: none;
    }

    .fav-check {
      width: 52px;
      text-align: left;

      img {
        width: 13px;
      }
    }

    .goods-img {
      cursor: pointer;
      width: 96px;
      height: 96px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #eeeeee;
      background: #fff;

      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
      }

      /deep/ img {
        width: 80px;
        height: 80px;
        object-fit: cover;
      }
    }

    .goods-title {
      flex: 1;
      text-align: left;
      padding-left: 15px;
      max-width: 520px;

      .text-1 {
        cursor: pointer;
        margin-bottom: 6px;
        font-family: OPPOSans, OPPOSans;
        // font-weight: bold;
        font-size: 14px;
        color: #1f1f1f;
        line-height: 18px;
      }

      .text-2 {
        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 12px;
        color: #777;
      }
    }

    .goods-price {
      min-width: 220px;
      font-family: OPPOSans, OPPOSans;
      font-weight: 700;
      font-size: 13px;
      color: #1f1f1f;

      .unit {
        font-weight: 600;
      }
    }

    .goods-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 240px;
      justify-content: flex-end;

      .btn {
        height: 34px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
      }

      .btn-cart {
        padding: 0 18px;
        background: #ec6a2b;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.5px;

        &:hover {
          opacity: 0.9;
        }
      }

      .btn-trash {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 44px;
          height: 44px;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/myFavourite.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
