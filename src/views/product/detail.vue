<script>
import detailLunbo from "@/components/detail/detailLunbo.vue"; // 滚动图
import product_add_cart_success_modal from "@/components/product/product_add_cart_success_modal.vue"; // 加入购物车
import commentList from "@/components/order/commentList.vue";
import {Loading} from "element-ui";

export default {
  name: "detail",
  components: {
    detailLunbo,
    product_add_cart_success_modal,
    commentList
  },
  data() {
    return {
      detailImages: [],
      Loading,
      loadingInstance: null,
      activeCate: {
        route: "/",
      },

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
      selected_num: 1, //商品数量
      show_sku: false,
      //拆分状态下选择的商品属性
      select_shuxing_list: [],

      //优惠券
      list_coupon: [],
      show_coupon: false,

      // 其他
      active_panel: "详情", //详情

      pagination: {
        page: 1,
        pagenum: 10,
      },
      pagination_relative: {
        page: 1,
        pagenum: 5,
      },

      select_inventory_id: "",

      timer: null, //促销计算
      remaining: "", //促销剩余时间

      coupons: [], //可用的优惠券
      isFavourite: false, //未收藏

      curr: {}, //产品
      detail: {}, //产品
      current: 0, //轮播图指示器
      swiperImgs: [], //轮播图
      activeSwipeIndex: 0, //轮播图指示器

      count_comments: 0, //评价总数
      list_comments: [], //评价详情

      if_shoucang: false,

      info: {},
      is_fav: false,
      reviews: [],

      is_prod: process.env.NODE_ENV == "production",
      query_wenxian_done: false,

      list_goods: [],
      sku_select: {}, //选择的规格
      sku_list: [], //规格列表


      select_inventoryId: "",
    };
  },

  computed: {
    //购物车商品总金额
    shopcart_money() {
      return this.sku_select.priceSale * this.selected_num.toFixed(2);
    },

    view_info() {
      let view_info = this.curr;
      if (this.sku_select.inventoryId) {
        view_info = this.sku_select;
      }
      return view_info;
    },

    poster() {
      let ret = "";
      if (this.detail.images && this.detail.images.length) {
        ret = this.detail.images[0];
      }
      return ret;
    },

    huoqi_text() {
      let text = "现货";
      if (this.detail.skuDay) {
        let num = parseInt(this.detail.skuDay);
        if (num) {
          text = "货期" + num + "天";
        }
      }
      return text;
    },
  },

  watch: {
    param_list(val) {
      //console.log(" ******** 产品参数 ******** ", val);
    },
  },

  beforeRouteUpdate(to, from, next) {
    next(to.query);
    this.id = this.$route.query.id || ""; //规格id
    this.setView();
  },

  mounted() {
    this.setView();
  },

  beforeDestroy() {
    document.removeEventListener("scroll", this.handleScrollEvent);
  },

  methods: {
    // 初始化
    setView() {
      //查询商品信息
      this.$api("product_detail", {inventoryId: this.id, ifShowSku: 1}).then((res) => {
        let {code, data, message} = res;

        if (code == 200) {
          this.curr = data;
          this.detail = data;
          this.if_shoucang = data.if_shoucang || 0;
          this.swiperImgs = data.images;
          this.detailImages = data.images.map((v, i) => ({
            index: i,
            image: v
          }));

          this.posterSrc = data.images[0];
          this.count_comments = data.comment_num;

          this.set_sku(data);
          this.query_comments(); //评论

        } else {
          if (message == "商品不存在或已下架") {
            this.$router.push("/");
          }
        }

      });
    },

    showLoading() {
      this.loadingInstance = Loading.service({
        lock: true,
        text: "数据查询中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },

    //设置商品选择的规格
    set_sku_select() {
      if (Object.keys(this.info.skus).length == this.select_shuxing_list.length) {
        let key_ids = this.select_shuxing_list.map((v) => v.id).join("-");
        this.sku_select =
            this.sku_list.find((v) => v.key_ids == key_ids) || {};
      }

      //console.log("已选的商品属性值 select_shuxing_list", this.select_shuxing_list);
      //console.log("商品规格 sku_select", { ...this.sku_select });
    },

    //是否已选择当亲属性
    if_shuxing_list_contain(item) {
      return !!this.select_shuxing_list.find((v) => v.id == item.id);
    },

    //当前属性商品库存是否不足
    if_out_stock(item) {
      //拼接目标规格的属性集合
      //比对目标属性是否库存不足
      let key = item.key;
      let id_arr = [];
      this.select_shuxing_list.forEach((v) => {
        if (v.id && key != v.key) {
          id_arr.push(v.id);
        } else if (key == v.key) {
          id_arr.push(item.id);
        }
      });

      //从所有规格中过滤出符合目标属性的规格
      let list_filter = this.sku_list.filter((v) => {
        let has_pipei = id_arr.every((id) => v.key_ids.includes(id));

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

    //设置规格
    set_sku(data) {
      //规格列表组
      let sku_list = [];
      if (data.inventorys && data.inventorys.length) {
        data.inventorys.forEach((v) => {
          sku_list.push({
            ...v,
            kucun: +v.kucun,
            key_vals: v.key_vals,
          });
        });
      } else {
        sku_list = [
          {
            status: this.info.product_status,
            image: this.info.images[0],
            inventoryId: this.info.inventoryId,
            key_vals: this.info.key_vals == "无" ? "默认" : this.info.key_vals,
            kucun: +this.info.kucun,
            priceMarket: this.info.priceMarket,
            priceSale: this.info.priceSale,
            priceSale2: this.info.priceSale2,
            priceSale3: this.info.priceSale3,
            nums1: this.info.nums1,
            nums2: this.info.nums2,
          },
        ];
      }

      //单规格商品 默认勾选
      if (sku_list.length == 1) {
        this.sku_select = sku_list[0];
      } else {
        // this.sku_select = {};
        this.sku_select =
            sku_list.find((v) => v.inventoryId == this.id) || {};
      }
      this.sku_list = sku_list;

      //规格拆分
      let skus = data.skus || {};
      if (skus && Object.keys(skus).length) {
        this.sku_mode = "多规格";
        let select_shuxing_list = [];
        Object.keys(skus).forEach((v) => {
          select_shuxing_list.push({
            key: skus[v].key,
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

    //商品是否选择规格检测
    checkedSelected() {
      //console.log("检测是否选择了商品", this.sku_select);

      if (!this.sku_select.inventoryId) {
        alertErr("请选择商品规格");
        return false;
      }

      if (this.sku_select.kucun < this.selected_num) {
        alertErr("该商品库存不足,无法购买");
        return false;
      }

      return true;
    },


    //立即购买
    payNow() {
      if (!this.mix_get_login_status()) {
        return
      }
      var isSelect = this.checkedSelected();
      if (!isSelect) {
        return;
      }


      let info = this.detail;
      let sku_item = this.sku_select;
      let data_format = [{
        title: info.title,
        image: sku_item.image || info.thumb,
        inventoryId: sku_item.inventoryId,
        productId: info.productId,
        keyVals: sku_item.keyVals,
        num: this.selected_num,
        priceSale: sku_item.priceSale,
        priceMarket: sku_item.priceMarket,
      }];
      console.log(sku_item, data_format, info)
      let str_data = JSON.stringify(data_format);
      this.$store.commit('set_cache_payment_products', str_data)
      this.$router.push({
        path: "/orderSubmit",
      });
    },

    onBlur_selected_num() {
      //console.log(this.selected_num + "");

      this.selected_num = parseInt(this.selected_num) || 1;
    },

    //购车添加商品
    shopcart_add() {
      if (!this.sku_select.inventoryId) {
        alertErr("请选择商品规格！");
        return;
      }
      if (this.selected_num > this.sku_select.kucun) {
        alertErr("当前商品库存不足！");
        return;
      }

      if (this.sku_select.status == -1) {
        alertErr("当前商品已下架！");
        return;
      }

      this.$api("gouwuche_add", {
        inventoryId: this.sku_select.inventoryId,
        num: this.selected_num,
        _no_tip: 1,
      }).then((res) => {
        let {code} = res;
        if (code === 200) {
          this.$refs.modalAddSuccess.init({
            num: 1,
            shopcart_count: this.selected_num
          });
        }
      });
    },

    //查询评论列表
    query_comments() {
      //商品评论列表
      this.$api("product_comments", {
        productId: this.detail.productId,
        ...this.pagination,
        // star: 0,
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          this.list_comments = data.list;
          this.count_comments = data.count;
        }
      });
    },


    // 切换面板
    togglePanel(name) {
      // return;
      this.active_panel = name;
      if (name == "详情") {
        this.scrollToTarget(".detail-content-box");
      } else if (name == "相关产品") {
        this.scrollToTarget(".xiangguan-box");
      } else if (name == "文献") {
        this.scrollToTarget(".wenxian-box");
      } else if (name == "评价") {
        this.scrollToTarget(".comment-box");
      }
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
    },
  },
};
</script>

<template>
  <div class="page">
    <!--  导航  -->
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/productCategories">商品列表</a></el-breadcrumb-item>
        <el-breadcrumb-item><a>{{ detail.title }}</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="page-box">
      <div class="page-inner">
        <div class="main-content">
          <div class="ctx-top">
            <!--      商品图片轮播      -->
            <div class="ctx-left">
              <div class="preview-wrap">
                <detailLunbo :imageList="detailImages" :img3D="detail.images3d"/>
              </div>
            </div>
            <!--            规格-->
            <div class="ctx-right">
              <div class="detail-title">
                {{ detail.title }}
              </div>
              <!--              产品型号-->
              <div class="info-box">
                <div class="label">产品型号</div>
                <div class="list">
                  <div class="item ellipsis-1"
                       :class="{active: item.inventoryId == sku_select.inventoryId, disabled: !item.kucun }"
                       v-for="(item,index) in sku_list" :key="index" @click="toggle_sku(item)">
                    {{ item.keyVals | f_guige }}
                  </div>
                </div>
              </div>
              <!--              富俊价-->
              <div class="info-texts">
                <div class="title">
                  <el-row :gutter="24">
                    <el-col :span="4"><p>富俊价</p></el-col>
                    <el-col :span="8"><p>数量</p></el-col>
                    <el-col :span="8"><p>单件(含税)</p></el-col>
                    <el-col :span="4"><p>预估发货日</p></el-col>
                  </el-row>
                </div>
                <div class="list-item">
                  <div class="item">
                    <el-row :gutter="24">
                      <el-col :span="4"><p style="color: transparent">1</p></el-col>
                      <el-col :span="8"><p>1+</p></el-col>
                      <el-col :span="8"><p class="price">$320.00</p></el-col>
                      <el-col :span="4"><p>7个工日内</p></el-col>
                    </el-row>
                  </div>
                  <div class="item">
                    <el-row :gutter="24">
                      <el-col :span="4"><p style="color: transparent"> 1</p></el-col>
                      <el-col :span="8"><p>10+</p></el-col>
                      <el-col :span="8"><p class="price">$320.00</p></el-col>
                      <el-col :span="4"><p>7-10个工日内</p></el-col>
                    </el-row>
                  </div>
                </div>
              </div>

              <!--              汇总-->
              <div class="other-box">
                <div class="btn-box">
                  <div class="label">选购数量</div>
                  <div class="content flex">
                    <el-input-number :min="1" :max="view_info.kucun"
                                     v-model="selected_num"></el-input-number>
                    <div class="tip">PCS</div>
                    <div class="desc">库存: {{ view_info.kucun }}</div>
                  </div>
                </div>
                <div class="btn-box">
                  <div class="label">商品总价</div>
                  <div class="content">
                    <div class="price">{{ vuex_huobi }} {{ shopcart_money }}</div>
                  </div>
                </div>
                <div class="btn-box btn-box-start">
                  <div class="label">商品交期</div>
                  <div class="content">
                    <div class="title">
                      <p>预计7个工作日发货 <span>(付款锁库存)</span></p>
                    </div>
                    <div class="desc">实际发货以付款成功次日起算，不含周日与法定节假日</div>
                  </div>
                </div>
                <div class="btn-box">
                  <div class="label"></div>
                  <button class="btn-ripple flex-center btn-add-cart" @click="shopcart_add()">
                    <img src="../../static/prod/cart.png" alt="" class="cart">
                    加入购物车
                  </button>
                  <button class="btn-ripple flex-center btn-buy" @click="payNow()">立即购买</button>
                </div>
              </div>
            </div>
          </div>

          <!--细节-->
          <div class="ctx-bottom-container">
            <div class="bottom-right">
              <div class="ctx-bottom">
                <div class="ctx-bottom-inner">
                  <div class="bottom-nav flex">
                    <div class="nav-item" @click="togglePanel('详情')"
                         :class="active_panel == '详情' ? 'active' : ''">
                      规格表
                    </div>

                    <div class="nav-item" @click="togglePanel('评价')"
                         :class="active_panel == '评价' ? 'active' : ''">
                      商品评价
                    </div>
                  </div>

                  <div class="detail-content-box" v-if="active_panel == '详情'">
                    <!-- <div class="section-title" data-title="详情">产品信息</div> -->
                    <div class="rich-html" v-html="detail.content"></div>
                    <div class="rich-html" v-html="detail.cont2"></div>
                    <div class="rich-html" v-html="detail.cont3"></div>
                  </div>

                  <div class="comment-box" v-if="active_panel == '评价'">
                    <commentList :list="list_comments"/>
                    <div class="pagination-box" style="margin-top: 80px"
                         v-if="list_comments.length">
                      <el-pagination background layout="total, prev, pager, next"
                                     @current-change="changePage_comment"
                                     :current-page.sync="pagination.page"
                                     :page-size="pagination.pagenum"
                                     :total="count_comments"></el-pagination>
                    </div>

                    <div class="detail-empty" v-if="!list_comments.length">
                      <el-empty description="没有查询到评论信息..."></el-empty>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <product_add_cart_success_modal ref="modalAddSuccess"></product_add_cart_success_modal>
  </div>
</template>

<style scoped lang="less">
.page-inner {
  padding-top: 25px;

  .main-content {
    .top-info {
      .product-title {
        text-align: left;
        font-size: 20px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
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
        .flex();

        .action-item {
          .flex();
          margin-right: 30px;
          cursor: pointer;

          &:hover {
            span {
              color: @theme;
            }
          }

          img {
            margin-right: 5px;
            max-width: 20px;
            max-height: 20px;
          }

          span {
            font-size: 12px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #666666;

            font-size: 16px;
          }
        }
      }

      .product-filter {
        .flex-between();
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
          .flex();
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
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #999999;
            font-size: 16px;

            &.active {
              background: @theme;
              color: #fff;
              border-color: @theme;
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
      padding: 15px 25px;
      display: flex;
      justify-content: space-between;
      background: #fff;
      min-height: 627px;

      .ctx-left {
        width: 355px;
        position: relative;

        .shoucang-box {
          margin-top: 20px;
          .flex-between();
          width: 100%;

          .yes {
            color: #f00;
          }

          .no {
            color: #000;
          }

          .shoucang-left {
            cursor: pointer;
            .flex();

            img {
              width: 20px;
              margin-right: 15px;
            }

            span {
              font-size: 16px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 36px;
              color: #333333;
            }
          }

          .shoucang-right {
            cursor: pointer;
            .flex();

            img {
              width: 20px;
              margin-right: 15px;
            }

            span {
              font-size: 16px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 36px;
              color: #333333;
            }
          }
        }
      }

      .ctx-right {
        flex: 1;
        margin-left: 33px;
        text-align: left;
        padding-bottom: 20px;
        color: #999;

        .detail-title {
          font-family: Roboto, Roboto;
          font-weight: 400;
          font-size: 20px;
          color: #000000;
          font-style: normal;
          text-transform: none;
        }

        .info-box {
          width: 762px;
          //height: 178px;
          background: #FFFFFF;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #E6E4E1;
          padding: 10px;
          margin-top: 20px;
          display: flex;

          .label {
            min-width: 70px;
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            font-style: normal;
            text-transform: none;
          }

          .list {
            max-height: 178px;
            //height: 100%;
            overflow-y: auto;
            margin-left: 30px;
            padding-right: 50px;
            display: flex;
            flex-wrap: wrap;

            .item {
              cursor: pointer;
              max-width: 590px;
              padding: 0 5px;
              height: 26px;
              line-height: 26px;
              border: 1px solid #fff;
              border-radius: 4px 4px 4px 4px;
              font-family: Roboto, Roboto;
              font-weight: 400;
              font-size: 14px;
              color: #000;
              font-style: normal;
              text-transform: none;
            }

            .item.active {
              background: rgba(166, 102, 0, 0.07);
              border: 1px solid @theme;
              color: @theme;
            }
            .item.disabled {
              cursor: not-allowed;
              color: #999;
            }
          }
        }

        .info-texts {
          width: 762px;
          background: #FFFFFF;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #E6E4E1;
          padding: 10px 12px;
          margin-top: 11px;

          .title {
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            font-style: normal;
            text-transform: none;
          }

          .list-item {
            margin-top: 14px;

            .item {
              height: 32px;
              background: #fff;
              border-radius: 2px 2px 2px 2px;

              p {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 14px;
                color: #333333;
                font-style: normal;
                text-transform: none;
                line-height: 32px;
                line-height: 32px;
              }

              p.price {
                color: #FF0000;
              }
            }

            .item:nth-child(odd) {
              background: #F1F1F1;
              border-radius: 2px 2px 2px 2px;
            }
          }
        }

        .other-box {
          margin-top: 11px;

          .btn-box {
            margin-top: 18px;
            .flex();

            .label {
              width: 80px;
            }

            .content {
              .el-input-number {
                width: 123px;
                border-radius: 3px 3px 3px 3px;
                border: 1px solid #E6E6E6;
                margin-right: 11px;
              }

              .tip {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 14px;
                color: #333333;
                font-style: normal;
                text-transform: none;
                margin-right: 10px;
              }

              .desc {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 14px;
                color: #77797B;
                font-style: normal;
                text-transform: none;
              }

              .price {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 18px;
                color: #FF0000;
                font-style: normal;
                text-transform: none;
              }

              p {
                font-family: Roboto, Roboto;
                font-weight: 400;
                font-size: 14px;
                color: #333333;
                font-style: normal;
                text-transform: none;
                margin-bottom: 10px;

                span {
                  font-family: Roboto, Roboto;
                  font-weight: 400;
                  font-size: 14px;
                  color: #77797B;
                  font-style: normal;
                  text-transform: none;
                }
              }
            }

            button {
              margin-right: 20px;
              font-size: 16px;
              transition: 0.3s;

              &:hover {
                opacity: 0.8;
              }
            }

            .btn-buy {
              width: 142px;
              height: 48px;
              background: @theme;
              border-radius: 4px 4px 4px 4px;
              border: 1px solid @theme;
              font-family: Roboto, Roboto;
              font-weight: bold;
              font-size: 16px;
              color: #FFFFFF;
              font-style: normal;
              text-transform: none;
            }

            .btn-add-cart {
              width: 142px;
              height: 48px;
              background: #FFFFFF;
              border-radius: 4px 4px 4px 4px;
              border: 1px solid @theme;
              font-family: Roboto, Roboto;
              font-weight: bold;
              font-size: 16px;
              color: @theme;
              font-style: normal;
              text-transform: none;

              img {
                width: 22.6px;
                height: 22.6px;
                margin-right: 8px;
              }
            }
          }

          .btn-box-start {
            align-items: start;
          }
        }

      }
    }


    .ctx-bottom-container {
      .flex();
      padding: 0 25px;
      background-color: #fff;

      .bottom-left {
        width: 220px;
        background: #FFF;
        font-weight: 400;
        font-size: 16px;
        color: #333333;

      }

      .bottom-right {
        width: 1164px;
        background: #FFF;
      }

      .ctx-bottom-inner {
        width: 100%;
        text-align: left;

        .detail-content-box, .comment-box {
          padding: 20px 0;
        }

        .bottom-nav {
          height: 38px;
          background: #F9F9F9;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #E6E6E6;

          .nav-item {
            cursor: pointer;
            width: 124px;
            height: 38px;
            border-radius: 4px 0px 0px 4px;
            text-align: center;
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #7D7D7D;
            font-style: normal;
            text-transform: none;
            line-height: 38px;

          }

          .nav-item.active {
            text-align: center;
            background: @theme;
            font-family: Roboto, Roboto;
            font-weight: bold;
            font-size: 14px;
            color: #FFFFFF;
            font-style: normal;
            text-transform: none;
          }
        }

        .section-title {
          margin-top: 40px;
          margin-bottom: 24px;
          font-size: 16px;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
          font-weight: bold;
          color: #333333;
        }
      }
    }
  }
}
</style>
