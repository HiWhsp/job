<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item><img alt="" src="@/static/home/home.png">当前位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ company_info.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--    条件筛选-->
    <div class="condition-filter" v-if="userInfo.type==2">
      <div class="filter flex">
        <p class="name">类目</p>
        <div class="item-wrap flex">
          <div v-for="(item, index) in filterList" :key="index"
               :class="{ 'active': activeIndex == item.id }"
               class="item pointer"
               @click="itemNav(item)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="company_info">
      <div class="company_name">{{ userInfo.type==1?company_info.username: company_info.company_name}} <img alt="" src="@/static/home/supplier.png"></div>
      <div class="company_content">{{ company_info.introduce }}</div>
    </div>
    <!-- 筛选-->
    <div class="page-list">
      <div class="filter-item">
        <!--        <div class="label">-->
        <!--          <p>共<span>{{ count }}</span>条</p>-->
        <!--        </div>-->
        <div class="val">
          <div class="sort-box">
            <div v-for="(item, index) in sortList" :key="index" :class="orderByColumn == item.ziduan ? 'active' : ''"
                 class="item" @click="onClickSort(item)">
              <div class="text">{{ item.title }}</div>
              <div v-if="item.title != '综合排序'" class="sanjiao-box">
                <div :class="orderByColumn == item.ziduan && isAsc == 'asc' ? 'active' : ''"
                     class="top"></div>
                <div :class="orderByColumn == item.ziduan && isAsc == 'desc' ? 'active' : ''"
                     class="bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="ctx-box">
      <div class="list cart-list">
        <div class="cart-list-inner">
          <!-- 标题 -->
          <div class="list-title">
            <div class="title-1"></div>
            <div class="title-2">序号</div>
            <div class="title-3">产品类目</div>
            <div class="title-4">产品规格</div>
            <div class="title-5">库存(吨)</div>
            <div class="title-6">检测报告</div>
            <div class="title-7">单价(元)</div>
            <div class="title-8">订购数量(吨)</div>
            <div class="title-9" v-if="userInfo.type==1">加入购物车</div>
            <div class="title-10">到货时间(天)</div>
            <div class="title-11">收藏</div>
          </div>

          <!-- 商品列表 -->
          <div v-for="(item, index) in list_goods" :key="index" class="item">
            <div class="item-detail flex">
              <div class="box-select">
                <el-checkbox v-model="item.checked" @change="on_change_checked_item"></el-checkbox>
              </div>
              <div class="box-index">{{ index + 1 }}</div>

              <div class="box-title">
                {{ item.material_type_name }}
              </div>
              <div class="box-sku">
                {{ item.guige }}
              </div>

              <div class="box-kucun">
                {{ item.kucun }}
              </div>

              <div class="div box-file" @click="lockFile(item)">
                查看
              </div>

              <div class="box-unit-price">
                <p>
                  <!-- <el-checkbox v-model="item.is_tax" @change="on_change_checked_item"></el-checkbox> -->
                  {{ vuex_huobi }} {{ item.includeTaxPrice }}(含税)
                </p>
                <p>
                  <!-- <el-checkbox v-model="item.is_notax" @change="on_change_checked_item"></el-checkbox> -->
                  {{ vuex_huobi }} {{ item.noTaxPrice }}(不含税)
                </p>
              </div>
              <div class="box-number">
                <el-input-number v-model="item.num" :min="0" :precision="2"></el-input-number>
                <!-- <button @click="do_number_minus(item)">-</button> -->
                <!-- <input v-model="item.num" min="1" type="number"  @input="inputChange(item)" @blur="on_blur_input(item)"/> -->
                <!-- <button @click="do_number_plus(item)">+</button> -->
              </div>
              <!--              <div class="box-subtotal">{{ vuex_huobi }} {{-->
              <!--                  (item.priceSale * item.num).toFixed(2)-->
              <!--                }}-->
              <!--              </div>-->
              <div class="box-card" v-if="userInfo.type==1">
                <img alt="" src="@/static/prod/goods-cart.png" @click="doCart(item)">
              </div>
              <div class="box-data">
                {{ item.daohuo_time }}
              </div>
              <div class="box-act">
                <img v-if="!item.had_collect" alt="" src="@/static/prod/no-action.png" @click="favouriteAdd(item, 1)">
                <img v-else alt="" src="@/static/prod/action.png" @click="favouriteAdd(item, 2)">
              </div>
            </div>
          </div>

          <el-empty v-if="!list_goods.length" description="暂无数据..."></el-empty>
          <!-- <div class="empty" v-if="!list_goods.length">暂无数据...</div> -->
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="bottom-action-box">
        <div class="all-select">
          <el-checkbox v-model="checked_all" @change="on_change_checked_all">{{
              checked_all ? "反选" : "全选"
            }}
          </el-checkbox>
        </div>
        <!--        <div class="delete-box">-->
        <!--          <span @click="do_cart_remove_select()">删除选中</span>-->
        <!--        </div>-->
        <!--        <div class="clear-box">-->
        <!--          <span @click="do_cart_clear()">清空购物车</span>-->
        <!--        </div>-->

        <div class="total-number">
          已选择
          <b>{{ count_shopcart_checked.toFixed(2) }}</b>
          吨商品
        </div>
        <div class="total-price">
          总计：
          <b>{{ vuex_huobi }} {{ shopcart_money }}</b>
          （含税）
        </div>
        <button :disabled="jiesuanDisabled" class="btn-ripple btn-order" @click="doCart()"  v-if="userInfo.type==1">
          加入购物车
        </button>
      </div>
    </div>
    <el-dialog :visible.sync="lockFIleVisible" width="400px">
      <div class="footer">
        <div class="content">
          <div class="file-item" v-for="(item, index) in lockFileList" :key="index">
            <a :href="item.url_full" target="_blank" class="pointer"
               v-if="item.url_full.includes('.pdf')">{{
                item.name
              }}</a>
            <a :href="item.url_full" target="_blank" class="pointer"
               v-else-if="item.url_full.includes('.xlsx')">{{
                item.name
              }}</a>
            <a :href="item.url_full" target="_blank" class="pointer"
               v-else-if="item.url_full.includes('.text')">{{
                item.name
              }}</a>
            <el-image
                v-else-if="item.url_full.includes('.png')"
                style="width: 100px; height: 100px"
                :src="item.url_full"
                :preview-src-list="item.url_full">
            </el-image>
          </div>
        </div>
      </div>
    </el-dialog>
    <productAddCartSuccessModal ref="modalAddSuccess"></productAddCartSuccessModal>
  </div>
</template>

<script>
import productAddCartSuccessModal from "@/components/product/product_add_cart_success_modal.vue";
import {mapState} from "vuex";
export default {
  name: '',
  components: {
    productAddCartSuccessModal
  },
  data() {
    return {
      lockFIleVisible: false,
      activeIndex: '',
      count: 0, // 总和
      pages: 1,
      isAsc: "", //升asc 降序desc
      orderByColumn: "ordering", //选择的排序方式
      sortList: [
        {title: "综合排序", ziduan: "ordering"},
        {title: "人气排序", ziduan: "collect_sort"},
        {title: "价格", ziduan: "price_sort"},
        {title: "销量", ziduan: "sale_num_sort"},
        {title: "新品", ziduan: "new_sort"}
      ],
      pagination: {
        page: 1,
        pagenum: 10
      },
      lockFileList: [],
      // 商品列表
      list_goods: [],
      filterList: [],
      company_info: {},
      checked_all: false, //是否全选
    }
  },
  watch: {},
  computed: {
    ...mapState(["userInfo"]),
    //购物车商品总金额
    shopcart_money() {
      let money = 0;
      console.log(this.list_goods
          .filter((v) => v.checked))
      this.list_goods
          .filter((v) => v.checked)
          .forEach((v) => {
            money += v.num * v.includeTaxPrice;
          });
      return money.toFixed(2);
    },
    //购物车被选择的商品
    list_shopcart_checked() {
      return this.list_goods.filter((v) => v.checked);
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
  mounted() {
    this.activeIndex = this.$route.query.type_id;
    this.setView();
  },
  methods: {
    setView() {
      this.queryGoods();
    },
    // 条件点击
    itemNav(item) {
      if (this.activeIndex === item.id) {
        this.activeIndex = '';
      } else {
        this.activeIndex = item.id;
      }
      -
          this.setView();
    },
    //排序方式
    onClickSort(item) {
      if (item.ziduan == this.orderByColumn) {
        this.isAsc = this.isAsc == "asc" ? "desc" : "asc";
      } else {
        this.isAsc = "asc";
      }
      this.orderByColumn = item.ziduan;
      this.setView();
    },
    //商品查询
    queryGoods() {
      this.$api({
        url: 'supplyProductPage',
        method: 'post',
        data: {
          supply_user_id: this.$route.query.ids,
          material_type_id: this.activeIndex,
          keyword: '',
          collect_sort: this.orderByColumn === 'collect_sort' ? this.isAsc === 'asc' ? 1 : 2 : '',
          price_sort: this.orderByColumn === 'price_sort' ? this.isAsc === 'asc' ? 1 : 2 : '',
          sale_num_sort: this.orderByColumn === 'sale_num_sort' ? this.isAsc === 'asc' ? 1 : 2 : '',
          new_sort: this.orderByColumn === 'new_sort' ? this.isAsc === 'asc' ? 1 : 2 : ''
        }
      }).then((res) => {
        let data = res.data;
        this.company_info = data.company_info;
        this.filterList = data.has_type;
        this.list_goods = data.material_list.map((v) => {
          v.checked = false;
          v.is_tax = false;
          v.is_notax = false;
          v.num = 0;
          return v;
        });
      });
    },
    // 加入购物车
    doCart(item) {
      let list = [];
      let nums=0
      if (item) {
        list.push({
          id: item.id,
          num: item.num
        });
      } else {
        list = this.list_shopcart_checked.map((v) => {
          nums+=Number(v.num)
          return {
            id: v.id,
            num: v.num
          };
        });
      }
      this.$api({
        url: 'addCart',
        method: 'post',
        data: {
          material_list: list,
        }
      }).then((res) => {
        let {code} = res;
        if (code === 200) {
          this.$refs.modalAddSuccess.init({
            num: nums,
            shopcart_count: res.data.cart_count
          });
        }
      });
    },
    // 获取排序方式
    getOrderType(item) {
      if (item === "ordering") { // 综合
        return 0;
      } else if (item === "price_sale") { // 单价
        return this.isAsc === "asc" ? 2 : 3;
      } else if (item === "orders") { // 库存
        return 1;
      }
    },
    //商品勾选 全选与取消
    on_change_checked_all(val) {
      //console.log("更新后的值", val);
      this.list_goods.forEach((v) => {
        v.checked = val;
      });
    },
    //商品勾选 单项选择
    on_change_checked_item() {
      // //console.log('监视单项选择', item)
      let checkLength = this.list_shopcart_checked.length;
      if (checkLength == this.list_goods.length) {
        this.checked_all = true;
      } else {
        this.checked_all = false;
      }
    },

    inputChange(item) {
        item.num = item.num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    },
    on_blur_input(item) {
      if (item.num < 1) {
        item.num = 1;
      }
    },
    //购物车商品数量减少
    do_number_minus(item) {
      if (item.num == 1) {
        return;
      }
      item.num = --item.num;
    },

    //购物车商品数量增加
    do_number_plus(item) {
      item.num = ++item.num;
    },
    //
    favouriteAdd(item, type) {
      this.$api({
        url: 'addCollect',
        method: 'post',
        data: {
          material_id: item.id,
          status: type
        }
      }).then(res => {
        let {code} = res;
        if (code === 200) {
          this.setView();
        }
      })
    },
    // 查看报告
    lockFile(item) {
      console.log(item)
      this.lockFileList = item.jiance_files_url
      this.lockFIleVisible = true;
    }
  }

}
</script>

<style lang="less" scoped>
.nav-bar {
  img {
    width: 14px;
    margin-right: 10px;
  }
}

.company_info {
  margin: 16px 0;
  padding: 36px 50px;
  background: #fff;

  .company_name {
    font-weight: 600;
    font-size: 36px;
    color: #000000;

    img {
      margin-left: 16px;
      margin-bottom: 10px;
      width: 56px;
      height: 20px;
    }
  }

  .company_content {
    margin-top: 20px;
    font-weight: 400;
    font-size: 18px;
    color: #333333;
    line-height: 32px;
  }
}

.condition-filter {
  margin-top: 21px;
  min-height: 152px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  padding: 20px;

  .filter {
    align-items: center;

    .name {
      width: 100px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      font-style: normal;
      text-transform: none;
    }

    .item-wrap {
      flex-wrap: wrap;
      flex: 1;

      .item {
        width: 164px;
        height: 48px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #DBDBDB;
        margin-bottom: 16px;
        margin-right: 10px;

        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        line-height: 48px;
        text-align: center;

        &:nth-child(7n) {
          margin-right: 0;
        }
      }

      .item.active {
        color: #fff;
        background: #044FA0;
      }
    }
  }
}

.page-list {
  margin-top: 16px;
  margin-bottom: 10px;

  .filter-item {
    display: flex;
    align-items: flex-start;
    background-color: #fff;
    height: 47px;

    &:last-child {
      border-bottom: none;
    }

    .label {
      font-size: 14px;
      height: 46px;
      line-height: 46px;
      text-align: right;

      span {
        color: @theme;
        margin: 0 5px;
      }
    }

    .val {
      flex: 1;
      height: 100%;
      background: #fff;
      display: flex;
      align-items: center;
    }

    .sort-box {
      height: 100%;
      display: flex;
      font-size: 14px;
      font-family: Roboto, Roboto;
      color: #545454;

      .item {
        width: 120px;
        height: 100%;
        border-right: 1px solid #E1E2E5;
        .flex-center();
        padding: 2px 12px;
        text-align: center;
        cursor: pointer;

        &.active {
          // background: @theme;
          // color: #fff;
          color: #A76737;
        }

        .sanjiao-box {
          margin-left: 5px;

          .top {
            border: 5px solid;
            border-color: transparent;
            border-bottom-color: #AAA;

            &.active {
              border-bottom-color: @theme;
            }
          }

          .bottom {
            margin-top: 2px;
            border: 5px solid;
            border-color: transparent;
            border-top-color: #AAA;

            &.active {
              border-top-color: @theme;
            }
          }
        }
      }
    }
  }
}

.ctx-box {
  background: #fff;

  .list {
    border-bottom: 1px solid #E6E4E1;

    .list-title {
      text-align: center;
      background: #044FA0;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #FFFFFF;
      line-height: 50px;

      .flex();

      .title-1 {
        width: 60px;
        text-align: center;
      }

      .title-2 {
        width: 60px;
      }

      .title-3 {
        text-align: left;
        padding-left: 20px;
        width: 150px;
      }

      .title-4 {
        width: 110px;
      }

      .title-5 {
        width: 110px;
      }

      .title-6 {
        width: 110px;
      }

      .title-7 {
        width: 180px;
      }

      .title-8 {
        width: 180px;
      }

      .title-9 {
        width: 150px;
      }

      .title-10,
      .title-11 {
        width: 150px;
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
        font-size: 16px;
        color: #333333;

        .box-select {
          width: 60px;
          text-align: center;

          /deep/ .el-checkbox__inner {
            border-color: @theme !important;
          }

          /deep/ .is-checked .el-checkbox__inner {
            background: @theme !important;
            border-color: @theme !important;
          }
        }

        .box-index {
          width: 60px;
          text-align: center;
        }

        .box-image {
          width: 150px;
          padding-left: 20px;
        }

        .box-title {
          width: 150px;
          text-align: center;
        }

        .box-sku {
          width: 110px;
          text-align: center;
        }

        .box-kucun {
          width: 110px;
          text-align: center;
        }

        .box-file {
          width: 110px;
          text-align: center;
          color: #007BFF;
          cursor: pointer;
        }

        .box-unit-price {
          width: 180px;
          text-align: left;
        }

        .box-number {
          width: 180px;
          padding: 5px;
          .flex-center();

          input {
            width: 48px;
            height: 30px;
            border: 1px solid #d5d8de;
            text-align: center;

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

        .box-card {
          width: 150px;
          text-align: center;

          img {
            width: 24px;
            cursor: pointer;
          }
        }

        .box-data {
          width: 150px;
          text-align: center;
        }

        .box-act {
          width: 150px;
          text-align: center;
          cursor: pointer;

          img {
            width: 18px;
            height: 16px;
          }
        }
      }
    }
  }
}

.bottom-action-box {
  .flex();
  padding: 20px 35px;
  margin-top: 18px;
  height: 86px;
  background: #FAFBFC;

  .all-select {
    flex: 1;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;

    /deep/ .el-checkbox__inner {
      border-color: @theme !important;
    }

    /deep/ .is-checked .el-checkbox__inner {
      background: @theme !important;
      border-color: @theme !important;
    }

    /deep/ .el-checkbox__label {
      color: #666666;
    }

    /deep/ .is-checked .el-checkbox__label {
      color: @theme !important;
    }
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
    width: fit-content;
    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;

    b {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #f13f17;
    }
  }

  .total-price {
    margin-left: 60px;
    margin-right: 60px;
    width: fit-content;

    font-family: OPPOSans, OPPOSans;
    font-weight: 400;
    font-size: 14px;
    color: #666666;

    b {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: #f13f17;
    }
  }

  .btn-order {
    cursor: pointer;
    width: 191px;
    height: 46px;
    background: @theme;

    font-size: 16px;
    font-family: Roboto, Roboto;
    font-weight: bold;
    color: #ffffff;
    transition: 0.3s;
    user-select: none;

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
}
</style>
