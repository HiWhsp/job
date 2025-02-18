<template>
  <div class="page">
    <div class="main-title w-1400">购物车</div>
    <div class="step-progress w-1400">
      <div class="step active">
        <div class="circle">1</div>
      </div>
      <div class="line"></div>
      <div class="step active">
        <div class="circle">2</div>
      </div>
      <div class="line"></div>
      <div class="step active">
        <div class="circle">3</div>
      </div>
    </div>
    <div class="step-text w-1400">
      <span>购物车</span>
      <span>确认订单信息并支付</span>
      <span>完成</span>
    </div>
    <div class="inner w-1400">
      <!-- 商品列表 -->
      <div class="ctx-box">
        <div class="list cart-list">
          <div class="cart-list-inner">
            <!-- 标题 -->
            <div class="list-title">
              <div class="title-1"></div>
              <!-- <div class="title-3">货号</div> -->
              <div class="title-2" style="text-align: left; padding-left: 0px">产品名称</div>
              <div class="title-4">单价</div>
              <div class="title-5">数量</div>
              <div class="title-6">小计</div>
            </div>

            <!-- 商品列表 -->
            <div class="item" v-for="(item, index) in list_shopcart" :key="index">
              <div class="item-detail flex">
                <div class="box-select">
                  <span class="goods-action" @click="do_cart_delete_row(item.inventoryId)">
                       <i class="el-icon-close"></i>
                  </span>
                </div>

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
                </div>
                <!--                <div class="box-sku">-->
                <!--                  {{ item.keyVals }}-->
                <!--                </div>-->
                <div class="box-unit-price">{{ vuex_huobi }} {{ item.priceSale }}</div>
                <div class="box-number">
                  <button @click="do_number_minus(item)">-</button>
                  <input type="number" min="1" v-model="item.num" @blur="on_blur_input(item)"/>
                  <button @click="do_number_plus(item)">+</button>
                </div>
                <div class="box-subtotal">{{ vuex_huobi }} {{ (item.priceSale * item.num).toFixed(2) }}</div>
              </div>
            </div>

            <el-empty v-if="!list_shopcart.length" description="购物车是空的..."></el-empty>
            <!-- <div class="empty" v-if="!list_shopcart.length">暂无数据...</div> -->
          </div>
        </div>


        <!-- 底部操作 -->
        <div class="bottom-action-box">
          <div class="flex">
            <div class="delete-box">
              <span @click="$router.push('/product-cates')">继续购物</span>
            </div>
            <div class="clear-box">
              <span @click="do_cart_clear()">清空购物车</span>
            </div>
          </div>

          <button class="btn-ripple btn-order" @click="setView()">
            更新购物车
          </button>

          <!--          <div class="total-number">-->
          <!--            已选择-->
          <!--            <b>{{ count_shopcart_checked }}</b>-->
          <!--            件商品-->
          <!--          </div>-->
          <!--          <div class="total-price">-->
          <!--            总价：-->
          <!--            <b>{{ vuex_huobi }} {{ shopcart_money }}</b>-->
          <!--          </div>-->
          <!--          <button :disabled="jiesuanDisabled" class="btn-ripple btn-order" @click="to_pay()">-->
          <!--            去下单-->
          <!--          </button>-->
        </div>

      </div>
      <!--      操作-->
      <div class="page-aside">
        <div class="title">购物车总数</div>
        <div class="item">
          <p>小计 <span class="money">¥696.00</span></p>
        </div>
        <div class="item" :class="{'active': isShow}" @click="isShow = !isShow">
          <p>积分抵扣 <span class="money">¥5.00 <i class="el-icon-arrow-down" v-if="!isShow"></i> <i
              class="el-icon-arrow-up" v-if="isShow"></i></span></p>
          <div class="info">
            <p>我的积分 <span>100</span></p>
            <p>可抵扣积分 <span>100</span></p>
            <p>输入您要抵扣的积分
              <span class="right">
                <el-input v-model="keyword"></el-input>
                <span class="all">全部</span>
              </span>
            </p>
            <p>抵扣金额 <span class="money">¥5.00</span></p>
          </div>
        </div>
        <div class="item">
          <p>运费 <span class="money">¥0.00</span></p>
        </div>
        <div class="cart-footer">
          <p class="subtotal">总计： <span class="total-price">￥{{ shopcart_money }}</span></p>
          <el-button class="checkout-btn" @click="to_pay">下单</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";

export default {
  name: "cart",
  components: {pageBreadcrumb},
  data() {
    return {
      isShow: false,
      address: "", //选择的地址
      checked_all: false, //是否全选
      list_shopcart: [], //购物车商品列表
      list_address: [], //地址列表
      keyword: "",
    };
  },
  computed: {
    ...mapState(["defaultAvatar", "shopcart_count"]),
    nav_option() {
      let channelId_arr = this.$route.query.ids ? this.$route.query.ids.split('-') : []
      let channelId = channelId_arr.pop()
      console.log(channelId)

      let cate_info = this.vuexFlatCates.find(v => v.id == channelId) || {}

      let option = [
        {route: '/product-reserve', title: '预约产品'},
        {route: '', title: '购物车'}
      ]
      console.log(option)
      return option
    },

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
    do_update_vuex_cart_number() {
      let count = 0;
      this.list_shopcart.forEach((v) => {
        count += v.num * 1;
      });

      this.$store.commit("set_vuex_cart_number", count);
    },

    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "gouwuche_lists",
        }
      })
          .then((res) => {
            let {code, data} = res;
            if (code == 200) {
              data.forEach((v) => {
                v.checked = true;
              });
              this.list_shopcart = data;
              if (data.length) {
                this.checked_all = true;
              }

              this.do_update_vuex_cart_number()
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
        }
      }).then(res => {
        if (res.code == 200) {
          let list = this.list_shopcart;
          let ids = (inventoryId + "").split(",");
          //可能删除多项商品
          ids.forEach((inventoryId) => {
            let index = list.findIndex((v) => v.inventoryId == inventoryId);
            list.splice(index, 1);
          });

          this.do_update_vuex_cart_number()
        }
      })
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
        }
      }).then(res => {
        if (res.code == 200) {
          let index = this.list_shopcart.findIndex((v) => v.inventoryId == inventoryId);
          this.list_shopcart.splice(index, 1, item);

          this.do_update_vuex_cart_number()
        }
      })
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
        }
      }).then(res => {
        if (res.code == 200) {
          this.list_shopcart = [];
          this.do_update_vuex_cart_number()
        }
      })

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

      let data_format = this.list_shopcart_checked.map(v => ({
        title: v.title,
        image: v.image,
        inventoryId: v.inventoryId,
        productId: v.productId,
        keyVals: v.keyVals,
        num: v.num,
        priceSale: v.priceSale,
        priceMarket: v.priceMarket,
      }));


      this.$store.commit('set_cache_payment_products', JSON.stringify(data_format))

      this.$router.push({
        path: "/order-submit",
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

<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}

.page {
  background-color: #fff;
  padding-top: 20px;
  text-align: center;
  font-size: 14px;

  .main-title {
    padding-left: 20px;
    text-align: left;
    height: 52px;
    line-height: 52px;
    background: #F4F4F4;

    font-weight: 400;
    font-size: 20px;
    color: #000000;
  }

  .step-progress {
    margin-top: 28px;
    width: 282px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .circle {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #000;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
      }

      .label {
        width: 100%;
        margin-top: 8px;
        font-size: 14px;
        text-align: center;
      }

      &.active {
        .circle {
          background: #000;
        }
      }
    }

    .line {
      width: 84px;
      height: 2px;
      background: #D8D8D8;
    }
  }

  .step-text {
    width: 282px;
    display: flex;
    justify-content: space-between;
    padding-right: 8px;
    margin-top: 6px;
    margin-bottom: 28px;

    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #000000;
  }

  .inner {
    display: flex;
    min-height: 50vh;
    margin: 0 auto;
    padding: 0 0 80px;

    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }

  .ctx-box {
    flex: 1;
    padding-bottom: 20px;

    .list {
      padding: 20px 0;

      .list-title {
        text-align: left;
        height: 48px;
        background-color: #F4F4F4;
        color: #000;

        display: flex;
        align-items: center;

        .title-1 {
          width: 50px;
          text-align: center;
        }

        .title-2 {
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
        border: 1px solid #eee;

        .item-title {
          display: flex;
          align-items: center;
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
          color: #000;


          .box-select {
            width: 50px;
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
            flex: 1;
            text-align: left;

            div {
              &:hover {
                color: #F74747;
              }
            }

            .goods-title {
              width: fit-content;
              cursor: pointer;
              // height: 40px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 2;

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
            color: #000;
            text-align: left;
          }

          .box-number {
            width: 200px;
            .flex-center();
            justify-content: start;

            input {
              width: 48px;
              height: 30px;
              border: 1px solid #ccc;
              text-align: center;
              border-left: 0;
              border-right: 0;
              background-color: transparent;
              color: #000;

              &::-webkit-outer-spin-button,
              &::-webkit-inner-spin-button {
                -webkit-appearance: none;
              }
            }

            button {
              width: 30px;
              height: 30px;
              border: 1px solid #ccc;
              color: #000;
              background: #F0F0F0;
            }
          }

          .box-subtotal {
            width: 200px;
            color: #000;
            text-align: left;
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
                color: #FF1F31;
              }
            }
          }
        }
      }

      .item:first-child {
        border-bottom: none;
      }
    }
  }

  .page-aside {
    margin-top: 20px;
    padding-bottom: 20px;
    width: 374px;
    background: #FFFFFF;
    border: 1px solid #EEEEEE;
    margin-left: 20px;

    .title {
      padding: 0 20px;
      text-align: left;
      width: 374px;
      height: 62px;
      font-weight: 700;
      font-size: 18px;
      color: #000000;
      line-height: 62px;

      background: #F4F4F4;
      border: 1px solid #EEEEEE;
    }

    .item {
      cursor: pointer;
      margin: 0 24px;
      height: 47px;
      line-height: 47px;
      border-bottom: 1px solid #eee;
      overflow: hidden;

      transition: 0.5s;

      p {
        display: flex;
        justify-content: space-between;
      }

      .info {
        p {
          height: 30px;
          line-height: 30px;
          font-size: 14px;

          span {
            color: #000;
          }

          .right {
            .all {
              color: #396DAD;
              cursor: pointer;
              margin-left: 15px;
            }
          }

          .money {
            color: #D41C17;
          }

          .el-input {
            width: 140px;
          }

          /deep/ .el-input__inner {
            height: 30px;
          }
        }

      }
    }

    .item.active {
      height: 184px;
    }

    .cart-footer {
      margin-top: 20px;
      text-align: center;
      padding: 0 24px;

      .subtotal {
        font-size: 20px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        margin-bottom: 28px;
      }

      .total-price {
        color: #000000;
        font-size: 18px;
      }

      .checkout-btn {
        width: 100%;
        height: 44px;
        color: white;
        font-size: 16px;

        background: #D41C17;
      }
    }
  }
}

.goods-action {
  cursor: pointer;
  .flex-center();
  font-family: OPPOSans, OPPOSans;
  font-weight: 400;
  font-size: 18px;
  color: #666666;

  img {
    width: 20px;
  }
}

.bottom-action-box {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;

  .delete-box {
    cursor: pointer;
    width: 148px;
    height: 44px;
    line-height: 44px;
    background: #F4F4F4;

    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 16px;
      color: #000;
    }
  }

  .clear-box {
    margin-left: 10px;
    cursor: pointer;
    width: 148px;
    height: 44px;
    line-height: 44px;
    background: #F4F4F4;

    span {
      font-family: OPPOSans, OPPOSans;
      font-weight: 400;
      font-size: 16px;
      color: #000;
    }
  }

  .total-number {
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #000;

    b {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #000;
    }
  }

  .total-price {
    margin-left: 60px;
    margin-right: 60px;
    width: fit-content;

    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #000;

    b {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #000;
    }
  }

  .btn-order {
    cursor: pointer;
    width: 148px;
    height: 44px;
    background: #000000;
    color: #fff;

    font-size: 16px;
    font-family: Microsoft YaHei;
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

<style scoped lang="less" src="@/assets/h5css/shop/shoppingCart.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/shoppingCart.less"></style>
