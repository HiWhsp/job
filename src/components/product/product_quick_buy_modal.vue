<template>
  <div class="modal-container">
    <el-dialog :visible.sync="show_modal" width="1400px" custom-class="quick-buy-modal" :close-on-click-modal="false"
      :before-close="onBeforeClose" v-loading="loading" :title="info.title">
      <div class="modal-inner">
        <div class="left-pic">
          <!-- <div class="pic-box">
            <img :src="(info.images && info.images[0]) || info.thumb" alt="" />
          </div>
          <div class="thumb-list" v-if="info.images && info.images.length">
            <div
              class="thumb-item"
              v-for="(img, idx) in info.images"
              :key="idx"
              @click="thumbIndex = idx"
            >
              <img :src="img" />
            </div>
          </div> -->

          <detailLunbo :imageList="detailImages" />
        </div>
        <div class="right-info">
          <div class="detail-title flex">
            <div class="title-text flex">
              {{ info.title }}
              <img v-if="info.isThird == 1" src="@img/product/sanlei.png" alt="" />
            </div>
          </div>
          <div class="detail-desc">商品编号：{{ info.productNo || "--" }}</div>

          <div class="sale-info">
            <div class="list">
              <div class="item price-item">
                <div class="label">价格</div>
                <div class="vals vals-price">
                  <div class="val">￥{{ price_range }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="info-texts">
            <div class="text-item">
              <div class="label">总销量</div>
              <div class="text">{{ info.orders }}</div>
            </div>
          </div>

          <div class="other-box">
            <div class="sku-box column-flex-center">
              <div class="flex-between" style="width: 100%">
                <div class="sku-label">选择规格</div>
                <!-- <div class="sku-tip">量大优惠，请关注以下单价变化</div> -->
              </div>
              <div class="sku-list">
                <div class="sku-item flex-between" :class="{ active: getSkuQuantity(item) > 0 }"
                  v-for="(item, index) in sku_list" :key="index" @click="clickSkuItem(item)">
                  <div class="sku-item-text">
                    <div class="text">
                       <el-image style="width: 40px; height: 40px":src="item.image" :preview-src-list="[item.image]"></el-image>
                      <span>
                        {{ item.keyVals }}
                      </span>
                    </div>
                    <div class="tier-pricing">
                  
                      <span v-for="(cit, cidx) in item.priceConfig" :key="cidx" style="margin-right: 8px">
                        
                        <template v-if="cit.min && cit.max">
                          {{ cit.min }}-{{ cit.max + info.unit }}¥{{
                            cit.price
                          }}
                          </template>
                        <template v-else-if="cit.price">
                          ≥{{ cit.min + info.unit }}¥{{ cit.price }}
                        </template>
                      </span>
                    </div>
                  </div>

                  <div class="sku-details flex-center">
                    <div class="price-info">
                      <div class="current-price">
                        ¥{{ getCurrentPrice(item) }}/{{ info.unit }}
                      </div>
                    </div>
                    <div class="stock-info">库存{{ item.kucun }}</div>
                    <div class="quantity-control">
                      <div class="quantity-input">
                        <div class="btn minus" :disabled="getSkuQuantity(item) <= 0"
                          @click.stop="decreaseSkuQuantity(item)">
                          <img src="@img/product/num-minus.png" alt="" />
                        </div>
                        <input type="number" v-model="sku_quantities[item.inventoryId]" @click.stop min="0"
                          :max="item.kucun" @blur="onBlurSkuQuantity(item)"
                          @input="updateSkuQuantity(item, $event.target.value)" />
                        <div class="btn plus" :disabled="getSkuQuantity(item) >= item.kucun"
                          @click.stop="increaseSkuQuantity(item)">
                          <img src="@img/product/num-plus.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order-summary">
              <div class="flex-center box">
                <div class="summary-item">
                  已选 <span>{{ orderSummary.selectedItems }}</span>款<span>{{ orderSummary.totalQuantity }}</span>件
                </div>
                <div class="summary-item">
                  实付金额<span>¥{{ orderSummary.finalAmount }}</span>
                </div>
                <div class="summary-item" v-if="orderSummary.discount > 0">
                  <div style="font-weight: 400">
                    优惠¥{{ orderSummary.discount }}
                  </div>
                </div>
              </div>

              <!-- <button class="contact-service" @click="openInquiryModal">
                  <img src="@img/product/chat.png" alt="" />
                  量大可联系客服
                </button> -->
            </div>
            <div class="btn-box">
              <div class="left-buttons">
                <button class="btn-ripple flex-center btn-buy" @click="do_pay_now()">
                  <img src="@img/product/detail-buy.png" alt="" class="cart" />
                  立即购买
                </button>
                <button
                  class="btn-ripple flex-center btn-add-cart"
                  @click="do_add_cart()"
                >
                  <img src="@img/product/detail-cart.png" alt="" class="cart" />
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <product_add_cart_success_modal ref="product_add_cart_success_modal" />

  </div>
</template>

<script>
import detailLunbo from "@/components/detail/detailLunbo.vue";
import product_add_cart_success_modal from "@/components/product/product_add_cart_success_modal.vue";

export default {
  name: "product-quick-buy-modal",
  data() {
    return {
      loading:false,
      show_modal: false,
      id: "",
      info: {},
      sku_list: [],
      sku_quantities: {},
      selected_num: 0,
      thumbIndex: 0,
      detailImages: [],
    };
  },
  components: {
    detailLunbo,
    product_add_cart_success_modal,

  },
  computed: {
    price_range() {
      if (
        !this.info.priceSale &&
        !this.info.priceSale2 &&
        !this.info.priceSale3
      ) {
        return this.info.priceSale || this.info.priceMarket || 0;
      }
      const prices = [
        this.info.priceSale,
        this.info.priceSale2,
        this.info.priceSale3,
      ]
        .filter((v) => v)
        .map((v) => Number(v));
      if (!prices.length) return 0;
      return `${Math.min.apply(null, prices)}.00 ~ ${Math.max.apply(
        null,
        prices
      )}.00`;
    },
    orderSummary() {
      let selectedItems = 0;
      let totalQuantity = 0;
      let finalAmount = 0;
      // 计算优惠
      let discount = 0;
      this.sku_list.forEach((item) => {
        const qty = this.getSkuQuantity(item);
        if (qty > 0) {
          selectedItems += 1;
          totalQuantity += qty;

          const price = this.getCurrentPrice(item);
          finalAmount += qty * price;
          if (item.priceConfig.length > 0) {
            const idx = item.priceConfig.findIndex((it) => it.price == price);
            console.log(idx, "idx");
            if (idx > 0) {
              discount += (item.priceConfig[0].price - price) * qty;
            }
          }
        }
      });
      return {
        selectedItems,
        totalQuantity,
        finalAmount: finalAmount.toFixed(2),
        discount: discount.toFixed(2),
      };
    },
  },
  methods: {
    init(inventoryId) {
     
      this.id = inventoryId;
      this.show_modal = true;
      this.query_product_detail();
    },
    onBeforeClose() {
      this.show_modal = false;
      this.id= ""
      this.info={}
      this.sku_list= []
      this.sku_quantities= {}
      this.selected_num=0
      this.thumbIndex= 0
      this.detailImages=[]
    },
    openInquiryModal() {
      // 弹窗内占位：与详情页行为一致可后续接入咨询组件
    },
    query_product_detail() {
      this.loading=true
      this.$api({
        url: "/service.php",
        method: "get",
        data: { action: "product_detail", inventoryId: this.id, ifShowSku: 1 },
      }).then((res) => {
        this.loading=false
        if (res.code == 200) {
          const data = res.data || {};
          this.info = data || {};
          this.detailImages = data.images.map((v, i) => ({
            index: i,
            image: v,
          }));
          this.set_sku(data);
        }
      });
    },
    set_sku(data) {
      let sku_list = [];
      if (data.inventorys && data.inventorys.length) {
        sku_list = data.inventorys.map((v) => ({
          ...v,
          priceConfig: data.seckillInfo ? [] : v.priceConfig,
          keyVals: v.keyVals,
          kucun: v.kucun,
        }));
      }
      this.sku_list = sku_list;
      this.sku_quantities = {};
      sku_list.forEach((item) => {
        this.$set(this.sku_quantities, item.inventoryId, 0);
      });
      this.updateTotalQuantity();
    },
    getSkuQuantity(item) {
      if (!this.sku_quantities[item.inventoryId]) {
        return 0;
      }
      return parseInt(this.sku_quantities[item.inventoryId]) || 0;
    },
    getCurrentPrice(item) {
      // 数量为0按1处理
      let quantity = this.getSkuQuantity(item) || 1;

      // 优先按 priceConfig 区间定价
      if (Array.isArray(item.priceConfig) && item.priceConfig.length) {
        // 找到最大区间的 max
        const sorted = [...item.priceConfig].sort(
          (a, b) => (a.min || 0) - (b.min || 0)
        );
        const maxConfig = sorted.reduce(
          (acc, cur) => {
            const curMax = typeof cur.max === "number" ? cur.max : Infinity;
            const accMax = typeof acc.max === "number" ? acc.max : -Infinity;
            return curMax > accMax ? cur : acc;
          },
          { max: -Infinity }
        );

        // 超过最高配置按最高价位处理（题意：按最高配置取值）
        if (typeof maxConfig.max === "number" && quantity > maxConfig.max) {
          return Number(
            maxConfig.price || maxConfig.priceSale || item.priceSale || 0
          );
        }

        // 在区间内匹配 >= min 且 <= max；若 max 为空则视为无上限
        const match = sorted.find((cfg) => {
          const min = Number(cfg.min || 0);
          const hasMax = Number(cfg.max || 0) && !isNaN(cfg.max);
          const max = hasMax ? Number(cfg.max) : Infinity;
          return quantity >= min && quantity <= max;
        });
        if (match) {
          return Number(match.price || match.priceSale || item.priceSale || 0);
        }
      }

      // 无 priceConfig 时，按单价 priceSale 计算
      return Number(item.priceSale || 0);
    },
    increaseSkuQuantity(item) {
      const current = this.getSkuQuantity(item);
      if (current < item.kucun) {
        this.$set(this.sku_quantities, item.inventoryId, current + 1);
        this.updateTotalQuantity();
      }
    },
    decreaseSkuQuantity(item) {
      const current = this.getSkuQuantity(item);
      if (current > 0) {
        this.$set(this.sku_quantities, item.inventoryId, current - 1);
        this.updateTotalQuantity();
      }
    },
    onBlurSkuQuantity(item) {
      let quantity = parseInt(this.sku_quantities[item.inventoryId]) || 0;
      if (quantity < 0) quantity = 0;
      if (quantity > item.kucun) quantity = item.kucun;
      this.$set(this.sku_quantities, item.inventoryId, quantity);
      this.updateTotalQuantity();
    },
    updateSkuQuantity(item, value) {
      let quantity = parseInt(value) || 0;
      if (quantity < 0) quantity = 0;
      this.$set(this.sku_quantities, item.inventoryId, quantity);
      this.updateTotalQuantity();
    },
    clickSkuItem(item) {
      if(item.kucun){

        if (this.getSkuQuantity(item) === 0) {
          this.$set(this.sku_quantities, item.inventoryId, 1);
        } else {
          this.$set(this.sku_quantities, item.inventoryId, 0);
        }
        this.updateTotalQuantity();
      }
    },
    updateTotalQuantity() {
      this.selected_num = Object.values(this.sku_quantities).reduce(
        (sum, qty) => sum + (parseInt(qty) || 0),
        0
      );
    },
    do_pay_now() {
      if (this.selected_num == 0) {
        alertErr("请选择订购数量！");
        return;
      }
      if (!this.mix_get_login_status()) {
        return;
      }
      let info = this.info;
      let data_format = [];
      this.sku_list.forEach((item) => {
        const quantity = this.getSkuQuantity(item);
        if (quantity > 0) {
          data_format.push({
            title: info.title,
            image: item.image || info.thumb,
            inventoryId: item.inventoryId,
            productId: info.productId,
            keyVals: item.keyVals,
            num: quantity,
            priceSale: this.getCurrentPrice(item),
            discountSale: info.discountSale,
            priceMarket: item.priceMarket,
          });
        }
      });
      let str_data = JSON.stringify(data_format);
      this.$store.commit("set_cache_payment_products", str_data);
      this.$router.push({ path: "/order-submit" });
      this.show_modal = false;
    },
    do_add_cart() {
      if (this.selected_num == 0) {
        alertErr("请选择订购数量！");
        return;
      }
      if (!this.mix_get_login_status()) {
        return;
      }
      let addPromises = [];
      this.sku_list.forEach((item) => {
        const quantity = this.getSkuQuantity(item);
        if (quantity > 0) {
          addPromises.push(
            this.$api({
              url: "/service.php",
              method: "get",
              data: {
                action: "gouwuche_add",
                inventoryId: item.inventoryId,
                num: quantity,
              },
            })
          );
        }
      });
      Promise.all(addPromises).then((results) => {
        let totalCount = 0;
        results.forEach((res) => {
          if (res.code == 200) totalCount += res.data.count || 0;
        });
         this.$refs.product_add_cart_success_modal.init({
            num: totalCount,
            title: "商品已添加到购物车",
          });
        if (totalCount) this.$store.commit("set_vuex_cart_number", totalCount);
        this.show_modal = false;
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;
}

/deep/ .el-dialog__body {
  padding: 24px 24px 30px;
}

.modal-inner {
  display: flex;
}

.left-pic {
  width: 443px;

  /deep/.lunbo-box,
  /deep/.zhutu-wrap,
  /deep/.zhutu-inner {
    width: 443px;

    .el-carousel {
      width: 443px;
    }
  }

  /deep/.zhutu-wrap,
  /deep/.zhutu-inner {
    height: 443px;

    .el-carousel {
      height: 443px;
      width: 443px;
    }
  }
}

.right-info {
  flex: 1;
  min-height: 364px;
  margin-left: 36px;
  text-align: left;

  .detail-title {
    .title-text {
      flex: 1;
      font-family: Poppins, Poppins;
      font-weight: bold;
      font-size: 26px;
      color: #000000;

      img {
        width: 94px;
        margin-left: 7px;
      }
    }

    .price-box {
      margin-left: 100px;
      font-family: Arial, Arial;
      font-weight: bold;
      font-size: 30px;
      color: #ff0000;
    }
  }

  .detail-desc {
    margin-top: 17px;
    margin-bottom: 20px;
    font-family: OPPOSans, OPPOSans;
    // font-weight: bold;
    font-size: 16px;
    color: #747474;
    line-height: 30px;
  }

  .sale-info {
    padding: 0px;
    background: #f7f7f7;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .list {
      .item {
        display: flex;
        align-items: center;
        padding: 12px 20px;

        &.price-item {
          background: url("~@img/product/sale-bg.png");
          // padding-top: 20px;
          // padding-bottom: 35px;
          padding: 20px 40px 35px;
        }

        .label {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 18px;
          color: #6a6a6a;
        }

        .vals {
          display: flex;
          align-items: center;
          //flex: 1;
          margin-left: 28px;

          font-size: 16px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          color: #353535;

          &.vals-price {
            font-size: 32px;
            font-family: PingFang SC, PingFang SC;
            font-weight: bold;
            color: #6941aa;
          }

          .val {
            flex: 1;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: bold;
            font-size: 32px;
            color: #6941aa;
          }
        }
      }
    }

    .price {
      display: flex;
      align-items: center;

      .number {
        font-size: 28px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #ea3200;
      }
    }
  }

  .other-box {
    padding-left: 20px;
  }

  .info-texts {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 45px;
    background: #f8f8f8;

    .text-item {
      display: flex;
      align-items: center;

      .label {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 18px;
        color: #6a6a6a;
      }

      .text {
        margin-left: 16px;
        font-size: 18px;
        color: #6941aa;
        font-weight: bold;
      }
    }
  }

  .sku-box {
    margin-top: 33px;
    display: flex;
    align-items: flex-start;
    width: 100%;

    .sku-label {
      margin-top: 8px;
      min-width: 90px;

      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 18px;
      color: #505050;
    }

    .sku-tip {
      margin-left: 20px;
      font-size: 18px;
      color: #00306B;
      font-family: Microsoft YaHei, Microsoft YaHei;
    }
  }

  .sku-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
    border-bottom: 1px solid #d6d6d6;
    padding-bottom: 10px;

    .sku-item {
      // padding: 10px;
      // border: 1px solid #ddd;
      // border-radius: 8px;
      background: #fff;
      transition: all 0.3s;
      cursor: pointer;
      .sku-item-text{
        width: 600px;
        text-wrap: nowrap;
        .text{
           display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            span{
              margin-left: 20px;
            }
        }
      }

      &:hover {
        // border-color: #00306B;
        // box-shadow: 0 2px 8px rgba(120, 83, 178, 0.1);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        color: #ccc;
      }

      &.active {
        // border: 1px solid #00306B;
        // box-shadow: 0 0 10px rgba(120, 83, 178, 0.2);
        // background: #f8f5ff;

        .text {
          // color: #00306B;
        }

        .price {
          // color: #00306B;
        }
      }

      .text {
        font-size: 16px;
        // font-weight: 500;
        color: #1F1F1F;
        // margin-bottom: 10px;
      }

      .tier-pricing {
        font-size: 12px;
        color: #9b9b9b;
        // margin-bottom: 15px;
        // line-height: 1.5;
      }

      .sku-details {
        // display: flex;
        // justify-content: space-between;
        // align-items: center;

        .price-info {
          display: flex;
          flex-direction: column;
          gap: 5px;

          .current-price {
            font-size: 16px;
            color: #00306B;
            text-wrap: nowrap;
          }
        }

        .stock-info {
          padding: 0 13px 0 25px;
          font-size: 16px;
          color: #505050;
            text-wrap: nowrap;

        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 10px;

          .quantity-input {
            display: flex;
            align-items: center;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;

            .btn {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 32px;
              height: 32px;
              background: #f5f5f5;
              border: none;
              cursor: pointer;
              transition: background 0.3s;

              &:hover {
                background: #e0e0e0;
              }

              &:disabled {
                cursor: not-allowed;
                opacity: 0.5;
              }

              img {
                width: 12px;
                height: 12px;
              }
            }

            input {
              width: 60px;
              height: 32px;
              border: none;
              text-align: center;
              font-size: 14px;
              outline: none;
              background: #fff;

              &::-webkit-outer-spin-button,
              &::-webkit-inner-spin-button {
                -webkit-appearance: none;
              }

              &[type="number"] {
                -moz-appearance: textfield;
              }
            }
          }
        }
      }
    }
  }

  .shuliang-box {
    margin-top: 20px;
    display: flex;
    align-items: center;

    .sel-num-title {
      min-width: 90px;
      font-family: Arial, Arial;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #505050;
    }

    .kucun {
      margin-left: 16px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #505050;
    }

    .shuliang {
      min-width: 105px;
      display: flex;
      align-items: center;

      .btn {
        display: flex;
        justify-content: center;
        align-items: center;

        border: 1px solid #d5d8de;
        width: 24px;
        height: 24px;
        cursor: pointer;
        user-select: none;

        &:hover {
          opacity: 0.8;
        }

        img {
          width: 10px;
          height: 10px;
          vertical-align: bottom;
        }
      }

      .minus {}

      input {
        outline: none;
        margin: 0 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-left: none;
        border-right: none;

        width: 40px;
        height: 30px;
        height: 24px;
        line-height: 30px;
        text-align: center;

        font-size: 16px;
        font-family: Arial;
        font-weight: 400;
        color: #4a4a4a;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
      }

      /* chrome */
      input[type="number"] {
        -moz-appearance: textfield;
        /* firefox */
      }

      .plus {}
    }
  }

  .yunfei-box,
  .dinghuo-box {
    margin-top: 30px;

    .label {
      min-width: 90px;
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #505050;
    }

    .value {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #505050;
    }
  }

  .order-summary {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    align-items: flex-end;
    margin: 12px 0;

    .box {
      align-items: flex-end;
      font-family: Microsoft YaHei, Microsoft YaHei;
    }

    .summary-item {
      font-size: 16px;
      color: #1F1F1F;
      text-align: right;
      margin-left: 20px;
      font-weight: bold;

      span {
        font-size: 24px;
        color: #00306B;
        padding: 0 1px;
      }
    }

    .contact-service {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 224px;
      height: 56px;
      border-radius: 8px 8px 8px 8px;
      border: 1px solid #00306B;
      font-size: 20px;
      font-weight: bold;
      color: #00306B;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #e0e0ff;
      }

      img {
        width: 24px;
        height: 24px;
        margin-right: 2px;
      }
    }
  }

  .btn-box {
    margin-top: 10px;
    display: flex;
    justify-content: end;
    align-items: flex-start;

    .left-buttons {
      display: flex;
      gap: 20px;

      button {
        font-size: 16px;
        transition: 0.3s;
        border-radius: 8px;
        // font-weight: bold;
        font-size: 18px;
        font-size: 20px;
        font-weight: bold;
        color: #ffffff;
        width: 224px;
        height: 56px;

        .cart {
          width: 24px;
          margin-right: 2px;
        }

        &:hover {
          opacity: 0.8;
        }
      }

      .btn-buy {
        background: #00306B;

        font-family: Microsoft YaHei, Microsoft YaHei;
      }

      .btn-add-cart {
        background: #FCB000;

        img {
          margin-right: 2px;
        }
      }

      .btn-add-fav {
        width: 164px;
        height: 48px;
        background: #ffffff;
        border-radius: 0px 0px 0px 0px;
        border: 1px solid #00306B;
        font-family: OPPOSans, OPPOSans;
        // font-weight: bold;
        font-size: 18px;
        color: #00306B;
      }
    }
  }
}
</style>
