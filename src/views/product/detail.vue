<script>
import detailLunbo from "@/components/detail/detailLunbo.vue"; // 滚动图
import product_add_cart_success_modal from "@/components/product/product_add_cart_success_modal.vue"; // 加入购物车
import {Loading} from "element-ui";

export default {
  name: "detail",
  components: {
    detailLunbo,
    product_add_cart_success_modal
  },
  data() {
    return {
      detailImages: [],
      Loading,
      loadingInstance: null,
      view_info: {},
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
      select_specifications: {}, //选择的规格
      selected_num: 1, //商品数量
      list_specifications: [], //规格列表
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

      selectedSkuComb: {}, //选择的商品规格信息 立即购买需要金额
      curr: {}, //产品
      detail: {}, //产品
      current: 0, //轮播图指示器
      swiperImgs: [], //轮播图
      activeSwipeIndex: 0, //轮播图指示器

      count_comments: 0, //评价总数
      list_comments: [], //评价详情

      if_shoucang: false,
    };
  },

  computed: {

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

  created() {
    this.setView();
  },

  beforeDestroy() {
    document.removeEventListener("scroll", this.handleScrollEvent);
  },

  methods: {
    // 初始化
    setView() {
      //查询商品信息
      this.$api("product_detail", {inventoryId: this.id}).then((res) => {
        let {code, data, message} = res;

        if (code == 1) {
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

          this.set_specifications(data);
          this.query_comments(); //评论
          this.query_products(); //评论

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
    set_select_specifications() {
      if (Object.keys(this.detail.skus).length == this.select_shuxing_list.length) {
        let key_ids = this.select_shuxing_list.map((v) => v.id).join("-");
        this.select_specifications =
            this.list_specifications.find((v) => v.key_ids == key_ids) || {};
      }

      //console.log("已选的商品属性值 select_shuxing_list", this.select_shuxing_list);
      //console.log("商品规格 select_specifications", { ...this.select_specifications });
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
      let list_filter = this.list_specifications.filter((v) => {
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

    //处理产品图片
    handleProductImage(image_list) {
      //处理产品图片
      // //console.log("产品列表数据 image_list", image_list);
      var promise_arr = [];
      image_list.forEach((src, index) => {
        var promise = this.loadImageAsync(src);
        promise_arr.push(promise);
      });
      Promise.all(promise_arr).then((resAll) => {
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

    //设置规格
    set_specifications(data) {
      //规格列表组
      let list_specifications = [];
      if (data.inventorys && data.inventorys.length) {
        data.inventorys.forEach((v) => {
          list_specifications.push({
            ...v,
            kucun: +v.kucun,
            key_vals: v.key_vals,
          });
        });
      } else {
        list_specifications = [
          {
            status: this.detail.product_status,
            image: this.detail.images[0],
            inventoryId: this.detail.inventoryId,
            key_vals: this.detail.key_vals == "无" ? "默认" : this.detail.key_vals,
            kucun: +this.detail.kucun,
            price_market: this.detail.price_market,
            price_sale: this.detail.price_sale,
            price_sale2: this.detail.price_sale2,
            price_sale3: this.detail.price_sale3,
            nums1: this.detail.nums1,
            nums2: this.detail.nums2,
          },
        ];
      }

      //单规格商品 默认勾选
      if (list_specifications.length == 1) {
        this.select_specifications = list_specifications[0];
      } else {
        // this.select_specifications = {};
        this.select_specifications =
            list_specifications.find((v) => v.inventoryId == this.id) || {};
      }
      this.list_specifications = list_specifications;

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
    toggleSpecifications(item) {
      if (item.kucun) {
        this.select_specifications = item;
        if (this.selected_num > item.kucun) {
          this.selected_num = item.kucun;
        }
      }
    },

    //商品是否选择规格检测
    checkedSelected() {
      //console.log("检测是否选择了商品", this.select_specifications);

      if (!this.select_specifications.inventoryId) {
        alertErr("请选择商品规格");
        return false;
      }

      if (this.select_specifications.kucun < this.selected_num) {
        alertErr("该商品库存不足,无法购买");
        return false;
      }

      return true;
    },

    //处理购物车列表数据
    handlePiPrice(item) {
      let v = item;
      let {nums1, nums2} = v;
      let num = this.selected_num;
      let price_sale = 0;
      if (+nums2 && +nums1) {
        if (+num > +(+nums2)) {
          price_sale = v.price_sale3;
        } else if (+num >= +nums1) {
          price_sale = v.price_sale2;
        } else {
          price_sale = v.price_origin;
        }
      }

      return price_sale;
    },

    //立即购买
    payNow() {
      var isSelect = this.checkedSelected();
      if (!isSelect) {
        return;
      }

      var item = this.curr;
      let {productId, images, title} = item;
      let {
        inventoryId,
        key_vals,
        price_sale,
        price_market,
      } = this.select_specifications;
      let num = this.selected_num;

      let price = this.handlePiPrice(this.select_specifications);
      console.warn("计算批量购买 price = ", price);

      var list_payment = [
        {
          productId: productId,
          image: images && images[0],
          key_vals: key_vals,
          title: title,
          num, //数量
          inventoryId, //规格
          price_sale: price || price_sale, //售价
          price_market: price_market, //市场价
        },
      ];

      sessionStorage.setItem("list_payment", JSON.stringify(list_payment));

      this.$router.push({
        path: "/orderCreate",
      });
    },

    onBlur_selected_num() {
      //console.log(this.selected_num + "");

      this.selected_num = parseInt(this.selected_num) || 1;
    },

    //购车添加商品
    shopcart_add() {
      this.$refs.modalAddSuccess.init({
        num: this.selected_num,
        ...this.select_specifications,
      });
      return;
      if (!this.select_specifications.inventoryId) {
        alertErr("请选择商品规格！");
        return;
      }
      if (this.selected_num > this.select_specifications.kucun) {
        alertErr("当前商品库存不足！");
        return;
      }

      if (this.select_specifications.status == -1) {
        alertErr("当前商品已下架！");
        return;
      }

      // debugger
      this.$api("gouwuche_add", {
        inventoryId: this.select_specifications.inventoryId,
        num: this.selected_num,
        _no_tip: 1,
      }).then((res) => {
        let {code, count} = res;
        if (code == 1) {
          // 购物车弹框
          this.$refs.modalAddSuccess.init({
            num: this.selected_num,
            ...this.select_specifications,
          });
          this.mix_shopcart_update_count(count);
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
        if (code == 1) {
          this.list_comments = data;
          this.count_comments = count;
        }
      });
    },
    query_products() {
      this.$api("product_plist", {
        page: 1,
        page_num: 5,
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 1) {
          this.list_goods = data;
        }
      });
    },


    //商品评价页面
    go_comments() {
      this.$router.push({
        path: "/comments",
        query: {
          pid: this.productId,
        },
      });
    },

    //
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
      element.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
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
        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="page-box">
      <div class="page-inner">
        <div class="main-content">
          <div class="ctx-top">
            <!--      商品图片轮播      -->
            <div class="ctx-left">
              <div class="preview-wrap">
                <detailLunbo :imageList="detailImages"/>
              </div>
            </div>
            <!--            规格-->
            <div class="ctx-right">
              <div class="detail-title">
                FUS-U30系列28电机 本体宽30mm
              </div>
              <!--              产品型号-->
              <div class="info-box">
                <div class="label">产品型号</div>
                <div class="list">
                  <div class="item ellipsis-1 active">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)</div>
                  <div class="item ellipsis-1">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)</div>
                  <div class="item ellipsis-1">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)</div>
                  <div class="item ellipsis-1">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)</div>
                  <div class="item ellipsis-1">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)</div>
                  <div class="item ellipsis-1">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)</div>
                  <div class="item ellipsis-1">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)</div>
                  <div class="item ellipsis-1">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)</div>
                  <div class="item ellipsis-1">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)</div>
                  <div class="item ellipsis-1">28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)
                    28电机*梯形丝杆导程0802*行程100mm(FUS-U30-B28-L0802-T100)
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
                    <el-input-number :min="1" :max="99"></el-input-number>
                    <div class="tip">PCS</div>
                    <div class="desc">库存: 2000</div>
                  </div>
                </div>
                <div class="btn-box">
                  <div class="label">商品总价</div>
                  <div class="content">
                    <div class="price">¥320.00</div>
                  </div>
                </div>
                <div class="btn-box">
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
                    <div class="nav-item" @click="togglePanel('详情')" :class="active_panel == '详情' ? 'active' : ''">
                      规格表
                    </div>

                    <div class="nav-item" @click="togglePanel('评价')" :class="active_panel == '评价' ? 'active' : ''">
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
                    <div class="pagination-box" style="margin-top: 80px" v-if="list_comments.length">
                      <el-pagination background layout="total, prev, pager, next" @current-change="changePage_comment"
                                     :current-page.sync="pagination.page" :page-size="pagination.pagenum"
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
          height: 178px;
          background: #FFFFFF;
          border-radius: 4px 4px 4px 4px;
          border: 1px solid #E6E4E1;
          padding: 10px;
          margin-top: 20px;
          .flex();

          .label {
            height: 100%;
            font-family: Roboto, Roboto;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            font-style: normal;
            text-transform: none;
          }

          .list {
            height: 100%;
            overflow-y: auto;
            margin-left: 30px;
            padding-right: 200px;

            .item {
              max-width: 430px;
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
