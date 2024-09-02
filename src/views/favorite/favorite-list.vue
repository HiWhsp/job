<template>
  <div class="page">
    <div class="main-title">
      <div class="left">我的收藏</div>
    </div>

    <div class="page-ctx">
      <div class="fav-box">
        <div class="fav-titles flex">
          <div class="fav-check flex" @click="do_toggle_all()" :class="{ checked: checkedAll }">
            <img src="@/static/common/check0.png" alt="" class="img-check check-0" />
            <img src="@/static/common/check1.png" alt="" class="img-check check-1" />
            <span>全选</span>
          </div>
          <div class="fav-delete" @click="do_delete_checked()">移除选中</div>
        </div>

        <div class="fav-data-box" v-if="count">
          <div class="fav-list">
            <div class="fav-item" v-for="(item, index) in product_list" :key="index">
              <div class="fav-check" @click.stop="do_toggle_item(item)" :class="{ checked: item.checked }">
                <img src="@/static/common/check0.png" alt="" class="img-check check-0" />
                <img src="@/static/common/check1.png" alt="" class="img-check check-1" />
              </div>

              <div class="goods-img" @click="to_product(item)">
                <!-- <img :src="item.img" alt="" /> -->
                <el-image :src="item.thumb">
                  <div slot="error" class="image-slot">
                    <img :src="item.thumb" />
                  </div>
                </el-image>
              </div>

              <div class="goods-title">
                <div class="text-1" @click="to_product(item)">
                  {{ item.title }}
                </div>
                <div class="text-2">
                  {{ item.keyVals }}
                </div>
              </div>

              <div class="goods-price">
                {{ vuex_huobi }} {{ item.priceSale }}
              </div>

              <div class="goods-actions flex-center">
                <!-- <button class="btn btn-detail btn-ripple" @click="addCart(item)">
                  加入购物车
                </button> -->
                <button class="btn btn-cancel" @click.stop="do_fav_cancel_item(item)">
                  取消收藏
                </button>
                <button class="btn btn-detail btn-ripple" @click="to_product(item)">
                  查看详情
                </button>
              </div>
            </div>
          </div>

          <div class="pagination-box" style="margin-top: 40px;text-align: right;">
            <el-pagination background layout="total, prev, pager, next" @current-change="changePage"
              :current-page.sync="pagination.page" :page-size="pagination.pageNum" :total="count"></el-pagination>
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
  name: "favourite-jilu",
  components: {},
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

  .page-ctx {
    margin-top: 14px;
    padding: 46px 32px;
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
        color: #4CA5E4;
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
        &+button {
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
          border-radius: 50px 50px 50px 50px;
          border: 1px solid #4CA5E4;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #4CA5E4;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/myFavourite.less"></style>
