<script>
export default {
  name: "collect",
  data() {
    return {
      tableData: [],
      list_shopcart: [{}],
      checked_all: false, //是否全选
    }
  },
  computed: {
    //购物车被选择的商品
    list_shopcart_checked() {
      return this.list_shopcart.filter((v) => v.checked);
    },
  },
  methods: {
    //商品勾选 单项选择
    on_change_checked_item() {
      // //console.log('监视单项选择', item)
      let checkLength = this.list_shopcart_checked.length;
      if (checkLength == this.list_shopcart.length) {
        this.checked_all = true;
      } else {
        this.checked_all = false;
      }
    },
    //商品勾选 全选与取消
    on_change_checked_all(val) {
      //console.log("更新后的值", val);
      this.list_shopcart.forEach((v) => {
        v.checked = val;
      });
    },
    handleSelectionChange() {

    }
  }
}
</script>

<template>
  <div class="page">
    <div class="main-title">
      <span>我的收藏</span>
    </div>
    <div class="page-ctx">
      <div class="list-title">
        <div class="all-select">
          <el-checkbox v-model="checked_all" @change="on_change_checked_all">{{
              checked_all ? "反选" : "全选"
            }}
          </el-checkbox>
        </div>
        <div class="delete-box">
          <span @click="do_cart_remove_select()">删除选中</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="item" v-for="(item, index) in list_shopcart" :key="index">
        <div class="item-detail flex">
          <div class="box-select">
            <el-checkbox v-model="item.checked" @change="on_change_checked_item"></el-checkbox>
          </div>

          <div class="box-image cover flex">
            惠州市精瑞砂轮有限公司
          </div>
          <div class="box-unit-price">陶瓷刚玉（CA）</div>
          <div class="box-number">
            40#
          </div>
          <div class="box-subtotal">{{ vuex_huobi }} {{
              (item.priceSale * item.num).toFixed(2)
            }}
          </div>
          <div class="box-act">
            <div class="goods-action-box">
              <div class="add-card">
                加入购物车
              </div>
              <div class="collect-no">
                取消收藏
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.page {
  padding: 0;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Roboto, Roboto-Bold, Roboto, Roboto;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: @theme;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 10px;
  padding: 24px 32px;
  background: #fff;
}

.list-title {
  background: #E9E9E9;
  color: #666;
  padding: 11px 20px;
  font-size: 14px;
  .flex();

  .all-select {
    margin-right: 30px;

  }

  .delete-box {
    cursor: pointer;
    color: #666;
  }

}

.item {
  border-bottom: 1px solid #eee;
  padding: 0 20px;

  &:last-child {
    border-bottom: none;
  }

  .item-title {
    .flex();
    text-align: left;
    padding: 12px 40px;
    border-bottom: 1px solid #eee;

    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }

  .item-detail {
    padding: 15px 0;
    font-family: OPPOSans, OPPOSans;
    // font-weight: bold;
    font-size: 14px;
    color: #666666;


    .box-select {
      width: 50px;
      width: 50px;

      /deep/ .el-checkbox__inner {
        border-color: @theme !important;
      }

      /deep/ .is-checked .el-checkbox__inner {
        background: @theme !important;
        border-color: @theme !important;
      }
    }

    .box-image {
      flex: 2;

      img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
        cursor: pointer;
      }

      /deep/ img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
        cursor: pointer;
      }
    }

    .box-title {
      flex: 2;
      text-align: left;

      div {
        &:hover {
          color: @theme;
        }
      }

      .goods-title {
        width: fit-content;
        cursor: pointer;
        // height: 40px;
        .ellipsis-2();
        color: #333;

      }

      .sku-info {
        width: fit-content;
        cursor: pointer;
        margin-top: 10px;
        color: #77797B;
      }
    }

    .box-sku {
      width: 200px;
    }

    .box-unit-price {
      width: 150px;
      color: #0B0B0B;
    }

    .box-number {
      width: 150px;
      .flex-center();

      input {
        width: 48px;
        height: 30px;
        border: 1px solid #d5d8de;
        text-align: center;
        border-left: 0;
        border-right: 0;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }

      button {
        width: 30px;
        height: 30px;
        border: 1px solid #d5d8de;
      }
    }

    .box-subtotal {
      width: 150px;
      color: #0B0B0B;
    }

    .box-inventory {
      width: 150px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 24px;
    }

    .box-act {
      width: 250px;
      font-size: 16px;

      .goods-action-box {
        display: flex;
        cursor: pointer;
      }

      .add-card {
        width: 104px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #044E9F;
        color: #fff;
        font-size: 14px;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid rgba(0, 0, 0, 0);
      }

      .collect-no {
        width: 104px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: #666;
        font-size: 14px;
      }
    }
  }
}
</style>