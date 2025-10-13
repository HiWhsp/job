<template>
  <div class="page">
    <div
      style="position: absolute; top: 0; left: 0; z-index: -100"
      id="tableGen"
    ></div>
    <div class="page-title">子账号管理</div>

    <div class="page-ctx">
      <div class="tab-box">
        <div class="dash-btn" @click="getList()">
          <i class="el-icon-plus"></i>
          添加
        </div>
        <div class="search-box">
          <input
            v-model="keyword"
            type="text"
            placeholder="输入商品名称、订单号"
          />
          <button @click="do_search()">搜索</button>
          <button @click="do_reset()">重置</button>
        </div>
      </div>

      <div class="page-sec">
        <div class="order-list-wrap">
          <el-table :data="orders" style="width: 100%" border>
            <el-table-column prop="id" label="id" width="50" align="center" />
            <el-table-column
              prop="name"
              label="用户名称"
              width="100"
              align="center"
            />
            <el-table-column
              prop="sex"
              label="用户性别"
              width="80"
              align="center"
            />
            <el-table-column
              prop="phone"
              label="部门"
              width="100"
              align="center"
            />
            <el-table-column
              prop="email"
              label="职位"
              width="100"
              align="center"
            />
            <el-table-column
              prop="status"
              label="手机号"
              width="140"
              align="center"
            />
            <el-table-column
              prop="status"
              label="邮箱"
              width="170"
              align="center"
            />
            <el-table-column
              prop="create_time"
              label="备注"
              width="100"
              align="center"
            />
            <el-table-column
              prop="update_time"
              label="状态"
              width="110"
              align="center"
            />
            <el-table-column
              prop="actions"
              label="操作"
              width="150"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  style="color: #f74747"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
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

        <el-empty v-if="!count" description="没有查询到订单信息..."></el-empty>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialog_show"
      width="600px"
      title="填写异议备注信息"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称：" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码：" prop="password">
          <el-input v-model="ruleForm.region"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="department">
          <el-input v-model="ruleForm.region"></el-input>
        </el-form-item>
        <el-form-item label="职位：" prop="position">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model="ruleForm.type"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="ruleForm.resource"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="启用"></el-radio>
            <el-radio label="禁用"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialog_show = false"
            >确定</el-button
          >
          <el-button @click="dialog_show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "servicePage",
  data() {
    return {
      tabSelect: {
        title: "全部",
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
      dialog_show: false,
      ruleForm: {
        name: "",
        password: "",
        department: "",
        position: "",
        phone: "",
        email: "",
        remark: "",
        status: "",
      },
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
        ],
        department: [
          { required: true, message: "请输入部门", trigger: "blur" },
        ],
        position: [{ required: true, message: "请输入职位", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState([""]),
  },
  created() {
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
          action: "orders_lists",
          ...this.pagination,
          scene: this.tabSelect.value,
          // keyword: this.keyword,
        },
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          let list = data.list;

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

    do_toggle_tab(item) {
      this.tabSelect = item;
      this.pagination.page = 1;
      this.query_order();
    },

    //分页
    on_current_change() {
      this.query_order();
    },

    //搜索
    do_search() {
      this.query_order();
    },
    doOfflinePay(item) {
      this.$refs.xianxia.init(item);
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

    toDetail(item) {
      // this.$router.push(`/order-detail?id=${item.id}`);
      this.toRoute({
        path: "/order-detail",
        query: {
          id: item.id,
        },
      });
    },
    doCancel(item) {
      this.$refs.order_cancel_modal.init(item);
    },
    doPay(item) {
      this.$router.push({
        path: "/payment-methods",
        query: {
          id: item.id,
        },
      });
    },
    doDelete(item) {
      this.$refs.order_delete_modal.init(item);
    },
    doReceive(item) {
      this.$refs.order_receive_modal.init(item);
    },
    doReview(item) {},
    doRefund(item) {
      this.toRoute({
        path: "/refund-type",
        query: {
          orderId: item.id,
          inventoryId: item.products[0].productId,
        },
      });
    },
    async getList() {
      this.dialog_show = true;
    },
    handleEdit(row) {
      this.dialog_show = true;
      this.ruleForm = row;
    },
    handleDelete(row) {
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "orders_del",
          order_id: row.id,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .order-list-wrap {
  margin-top: 30px;
}
.dash-btn {
  width: 94px;
  height: 36px;
  background: #e5222b;
  border-radius: 3px;
  color: #fff;
  font-size: 14px;
  font-weight: normal;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    margin-right: 4px;
  }
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
  }

  .page-ctx {
    margin-top: 14px;
    padding: 24px 32px;
    background: #fff;
  }
}

.tab-box {
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
        color: #f74747;
      }

      &.active {
        // background: #F74747;
        // color: #fff;
        font-weight: bold;
        color: #f74747;

        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #f74747;
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
    display: inline-block;
    padding: 2px 4px;
    background: coral;
    color: #fff;
  }
}

.order-list-wrap {
  /deep/ .el-table th.el-table__cell.is-leaf {
    background: #f5f5f5;
  }
}

.demo-ruleForm {
  /deep/ .el-button--primary {
    background: #e5222b;
    border: none;
    border-radius: 4px;
    color: #fff !important;
  }
  /deep/ .el-button {
    border: 1px solid #e5222b;
    border-radius: 4px;
    color: #e5222b;
  }
}
</style>
