<template>
  <div class="page">
    <div class="main-title flex flex-between">
      报价单
      <div class="search-box">
        <input v-model="keyword" type="text" placeholder="输入商品名称、订单号"/>
        <button @click="do_search()">搜索</button>
        <button @click="do_reset()">重置</button>
      </div>
    </div>

    <div class="page-ctx">
      <div class="tab-box">
        <div class="tab-list">
          <div v-for="(item, index) in tabList" :key="index" class="tab-item"
               :class="tabSelect.value == item.value ? 'active' : ''" @click="do_toggle_tab(item)">
            {{ item.title }}
            <span class="number" v-if="item.num">{{ item.num }}</span>
          </div>
        </div>
      </div>

      <div class="center">
        <orderList :list="orders" @confirm="emitConfirm"/>

        <div v-if="count" class="pagination-box" style="margin-top: 40px; text-align: right;">
          <el-pagination background layout="total, prev, pager, next" @current-change="changePage"
                         :current-page.sync="pagination.page" :page-size="pagination.pageNum"
                         :total="count"></el-pagination>
        </div>

        <el-empty v-if="!count" description="没有查询到订单信息..."></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import orderList from "@/components/order/orderList.vue"; //订单列表
import {mapState} from "vuex";

export default {
  name: "order-quotation-list",
  components: {
    orderList,
  },
  data() {
    return {
      tabSelect: {
        title: '全部',
        value: 0,
      },
      //
      orders: [],
      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      keyword: "",
      user_index: {},
    };
  },
  computed: {
    ...mapState([""]),

    tabList() {
      //scene
      //筛选状态：0-全部 1-待支付 2-待发货 3-待收货 4-待核销 5-已完成 6-待评价 7-已取消
      //orderStatus
      //订单状态：-5-待支付  -1-已取消  2-待发货  3-待收货  4-待自提  5-已完成
      let user_index = {} || this.user_index;
      let tabList = [
        {value: 0, title: "全部订单"},
        {value: 1, title: "待付款", num: user_index.order_num_1 || 0},
        {value: 2, title: "待发货", num: user_index.order_num_2 || 0},
        {value: 3, title: "待收货", num: user_index.order_num_3 || 0},
        // { value: 4, title: "待核销", num: user_index.order_num_4 || 0 },
        {value: 6, title: "待评价", num: user_index.order_num_4 || 0},
        {value: 5, title: "已完成", num: user_index.order_num_4 || 0},
        {value: 7, title: "已取消", num: user_index.order_num_4 || 0},
        // { value: 6, title: "待审核", num: user_index.order_num_6 || 0 },
      ];
      return tabList;
    },
  },
  created() {

    this.setView();
  },

  methods: {
    emitConfirm() {
      this.query_order()
    },
    setView() {
      if (this.$route.query.status) {
        this.tabSelect = this.tabList.find(v => v.value == this.$route.query.status) || this.tabList[0]
      }

      this.query_userIndex();
      this.query_order();
    },

    //用户主页数据
    query_userIndex() {
      this.$api("users_index").then((res) => {
        let {code, data} = res;
        if (code == 200) {
          this.user_index = data;
        }
      });
    },

    //订单列表
    query_order() {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'orders_lists',
          ...this.pagination,
          scene: this.tabSelect.value,
          // keyword: this.keyword,
        },
      }).then((res) => {
        let {code, data} = res;
        if (code == 200) {
          let list = data.list

          list.forEach((order) => {
            order.isPay = order.value >= 0;
            order.actions = this.getOrderActions({
              ...order,
            });

            let count_goods = 0;
            order.products.forEach((product) => {
              count_goods = count_goods + +product.num;
            });
            order.count_goods = count_goods;
          });

          this.orders = list;
          this.count = data.count;
        }
      });
    },

    //根据订单状态获取订单操作结果
    getOrderActions(order) {
      let {status, statusInfo, ifpingjia} = order;
      let actions = [];
      // let actions = [
      //   { name: "取消订单",type: 'quxiao' },
      //   { name: "立即支付",type: 'zhifu' },
      //   { name: "确认收货",type: 'shouhuo' },
      //   { name: "评价订单",type: 'pingjia' },
      //   { name: "申请售后",type: 'shouhou' },
      //   { name: "删除订单",type: 'shanchu' },
      //   { name: "再次购买",type: 'goumai' },
      // ];

      if (status == -5) {
        //待支付
        if (statusInfo == "无效") {
          actions = [{name: "取消订单", type: "quxiao"}];
        } else if (statusInfo == "待支付") {
          actions = [
            {name: "立即支付", type: "zhifu"},
            {name: "取消订单", type: "quxiao"},
          ];
        }
      } else if (status == -3) {
        //-3售后处理中
        actions = [{name: "删除订单", type: "shanchu"}];
      } else if (status == -1) {
        //无效
        actions = [{name: "删除订单", type: "shanchu"}];
      } else if (status == 0) {
        //0待成团
        actions = [{name: "取消订单", type: "quxiao"}];
      } else if (status == 2) {
        //2待发货
        actions = [
          // { name: "取消订单", type: "quxiao" }
        ];
      } else if (status == 3) {
        //3待收货
        actions = [
          {name: "确认收货", type: "shouhuo"},
          {name: "查看物流", type: "wuliu"},
        ];
      } else if (status == 4) {
        //4已收货
        if (ifpingjia) {
          actions = [
            // { name: "删除订单", type: "shanchu" },
            // { name: "查看物流", type: "wuliu" },
            // { name: "售后", type: "shouhou" },
          ];
        } else {
          actions = [
            // { name: "删除订单", type: "shanchu" },
            // { name: "查看物流", type: "wuliu" },
            // { name: "售后", type: "shouhou" },
            //  { name: "评价", type: 'pingjia' }
          ];
        }
      }
      return actions;
    },

    do_toggle_tab(item) {
      this.tabSelect = item;
      this.pagination.page = 1;
      this.query_order();
    },


    //分页
    changePage() {
      this.query_order();
    },

    //搜索
    do_search() {
      this.query_order();
    },

    //重置
    do_reset() {
      this.keyword = "";
      this.pagination.page = 1;
      this.query_order();
    },

    updateView() {
      this.query_order();
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}

.page {
  padding: 0;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    .search-box {
      .flex();
      min-width: 260px;
      height: 32px;
      background: #f9f9f9;

      input {
        background: #f9f9f9;
        flex: 2;
        height: 100%;
        border: 1px solid #e2e2e2;
        border-right: none;
        outline: none;
        padding-left: 10px;
        font-size: 12px;
      }

      button {
        width: 50px;
        height: 32px;
        background: #ffffff;
        border: 1px solid #e2e2e2;
        color: #7d7d7d;

        &:last-child {
          border-left: 0;
        }
      }
    }

  }

  .page-ctx {
    margin-top: 14px;
    padding: 24px 32px;
    background: #fff;
  }
}

.tab-box {
  padding-right: 20px;
  .flex-between();
  background: #ffffff;
  // border: 1px solid #cccccc;

  .tab-list {
    .flex();
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .tab-item {
      position: relative;
      // min-width: 96px;
      height: 48px;
      line-height: 48px;
      cursor: pointer;
      margin-right: 40px;

      .number {
        color: @theme;
      }

      &.active {
        // background: @theme;
        // color: #fff;
        font-weight: bold;
        color: @theme;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: @theme;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-list.less"></style>
