<template>
  <div class="page">
    <div class="page-title flex-between">
      人员管理
      <div class="flex" v-if="vuex_user.staffType == 3">
        <div class="search">
          <input
            v-model="keyword"
            class="searchbar"
            type="text"
            placeholder="请输入搜索关键词"
            @keyup="doSearchEnter"
          />
          <img
            class="searchbtn"
            @click="doSearch()"
            src="@/assets/img/my/search.png"
            alt=""
          />
        </div>
        <div class="dash-btn" @click="showTemplate()">
          <img class="dashicon" src="@/assets/img/my/download.png" alt="" />
          下载模板
        </div>
        <div class="dash-btn">
          <img class="dashicon" src="@/assets/img/my/remove.png" alt="" />
          <span
            :class="deleteConfirm == 1 ? 'hide' : ''"
            @click="deleteConfirm = 1"
            >删除选中</span
          >
          <span @click="batchDel()" :class="deleteConfirm == 0 ? 'hide' : ''"
            >确认删除</span
          >
        </div>
        <el-upload
          class="upload-demo"
          :action="UPLOAD_ACTION"
          name="file"
          :data="custom_upload_data"
          accept=".xls,.xlsx,.et"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
        >
          <div class="dash-btn">
            <img class="dashicon" src="@/assets/img/my/add.png" alt="" />
            批量导入
          </div>
        </el-upload>

        <div class="dash-btn" @click="toRoute('/enterprise-member-add')">
          <img class="dashicon" src="@/assets/img/my/add.png" alt="" />
          添加子账号
        </div>
      </div>
      <div class="flex" v-else>
        <div class="search">
          <input
            v-model="keyword"
            class="searchbar"
            type="text"
            placeholder="请输入搜索关键词"
            @keyup="doSearchEnter"
          />
          <img
            class="searchbtn"
            @click="doSearch()"
            src="@/assets/img/my/search.png"
            alt=""
          />
        </div>
      </div>
    </div>

    <div class="page-ctx">
      <div class="tab-box">
        <div class="tab-list">
          <div
            v-for="(item, index) in tabList"
            :key="index"
            class="tab-item"
            :class="tabSelect.value == item.value ? 'active' : ''"
            @click="do_toggle_tab(item)"
          >
            {{ item.title }}
            <span class="number" v-if="item.num">{{ item.num }}</span>
          </div>
        </div>
        <!-- <div class="search-box">
          <input v-model="keyword" type="text" placeholder="输入商品名称、订单号" />
          <button @click="do_search()">搜索</button>
          <button @click="do_reset()">重置</button>
        </div> -->
      </div>

      <div class="page-sec">
        <!-- <orderList :list="orders" @confirm="emitConfirm"/> -->
        <div class="store-list">
          <table v-if="count">
            <thead>
              <td>
                <span class="selectall"
                  ><input
                    type="checkbox"
                    v-model="checkedAll"
                    @change="changeAllChecked()"
                  />
                  全选</span
                >
              </td>
              <td>账号</td>
              <td>姓名</td>
              <td>密码</td>
              <td>订单数量</td>
              <td>工作邮箱</td>
              <td>角色</td>
            </thead>
            <tr v-for="(item, key) in orders" :v-bind="key">
              <td>
                <input type="checkbox" :value="item.id" v-model="checkedItem" />
              </td>
              <td>{{ item.nickname }}</td>
              <td>{{ item.realName }}</td>
              <td class="resetpass" @click="doPassReset(item)">密码重置</td>
              <td class="person">{{ item.orderNum }}</td>
              <td>{{ item.email }}</td>
              <td>
                {{
                  item.staffType == 1
                    ? "采购员"
                    : item.staffType == 2
                    ? "采购经理"
                    : item.staffType == 3
                    ? "采购总监"
                    : "其它"
                }}
              </td>
            </tr>
          </table>
        </div>
        <div
          v-if="count"
          class="pagination-box"
          style="margin-top: 40px; text-align: right"
        >
          <el-pagination
            background
            layout="total, prev, pager, next"
            @current-change="on_current_change"
            :current-page.sync="pagination.page"
            :page-size="pagination.pageNum"
            :total="count"
          ></el-pagination>
        </div>

        <el-empty v-if="!count" description="没有查询到相关信息..."></el-empty>
      </div>
    </div>
    <Enterprise_password_mod
      ref="passmod"
      @confirm="query_order"
    ></Enterprise_password_mod>
    <Enterprise_template_down ref="download"></Enterprise_template_down>
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env";
import Enterprise_template_down from "../../components/enterprise/enterprise_template_down";
import Enterprise_password_mod from "../../components/enterprise/enterprise_password_mod";
// import orderList from "@/components/order/orderList.vue"; //订单列表

import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    Enterprise_template_down,
    Enterprise_password_mod,
  },
  data() {
    return {
      tabSelect: {
        title: "全部",
        value: -1
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
      item: {},
      deleteConfirm: 0,
      // 设置选项复选框初始状态为未选中,由于是一个数组,所以值为[],即为空
      checkedItem: [],
      // 设置选中全选复选框后重新给选项复选框赋值,即选中所有的选项复选框
      checkedAttr: [],
      checkedAll: false,
      link: "",
      UPLOAD_ACTION: "http://jzgy360.com/service.php",
      UPLOAD_NAME,
      UPLOAD_PARAMS_ACTION: "upload_uploadFile",
    };
  },
  computed: {
    ...mapState([""]),
    custom_upload_data() {
      let token = localStorage.getItem("token") || "";
      let userId = localStorage.getItem("userId") || "";

      let info = {
        action: "upload_uploadFile",
        token: token,
        userId: userId,
      };
      return info;
    },
    tabList() {
      //scene
      //筛选状态：0-全部 1-待支付 2-待发货 3-待收货 4-待核销 5-已完成 6-待评价 7-已取消
      //orderStatus
      //订单状态：-5-待支付  -1-已取消  2-待发货  3-待收货  4-待自提  5-已完成
      let user_index = {} || this.user_index;
      let tabList = [
        { value: -1, title: "全部" },
        { value: 0, title: "采购专员" },
        { value: 1, title: "采购人员" },
        { value: 2, title: "采购经理" },
        { value: 3, title: "采购总监" },
      ];
      return tabList;
    },
  },
  created() {
    let blacklistT = [1];
    if (blacklistT.indexOf(this.vuex_user.type) > 0) {
      alert("权限不足");
      this.toRoute("/index");
    }
    this.setView();
  },

  methods: {
    emitConfirm() {
      this.query_order();
    },
    setView() {
      if (this.$route.query.status) {
        this.tabSelect =
          this.tabList.find((v) => v.value == this.$route.query.status) ||
          this.tabList[0];
      }

      this.query_userIndex();
      this.query_order();
    },
    doSearchEnter(e) {
      console.log(e);
      if (e.keyCode === 13) {
        this.doSearch();
      }
    },
    doSearch() {
      this.checkedItem = [];
      this.checkedAttr = [];
      this.pagination.page = 1;
      this.query_order();
    },
    //用户主页数据
    query_userIndex() {
      this.$api("users_index").then((res) => {
        let { code, data } = res;
        if (code == 200) {
          this.user_index = data;
        }
      });
    },

    //订单列表
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userC_lists",
          ...this.pagination,
          staffType: this.tabSelect.value != -1? this.tabSelect.value : '',
          name: this.keyword,
          // keyword: this.keyword,
        },
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          let list = data.list;
          this.orders = list;
          this.count = data.count;
          for (let i = 0; i < this.orders.length; i++) {
            this.checkedAttr.push(this.orders[i].id);
          }
        }
      });
    },

    //根据订单状态获取订单操作结果
    getOrderActions(order) {
      let { status, status_info, ifpingjia } = order;
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
        if (status_info == "无效") {
          actions = [{ name: "取消订单", type: "quxiao" }];
        } else if (status_info == "待支付") {
          actions = [
            { name: "立即支付", type: "zhifu" },
            { name: "取消订单", type: "quxiao" },
          ];
        }
      } else if (status == -3) {
        //-3售后处理中
        actions = [{ name: "删除订单", type: "shanchu" }];
      } else if (status == -1) {
        //无效
        actions = [{ name: "删除订单", type: "shanchu" }];
      } else if (status == 0) {
        //0待成团
        actions = [{ name: "取消订单", type: "quxiao" }];
      } else if (status == 2) {
        //2待发货
        actions = [
          // { name: "取消订单", type: "quxiao" }
        ];
      } else if (status == 3) {
        //3待收货
        actions = [
          { name: "确认收货", type: "shouhuo" },
          { name: "查看物流", type: "wuliu" },
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
    showTemplate() {
      this.$refs.download.init({});
    },
    doPassReset(item) {
      this.$refs.passmod.init(item);
    },
    do_toggle_tab(item) {
      this.tabSelect = item;
      this.pagination.page = 1;
      this.checkedAll = false;
      this.query_order();
    },

    //分页
    on_current_change() {
      this.checkedItem = [];
      this.checkedAttr = [];
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
    beforeAvatarUpload(file) {},
    handleAvatarSuccess(res, file, fileList) {
      console.log(file);
      console.log(res);
      this.batchUpConfirm(res.data.url);
    },
    updateView() {
      this.query_order();
    },

    toDetail(item) {
      // this.$router.push(`/order-detail?id=${item.id}`);
      this.toRoute({
        path: "/order-detail",
        query: {
          id: item.id,
        },
      });
    },
    doPay(item) {
      this.$router.push({
        path: "/payment-methods",
        query: {
          id: item.id,
        },
      });
    },

    updateView() {
      this.$parent.updateView();
    },
    changeAllChecked() {
      // 判断全选复选框是否选中
      if (this.checkedAll) {
        // 如果全选复选框被选中,则重新给选项复选框赋值,即选中所有的选项复选框
        this.checkedItem = this.checkedAttr;
      } else {
        // 如果全选复未选框被选中,则设置为空值,即未选中所有的选项复选框
        this.checkedItem = [];
      }
    },
    batchUpConfirm(url) {
      let link = url.substring(url.lastIndexOf("/upload") + 8);
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "userC_multiImport",
          filepath: link,
        },
      }).then((res) => {
        alert(res);
        if (res.code == 200) {
          this.query_order();
        }
      });
    },
    batchDel() {
      if (this.checkedItem.length === 0) {
        alert("目前未选中任何项目！");
      } else {
        let target = this.checkedItem.join(",");
        this.$api({
          url: "/service.php",
          method: "get",
          data: {
            action: "userC_del",
            id: target,
          },
        }).then((res) => {
          if (res.code == 200) {
            alert("删除成功");
            this.query_order();
            this.$forceUpdate();
          } else {
            alert(res);
          }
        });
      }
      this.deleteConfirm = 0;
    },
    //处理订单行为
    handleOrderAction(action, order_id, order) {
      let fahuo_id = order.fahuo_id || "";
      //console.log({ ...action });
      let name = action.name;
      if (name == "取消订单") {
        this.orders_qxOrder(order_id);
      } else if (name == "删除订单") {
        this.orders_del(order_id);
      } else if (name == "立即支付") {
        this.order_payment(order_id);
      } else if (name == "确认收货") {
        this.order_qianshou(order_id);
      } else if (name == "评价") {
        this.jump_pingjia(order_id);
      } else if (name == "申请售后") {
        this.jump_shouhou(order_id);
      } else if (name == "查看物流") {
        this.$router.push(
          `/orderLogistics?order_id=${order_id}&logistics_id=${fahuo_id}`
        );
      } else if (name == "售后") {
        this.$router.push(`/refundFeedback?order_id=${order_id}`);
      }
    },

    //取消订单
    orders_qxOrder(order_id) {
      let order = this.list.find((v) => v.id == order_id);

      // order.orders_qxOrder({
      //   params: { order_id },
      //   success: () => {
      //     this.updateView();
      //   }
      // });
    },
    //删除订单
    orders_del(order_id) {
      order.orders_del({
        params: { order_id },
        success: () => {
          this.updateView();
        },
      });
    },
    //订单支付
    order_payment(order_id) {
      this.$router.push(`/payment-methods?order_id=${order_id}`);
    },

    //订单确认收货
    order_qianshou(order_id) {
      let order = this.list.find((v) => v.id == order_id);
      this.$refs.order_receive_modal.showModal = true;
      this.$refs.order_receive_modal.order = order;
      //console.log("订单信息", { ...order });
    },

    //订单评价
    jump_pingjia(order_id) {
      this.$router.push(`/order-review-submit?order_id=${order_id}`);
    },
    //订单售后申请
    jump_shouhou(order_id) {
      this.$router.push(`/orderRefund?order_id=${order_id}`);
    },
    jump_order_detail(order) {},

    open_link(link) {
      window.open(link, "_blank");
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}
.hide {
  display: none;
}
.page {
  padding-bottom: 50px;

  .page-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    .search {
      position: relative;
      .searchbar {
        border: 1px solid #b8c4d1;
        height: 32px;
        width: 220px;
        padding-right: 38px;
        padding-left: 10px;
        font-size: 12px;
      }
      .searchbtn {
        position: absolute;
        height: 18px;
        right: 10px;
        bottom: 16px;
      }
    }
    .dash-btn {
      display: flex;
      align-items: center;
      margin-left: 16px;
      color: #F74747;
      font-size: 14px;
      font-weight: normal;
      cursor: pointer;
      .dashicon {
        height: 18px;
        margin-right: 4px;
      }
    }
  }

  .page-ctx {
    margin-top: 14px;
    padding: 24px 32px;
    background: #fff;
  }
}
.store-list {
  table {
    width: 100%;
    // border: 1px solid #e5e5e5;
    border-collapse: collapse;
    margin: 16px;
    thead {
      // background: #f5f5f5;
      height: 44px;
      font-weight: bold;
    }
    .selectall {
      font-weight: normal;
      display: flex;
      align-items: center;
      input {
        margin-right: 4px;
      }
    }
    thead,
    tr {
      // text-align: center;
      color: #333;
      font-size: 14px;
    }
    tr {
      height: 64px;
      border-top: 1px solid #f5f5f5;
    }
    td {
      padding-left: 16px;
    }
    a {
      color: black;
    }
    .person {
      color: #666666;
    }
    .resetpass {
      cursor: pointer;
    }
  }
}
.tab-box {
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  // border: 1px solid #cccccc;

  .tab-list {
    display: flex;
    align-items: center;
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
        color: #F74747;
      }

      &.active {
        // background: #F74747;
        // color: #fff;
        font-weight: bold;
        color: #F74747;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #F74747;
        }
      }
    }
  }

  .search-box {
    display: flex;
    align-items: center;
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

.goods-sku {
  margin: 15px 0;
}

.check-url {
  // margin: 15px 0;

  span {
    cursor: pointer;
    display: inlin-block;
    padding: 2px 4px;
    background: coral;
    color: #fff;
  }
}

.order-list-wrap {
  .info-item {
    border: 1px solid #e5e5e5;
    margin-bottom: 30px;
  }

  .base-box {
    height: 48px;
    padding: 0 15px;
    background: #f5f5f5;
    border-bottom: 1px solid #e5e5e5;

    .date {
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }

    .order-code {
      flex: 2;
      text-align: left;
      padding-left: 20px;

      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;

      span {
        color: #333333;
      }
    }

    .order-state {
      padding: 3px 6px;
      // border: 1px solid #ccc;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #999999;
      color: #F74747;

      // 待付款
      &.state--5 {
        // background: #ff4c29;
        // border-color: #ff4c29;
        // color: #fff;
      }

      &.state-2 {
        color: #F74747;
        border-color: #F74747;
      }
    }
  }

  .product-box {
    .product-list {
      .product-item {
        padding: 20px;
        border-bottom: 1px dashed #ccc;

        font-family: OPPOSans, OPPOSans;
        font-weight: 400;
        font-size: 14px;
        color: #333333;

        &:last-child {
          border: none;
        }

        .box-image {
          width: 100px;
          height: 100px;
          cursor: pointer;
          border: 1px solid #f5f5f5;

          /deep/ img {
            width: 100px;
            height: 100px;
            object-fit: contain;
            object-fit: cover;
          }

          img {
            width: 100px;
            height: 100px;
            object-fit: contain;
            object-fit: cover;
          }
        }

        .box-title {
          flex: 1;
          text-align: left;
          padding-left: 40px;

          .product-title {
            width: fit-content;
            cursor: pointer;

            &:hover {
              color: #F74747;
            }
          }

          .product-sku {
            margin-top: 20px;
            min-width: 200px;
            color: #777;
          }
        }

        .box-sku {
          text-align: center;
          min-width: 200px;
        }

        .box-num {
          text-align: center;
          min-width: 150px;
        }

        .box-price {
          text-align: center;
          min-width: 150px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #777;
        }
        .box-subtotal {
          text-align: center;
          min-width: 150px;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #777;
        }
        .box-refund {
          .refund-act {
            text-align: center;
            min-width: 150px;

            font-family: OPPOSans, OPPOSans;
            font-weight: 400;
            font-size: 14px;
            color: #ff0000;
          }
        }
      }
    }
  }

  .info-heji {
    padding: 15px;
    border-top: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .heji {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-family: sans-serif;
      font-weight: 400;
      color: #333333;

      .heji-num {
        margin-right: 30px;

        b {
          color: #F74747;
        }
      }

      .heji-money {
        b {
          color: #F74747;
        }
      }
    }

    .btn-actions {
      button {
        transition: 0.3s;
        min-width: 120px;
        height: 32px;
        background: #ffffff;
        border-radius: 50px 50px 50px 50px;
        border-radius: 4px;
        border: 1px solid #F74747;
        font-family: Arial, Arial;
        font-weight: 400;
        font-size: 14px;
        color: #F74747;

        & + button {
          margin-left: 20px;
        }

        &:hover {
          opacity: 0.7;
        }

        &.btn-bg {
          background: #F74747;
          color: #ffffff;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/shop/order-list.less"></style>

<style scoped lang="less" src="@/assets/h5css/shop/orderList.less"></style>
