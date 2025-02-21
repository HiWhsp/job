<template>
  <div class="page">
    <div class="main-title">
      <div class="left">我的收藏</div>
    </div>
    <div class="page-ctx">
      <div class="fav-box">
        <div v-if="count" class="fav-data-box">
          <productList :list="product_list"/>
          <div class="pagination-box" style="margin-top: 40px;text-align: center;">
            <el-pagination :current-page.sync="pagination.page" :page-size="pagination.pageNum" :total="count"
                           background layout="total, prev, pager, next"
                           @current-change="mix_current_change"></el-pagination>
          </div>
        </div>
        <div v-if="!count" class="fav-empty">
          <el-empty description="没有查询到收藏信息..."></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import productList from "@/components/product/productList.vue";

export default {
  name: "favourite-list",
  components: {productList},
  data() {
    return {
      product_list: [],
      checkedAll: false,

      pagination: {
        page: 1,
        pageNum: 10,
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
      this.query_fav()
    },
    query_fav() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 0,
          shoucang: 1,
          ...this.pagination,
        },
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          let {count, list} = data;
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
        alertErr("请选择要移除收藏的商品");
        return;
      }
      let ids = this.checked_list.map((v) => v.id).join();
      this.confirm_cancel(ids)
    },

    //收藏 取消
    do_fav_cancel_item(item) {
      this.confirm_cancel(item.id)
    },

    confirm_cancel(ids) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_bathDelOperate",
          operateType: 1,//行为类型：1-关注 2-足迹 此接口默认为 1-关注
          productIds: ids
        },
      }).then((res) => {
        alert(res)
        if (res.code == 200) {
          this.setView();
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
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
    justify-content: space-between;
    text-align: left;
    height: 40px;
    font-family: Poppins, Poppins;
    font-size: 16px;
    color: #000;
    border-bottom: 1px solid #E4E7ED;
  }

  .page-ctx {
    margin-top: 14px;
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

    border: 1px solid #E5E5E5;
    height: 44px;
    background: #F5F5F5;


    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;


    .fav-check {
      user-select: none;
      cursor: pointer;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

      &.checked {
        color: #F74747;
      }


      img {
        width: 13px;
        margin-right: 8px;
      }
    }

    .fav-delete {
      margin-left: 40px;
      cursor: pointer;

      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

    }
  }


}


.fav-list {
  border: 1px solid #e5e5e5;
  border-top: none;

  .fav-item {
    display: flex;
    align-items: center;
    padding: 24px;
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

      img {
        width: 97px;
        height: 97px;
        border: 1px solid #eeeeee;
        overflow: hidden;
      }

      /deep/ img {
        width: 97px;
        height: 97px;
        object-fit: cover;
      }
    }

    .goods-title {
      flex: 1;
      text-align: left;
      padding-left: 15px;

      .text-1 {
        cursor: pointer;
        margin-bottom: 15px;
        font-family: OPPOSans, OPPOSans;
        // font-weight: bold;
        font-size: 14px;
        color: #666666;

      }

      .text-2 {
        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #666666;
      }
    }

    .goods-price {
      min-width: 150px;
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #FF0000;
    }


    .goods-actions {
      min-width: 300px;

      button {
        & + button {
          margin-left: 32px;
        }

        &.btn-cancel {
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
        }

        &.btn-detail {
          width: 104px;
          height: 32px;
          background: #FFFFFF;
          border-radius: 6px;
          border: 1px solid #F74747;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #F74747;
        }
      }
    }
  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/user/myFavourite.less"></style>
