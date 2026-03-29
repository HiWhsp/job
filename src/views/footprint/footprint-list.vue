<template>
  <div class="page">
    <div class="main-title">
      <div class="left">My Footprints</div>
    </div>

    <div class="page-ctx">
      <div class="fav-box">
        <div class="fav-titles flex">
          <div class="fav-check flex">
            <el-checkbox v-model="checkedAll" @change="do_toggle_all()">ALL</el-checkbox>
          </div>
          <div class="fav-delete" @click="do_delete_checked()">Delete Selected</div>
        </div>

        <div class="fav-data-box" v-if="count">
          <div class="fav-list">
            <div class="fav-item" v-for="(item, index) in product_list" :key="index">
              <el-checkbox v-model="item.checked"></el-checkbox>
              <div class="goods-img scale-box" @click="to_product(item)">
                <img class="scale-img" :src="item.thumb" alt />
                <!-- <el-image :src="item.thumb">
                  <div slot="error" class="image-slot">
                    <img :src="item.thumb" />
                  </div>
                </el-image>-->
              </div>
              <div class="goods-info">
                <div class="goods-title">
                  <div class="text-1" @click="to_product(item)">{{ item.title }}</div>
                </div>

                <div class="goods-price">{{ vuex_huobi }} {{ item.priceSale }}/pack</div>

                <div class="goods-actions">
                  <!-- <button class="btn btn-detail btn-ripple" @click="addCart(item)">
                  加入购物车
                  </button>-->
                  <button class="btn btn-detail btn-ripple" @click="addCart(item)">ADD TO CART</button>
                  <button class="btn btn-cancel" @click.stop="do_fav_cancel_item(item)">
                    <img src="@img/other/shopcart-goods-delete.png" alt />
                  </button>
                </div>
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
          history: 1,
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
      this.checkedAll = this.checkedAll;
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
          operateType: 2, //行为类型：1-关注 2-足迹 此接口默认为 1-关注
          productIds: ids
        }
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          this.setView();
        }
      });
    },
    addCart(item) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_add",
          inventoryId: item.inventoryId,
          num: 1
        }
      }).then(res => {
        if (res.code == 200) {
          alertSucc("The product has been added to the cart.");
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.img-check {
  cursor: pointer;
  width: 28px;
  height: 28px;

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
    padding: 0 24px;
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
    padding: 34px;
    background: #fff;
  }
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}

.fav-box {
  .fav-titles {
    padding: 0 24px;

    height: 83px;
    background: #fbfbfb;

    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 20px;
    color: #1f1f1f;

    .fav-check {
      user-select: none;
      cursor: pointer;
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 20px;
      color: #1f1f1f;

      .el-checkbox {
        margin-right: 32px;
        width: 28px;
        height: 28px;
        background: #ffffff;
        border-radius: 6px 6px 6px 6px;
        /deep/ .el-checkbox__inner {
          width: 28px;
          height: 28px;
          background: #ffffff;
          border-radius: 6px 6px 6px 6px;
          border: 1px solid #707070;
          &:after {
            width: 7px;
            left: 10px;
            height: 17px;
          }
        }

        /deep/ .el-checkbox__label {
          font-family: Poppins, Poppins;
          font-weight: 600;
          font-size: 20px;
          color: #1e262e;
          line-height: 28px;
        }
      }
    }

    .fav-delete {
      margin-left: 40px;
      font-size: 20px;
      cursor: pointer;
      text-decoration: underline;
      font-family: Poppins, Poppins;
      font-weight: 400;
      color: #1f1f1f;
    }
  }
}

.fav-list {
  .fav-item {
    display: flex;
    align-items: center;
    padding: 24px 0 24px 19px;
    border-bottom: 1px solid #e5e5e5;

    .el-checkbox {
      margin-right: 32px;
      width: 28px;
      height: 28px;
      background: #ffffff;
      border-radius: 6px 6px 6px 6px;
      /deep/ .el-checkbox__inner {
        width: 28px;
        height: 28px;
        background: #ffffff;
        border-radius: 6px 6px 6px 6px;
        border: 1px solid #707070;
        &:after {
          width: 7px;
          left: 10px;
          height: 17px;
        }
      }
    }

    &:last-child {
      border-bottom: none;
    }

    .fav-check {
      width: 52px;
      text-align: left;
    }

    .goods-img {
      cursor: pointer;

      img {
        width: 120px;
        height: 120px;
        border: 1px solid #cecece;
        border-radius: 6px 6px 6px 6px;
        overflow: hidden;
      }

      /deep/ img {
        width: 97px;
        height: 97px;
        object-fit: cover;
      }
    }

    .goods-info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .goods-title {
      width: 328px;
      text-align: left;
      padding-left: 15px;

      .text-1 {
        cursor: pointer;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 24px;
        color: #1e262e;
        line-height: 30px;
      }

      .text-2 {
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 14px;
        color: #1f1f1f;
      }
    }

    .goods-price {
      height: 28px;
      font-family: Poppins, Poppins;
      font-weight: 600;
      font-size: 20px;
      color: #1e262e;
      line-height: 28px;
    }

    .goods-actions {
      min-width: 300px;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      button {
        & + button {
          margin-left: 32px;
        }

        &.btn-cancel {
          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 14px;
          color: #505050;
          img {
            width: 44px;
            height: 44px;
          }
        }

        &.btn-detail {
          width: 180px;
          height: 52px;
          background: #ec6a2b;
          border-radius: 6px 6px 6px 6px;
          border: 1px solid #ec6a2b;

          font-family: Poppins, Poppins;
          font-weight: 400;
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/myFavourite.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
