<template>
  <div class="page">
    <div class="page-top">
      <div class="page-bread w-1400">
        <div class="bread-box">
          <!-- <img src="@img/common/product-home.png" alt="" /> -->
          <router-link to="/">Home</router-link>
          <div class="bread-item" v-for="(item, index) in bread_list" :key="index">
            <span class="arrow">/</span>
            <template v-if="item">
              <a v-if="item && !item.route" class="link" href="javascript: void(0)">{{ item.title }}</a>
              <router-link
                v-else-if="item && item.route"
                :to="item.route"
                class="route-link"
              >{{ item.title }}</router-link>
            </template>
          </div>
          <span class="arrow">/</span>
          <a href="javascirpt:void(0);">{{ info.title }}</a>
        </div>
      </div>
    </div>

    <div class="page-box">
      <div class="page-inner w-1400">
        <div class="main-content">
          <div class="ctx-top">
            <div class="ctx-left">
              <!-- 商品预览 -->
              <div class="preview-wrap">
                <detailLunbo :imageList="detailImages" />
              </div>
            </div>

            <div class="ctx-right">
              <div class="detail-title flex">
                <div class="title-text flex">{{ info.title }}</div>
              </div>
              <div class="detail-desc">
                <div class="btn">FDA</div>
                <div class="btn">CE</div>
              </div>

              <div class="sale-info">
                <div class="list">
                  <div class="item price-item">
                    <div class="vals vals-price">
                      <div class="val">{{ vuex_huobi }}{{ view_info.priceSale }}</div>
                    </div>
                    <span style="color: #ec6a2b; line-height: 30px; margin: 0 10px">/pack</span>
                    <div
                      class="val"
                      style="color: #5e5e5e; line-height: 30px"
                    >{{ vuex_huobi }}{{ view_info.priceMarket }}</div>
                  </div>
                  <div class="item">
                    <span class="date">5-7 days delivery!</span>
                    <img
                      src="@/assets/img/product/icon-fav0.png"
                      v-if="!if_shoucang"
                      alt
                      @click="do_fav_toggle()"
                    />
                    <img
                      src="@/assets/img/product/icon-fav1.png"
                      v-else
                      alt
                      @click="do_fav_toggle()"
                    />
                  </div>
                </div>
              </div>

              <div class="other-box">
                <div class="sku-box column-flex-center">
                  <!-- SKU选择器 -->
                  <template v-if="skuLists && skuLists.length > 0">
                    <div class="sku-selectors">
                      <div
                        class="sku-selector-group"
                        v-for="(skuGroup, groupIndex) in skuLists"
                        :key="groupIndex"
                      >
                        <div class="sku-selector-label">
                          {{ skuGroup.key }}: {{ getSelectedOptionTitle(skuGroup) }}
                        </div>
                        <div class="sku-selector-options">
                          <!-- 有 thumb 显示图片，无 thumb 显示文字 -->
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
                            <el-image
                              v-if="child.thumb"
                              :src="child.thumb"
                              class="color-image"
                            ></el-image>
                            <span v-else>{{ child.title }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- 旧的SKU列表（兼容，如果没有skuLists则显示） -->
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
                              :class="{
                                active: selectedSkuId === item.inventoryId,
                              }"
                            >
                              <el-image :src="item.image"></el-image>
                            </div>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- SKU详情和操作 -->
                  <div class="sku-details-box">
                    <div v-if="currentSelectedInventory" class="sku-details">
                      <!-- <div class="key-vals active">{{ currentSelectedInventory.keyVals }}</div> -->
                      <!-- 操作 -->
                      <div class="operation-box">
                        <div class="operation-item">
                          <div class="price-info" v-if="!info.seckillInfo">
                            <div class="price-info-text">Quantity:</div>
                            <div class="price-tiers" v-if="currentSelectedInventory.priceConfig && currentSelectedInventory.priceConfig.length > 0">
                              <span
                                v-for="(tier, index) in formatPriceConfig(currentSelectedInventory.priceConfig)"
                                :key="index"
                                class="price-tier-item"
                              >
                                {{ tier }}
                              </span>
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
                                <img src="@img/product/num-minus.png" alt />
                              </div>
                              <input
                                type="number"
                                v-model="sku_quantities[currentSelectedInventory.inventoryId]"
                                @click.stop
                                min="0"
                                :max="currentSelectedInventory.kucun"
                                @blur="onBlurSkuQuantity(currentSelectedInventory)"
                                @input="
                                  updateSkuQuantity(currentSelectedInventory, $event.target.value)
                                "
                              />
                              <div
                                class="btn plus"
                                :disabled="getSkuQuantity(currentSelectedInventory) >= currentSelectedInventory.kucun"
                                @click.stop="increaseSkuQuantity(currentSelectedInventory)"
                              >
                                <img src="@img/product/num-plus.png" alt />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="operation-item">
                          <div class="operation-item-tip">
                            Increased quantity with lower unit price, pay
                            attention on the price change.
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
                        <span>{{ orderSummary.selectedItems }}</span>items
                        <span>{{ orderSummary.totalQuantity }}</span>Pack
                      </div>
                      <div class="summary-item">
                        Actual amount
                        <span>
                          {{
                          vuex_huobi + "" + orderSummary.finalAmount
                          }}
                        </span>
                      </div>
                      <div class="summary-item" v-if="orderSummary.discount > 0">
                        Discount:
                        <span>{{ orderSummary.discount }}</span>
                      </div>
                    </div>
                    <div class="left-buttons2">
                      <button
                        class="contact-service"
                        @click="openInquiryModal"
                      >LARGE ORDER GET COMPETITIVE QUOTE</button>
                      <button class="btn-ripple flex-center btn-buy" @click="do_pay_now()">
                        <img src="@img/product/detail-buy.png" alt class="cart" />
                        SHOP NOW
                      </button>
                      <button class="btn-ripple flex-center btn-add-cart" @click="do_add_cart()">
                        <img src="@img/product/detail-cart.png" alt class="cart" />
                        ADD TO CART
                      </button>
                    </div>
                  </div>

                  <!-- <button
                    class="btn-ripple flex-center btn-add-fav"
                    @click="do_add_fav()"
                  >
                    {{ is_fav ? "取消收藏" : "添加收藏" }}
                  </button>-->
                </div>
              </div>
            </div>
          </div>

          <div class="ctx-bottom-container">
            <div class="bottom-left">
              <div class="main-title">Recommended Products</div>
              <div class="product-list">
                <div
                  class="product-item"
                  v-for="(item, index) in related_products"
                  :key="index"
                  @click="toDetail(item)"
                >
                  <div class="poster-box scale-box">
                    <img :src="item.thumb" alt class="poster scale-img" />
                  </div>
                  <div class="info-box">
                    <div class="title ellipsis-2">{{ item.title }}</div>
                    <div class="price-box">
                      <div class="pirce-item-value">{{ vuex_huobi + "" + item.priceSale }}</div>
                      <div class="market-price">{{ item.priceMarket }}</div>
                    </div>
                    <div class="description-box">
                      <div class="description-item">FDA</div>
                      <div class="description-item">ISO13485</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bottom-right">
              <div class="ctx-bottom">
                <div class="ctx-bottom-inner">
                  <div class="bottom-nav">
                    <div
                      class="nav-item"
                      @click="togglePanel('详情')"
                      :class="active_panel == '详情' ? 'active' : ''"
                    >Product Specifications</div>
                    <div
                      class="nav-item"
                      @click="togglePanel('资质证书')"
                      :class="active_panel == '资质证书' ? 'active' : ''"
                    >Qualification & Certificates</div>

                    <div
                      class="nav-item"
                      @click="togglePanel('评价')"
                      :class="active_panel == '评价' ? 'active' : ''"
                    >
                      Comments
                      <!-- <span class="count-num">{{ info.commentNum }}</span> -->
                    </div>

                    <!-- <el-popover placement="bottom" trigger="click">
                  <div class="pop-kefu">
                    <div class="pop-kefu-inner">
                      <div class="kefu-tip">请微信扫描下方二维码</div>
                      <img class="kefu-code" :src="vuex_config.kefu_code" />
                    </div>
                  </div>
                  <button class="contact" slot="reference">
                    <img src="@img/other/goods-detail-kefu.png" alt />
                    <span>联系客服</span>
                  </button>
                    </el-popover>-->
                    <!-- <button class="contact" slot="reference" @click="shopcart_add">
                  <img src="@img/icon-cart-trans.png" alt />
                  <span>加入购物车</span>
                    </button>-->
                  </div>

                  <!-- v-if="active_panel == '详情'" -->
                  <div class="detail-content-box" v-if="active_panel == '详情'">
                    <!-- <div class="panel-title" data-title="详情">
                      商品详情
                    </div>
                    <div class="panel-title-line"></div>-->
                    <div class="detail-spec">
                      <div
                        class="detail-spec-sector"
                        v-for="(value, key) in info.addrows"
                        :key="key"
                      >
                        <div>{{ key }}</div>
                        <div>{{ value || "--" }}</div>
                      </div>
                    </div>
                    <div class="rich-html" v-html="info.content"></div>
                    <div class="rich-html" v-html="info.cont2"></div>
                    <div class="rich-html" v-html="info.cont3"></div>
                  </div>
                  <div class="detail-content-box" v-if="active_panel == '资质证书'">
                    <div class="rich-html" v-html="info.cont4"></div>
                  </div>
                  <!-- v-if="active_panel == '评价'" -->
                  <div class="comment-box" v-if="active_panel == '评价'">
                    <!-- <div class="panel-title" data-title="评论">
                      累计评价 ({{ info.commentNum }})
                    </div>
                    <div class="panel-title-line"></div>-->

                    <review_list :list="reviews" />

                    <div class="pagination-box" style="margin-top: 80px" v-if="info.commentNum">
                      <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="changePage_comment"
                        :current-page.sync="pagination.page"
                        :page-size="pagination.pageNum"
                        :total="info.commentNum"
                      ></el-pagination>
                    </div>

                    <div class="detail-empty" v-else>
                      <el-empty description="no comments found..."></el-empty>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <product_add_cart_success_modal ref="product_add_cart_success_modal" />
    <product_saveInquiry ref="product_saveInquiry" />
    <product_renzheng_tip ref="product_renzheng_tip" />
  </div>
</template>

<script>
// import { Swiper, SwiperOptions, Pagination, Navigation } from "swiper";
// import "swiper/swiper-bundle.min.css";

import product_add_cart_success_modal from "@/components/product/product_add_cart_success_modal.vue";
import product_renzheng_tip from "@/components/product/product_renzheng_tip.vue";
import product_saveInquiry from "@/components/product/product_saveInquiry.vue";
import detailLunbo from "@/components/detail/detailLunbo.vue";
import carouselComponent from "@/components/goods/carouselComponent.vue"; //左侧轮播
import review_list from "@/components/review/review_list.vue";
import area_select from "@/components/address/area_select.vue";

import { mapState } from "vuex";
import { Loading } from "element-ui";

export default {
  name: "goods-detail",
  components: {
    product_add_cart_success_modal,
    product_saveInquiry,
    carouselComponent,
    review_list,
    detailLunbo,
    area_select,
    product_renzheng_tip
    // QRCode,
    // modalLoading,
    // modalYaoqing,
    // goodsCouponList,
  },
  data() {
    return {
      info: {
        inventorys: [],
        brand: {}
      },
      is_fav: false,
      reviews: [],
      pagination: {
        page: 1,
        pageNum: 10
      },
      //
      //
      //
      //

      is_prod: process.env.NODE_ENV == "production",

      detailImages: [],

      Loading,
      loadingInstance: null,

      query_wenxian_done: false,
      activeCate: {
        route: "/"
      },

      list_goods: [],
      product_list: [],
      group_list_wenxian: [],
      list_wenxian: [],
      count_wenxian: 0,
      query_field_done: false, //参数字段
      field_list: [],
      param_list: [],
      all_field: [],
      id: this.$route.query.id || "", //规格id
      product_id: "", //产品id

      //规格数量
      sku_mode: "单规格",
      sku_select: {}, //选择的规格
      selected_num: 0, //商品数量
      sku_list: [], //规格列表
      show_sku: false,
      //拆分状态下选择的商品属性
      select_shuxing_list: [],
      // 每个规格的数量
      sku_quantities: {},

      //优惠券
      list_coupon: [],
      show_coupon: false,

      // 其他
      active_panel: "详情", //详情

      pagination_relative: {
        page: 1,
        pageNum: 5
      },

      select_inventoryId: "",
      timer: null, //促销计算
      remaining: "", //促销剩余时间

      coupons: [], //可用的优惠券
      isFavourite: false, //未收藏
      minnum: "",
      selectedSkuComb: {}, //选择的商品规格信息 立即购买需要金额
      // show_sku: false,
      curr: {}, //产品
      detail: {}, //产品
      current: 0, //轮播图指示器
      swiperImgs: [], //轮播图
      activeSwipeIndex: 0, //轮播图指示器

      //
      if_shoucang: false,
      related_products: [],

      // 选中的SKU ID（单选）
      selectedSkuId: null,
      // SKU列表配置（来自接口的skuLists）
      skuLists: [],
      // 已选择的SKU选项 { key: [id1, id2, ...] }
      selectedSkuOptions: {}
    };
  },

  computed: {
    ...mapState(["kefu_qq"]),

    bread_list() {
      let option = [];
      if (this.info.channelId) {
        if (this.vuex_category_flat.length) {
          let cate = this.vuex_category_flat.find(
            v => v.id == this.info.channelId
          );
          if (cate) {
            let ids = cate.ids || "";
            let id_arr = ids.split("-").filter(v => !!v);
            id_arr.forEach(id => {
              let cate = this.vuex_category_flat.find(v => v.id == id) || {};
              option.push(cate);
            });
          }
        }
      }

      return option;
    },

    //预览信息
    view_info() {
      let view_info = this.curr;
      if (this.sku_select.inventoryId) {
        view_info = this.sku_select;
      }
      return view_info;
    },

    poster() {
      let ret = "";
      if (this.info.images && this.info.images.length) {
        ret = this.info.images[0];
      }
      return ret;
    },

    huoqi_text() {
      let text = "现货";
      if (this.info.skuDay) {
        let num = parseInt(this.info.skuDay);
        if (num) {
          text = "货期" + num + "天";
        }
      }
      return text;
    },

    // 计算总价和优惠
    orderSummary() {
      let totalAmount = 0;
      let selectedItems = 0;
      let totalQuantity = 0;

      // 计算优惠
      let discount = 0;
      const prices = this.view_info.priceSale;
      this.sku_list.forEach(item => {
        const quantity = this.getSkuQuantity(item);
        if (quantity > 0) {
          selectedItems++;
          totalQuantity += quantity;
          const price = this.getCurrentPrice(item);
          totalAmount += price * quantity;
          if ((item.priceConfig || []).length > 0) {
            const idx = item.priceConfig.findIndex(it => it.price == price);
            console.log(idx, "idx");
            if (idx > 0) {
              discount += (item.priceConfig[0].price - price) * quantity;
            }
          }
        }
      });
      const finalAmount = totalAmount; //totalAmount - discount;

      return {
        selectedItems,
        totalQuantity,
        totalAmount: totalAmount.toFixed(2),
        discount: discount.toFixed(2),
        finalAmount: finalAmount.toFixed(2)
      };
    },

    // 当前选中的库存项（根据选择的SKU选项匹配）
    currentSelectedInventory() {
      if (!this.skuLists || this.skuLists.length === 0) {
        // 如果没有skuLists，返回当前选中的SKU
        return this.sku_list.find(item => item.inventoryId === this.selectedSkuId) || null;
      }

      // 根据选择的选项组合匹配对应的库存
      const selectedIds = this.getSelectedOptionIds();
      if (selectedIds.length === 0) {
        return null;
      }

      // 将选中的ID排序后拼接，匹配keyIds
      const keyIdsStr = selectedIds.sort((a, b) => a - b).join("-");
      
      // 查找匹配的库存项
      const matchedInventory = this.sku_list.find(item => {
        if (!item.keyIds) return false;
        const itemKeyIds = item.keyIds.split("-").map(id => parseInt(id)).sort((a, b) => a - b).join("-");
        return itemKeyIds === keyIdsStr;
      });

      return matchedInventory || null;
    }
  },

  watch: {
    param_list(val) {
      //console.log(" ******** 产品参数 ******** ", val);
    }
  },

  beforeRouteUpdate(to, from, next) {
    //console.log("组件复用");
    //console.log(to, from);

    next(to.query);
    this.id = this.$route.query.id || ""; //规格id
    this.setView();
  },

  created() {
    this.setView();
    this.$store.dispatch("appInit");
  },

  beforeDestroy() {
    //console.log("销毁详情页 handleScrollEvent");

    document.removeEventListener("scroll", this.handleScrollEvent);
  },

  methods: {
    //更新当前父组件数据
    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      let { sheng, shi, qu } = data;
      // debugger
    },

    toDetail(item) {
      // this.$router.push(`/product-detail?id=${item.inventoryId}`);
      window.open(
        "/product-detail?id=" + item.inventoryId,
        "__blank",
        "",
        false
      );
    },

    setView() {
      this.query_product_detail();
    },

    query_product_detail() {
      this.showLoading();
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_detail",
          inventoryId: this.id,
          ifShowSku: 1 //是否展示全部规格skus：0-不需要展示 1-需要展示（规格以组合形式展示，即规格1,规格2 组合一起的）
        }
      }).then(res => {
        console.log(res);
        let { code, data, message } = res;
        if (res.code == 200) {
          data.brand = data.brand || {};
          this.info = data;
          if (data.inventorys && data.inventorys.length) {
            this.minnum = data.inventorys[0].minNumNormal;
          } else {
            this.minnum = 1;
          }

          this.add_history_record();
          // this.reviews = data.commentList;
          this.query_reviews(); //评论

          this.curr = data;
          this.detail = data;
          this.swiperImgs = data.images;
          this.detailImages = data.images.map((v, i) => ({
            index: i,
            image: v
          }));
          // console.log(this.detailImages ,'this.detailImages ')
          this.if_shoucang = data.ifShoucang == 0 ? false : true;
          this.posterSrc = data.images[0];
          this.set_sku(data);

          this.query_related_product();
          console.log(data);
        } else {
          alert(res.message);
          if (
            message == "The product does not exist or has been discontinued"
          ) {
            this.$router.push("/");
          }
        }
        this.hideLoading();
      });
    },
    async setClipboard() {
      let text = window.location.href;
      const type = "text/plain";
      const clipboardItemData = {
        [type]: text
      };
      const clipboardItem = new ClipboardItem(clipboardItemData);
      await navigator.clipboard.write([clipboardItem]);
      console.log(text);
      alert("The link has been copied to the clipboard");
    },
    showLoading() {
      this.loadingInstance = Loading.service({
        lock: true,
        text: "Data query in progress...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // if (this.$refs.modalLoading) {
      //   this.$refs.modalLoading.init();
      // }
    },
    hideLoading() {
      this.loadingInstance.close();

      // this.$refs.modalLoading.close();

      // this.loadingInstance = Loading.service({
      //   lock: true,
      //   text: "数据查询中...",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)",
      // });
    },

    //查询评论列表
    query_reviews() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_comments",
          productId: this.info.productId,
          ...this.pagination
        }
      }).then(res => {
        let { code, data, count } = res;
        if (code == 200) {
          this.reviews = data.list;
        }
      });
    },
    //相关商品信息
    query_related_product() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          productId: this.info.productId,
          page: 1,
          pageNum: 6
        }
      }).then(res => {
        if (res.code == 200) {
          this.related_products = res.data.list;
        }
      });
    },

    add_history_record() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_operate",
          productId: this.info.productId,
          operateType: 2, //1-关注 2-足迹
          operateSence: 0 //0-关注（添加记录） 1-取消关注（删除记录）
        }
      }).then(res => {});
    },
    do_fav_toggle() {
      this.do_add_fav();
    },
    do_add_fav() {
      if (!this.mix_get_login_status()) {
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_operate",
          productId: this.info.productId,
          operateType: 1, //1-关注 2-足迹
          operateSence: this.if_shoucang ? 1 : 0 //0-关注（添加记录） 1-取消关注（删除记录）
        }
      }).then(res => {
        alert(res);
        if (res.code == 200) {
          this.if_shoucang = !this.if_shoucang;
        }
      });
    },

    //商品sku 属性选择
    onSelectShuXing(item) {
      //console.log("商品属性选择", { ...item });

      //当前属性对应商品库存不足
      if (this.if_out_stock(item)) {
        return;
      }

      let key = item.key;
      let index = this.select_shuxing_list.findIndex(v => v.id == item.id);
      if (index < 0) {
        //已选的属性不包含当前属性
        //需要查询是否已选过当前属性其他属性值
        let prev_item = this.select_shuxing_list.find(v => v.key == key);
        let prev_item_index = this.select_shuxing_list.findIndex(
          v => v.key == key
        );
        if (prev_item) {
          this.select_shuxing_list.splice(prev_item_index, 1, item);
        } else {
          this.select_shuxing_list.push(item);
        }
      } else {
        this.select_shuxing_list.splice(index, 1, {
          key: key
        });
      }

      this.set_sku_select();
    },

    //设置商品选择的规格
    set_sku_select() {
      if (
        Object.keys(this.info.skus).length == this.select_shuxing_list.length
      ) {
        let key_ids = this.select_shuxing_list.map(v => v.id).join("-");
        this.sku_select = this.sku_list.find(v => v.key_ids == key_ids) || {};
      }

      //console.log("已选的商品属性值 select_shuxing_list", this.select_shuxing_list);
      //console.log("商品规格 sku_select", { ...this.sku_select });
    },

    //是否已选择当亲属性
    if_shuxing_list_contain(item) {
      return !!this.select_shuxing_list.find(v => v.id == item.id);
    },

    //当前属性商品库存是否不足
    if_out_stock(item) {
      //拼接目标规格的属性集合
      //比对目标属性是否库存不足
      let key = item.key;
      let id_arr = [];
      this.select_shuxing_list.forEach(v => {
        if (v.id && key != v.key) {
          id_arr.push(v.id);
        } else if (key == v.key) {
          id_arr.push(item.id);
        }
      });

      //从所有规格中过滤出符合目标属性的规格
      let list_filter = this.sku_list.filter(v => {
        let has_pipei = id_arr.every(id => v.key_ids.includes(id));

        return has_pipei;
      });

      let ret = false;

      if (list_filter.length > 1) {
        ret = false;
      } else if (list_filter.length == 1) {
        let obj = list_filter[0];
        if (+obj.kucun) {
          ret = false;
        } else {
          ret = true;
        }
      } else {
        ret = true;
      }

      return ret;
    },

    //处理产品图片
    handleProductImage(image_list) {
      //处理产品图片
      // //console.log("产品列表数据 image_list", image_list);
      var promise_arr = [];
      image_list.forEach((src, index) => {
        var promise = this.loadImageAsync(src);
        promise_arr.push(promise);
      });
      Promise.all(promise_arr).then(resAll => {
        // //console.log("图片全部加载完成 resAll", resAll);

        //设置产品图片
        this.product_list.forEach((v, index) => {
          if (!resAll[index]) {
            v.img = v.default_img;
          }
        });
      });
      //产品图片处理完成
    },

    //设置分类 面包屑导航需要
    setActiveCate() {
      if (this.product_cates_all && this.product_cates_all.length) {
        //实验耗材
        var cate_id = this.info.channelId;
        this.activeCate =
          this.product_cates_all.find(v => v.id == cate_id) || {};

        //console.log("activeCate", { ...this.activeCate });

        // this.queryCateParams();
        this.queryFilterParams();
      } else {
        setTimeout(() => {
          this.setActiveCate();
        }, 100);
      }
    },

    //设置规格
    set_sku(data) {
      // 保存skuLists
      if (data.skuLists && Array.isArray(data.skuLists)) {
        this.skuLists = data.skuLists;
        // 初始化选中的选项
        this.selectedSkuOptions = {};
        this.skuLists.forEach(skuGroup => {
          // 优先选择is_selected为1的选项，否则选择第一个
          const selectedOption = skuGroup.child.find(child => child.is_selected === 1) || 
                                (skuGroup.child.length > 0 ? skuGroup.child[0] : null);
          if (selectedOption) {
            this.$set(this.selectedSkuOptions, skuGroup.id, selectedOption.id);
          }
        });
        
        // 等待Vue更新后，尝试匹配对应的库存
        this.$nextTick(() => {
          const matchedInventory = this.currentSelectedInventory;
          if (matchedInventory) {
            this.selectedSkuId = matchedInventory.inventoryId;
            this.sku_select = matchedInventory;
          }
        });
      } else {
        this.skuLists = [];
      }

      //规格列表组
      let sku_list = [];
      if (data.inventorys && data.inventorys.length) {
        data.inventorys.forEach(v => {
          sku_list.push({
            ...v,
            priceConfig:
              data.seckillInfo || (v.priceConfig[0] || {}).price == ""
                ? []
                : v.priceConfig,
            kucun: +v.kucun,
            key_vals: v.key_vals,
            keyVals: v.keyVals || v.key_vals
          });
        });
      } else {
        sku_list = [
          {
            status: this.info.product_status,
            image: this.info.images[0],
            inventoryId: this.info.inventoryId,
            key_vals: this.info.key_vals == "无" ? "默认" : this.info.key_vals,
            keyVals: this.info.key_vals == "无" ? "默认" : this.info.key_vals,
            kucun: +this.info.kucun,
            priceMarket: this.info.priceMarket,
            priceSale: this.info.priceSale,
            priceSale2: this.info.priceSale2,
            priceSale3: this.info.priceSale3,
            nums1: this.info.nums1,
            nums2: this.info.nums2
          }
        ];
      }

      //单规格商品 默认勾选
      if (sku_list.length == 1) {
        this.sku_select = sku_list[0];
        this.selectedSkuId = sku_list[0].inventoryId;
      } else {
        // this.sku_select = {};
        this.sku_select = sku_list.find(v => v.inventoryId == this.id) || {};
        // 如果有匹配的SKU，设置为选中，否则选中第一个有库存的
        if (this.sku_select.inventoryId) {
          this.selectedSkuId = this.sku_select.inventoryId;
        } else {
          const firstAvailable = sku_list.find(v => v.kucun > 0);
          if (firstAvailable) {
            this.selectedSkuId = firstAvailable.inventoryId;
          } else if (sku_list.length > 0) {
            this.selectedSkuId = sku_list[0].inventoryId;
          }
        }
      }
      this.sku_list = sku_list;

      // 初始化规格数量
      this.sku_quantities = {};
      sku_list.forEach(item => {
        this.$set(this.sku_quantities, item.inventoryId, 0);
      });

      //规格拆分
      let skus = data.skus || {};
      if (skus && Object.keys(skus).length) {
        this.sku_mode = "多规格";
        let select_shuxing_list = [];
        Object.keys(skus).forEach(v => {
          select_shuxing_list.push({
            key: skus[v].key
          });
        });

        //console.log("商品规格默认 select_shuxing_list", select_shuxing_list);

        this.select_shuxing_list = select_shuxing_list;
      } else {
        this.sku_mode = "单规格";
      }
    },

    //切换规格
    toggle_sku(item) {
      if (item.kucun) {
        this.sku_select = item;
        if (this.selected_num > item.kucun) {
          this.selected_num = item.kucun;
        }
      }
    },

    // 选择SKU（单选）
    selectSku(item) {
      // 如果点击的是已选中的SKU，取消选中
      if (this.selectedSkuId === item.inventoryId) {
        this.selectedSkuId = null;
        // 不清零数量，保留用户输入的值
      } else {
        // 选中新的SKU
        this.selectedSkuId = item.inventoryId;
        // 不清除其他SKU的数量，保留用户之前输入的值
      }
    },

    // 选择SKU选项（基于skuLists）
    selectSkuOption(groupId, optionId) {
      // 检查选项是否可用
      if (!this.isOptionAvailable(groupId, optionId)) {
        return;
      }

      // 更新选中的选项
      this.$set(this.selectedSkuOptions, groupId, optionId);

      // 等待Vue更新后，根据选择的选项匹配对应的库存
      this.$nextTick(() => {
        const matchedInventory = this.currentSelectedInventory;
        if (matchedInventory) {
          this.selectedSkuId = matchedInventory.inventoryId;
          this.sku_select = matchedInventory;
          
          // 如果该库存项还没有初始化数量，初始化为0
          if (this.sku_quantities[matchedInventory.inventoryId] === undefined) {
            this.$set(this.sku_quantities, matchedInventory.inventoryId, 0);
          }
        } else {
          // 如果还没有选择完所有选项，清空selectedSkuId
          this.selectedSkuId = null;
          this.sku_select = {};
        }
      });
    },

    // 判断选项是否被选中
    isOptionSelected(groupId, optionId) {
      return this.selectedSkuOptions[groupId] === optionId;
    },

    // 判断选项是否可用（是否有对应的库存）
    isOptionAvailable(groupId, optionId) {
      // 构建临时选择（将当前选项替换为要检查的选项）
      const tempSelected = { ...this.selectedSkuOptions };
      tempSelected[groupId] = optionId;

      // 获取所有已选择的组ID
      const selectedGroupIds = Object.keys(tempSelected).filter(key => tempSelected[key] !== undefined && tempSelected[key] !== null);
      
      // 如果还没有选择所有必需的选项，检查是否有任何库存项包含这个选项
      if (selectedGroupIds.length < this.skuLists.length) {
        // 检查是否有任何库存项的keyIds包含这个选项ID
        return this.sku_list.some(item => {
          if (!item.keyIds) return false;
          const itemKeyIds = item.keyIds.split("-").map(id => parseInt(id));
          return itemKeyIds.includes(parseInt(optionId)) && item.kucun > 0;
        });
      }

      // 如果所有选项都已选择，检查完整组合是否有库存
      const selectedIds = Object.values(tempSelected).filter(id => id !== undefined && id !== null);
      if (selectedIds.length === 0) {
        return true;
      }

      // 检查是否有匹配的库存
      const keyIdsStr = selectedIds.map(id => parseInt(id)).sort((a, b) => a - b).join("-");
      const hasMatch = this.sku_list.some(item => {
        if (!item.keyIds) return false;
        const itemKeyIds = item.keyIds.split("-").map(id => parseInt(id)).sort((a, b) => a - b).join("-");
        return itemKeyIds === keyIdsStr && item.kucun > 0;
      });

      return hasMatch;
    },

    // 获取已选择的选项ID列表
    getSelectedOptionIds() {
      return Object.values(this.selectedSkuOptions).filter(id => id !== undefined && id !== null);
    },

    // 获取选中选项的标题
    getSelectedOptionTitle(skuGroup) {
      const selectedId = this.selectedSkuOptions[skuGroup.id];
      if (!selectedId) {
        return "";
      }
      const selectedOption = skuGroup.child.find(child => child.id === selectedId);
      return selectedOption ? selectedOption.title : "";
    },

    // 格式化priceConfig为显示文本
    formatPriceConfig(priceConfig) {
      if (!Array.isArray(priceConfig) || priceConfig.length === 0) {
        return [];
      }

      const unit = this.info.unit || "pack";
      const sorted = [...priceConfig].sort((a, b) => (a.min || 0) - (b.min || 0));
      
      return sorted.map(config => {
        const min = Number(config.min || 0);
        const max = config.max === "" || config.max === null || config.max === undefined ? null : Number(config.max);
        const price = Number(config.price || 0);
        
        if (max === null) {
          // 无上限，显示 >minpack $price
          return `>${min}${unit} ${this.vuex_huobi}${price}`;
        } else {
          // 有上限，显示 min-maxpack $price
          return `${min}-${max}${unit} ${this.vuex_huobi}${price}`;
        }
      });
    },

    // 获取规格当前价格（按 priceConfig 区间优先）
    getCurrentPrice(item) {
      let quantity = this.getSkuQuantity(item) || 1; // 0 按 1 处理
      if (Array.isArray(item.priceConfig) && item.priceConfig.length) {
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

        if (typeof maxConfig.max === "number" && quantity > maxConfig.max) {
          return Number(
            maxConfig.price || maxConfig.priceSale || item.priceSale || 0
          );
        }
        const match = sorted.find(cfg => {
          const min = Number(cfg.min || 0);
          const hasMax = Number(cfg.max || 0) && !isNaN(cfg.max);
          const max = hasMax ? Number(cfg.max) : Infinity;
          return quantity >= min && quantity <= max;
        });
        if (match) {
          return Number(match.price || match.priceSale || item.priceSale || 0);
        }
      }
      return Number(item.priceSale || 0);
    },

    // 获取规格数量
    getSkuQuantity(item) {
      if (!this.sku_quantities[item.inventoryId]) {
        this.$set(this.sku_quantities, item.inventoryId, 0);
      }
      // console.log(
      //   "getSkuQuantity for",
      //   item.inventoryId,
      //   ":",
      //   this.sku_quantities[item.inventoryId]
      // );
      // 确保返回数值类型，避免字符串拼接问题
      return parseInt(this.sku_quantities[item.inventoryId]) || 0;
    },

    // 增加规格数量
    increaseSkuQuantity(item) {
      console.log("increaseSkuQuantity called", item);
      if (this.getSkuQuantity(item) < item.kucun) {
        this.$set(
          this.sku_quantities,
          item.inventoryId,
          parseInt(this.getSkuQuantity(item)) + 1
        );
        console.log(this.sku_quantities);
        this.updateTotalQuantity();
        console.log("quantity increased to:", this.getSkuQuantity(item));
      }
    },

    // 减少规格数量
    decreaseSkuQuantity(item) {
      console.log("decreaseSkuQuantity called", item);
      if (this.getSkuQuantity(item) > 0) {
        this.$set(
          this.sku_quantities,
          item.inventoryId,
          parseInt(this.getSkuQuantity(item)) - 1
        );
        this.updateTotalQuantity();
        console.log("quantity decreased to:", this.getSkuQuantity(item));
      }
    },

    // 更新总数量
    updateTotalQuantity() {
      this.selected_num = Object.values(this.sku_quantities).reduce(
        (sum, qty) => sum + (parseInt(qty) || 0),
        0
      );
      console.log("updateTotalQuantity - selected_num:", this.selected_num);
      console.log("sku_quantities:", this.sku_quantities);
    },

    // 处理规格数量输入框失焦
    onBlurSkuQuantity(item) {
      console.log("onBlurSkuQuantity called", item);
      let quantity = parseInt(this.sku_quantities[item.inventoryId]) || 0;
      if (quantity < 0) quantity = 0;
      if (quantity > item.kucun) quantity = item.kucun;
      this.$set(this.sku_quantities, item.inventoryId, quantity);
      this.updateTotalQuantity();
    },

    // 更新规格数量（输入框输入时）
    updateSkuQuantity(item, value) {
      console.log("updateSkuQuantity called", item, value);
      let quantity = parseInt(value) || 0;
      if (quantity < 0) quantity = 0;
      this.$set(this.sku_quantities, item.inventoryId, quantity);
      this.updateTotalQuantity();
    },

    // 点击规格项
    clickSkuItem(item) {
      if (item.kucun) {
        console.log("clickSkuItem called", item);
        // 如果当前规格数量为0，设置为1；如果大于0，设置为0
        if (this.getSkuQuantity(item) === 0) {
          this.$set(this.sku_quantities, item.inventoryId, 1);
        } else {
          this.$set(this.sku_quantities, item.inventoryId, 0);
        }
        this.updateTotalQuantity();
      }
    },

    //商品是否选择规格检测
    checkedSelected() {
      //console.log("检测是否选择了商品", this.sku_select);

      if (!this.sku_select.inventoryId) {
        alertErr("Please select product specifications");
        return false;
      }

      if (this.sku_select.kucun < this.selected_num) {
        alertErr("The product stock is insufficient, cannot be purchased");
        return false;
      }

      return true;
    },

    //处理购物车列表数据
    handlePiPrice(item) {
      let v = item;
      let { nums1, nums2 } = v;
      let num = this.selected_num;
      let priceSale = 0;
      if (+nums2 && +nums1) {
        if (+num > +(+nums2)) {
          priceSale = v.priceSale3;
        } else if (+num >= +nums1) {
          priceSale = v.priceSale2;
        } else {
          priceSale = v.price_origin;
        }
      }

      return priceSale;
    },

    //立即购买
    do_pay_now() {
      //企业用户
      console.log("vuex_user", this.vuex_user);
      console.log("info", this.info);
      // return
      // if (this.info.isThird == 1 &&!(this.vuex_user.userType == 1 && this.vuex_user.renzheng == 2)) {
      //   // 打开认证提示弹窗
      //   this.$refs.product_renzheng_tip.init();
      //   return;
      // }
      // //企业用户购买
      // if (this.info.isThird == 1 && this.vuex_user.userType != 1) {
      //   this.$refs.product_renzheng_tip.init();
      //   return;
      // }
      //如果是三类
      // if (this.info.isThird == 1) {
      //   if (this.vuex_user.userType != 1) {
      //     this.$refs.product_renzheng_tip.init();
      //     return;
      //   } else if (this.vuex_user.userType == 1) {
      //     if (
      //       this.vuex_user.license2 ||
      //       this.vuex_user.license3 ||
      //       this.vuex_user.license4 | this.vuex_user.license6
      //     ) {
      //       console.log("可以购买三类");
      //     } else {
      //       this.$refs.product_renzheng_tip.init();
      //       return;
      //     }
      //   }
      // }

      // this.$refs.product_renzheng_tip.init();

      // this.updateTotalQuantity();
      if (this.selected_num == 0) {
        alertErr("please select the quantity!");
        return;
      }
      if (!this.mix_get_login_status()) {
        return;
      }

      // 检查是否有选择的规格
      let hasSelectedSku = false;
      this.sku_list.forEach(item => {
        if (this.getSkuQuantity(item) > 0) {
          hasSelectedSku = true;
        }
      });

      if (!hasSelectedSku) {
        alertErr("please select the product specifications!");
        return;
      }

      let info = this.info;
      let data_format = [];

      // 构建包含所有选择规格的数据
      this.sku_list.forEach(item => {
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
            priceMarket: item.priceMarket
          });
        }
      });

      let str_data = JSON.stringify(data_format);
      this.$store.commit("set_cache_payment_products", str_data);
      this.$router.push({
        path: "/order-submit"
      });
    },

    onBlur_selected_num() {
      //console.log(this.selected_num + "");

      this.selected_num = parseInt(this.selected_num) || 1;
    },

    //购车添加商品
    do_add_cart() {
      // this.updateTotalQuantity()
      if (this.selected_num == 0) {
        alertErr("please select the quantity!");
        return;
      }
      // if (
      //   this.info.isThird == 1 &&
      //   this.vuex_user.userType == 1 &&
      //   this.vuex_user.renzheng != 2
      // ) {
      //   // 打开认证提示弹窗
      //   this.$refs.product_renzheng_tip.init();
      //   return;
      // }
      // //企业用户购买
      // if (this.info.isThird == 1 && this.vuex_user.userType != 1) {
      //   this.$refs.product_renzheng_tip.init();
      //   return;
      // }

      // if (this.info.isThird == 1) {
      //   if (this.vuex_user.userType != 1) {
      //     this.$refs.product_renzheng_tip.init();
      //     return;
      //   } else if (this.vuex_user.userType == 1) {
      //     if (
      //       this.vuex_user.license2 ||
      //       this.vuex_user.license3 ||
      //       this.vuex_user.license4 | this.vuex_user.license6
      //     ) {
      //       console.log("可以购买三类");
      //     } else {
      //       this.$refs.product_renzheng_tip.init();
      //       return;
      //     }
      //   }
      // }

      if (!this.mix_get_login_status()) {
        return;
      }

      // 检查是否有选择的规格
      let hasSelectedSku = false;
      this.sku_list.forEach(item => {
        if (this.getSkuQuantity(item) > 0) {
          hasSelectedSku = true;
        }
      });

      if (!hasSelectedSku) {
        alertErr("please select the product specifications!");
        return;
      }

      // 检查库存
      let hasInsufficientStock = false;
      this.sku_list.forEach(item => {
        const quantity = this.getSkuQuantity(item);
        if (quantity > 0 && quantity > item.kucun) {
          hasInsufficientStock = true;
        }
      });

      if (hasInsufficientStock) {
        alertErr("some products are out of stock!");
        return;
      }

      // 检查商品状态
      let hasOfflineItem = false;
      this.sku_list.forEach(item => {
        const quantity = this.getSkuQuantity(item);
        if (quantity > 0 && item.status == -1) {
          hasOfflineItem = true;
        }
      });

      if (hasOfflineItem) {
        alertErr("some products have been taken off the shelf!");
        return;
      }

      // 添加所有选择的规格到购物车
      let addPromises = [];
      this.sku_list.forEach(item => {
        const quantity = this.getSkuQuantity(item);
        if (quantity > 0) {
          addPromises.push(
            this.$api({
              url: "/service.php",
              method: "get",
              data: {
                action: "gouwuche_add",
                inventoryId: item.inventoryId,
                num: quantity
              }
            })
          );
        }
      });

      Promise.all(addPromises).then(results => {
        let successCount = 0;
        let totalCount = 0;

        results.forEach((res, index) => {
          if (res.code == 200) {
            successCount++;
            totalCount = res.data.count || 0;
          }
        });
        if (successCount == results.length) {
          this.$refs.product_add_cart_success_modal.init({
            num: totalCount,
            title: "The product has been added to the shopping cart"
          });

          this.sku_list.forEach(e => {
            this.sku_quantities[e.inventoryId] = 0;
          });
          this.$store.commit("set_vuex_cart_number", totalCount);
        }
      });
    },

    //商品评价页面
    go_comments() {
      this.$router.push({
        path: "/comments",
        query: {
          pid: this.productId
        }
      });
    },

    //预览图片
    previewImage(src, index, swiperImgs) {
      ImagePreview({
        images: swiperImgs,
        startPosition: index,
        closeable: true
      });
    },

    //商品详情 内含图片
    imageEnlargement(e) {
      if (e.target.nodeName == "IMG") {
        //判断点击富文本内容为img图片
        ImagePreview({
          images: [e.target.currentSrc], //获取当前图片src
          showIndex: false,
          loop: false
        });
      } else {
        //console.log("点击内容不为img");
      }
    },

    //
    togglePanel(name) {
      // return;
      this.active_panel = name;
      this.$nextTick(() => {
        if (["资质证书", "详情"].includes(name)) {
          this.scrollToTarget(".detail-content-box");
        } else if (name == "评价") {
          this.scrollToTarget(".comment-box");
        }
      });
    },

    //商品评价分页
    changePage_comment(page) {
      this.pagination.page = page;
      this.query_comments();
    },

    //滚动到指定位置
    scrollToTarget(clsName) {
      // var element = document.querySelector(".wenxian-box");
      var element = document.querySelector(clsName);
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
    },

    do_open_share() {
      this.setClipboard();
    },

    // 打开咨询弹窗
    openInquiryModal() {
      // 构建产品信息对象
      const productInfo = {
        productId: this.info.productId,
        title: this.info.title,
        productNo: this.info.productNo,
        priceSale: this.view_info.priceSale,
        image:
          this.info.images && this.info.images[0] ? this.info.images[0] : "",
        // 添加规格列表
        skuList: this.sku_list,
        // 添加SKU列表配置
        skuLists: this.skuLists,
        // 添加当前选择的规格信息
        selectedSpecs: this.getSelectedSpecsInfo()
      };

      // 调用咨询组件
      this.$refs.product_saveInquiry.init(productInfo);
    },

    // 获取当前选择的规格信息
    getSelectedSpecsInfo() {
      const selectedSpecs = [];
      this.sku_list.forEach(item => {
        const quantity = this.getSkuQuantity(item);
        if (quantity > 0) {
          selectedSpecs.push({
            spec: item.keyVals || "默认规格",
            quantity: quantity,
            price: this.getCurrentPrice(item)
          });
        }
      });
      return selectedSpecs;
    }
  }
};
</script>

<style lang="less">
.pop-kefu-inner {
  padding: 25px;

  .kefu-tip {
    margin-bottom: 20px;
  }
}

.detail-qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  img {
    border: 1px solid #ddd;
    width: 150px;
    height: 150px;
  }
}
</style>

<style scoped lang="less">
.page-top {
  padding: 28px 0;
  position: relative;

  .page-top-banner {
    img {
      width: 100%;
    }
  }

  .page-bread {
    margin: 0 auto;
    height: auto;
    // background: #f5f5f5;
    padding: 0 0;

    .bread-box {
      height: auto;
      display: flex;
      align-items: center;

      img {
        width: 15px;
        margin-right: 10px;
      }

      .bread-divider {
        margin: 0 10px;
        font-size: 14px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        color: #505050;
      }

      a {
        display: inline-flex;
        align-items: center;

        font-family: Poppins, Poppins;
        font-size: 18px;
        color: #5e5e5e;

        img {
          margin-right: 10px;
        }
      }

      .link {
        font-family: Poppins, Poppins;
        font-size: 15px;
        color: #505050;
      }

      .route-link {
        font-family: Poppins, Poppins;
        font-size: 15px;
        color: #505050;
      }

      .arrow {
        margin: 0 6px;
        color: #aeaeae;
      }

      > *:last-child {
        font-family: Poppins, Poppins;
        font-size: 15px;
        color: #000000;
      }
    }
  }
}

.pop-kefu {
  .pop-kefu-inner {
    text-align: center;

    .kefu-tip {
      text-align: center;
      font-size: 14px;
    }

    .kefu-code {
    }

    .erweima {
    }
  }
}

.phone-tip-inner {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.misc-detail {
  display: grid;
  margin: 16px 0;
  max-width: 80%;
  min-width: 384px;
  grid-template-columns: 1fr 1fr;
  font-size: 14px;

  .misc-sector {
    display: grid;
    grid-template-columns: 100px 1fr;
    margin: 8px 0;
  }
}

.detail-spec {
  display: grid;
  margin: 0 0 16px;
  //max-width: 80%;
  //min-width: 384px;
  grid-template-columns: 1fr 1fr 1fr;
  font-size: 14px;

  .detail-spec-sector {
    display: grid;
    grid-template-columns: 100px 1fr;
    margin: 8px 0;
  }
}

.page {
  background: #f3f3f3;
  // padding-top: 32px;
  padding-bottom: 72px;
  min-height: 50vh;
  font-size: 14px;

  .page-box {
    padding: 36px 30px;
    background: #ffffff;
  }

  .page-inner {
    // overflow: hidden;
    margin: 0 auto;
    margin-top: 0;
    margin-bottom: 0;
    padding-bottom: 50px;

    .main-content {
      // background-color: #fff;

      .ctx-top {
        background: #fff;
        display: flex;
        align-items: flex-start;
      }

      .top-info {
        .product-title {
          text-align: left;
          font-size: 20px;
          font-family: Poppins, Poppins;
          font-weight: bold;
          color: #333333;

          .state-xiajia {
            margin-left: 20px;
            font-weight: normal;
            font-size: 14px;
            color: #999;
            color: #ea3200;
          }
        }

        .product-other-action {
          padding: 25px 0;
          display: flex;
          align-items: center;

          .action-item {
            display: flex;
            align-items: center;
            margin-right: 30px;
            cursor: pointer;

            &:hover {
              span {
                color: #00306B;
              }
            }

            img {
              margin-right: 5px;
              max-width: 20px;
              max-height: 20px;
            }

            span {
              font-size: 12px;
              font-family: Poppins, Poppins;
              font-weight: 400;
              color: #1f1f1f;

              font-size: 16px;
            }
          }
        }

        .product-filter {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 0;
          padding-bottom: 0;
          border: 1px solid #d5d8de;
          border-left: none;
          border-right: none;

          .text {
            margin-bottom: 15px;
          }

          .tabs {
            flex: 1;
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .tab-item {
              margin-right: 15px;
              margin-bottom: 15px;
              min-width: 32px;
              padding: 0 5px;
              height: 24px;
              line-height: 24px;
              background: #ffffff;
              border-radius: 3px 3px 3px 3px;
              border: 1px solid #a6a6a6;

              font-size: 12px;
              font-family: Poppins, Poppins;
              font-weight: 400;
              color: #505050;
              font-size: 16px;

              &.active {
                background: #00306B;
                color: #fff;
                border-color: #00306B;
              }
            }
          }

          .fuli {
            img {
              height: 24px;
            }
          }
        }
      }

      .ctx-top {
        padding: 0;
        display: flex;
        justify-content: space-between;

        .ctx-left {
          width: 783px;
          position: relative;

          .detail-act-list {
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .act-item {
              cursor: pointer;
              display: flex;
              align-items: center;

              img {
                width: 20px;
                margin-right: 6px;
              }

              span {
                font-size: 16px;
                font-family: Poppins, Poppins;
                font-weight: 400;
                line-height: 36px;
                color: #333333;
              }
            }
          }
        }

        .ctx-right {
          flex: 1;
          min-height: 364px;
          margin-left: 36px;
          text-align: left;

          .detail-title {
            .title-text {
              flex: 1;
              font-family: Poppins, Poppins;
              font-weight: bold;
              font-size: 30px;
              color: #242424;

              img {
                width: 94px;
                margin-left: 7px;
              }
            }

            .price-box {
              margin-left: 100px;
              font-family: Poppins, Poppins;
              font-weight: bold;
              font-size: 30px;
              color: #ff0000;
            }
          }

          .detail-desc {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
            .btn {
              background: #ffffff;
              border-radius: 5px 5px 5px 5px;
              border: 1px solid #00306b;
              font-family: Poppins, Poppins;
              font-weight: bold;
              font-size: 22px;
              color: #00306b;
              line-height: 31px;
              padding: 0 10px;
            }
          }

          .sale-info {
            padding: 0px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            border-bottom: 1px solid #dedede;

            .list {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .item {
                display: flex;
                align-items: end;
                padding: 12px 0;

                .label {
                  font-family: Poppins, Poppins;
                  font-weight: 400;
                  font-size: 18px;
                  color: #6a6a6a;
                }

                .vals {
                  display: flex;
                  align-items: center;
                  //flex: 1;

                  font-size: 16px;
                  font-family: Poppins, Poppins;
                  font-weight: 500;
                  color: #353535;

                  &.vals-price {
                    font-size: 40px;
                    font-family: Poppins, Poppins;
                    font-weight: bold;
                    color: #ec6a2b;
                  }

                  .val {
                    flex: 1;
                    font-family: Poppins, Poppins;
                    font-weight: bold;
                    font-size: 40px;
                    color: #ec6a2b;
                  }
                }

                .date {
                  font-family: Poppins, Poppins;
                  font-weight: 600;
                  font-size: 22px;
                  color: #242424;
                  line-height: 30px;
                  margin-right: 25px;
                }
                img {
                  width: 26px;
                  height: 26px;
                }
              }
            }

            .price {
              display: flex;
              align-items: center;

              .number {
                font-size: 28px;
                font-family: Poppins, Poppins;
                font-weight: bold;
                color: #ea3200;
              }
            }
          }

          .other-box {
          }

          .sku-box {
            margin-top: 23px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;

            .sku-label {
              margin-top: 8px;
              min-width: 90px;

              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 18px;
              color: #505050;
            }

            .sku-tip {
              margin-left: 20px;
              font-size: 18px;
              color: #00306B;
              font-weight: bold;
              font-family: Poppins, Poppins;
            }

            // SKU选择器样式
            .sku-selectors {
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 20px;

              .sku-selector-group {
                display: flex;
                flex-direction: column;
                gap: 10px;

                .sku-selector-label {
                  font-family: Poppins, Poppins;
                  font-weight: 600;
                  font-size: 20px;
                  color: #242424;
                }

                .sku-selector-options {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 10px;

                  .sku-option-item {
                    cursor: pointer;
                    transition: all 0.3s;
                    border-radius: 6px;
                    border: 2px solid #707070;
                    background: #ffffff;

                    &.sku-option-color {
                      width: 80px;
                      height: 80px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      overflow: hidden;

                      .color-image {
                        width: 100%;
                        height: 100%;
                        border-radius: 4px;

                        img {
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                        }
                      }

                      span {
                        font-size: 14px;
                        color: #242424;
                      }

                      &.active {
                        border: 2px solid #ec6a2b;
                      }

                      &.disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                        border-color: #ccc;
                      }
                    }

                    &.sku-option-button {
                      padding: 10px 20px;
                      min-width: 60px;
                      text-align: center;
                      font-family: Poppins, Poppins;
                      font-weight: bold;
                      font-size: 18px;
                      color: #242424;
                      line-height: 1.5;

                      &.active {
                        background: #fff8f5;
                        border: 2px solid #ec6a2b;
                        color: #ec6a2b;
                        font-weight: bold;
                      }

                      &.disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                        border-color: #ccc;
                        color: #999;
                      }

                      &:hover:not(.disabled) {
                        border-color: #ec6a2b;
                      }
                    }
                  }
                }
              }
            }
          }

          .sku-list {
            flex: 1;
            display: flex;
            gap: 8px;

            .sku-item {
              background: #fff;
              transition: all 0.3s;
              cursor: pointer;
              border-radius: 8px;
              border: 2px solid transparent;

              display: flex;
              flex-direction: column;
              align-items: center;
              width: 100%;

              .sku-item-text {
                display: flex;
                align-items: center;
                flex: 1;
              }

              .text {
                font-size: 18px;
                color: #1f1f1f;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;

                .sku-item-image {
                  width: 80px;
                  height: 80px;
                  border: 2px solid #707070;
                  border-radius: 6px;
                }
                .active {
                  width: 80px;
                  height: 80px;
                  border: 2px solid #ec6a2b;
                  border-radius: 6px;
                }
                .el-image {
                  width: 100%;
                  height: 100%;
                  border-radius: 6px;
                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 6px;
                  }
                }
              }
            }
          }

          .sku-details-box {
            width: 100%;
            .sku-details {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;

              .key-vals {
                height: 36px;
                line-height: 36px;
                padding: 0 10px;
                background: #ffffff;
                border-radius: 6px;
                border: 1px solid #707070;
                font-size: 18px;
                color: #242424;
                font-weight: bold;
                cursor: pointer;
                &.active {
                  background: #fff8f5;
                  border: 2px solid #ec6a2b;
                }
              }

              .operation-box {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                width: 100%;
                border-top: 1px solid #dedede;
                border-bottom: 1px solid #dedede;
                margin-top: 20px;
                padding: 20px 0;
                .operation-item {
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 10px;
                }

                .operation-item-tip {
                  font-family: Poppins, Poppins;
                  font-weight: 400;
                  font-size: 20px;
                  color: #ec6a2b;
                  margin-top: 30px;
                }
              }

              .price-info {
                display: flex;
                align-items: center;
                gap: 5px;
                flex-wrap: wrap;

                .price-info-text {
                  font-size: 20px;
                  color: #505050;
                  margin-right: 5px;
                }

                .current-price {
                  font-size: 20px;
                  color: #242424;
                }

                .price-tiers {
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  gap: 10px;
                  font-size: 18px;
                  color: #242424;
                  font-family: Poppins, Poppins;

                  .price-tier-item {
                    white-space: nowrap;
                  }
                }
              }

              .stock-info {
                font-size: 16px;
                color: #505050;
                white-space: nowrap;
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
                    width: 42px;
                    height: 42px;
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
                    height: 42px;
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

          .shuliang-box {
            margin-top: 20px;
            display: flex;
            align-items: center;

            .sel-num-title {
              min-width: 90px;
              font-family: Poppins, Poppins;
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 14px;
              color: #505050;
            }

            .kucun {
              margin-left: 16px;
              font-family: Poppins, Poppins;
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

              .minus {
              }

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
                font-family: Poppins, Poppins;
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

              .plus {
              }
            }
          }

          .yunfei-box,
          .dinghuo-box {
            margin-top: 30px;

            .label {
              min-width: 90px;
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 14px;
              color: #505050;
            }

            .value {
              font-family: Poppins, Poppins;
              font-weight: 400;
              font-size: 14px;
              color: #505050;
            }
          }

          .btn-box {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            .left-buttons {
              margin-top: 42px;
              display: flex;
              gap: 20px;
            }

            .left-buttons2 {
              display: flex;
              gap: 20px;

              .contact-service {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 284px;
                height: 80px;
                border-radius: 10px;
                background: #4891e9;
                font-size: 20px;
                font-weight: bold;
                color: #fff;
                cursor: pointer;
                transition: all 0.3s;
                padding: 0 20px;
              }
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
                height: 80px;

                .cart {
                  width: 24px;
                  margin-right: 2px;
                }

                &:hover {
                  opacity: 0.8;
                }
              }

              .btn-buy {
                background: #ec6a2b;
                font-family: Poppins, Poppins;
              }

              .btn-add-cart {
                background: #00306b;

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
                font-family: Poppins, Poppins;
                // font-weight: bold;
                font-size: 18px;
                color: #00306B;
              }
            }

            .order-summary {
              display: flex;
              flex-direction: column;
              gap: 10px;
              min-width: 200px;
              align-items: flex-end;

              .box {
                align-items: flex-end;
                font-family: Poppins, Poppins;
              }

              .summary-item {
                font-size: 16px;
                color: #1f1f1f;
                text-align: right;
                margin-left: 20px;
                font-weight: bold;

                span {
                  font-size: 24px;
                  color: #ec6a2b;
                  padding: 0 5px;
                }
              }
            }
          }
        }
      }

      .ctx-bottom-container {
        margin-top: 16px;
        margin-top: 40px;
        display: flex;
        justify-content: space-between;

        .bottom-left {
          border: 1px solid #d6d6d6;
          margin-right: 24px;
          width: 384px;
          background: #fff;
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          border-radius: 10px;
        }

        .bottom-right {
          flex: 1;
          overflow: hidden;
          background: #fff;
        }
      }

      .ctx-bottom-inner {
        width: 100%;
        text-align: left;

        .panel-title {
          margin-bottom: 15px;
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 25px;
          color: #00306B;
        }

        .panel-title-line {
          margin-bottom: 64px;
          width: 100%;
          height: 7px;
          background: #00306B;
          border-radius: 0px 0px 0px 0px;
        }
      }
    }
  }
}

.bottom-nav {
  position: relative;
  display: flex;
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid #dedede;
  .count-num {
    color: #00306B;
  }

  .nav-item {
    text-align: center;
    cursor: pointer;
    text-align: center;
    padding: 0 30px;
    font-size: 24px;
    font-family: Poppins, Poppins;
    font-weight: 400;
    color: #000000;

    &.active {
      background: #ec6a2b;
      border-radius: 10px 10px 0px 0px;
      color: #fff;
      .count-num {
        color: #fff;
      }
    }
  }

  button {
    position: absolute;
    right: 0;
    top: 8px;
    /*no */
    right: 8px;
    /*no */
    min-width: 126px;
    /*no */
    height: 32px;
    /*no */

    &.contact {
      background: #00306B;
      display: flex;
      justify-content: center;
      align-items: center;
      right: 20px;

      &:hover {
        opacity: 0.8;
      }

      img {
        width: 20px;
        margin-right: 10px;
        vertical-align: bottom;
      }

      span {
        font-size: 14px;
        font-family: Poppins, Poppins;
        font-weight: 400;
        line-height: 20px;
        color: #ffffff;
      }
    }
  }
}

.detail-content {
  margin-top: 30px;

  .big-img-list {
    .big-img-item {
      margin-bottom: 10px;
      padding: 30px;
      margin: 10px auto;

      img {
        width: 400px;
        height: 300px;
      }
    }
  }
}

.detail-content-box {
  min-height: 10vh;
  padding: 20px;
  // padding: 0;
  text-align: left;

  /deep/ img {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }

  .params-html {
    margin-bottom: 32px;

    .params-box {
      .params-item {
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-bottom: none;

        &:last-child {
          border-bottom: 1px solid #ccc;
        }

        &[data-key="target_backmsg"] {
          display: none;
        }

        .params-label {
          display: flex;
          align-items: center;
          align-self: stretch;
          background: #f7f7f7;
          min-height: 50px;
          line-height: 50px;
          width: 300px;
          padding: 0 24px;
          font-size: 14px;
          font-family: Poppins, Poppins;
          font-weight: bold;
          color: #1f1f1f;

          font-size: 16px;
        }

        .params-val {
          flex: 1;
          min-height: 50px;
          line-height: 50px;
          padding: 0 24px;
          font-size: 14px;
          font-family: Poppins, Poppins;
          font-weight: bold;
          color: #1f1f1f;

          font-size: 16px;
        }
      }
    }
  }
}

.rich-html {
  line-height: 2;
  // overflow-x: auto;

  /deep/ table {
    width: 100%;
    margin: 0 auto;
    table-layout: auto;

    td {
      border: 1px solid #aaa;
      border-bottom: none;
      border-right: none;
      min-height: 3.6rem;
      height: auto !important;
      line-height: 3rem;

      p,
      span,
      strong,
      i {
        font-size: 1.2rem;
      }
    }

    tr {
      height: auto !important;

      &.firstRow {
        td {
          p,
          span,
          strong,
          i {
            font-size: 1.4rem;
          }
        }
      }
    }

    tr td:last-child {
      border-right: 1px solid #aaa;
    }

    tr:last-child {
      td {
        border-bottom: 1px solid #aaa;
      }
    }
  }
}

.pagation-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.comment-box {
  min-height: 10vh;
  padding: 20px;
  // margin-top: 20px;

  .comment-title {
    display: flex;
    background-color: #eee;
    align-items: center;
    color: #fff;
    width: 100%;

    color: #000;

    .comment-title-text {
      padding: 5px 30px;
      margin-right: 20px;
      background-color: #00306B;
      color: #fff;
    }
  }

  label {
    width: 70px;

    input {
      margin-right: 10px;
    }
  }

  .comment-list {
    margin-top: 20px;
    font-size: 14px;
    color: #000;
    text-align: left;

    .comment-item {
      background-color: #eee;
      padding: 20px;
      min-height: 50px;
      margin-bottom: 20px;

      .comment-bottom {
        margin-top: 10px;
        display: flex;
        align-items: center;

        .left {
          flex: 3;

          .img-list {
            display: flex;

            .img-item {
              padding: 10px;
            }

            img {
              width: 80px;
              height: 80px;
              padding: 10px;
              background-color: #fff;
              margin-right: 10px;
            }
          }
        }

        .right {
          flex: 1;
        }
      }
    }
  }
}

.bottom-left {
  .main-title {
    line-height: 70px;
    height: 70px;
    background: #00306b;
    border-radius: 10px 10px 0px 0px;

    font-family: Poppins, Poppins;
    font-weight: 600;
    font-size: 24px;
    color: #ffffff;
    text-align: center;
  }
}

.product-list {
  padding: 34px 26px;
  .product-item {
    width: 100%;
    // height: 349px;
    background: #ffffff;
    cursor: pointer;

    &:hover {
      .title {
        color: #00306B !important;
      }
    }

    .poster-box {
      width: 100%;
      height: 334px;

      .poster {
        width: 100%;
        height: 100%;
      }
    }

    .info-box {
      margin-top: 20px;
      .title {
        // white-space: nowrap;
        // text-overflow: ellipsis;
        overflow: hidden;
        font-weight: 400;
        font-size: 16px;
        color: #1f1f1f;
      }

      .price-box {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
        .pirce-item-value {
          font-size: 30px;
          color: #ec6a2b;
          font-weight: bold;
        }
        .market-price {
          font-size: 20px;
          color: #5e5e5e;
          // 增加删除线
          text-decoration: line-through;
        }
      }

      .description-box {
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        .description-item {
          padding: 0 10px;
          height: 30px;
          border-radius: 5px;
          border: 1px solid #00306b;
          font-family: Poppins, Poppins;
          font-weight: bold;
          font-size: 22px;
          color: #00306b;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/product-detail.less"></style>

<style
  scoped
  lang="less"
  src="@/assets/h5css/mobile/product-detail.less"
></style>
