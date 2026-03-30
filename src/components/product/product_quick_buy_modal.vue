<template>
  <div class="modal-container">
    <el-dialog
      :visible.sync="show_modal"
      width="1695px"
      custom-class="quick-buy-modal"
      :close-on-click-modal="false"
      :before-close="onBeforeClose"
      v-loading="loading"
      append-to-body
      :show-close="true"
    >
      <span slot="title" class="qb-dialog-title-placeholder"></span>
      <div class="main-content qb-main-content">
        <div class="ctx-top">
          <div class="ctx-left">
            <div class="preview-wrap">
              <detailLunbo :imageList="detailImages" />
            </div>
          </div>
          <div class="ctx-right">
            <div class="detail-title flex">
              <div class="title-text flex">
                {{ info.title }}
              </div>
            </div>
            <div class="detail-desc">
              <div class="btn">FDA</div>
              <div class="btn">CE</div>
            </div>
            <div class="sale-info">
              <div class="list">
                <div class="item price-item">
                  <div class="vals vals-price">
                    <div class="val">{{ vuex_huobi }}{{ headerPriceSale }}</div>
                  </div>
                  <span>/{{ info.unit || "pack" }}</span>
                  <div class="del" v-if="headerPriceMarket">{{ vuex_huobi }}{{ headerPriceMarket }}</div>
                </div>
                <div class="item">
                  <span class="date">5-7 days delivery!</span>
                </div>
              </div>
            </div>

            <div class="other-box">
              <div class="sku-box column-flex-center">
                <template v-if="skuLists && skuLists.length > 0">
                  <div class="sku-selectors">
                    <div
                      class="sku-selector-group"
                      v-for="(skuGroup, groupIndex) in skuLists"
                      :key="groupIndex"
                    >
                      <div class="sku-selector-label">
                        <span class="sku-selector-label-text">{{ skuGroup.key }}:</span>
                        {{ getSelectedOptionTitle(skuGroup) }}
                      </div>
                      <div class="sku-selector-options">
                        <div
                          v-for="child in skuGroup.child"
                          :key="child.id"
                          class="sku-option-item"
                          :class="{
                            'sku-option-color': child.thumb,
                            'sku-option-button': !child.thumb,
                            active: isOptionSelected(skuGroup.id, child.id),
                            disabled: !isOptionAvailable(skuGroup.id, child.id)
                          }"
                          @click="selectSkuOption(skuGroup.id, child.id)"
                        >
                          <el-image v-if="child.thumb" :src="child.thumb" class="color-image"></el-image>
                          <span v-else>{{ child.title }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="sku-list">
                    <div
                      class="sku-item"
                      v-for="(item, index) in sku_list"
                      :key="index"
                      @click="selectSku(item)"
                    >
                      <div class="sku-item-text">
                        <div class="text">
                          <div
                            class="sku-item-image"
                            :class="{ active: selectedSkuId === item.inventoryId }"
                          >
                            <el-image :src="item.image"></el-image>
                          </div>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="sku-details-box">
                  <div v-if="currentSelectedInventory" class="sku-details">
                    <div class="operation-box">
                      <div class="operation-item">
                        <div class="price-info" v-if="!info.seckillInfo">
                          <div class="price-info-text">Quantity:</div>
                          <div
                            class="price-tiers"
                            v-if="
                              currentSelectedInventory.priceConfig &&
                              currentSelectedInventory.priceConfig.length > 0
                            "
                          >
                            <span
                              v-for="(tier, tidx) in formatPriceConfig(currentSelectedInventory.priceConfig)"
                              :key="tidx"
                              class="price-tier-item"
                            >{{ tier }}</span>
                          </div>
                          <div class="current-price" v-else>
                            {{ vuex_huobi }}{{ getCurrentPrice(currentSelectedInventory) }}/{{
                              info.unit || "pack"
                            }}
                          </div>
                        </div>
                        <div class="quantity-control">
                          <div class="quantity-input">
                            <div
                              class="btn minus"
                              :disabled="getSkuQuantity(currentSelectedInventory) <= 0"
                              @click.stop="decreaseSkuQuantity(currentSelectedInventory)"
                            >
                              <img src="@img/product/num-minus.png" alt="" />
                            </div>
                            <input
                              type="number"
                              v-model="sku_quantities[currentSelectedInventory.inventoryId]"
                              @click.stop
                              min="0"
                              :max="currentSelectedInventory.kucun"
                              @blur="onBlurSkuQuantity(currentSelectedInventory)"
                              @input="updateSkuQuantity(currentSelectedInventory, $event.target.value)"
                            />
                            <div
                              class="btn plus"
                              :disabled="getSkuQuantity(currentSelectedInventory) >= currentSelectedInventory.kucun"
                              @click.stop="increaseSkuQuantity(currentSelectedInventory)"
                            >
                              <img src="@img/product/num-plus.png" alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="operation-item">
                        <div class="operation-item-tip">
                          Increased quantity with lower unit price, pay attention on the price change.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="btn-box flex">
                <div class="order-summary">
                  <div class="flex-center box">
                    <div class="summary-item">
                      Selected
                      <span>{{ orderSummary.selectedItems }}</span> items
                      <span>{{ orderSummary.totalQuantity }}</span>
                      {{ info.unit || "pack" }}
                    </div>
                    <div class="summary-item">
                      Actual amount
                      <span>{{ vuex_huobi }}{{ orderSummary.finalAmount }}</span>
                    </div>
                    <div class="summary-item" v-if="orderSummary.discount > 0">
                      Discount:
                      <span>{{ vuex_huobi }}{{ orderSummary.discount }}</span>
                    </div>
                  </div>
                  <div class="left-buttons2">
                    <!-- <button class="btn-ripple flex-center btn-buy" @click="do_pay_now()">
                      <img src="@img/product/detail-buy.png" alt="" class="cart" />
                      SHOP NOW
                    </button> -->
                    <button class="btn-ripple flex-center btn-buy" @click="do_add_cart()">
                      <img src="@img/product/detail-cart.png" alt="" class="cart" />
                      ADD TO CART
                    </button>
                  </div>
                </div>
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
import { mapState } from "vuex";

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
      skuLists: [],
      selectedSkuOptions: {},
      selectedSkuId: null,
      sku_select: {},
    };
  },
  components: {
    detailLunbo,
    product_add_cart_success_modal,

  },
  computed: {
    ...mapState(["vuex_huobi"]),
    currentSelectedInventory() {
      if (!this.skuLists || this.skuLists.length === 0) {
        return (
          this.sku_list.find((item) => item.inventoryId === this.selectedSkuId) ||
          null
        );
      }
      const selectedIds = this.getSelectedOptionIds()
        .map((id) => parseInt(id, 10))
        .filter((id) => !Number.isNaN(id));
      if (selectedIds.length === 0) {
        return null;
      }
      const keyIdsStr = selectedIds.sort((a, b) => a - b).join("-");
      const matchedInventory = this.sku_list.find((item) => {
        if (!item.keyIds) return false;
        const itemKeyIds = item.keyIds
          .split("-")
          .map((id) => parseInt(id, 10))
          .sort((a, b) => a - b)
          .join("-");
        return itemKeyIds === keyIdsStr;
      });
      return matchedInventory || null;
    },
    headerPriceSale() {
      const inv = this.currentSelectedInventory;
      if (inv) {
        return this.getCurrentPrice(inv);
      }
      const picked = this.sku_list.find((row) => this.getSkuQuantity(row) > 0);
      if (picked) {
        return this.getCurrentPrice(picked);
      }
      return this.info.priceSale || 0;
    },
    headerPriceMarket() {
      const inv = this.currentSelectedInventory;
      if (inv) {
        return inv.priceMarket || this.info.priceMarket || "";
      }
      const picked = this.sku_list.find((row) => this.getSkuQuantity(row) > 0);
      if (picked) {
        return picked.priceMarket || this.info.priceMarket || "";
      }
      return this.info.priceMarket || "";
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
          const pcfg = item.priceConfig || [];
          if (pcfg.length > 0) {
            const idx = pcfg.findIndex((it) => it.price == price);
            if (idx > 0) {
              discount += (pcfg[0].price - price) * qty;
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
      this.id = "";
      this.info = {};
      this.sku_list = [];
      this.sku_quantities = {};
      this.selected_num = 0;
      this.thumbIndex = 0;
      this.detailImages = [];
      this.skuLists = [];
      this.selectedSkuOptions = {};
      this.selectedSkuId = null;
      this.sku_select = {};
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
          this.detailImages = (data.images || []).map((v, i) => ({
            index: i,
            image: v,
          }));
          this.set_sku(data);
        }
      });
    },
    set_sku(data) {
      if (data.skuLists && Array.isArray(data.skuLists)) {
        this.skuLists = data.skuLists;
        this.selectedSkuOptions = {};
        this.skuLists.forEach((skuGroup) => {
          const selectedOption =
            skuGroup.child.find((child) => child.is_selected === 1) ||
            (skuGroup.child.length > 0 ? skuGroup.child[0] : null);
          if (selectedOption) {
            this.$set(this.selectedSkuOptions, skuGroup.id, selectedOption.id);
          }
        });
      } else {
        this.skuLists = [];
      }

      let sku_list = [];
      if (data.inventorys && data.inventorys.length) {
        data.inventorys.forEach((v) => {
          sku_list.push({
            ...v,
            priceConfig:
              data.seckillInfo || (v.priceConfig[0] || {}).price == ""
                ? []
                : v.priceConfig,
            kucun: +v.kucun,
            key_vals: v.key_vals,
            keyVals: v.keyVals || v.key_vals,
          });
        });
      } else {
        sku_list = [
          {
            status: this.info.product_status,
            image: (this.info.images && this.info.images[0]) || "",
            inventoryId: this.info.inventoryId,
            key_vals: this.info.key_vals == "无" ? "默认" : this.info.key_vals,
            keyVals: this.info.key_vals == "无" ? "默认" : this.info.key_vals,
            kucun: +this.info.kucun,
            priceMarket: this.info.priceMarket,
            priceSale: this.info.priceSale,
            priceSale2: this.info.priceSale2,
            priceSale3: this.info.priceSale3,
            nums1: this.info.nums1,
            nums2: this.info.nums2,
            keyIds: this.info.keyIds,
          },
        ];
      }

      if (sku_list.length == 1) {
        this.sku_select = sku_list[0];
        this.selectedSkuId = sku_list[0].inventoryId;
      } else {
        this.sku_select =
          sku_list.find((v) => v.inventoryId == this.id) || {};
        if (this.sku_select.inventoryId) {
          this.selectedSkuId = this.sku_select.inventoryId;
        } else {
          const firstAvailable = sku_list.find((v) => v.kucun > 0);
          if (firstAvailable) {
            this.selectedSkuId = firstAvailable.inventoryId;
          } else if (sku_list.length > 0) {
            this.selectedSkuId = sku_list[0].inventoryId;
          }
        }
      }

      this.sku_list = sku_list;
      this.sku_quantities = {};
      sku_list.forEach((item) => {
        this.$set(this.sku_quantities, item.inventoryId, 0);
      });

      if (this.skuLists.length) {
        this.$nextTick(() => {
          const openInv = sku_list.find(
            (v) => String(v.inventoryId) === String(this.id)
          );
          if (openInv && openInv.keyIds) {
            const parts = openInv.keyIds
              .split("-")
              .filter(Boolean)
              .map((x) => parseInt(x, 10));
            this.skuLists.forEach((g) => {
              const child = g.child.find((c) => parts.includes(c.id));
              if (child) {
                this.$set(this.selectedSkuOptions, g.id, child.id);
              }
            });
          }
          const matched = this.currentSelectedInventory;
          if (matched) {
            this.selectedSkuId = matched.inventoryId;
            this.sku_select = matched;
            if (this.sku_quantities[matched.inventoryId] === undefined) {
              this.$set(this.sku_quantities, matched.inventoryId, 0);
            }
          }
          this.updateTotalQuantity();
        });
      } else {
        this.updateTotalQuantity();
      }
    },
    getSkuQuantity(item) {
      if (!item || item.inventoryId == null) {
        return 0;
      }
      if (!this.sku_quantities[item.inventoryId]) {
        return 0;
      }
      return parseInt(this.sku_quantities[item.inventoryId], 10) || 0;
    },
    selectSku(item) {
      if (this.selectedSkuId === item.inventoryId) {
        this.selectedSkuId = null;
      } else {
        this.selectedSkuId = item.inventoryId;
      }
    },
    selectSkuOption(groupId, optionId) {
      if (!this.isOptionAvailable(groupId, optionId)) {
        return;
      }
      this.$set(this.selectedSkuOptions, groupId, optionId);
      this.$nextTick(() => {
        const matchedInventory = this.currentSelectedInventory;
        if (matchedInventory) {
          this.selectedSkuId = matchedInventory.inventoryId;
          this.sku_select = matchedInventory;
          if (this.sku_quantities[matchedInventory.inventoryId] === undefined) {
            this.$set(this.sku_quantities, matchedInventory.inventoryId, 0);
          }
        } else {
          this.selectedSkuId = null;
          this.sku_select = {};
        }
      });
    },
    isOptionSelected(groupId, optionId) {
      return this.selectedSkuOptions[groupId] === optionId;
    },
    isOptionAvailable(groupId, optionId) {
      const tempSelected = { ...this.selectedSkuOptions };
      tempSelected[groupId] = optionId;
      const selectedGroupIds = Object.keys(tempSelected).filter(
        (key) => tempSelected[key] !== undefined && tempSelected[key] !== null
      );
      if (selectedGroupIds.length < this.skuLists.length) {
        return this.sku_list.some((item) => {
          if (!item.keyIds) return false;
          const itemKeyIds = item.keyIds.split("-").map((id) => parseInt(id, 10));
          return itemKeyIds.includes(parseInt(optionId, 10)) && item.kucun > 0;
        });
      }
      const selectedIds = Object.values(tempSelected).filter(
        (id) => id !== undefined && id !== null
      );
      if (selectedIds.length === 0) {
        return true;
      }
      const keyIdsStr = selectedIds
        .map((id) => parseInt(id, 10))
        .sort((a, b) => a - b)
        .join("-");
      return this.sku_list.some((item) => {
        if (!item.keyIds) return false;
        const itemKeyIds = item.keyIds
          .split("-")
          .map((id) => parseInt(id, 10))
          .sort((a, b) => a - b)
          .join("-");
        return itemKeyIds === keyIdsStr && item.kucun > 0;
      });
    },
    getSelectedOptionIds() {
      return Object.values(this.selectedSkuOptions).filter(
        (id) => id !== undefined && id !== null
      );
    },
    getSelectedOptionTitle(skuGroup) {
      const selectedId = this.selectedSkuOptions[skuGroup.id];
      if (!selectedId) {
        return "";
      }
      const selectedOption = skuGroup.child.find(
        (child) => child.id === selectedId
      );
      return selectedOption ? selectedOption.title : "";
    },
    formatPriceConfig(priceConfig) {
      if (!Array.isArray(priceConfig) || priceConfig.length === 0) {
        return [];
      }
      const unit = this.info.unit || "pack";
      const sorted = [...priceConfig].sort(
        (a, b) => (a.min || 0) - (b.min || 0)
      );
      return sorted.map((config) => {
        const min = Number(config.min || 0);
        const max =
          config.max === "" || config.max === null || config.max === undefined
            ? null
            : Number(config.max);
        const price = Number(config.price || 0);
        if (max === null) {
          return `>${min}${unit} ${this.vuex_huobi}${price}`;
        }
        return `${min}-${max}${unit} ${this.vuex_huobi}${price}`;
      });
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
        if (totalCount && this.$store && this.$store.dispatch) {
          this.$store.dispatch("query_cart");
        }
        this.show_modal = false;
      });
    },
  },
};
</script>

<style lang="less" src="./product_quick_buy_modal_ctx.less"></style>

