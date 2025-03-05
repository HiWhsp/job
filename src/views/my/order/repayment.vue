<template>
  <div class="page">
    <div class="inner">
      <div class="main-title">
        <div class="left">
          <span>还款</span>
        </div>
      </div>
      <!-- 商品列表 -->
      <div class="ctx-box">
        <div class="list cart-list">
          <div class="cart-list-inner">
            <!-- 标题 -->
            <div class="list-title">
              <el-checkbox
                  v-model="checked_all"
                  class="title-1"
                  @change="on_change_checked_all"
              >{{ checked_all ? "反选" : "全选" }}
              </el-checkbox>
              <div class="title-2" style="text-align: left; padding-left: 0px">
                项目名称
              </div>
              <div class="title-4">订单编号</div>
              <div class="title-5">欠款金额</div>
              <div class="title-6">发票状态</div>
            </div>

            <!-- 商品列表 -->
            <div
                v-for="(item, index) in list_shopcart"
                :key="index"
                class="item"
            >
              <div class="item-detail flex">
                <div class="box-select">
                  <el-checkbox
                      v-model="item.checked"
                      @change="on_change_checked_item"
                  ></el-checkbox>
                </div>
                <!-- <div class="box-sku" @click="mix_to_product(item)">{{ item.skuId }}</div> -->

                <div class="box-image cover">
                  <!-- <img :src="item.image" @click="mix_to_product(item)" /> -->
                  <el-image :src="item.image" @click="mix_to_product(item)">
                    <div slot="error" class="image-slot">
                      <img :src="item.default_img"/>
                    </div>
                  </el-image>
                </div>
                <div class="box-title">
                  <div class="goods-title" @click="mix_to_product(item)">
                    {{ item.title }}
                  </div>
                  <div class="goods-sub-title">{{ item.subtitle }}</div>
                </div>
                <div class="box-unit-price">
                  {{ vuex_huobi }} {{ item.priceSale }}
                </div>
                <div class="box-subtotal">
                  {{ vuex_huobi }} {{ (item.priceSale * item.num).toFixed(2) }}
                </div>
                <div class="box-act">
                  <div class="goods-action-box">
                    <span
                        class="goods-action"
                        @click="do_cart_delete_row(item.inventoryId)"
                    >
                      删除
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <el-empty
                v-if="!list_shopcart.length"
                description="暂无数据..."
            ></el-empty>
            <!-- <div class="empty" v-if="!list_shopcart.length">暂无数据...</div> -->
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="bottom-action-box">
          <div class="total-number">
            总共欠款：
            <b>{{ count_shopcart_checked }}</b>
            元
          </div>
          <div class="total-price">
            本次还款：
            <b>{{ vuex_huobi }} {{ shopcart_money }}</b>
            元
          </div>
        </div>
      </div>
      <div class="section-ctx">
        <div class="pay-group">
          <div class="title"><span>*</span>支付方式：</div>
          <div class="pay-items">
            <div v-for="(item, index) in payTypeOption" :class="{ checked: info.payType == item.value }" class="item"
                 @click="do_toggle_paytype(item)">
              <img alt=""
                   class="img-check check-0 check-img check-img-0" src="@/assets/img/base/invite/check0.png"/>
              <img alt=""
                   class="img-check check-1 check-img check-img-1" src="@/assets/img/base/invite/check1.png"/>
              <img :src="item.icon" alt="" class="marker-img"/>
              <span>{{ item.title }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="info.payType === 'paypal'" class="account">
        <p style="color: #666666;">注：您在发票提交财务报销或通过直接向我司转账后，可取得对公转账凭证。
          <br>
          上传转账凭证，有利于我司财务人员快速核对还款情况，迅速恢复信用金。</p>
        <div class="it">
          <p><span>户名：</span>{{ webConfig.company_name }}</p>
          <p><span>账号：</span>{{ webConfig.bank_no }}</p>
          <p><span>开户行：</span>{{ webConfig.bank_name }}</p>
        </div>
      </div>
      <div v-if="info.payType === 'paypal'" class="section-ctx">
        <div class="pay-group">
          <div class="title">上传凭证 :</div>
          <div class="upload-ctx">
            <el-upload
                :show-file-list="false"
                action="https://jsonplaceholder.typicode.com/posts/"
                class="avatar-uploader">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <div v-else class="box">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>
          </div>
        </div>
      </div>
      <div v-if="info.payType === 'bank'" class="section-ctx">
        <div class="pay-group">
          <div class="title">支付团体：</div>
          <div class="pay-items">
            <el-radio-group v-model="radio">
              <el-radio :label="3">备选项</el-radio>
              <el-radio :label="6">备选项</el-radio>
              <el-radio :label="9">备选项</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div v-if="info.payType === 'paypal' || info.payType === 'bank'" class="section-ctx">
        <div class="pay-group">
          <div class="title">备注：</div>
          <div class="pay-items">
            <el-input v-model="info.prepaidRemark"
                      :rows="4"
                      maxlength="200" placeholder="您可以填写欠款、回款的相关说明，以便平台和财务核对" show-word-limit type="textarea">
            </el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "cart",
  components: {},
  data() {
    return {
      imageUrl: '',
      info: {
        payType: 1, // 支付方式
        prepaidAccount: 1, // 预付账户
        prepaidBenefits: '', // 预付福利
        prepaidAmount: '', // 预付金额
        prepaidGift: '', // 预付赠送金
        prepaidRemark: '', // 预付备注
      },
      payTypeOption: [
        {value: 'weixin', title: '微信支付', icon: require("@/assets/img/base/invite/wxPay.png")},
        {value: 'zhifubao', title: '支付宝支付', icon: require("@/assets/img/base/invite/zfbPay.png")},
        {value: 'paypal', title: '对公转账', icon: require("@/assets/img/base/invite/duigong.png")},
        // {value: 'bank', title: '团体余额', icon: require("@/assets/img/base/invite/pay4.png")},
      ],
      checked_all: false, // 是否全选
      list_shopcart: [], // 购物车商品列表
      keyword: "",
    };
  },
  computed: {
    ...mapState(["defaultAvatar", "shopcart_count", "webConfig"]),

    canSubmit() {
      return this.form.name;
    },

    //购物车商品总金额
    shopcart_money() {
      let money = 0;
      this.list_shopcart
          .filter((v) => v.checked)
          .forEach((v) => {
            money += v.num * v.priceSale;
          });
      return money.toFixed(2);
    },

    //购物车被选择的商品
    list_shopcart_checked() {
      return this.list_shopcart.filter((v) => v.checked);
    },
    //购物车被选择的商品
    count_shopcart_checked() {
      let count = 0;
      if (this.list_shopcart_checked.length) {
        this.list_shopcart_checked.forEach((v) => {
          count += +v.num;
        });
      }
      return count;
    },

    jiesuanDisabled() {
      return !this.list_shopcart_checked.length;
    },
  },
  watch: {
    address(val) {
      //console.log("当前地址", val);
    },
  },
  created() {
    this.setView();
  },
  methods: {
    do_toggle_paytype(item) {
      this.info.payType = item.value
    },
    do_update_vuex_cart_number() {
      let count = 0;
      this.list_shopcart.forEach((v) => {
        count += v.num * 1;
      });

      this.$store.commit("set_vuex_cart_number", count);
    },

    setView() {
      this.$api({
        url: "user_order_list",
        method: "post",
        data: {
          ...this.pagination,
          if_hk: 1
        },
      }).then((res) => {
        let {code, data} = res;
        if (code == 200) {
          data.forEach((v) => {
            v.checked = true;
          });
          this.list_shopcart = data;
          if (data.length) {
            this.checked_all = true;
          }

          this.do_update_vuex_cart_number();
        }
      });
    },

    favouriteDelete(item) {
      this.$api("product_collect", {
        inventoryId: item.inventoryId,
        collect_type: 1,
      }).then((res) => {
        let {code, message} = res;

        if (code == 200) {
          this.setView();
        }
      });
    },
    favouriteAdd(item) {
      this.$api("product_collect", {
        inventoryId: item.inventoryId,
        collect_type: 0,
      }).then((res) => {
        let {code, message} = res;

        if (code == 200) {
          this.setView();
        }
      });
    },

    //购物车 删除选中
    do_cart_remove_select() {
      if (!this.list_shopcart_checked.length) {
        alertErr("请先选择要删除的商品");
        return;
      }
      let ids = this.list_shopcart_checked.map((v) => v.inventoryId);
      //console.log("要删除的商品id", ids);
      let id = ids.join();
      this.do_cart_delete_row(id);
    },

    //购车车 删除商品
    do_cart_delete_row(inventoryId) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_del",
          inventoryId: inventoryId,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = this.list_shopcart;
          let ids = (inventoryId + "").split(",");
          //可能删除多项商品
          ids.forEach((inventoryId) => {
            let index = list.findIndex((v) => v.inventoryId == inventoryId);
            list.splice(index, 1);
          });

          this.do_update_vuex_cart_number();
        }
      });
    },

    //购物车商品数量减少
    do_number_minus(item) {
      if (item.num == 1) {
        return;
      }
      item.num = --item.num;
      this.do_updateNum(item);
    },

    //购物车商品数量增加
    do_number_plus(item) {
      item.num = ++item.num;
      this.do_updateNum(item);
    },
    //购物车修改数量
    do_updateNum(item) {
      let {inventoryId, num} = item;

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_updateNum",
          inventoryId: inventoryId,
          num: num,
        },
      }).then((res) => {
        if (res.code == 200) {
          let index = this.list_shopcart.findIndex(
              (v) => v.inventoryId == inventoryId
          );
          this.list_shopcart.splice(index, 1, item);

          this.do_update_vuex_cart_number();
        }
      });
    },

    // 购物车商品更新数量

    //清空购物车
    do_cart_clear() {
      if (!this.list_shopcart.length) {
        alertErr("购物车是空的！");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_delAll",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.list_shopcart = [];
          this.do_update_vuex_cart_number();
        }
      });
    },

    //商品勾选 全选与取消
    on_change_checked_all(val) {
      //console.log("更新后的值", val);
      this.list_shopcart.forEach((v) => {
        v.checked = val;
      });
    },

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

    //去结算
    to_pay() {
      if (!this.list_shopcart.length) {
        alertErr("您的购物车是空的，快去选购商品吧！");
        return;
      }

      if (!this.list_shopcart_checked.length) {
        alertErr("请选择要结算的商品");
        return;
      }

      let data_format = this.list_shopcart_checked.map((v) => ({
        title: v.title,
        image: v.image,
        inventoryId: v.inventoryId,
        productId: v.productId,
        keyVals: v.keyVals,
        num: v.num,
        priceSale: v.priceSale,
        priceMarket: v.priceMarket,
      }));

      this.$store.commit(
          "set_cache_payment_products",
          JSON.stringify(data_format)
      );

      this.$router.push({
        name: "order",
        query: {
          from: "cart",
        },
      });
    },

    on_blur_input(item) {
      if (item.num < 1) {
        item.num = 1;
      }
      this.shopcart_updateNum(item);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .order-list-wrap {
  margin-top: 30px;
}

.page {
  width: 100%;
  background: #fff;
  text-align: center;
  font-size: 14px;
  padding-bottom: 100px;

  .inner {
    padding: 20px 22px 0 22px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }

  .main-title {
    padding-bottom: 16px;
    border-bottom: 1px solid #d5d8de;
    text-align: left;

    .left {
      font-size: 24px;
      color: #333333;
      line-height: 24px;
    }
  }

  .ctx-box {
    background: #fff;
    padding: 18px 0;

    .list {
      border-bottom: 1px solid #e6e4e1;

      .list-title {
        text-align: center;
        color: #333;
        background: #f5f5f5;
        padding: 11px 0;
        font-size: 14px;

        .flex();
        border-radius: 4px;

        .title-1 {
          width: 115px;
          text-align: center;
        }

        .title-2 {
          // width: 150px;
          flex: 2;
        }

        .title-3 {
          width: 200px;
        }

        .title-4 {
          width: 200px;
        }

        .title-5 {
          width: 200px;
        }

        .title-6 {
          width: 200px;
        }

        .title-7 {
          width: 200px;
        }
      }

      .item {
        border-bottom: 1px solid #eee;

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
            width: 58px;
            width: 100px;
          }

          .box-image {
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
                color: #4ca5e4;
              }
            }

            .goods-title {
              width: fit-content;
              height: 38px;
              cursor: pointer;
              // height: 40px;
              .ellipsis-2();
              font-size: 16px;
              color: #333333;
              line-height: 18px;
            }

            .goods-sub-title {
              font-size: 14px;
              color: #999999;
              line-height: 16px;
            }

            .sku-info {
              width: fit-content;
              cursor: pointer;
              margin-top: 10px;
            }
          }

          .box-sku {
            width: 200px;
          }

          .box-unit-price {
            width: 200px;
            color: #ff0000;
          }

          .box-number {
            width: 200px;
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
            width: 200px;
            color: #fc0d1b;
          }

          .box-act {
            width: 200px;
            font-size: 16px;

            div {
              & + div {
                margin-top: 10px;
              }

              span {
                cursor: pointer;

                &:hover {
                  color: #4ca5e4;
                }
              }
            }
          }
        }
      }
    }
  }

  .section-ctx {
    margin-top: 24px;

    .pay-group {
      .flex();

      .title {
        min-width: 120px;
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #666666;

        span {
          color: #E80000;
          margin-right: 3px;
        }
      }

      .pay-items {
        flex: 1;
        .flex();

        .item {
          .flex();
          margin-right: 60px;
          cursor: pointer;

          .check-img {
            width: 21px;
          }

          .check-img-1 {
            display: none;
          }

          .marker-img {
            width: 39px;
            height: 39px;
            margin: 0 10px;
          }

          span {
            font-size: 16px;
            font-weight: 400;
            color: #000000;
          }

          .invoice {
            width: 95px;
            height: 35px;
            border: 1px solid #D9D9D9;
            text-align: center;
            line-height: 35px;
            color: #818181;
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

          .invoice {
            background: #00479D;
            color: #fff;
          }
        }

        .el-input {
          width: 220px;
        }
      }
    }
  }

  .account {
    margin-top: 20px;
    display: flex;
    flex-direction: column;

    .title {
      width: 144px;
      height: 21px;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }

    p {
      text-align: left;
    }

    .it {
      margin-top: 10px;
      display: flex;

      p {
        min-width: 250px;

        text-align: center;
        font-weight: 400;
        font-size: 14px;
        color: #818181;

        span {
          font-weight: 400;
          font-size: 16px;
          color: #333333;
        }
      }
    }
  }

  .upload-ctx {
    .box {
      width: 100px;
      height: 100px;
      background: #FFFFFF;
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #DEDEDE;
      text-align: center;
      line-height: 100px;
      font-size: 24px;
    }
  }
}

.goods-action-box {
  text-align: center;
  font-size: 14px;
  font-weight: normal;
  color: #666666;

  .goods-action {
    .flex-center();
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;

    img {
      width: 20px;
    }
  }
}

.bottom-action-box {
  .flex();
  justify-content: end;
  padding: 20px 35px;
  margin-top: 18px;
  height: 65px;
  background: #F2F5FA;

  .all-select {
    cursor: pointer;
    min-width: 80px;
    text-align: left;
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }

  .delete-box {
    cursor: pointer;
    width: fit-content;

    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

      &:hover {
        color: @theme;
      }
    }
  }

  .clear-box {
    cursor: pointer;
    margin-left: 34px;
    flex: 2;
    text-align: left;

    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 14px;
      color: #666666;

      &:hover {
        color: @theme;
      }
    }
  }

  .total-number {
    font-weight: 400;
    font-size: 14px;
    color: #666666;

    b {
      font-size: 20px;
      font-weight: bold;
      line-height: 20px;
      color: #00479D;
    }
  }

  .total-price {
    margin-left: 60px;
    width: fit-content;

    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;

    b {
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #00479D;
    }
  }

  .btn-order {
    cursor: pointer;
    width: 191px;
    height: 46px;
    background: #27417c;
    border-radius: 4px;
    font-size: 16px;
    color: #ffffff;
    transition: 0.3s;
    user-select: none;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}

.tip-box {
  margin-top: 30px;
  text-align: left;
  font-size: 14px;
  color: #999999;

  b {
    color: #e6170b;
  }
}
</style>
