<template>
  <div class="page">
    <div class="main-title flex">
      <span>Sales Performance</span>
    </div>

    <div class="page_box">
      <div class="page_btns">
        <div class="btns" @click="handle_sqtx">
          <img src="../../assets/img/sales/sq.png" alt />
          WITHDRAW COMMISSION
        </div>
      </div>
      <div class="page_top">
        <div class="lefts">
          <div class="left_box">
            <div class="left_num">US${{ formatPrice(price_z) }}</div>
            <div class="left_text">Total Sales Amount</div>
          </div>
          <div class="left_box">
            <div class="left_num">US${{ formatPrice(price_tc) }}</div>
            <div class="left_text">Total commission amount</div>
          </div>
          <div class="left_box">
            <div class="left_num">US${{ formatPrice(commission) }}</div>
            <div class="left_text">Current Commission Balance</div>
          </div>
          <div class="left_box">
            <div class="left_num">{{ order_num }}</div>
            <div class="left_text">Total Order Quantity</div>
          </div>
        </div>
        <div class="rights">
          <div class="right_text" @click="handle_yjxy">Commission Rules and Operating Instructions</div>
        </div>
      </div>
      <div class="page_bom">
        <div class="transaction-list">
          <div class="transaction-item" v-for="(item,index) in lists" :key="index">
            <div class="transaction-time">{{ formatDateTime(item.orderTime) }}</div>
            <div class="transaction-content">
              <div class="transaction-row">
                <span class="transaction-label">Customer Name:</span>
                <span class="transaction-value">{{ item.nickname }}</span>
              </div>
              <div class="transaction-row">
                <span class="transaction-label">Transaction Time:</span>
                <span class="transaction-value">{{ item.orderTime }}</span>
              </div>
              <div class="transaction-row">
                <span class="transaction-label">Transaction Amount:</span>
                <span class="transaction-value">US${{ formatPrice(item.orderPrice) }}</span>
              </div>
              <div class="transaction-row">
                <span class="transaction-label">Commission Amount:</span>
                <span class="transaction-value">US${{ formatPrice(item.commissionPrice) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="page_pages" v-if="total != 0">
        <el-pagination
          @size-change="handleSizeChange"
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pages.page"
          :page-size="pages.pageNum"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      title="WITHDRAW COMMISSION"
      :visible.sync="sqtx_show"
      width="920px"
      :before-close="handleClose"
      custom-class="withdraw-dialog"
    >
      <div class="dia_box">
        <!-- 提现金额部分 -->
        <div class="form_flex">
          <div class="title">Withdraw Amount :</div>
          <div class="inputs">
            <input
              type="number"
              class="input_input"
              v-model.number="tx_price"
              placeholder="Please enter"
              @blur="handle_blur"
            />
            <div class="info_text">
              <div class="info_item">Transaction Fee: US${{ formatPrice(sxf) }}</div>
              <div class="info_item">Withdrawable Amount: US${{ formatPrice(commission) }}</div>
            </div>
          </div>
        </div>

        <!-- 个人信息部分 -->
        <div class="form_flex">
          <div class="title">Name :</div>
          <div class="inputs">
            <input type="text" class="input_input" v-model="realName" placeholder="Please enter" />
          </div>
        </div>
        <div class="form_flex">
          <div class="title">ID :</div>
          <div class="inputs">
            <input type="text" class="input_input" v-model="identityId" placeholder="Please enter" />
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex_btn">
          <div class="btns" @click="handle_tx_end">SUBMIT</div>
        </div>

        <!-- 说明文字 -->
        <div class="btn_text">
          <div>We will arrange the payment to you immediately upon the withdrawal approved.</div>
          <div>Your commission balance will be automatically updated after the payment processed. Please check your commission balance in time.</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "sales-performance",
  data() {
    return {
      price_z: 0,
      price_tc: 0,
      order_num: 0,
      lists: [],
      total: 0,
      pages: {
        page: 1,
        pageNum: 10
      },
      sqtx_show: false,
      commission: 0,
      tixianBili: 0,
      tx_price: 0,
      realName: "",
      identityId: ""
    };
  },
  computed: {
    sxf() {
      let price = 0;
      if (this.tx_price && this.tixianBili) {
        price = (Number(this.tx_price) * Number(this.tixianBili)).toFixed(2);
      }

      return price;
    }
  },
  created() {
    this.get_lists();
    this.get_user();
    this.get_setting();
  },
  methods: {
    formatPrice(price) {
      if (!price) return "0.00";
      return Number(price).toFixed(2);
    },
    formatDateTime(dateTime) {
      if (!dateTime) return "";
      // 如果已经包含时间部分（有冒号），直接返回
      if (dateTime.includes(":")) {
        return dateTime;
      }
      // 如果只有日期，添加默认时间
      return dateTime + " 00:00:00";
    },
    handle_yjxy() {
      this.$router.push({
        path: "/terms",
        query: {
          id: "144"
        }
      });
    },
    handle_blur() {
      if (this.tx_price > this.commission) {
        this.tx_price = this.commission;
      } else if (this.tx_price < 0) {
        this.tx_price = 0;
      }
    },
    handle_tx_end() {
      if (this.tx_price == 0) {
        this.$message.error("Withdrawal amount cannot be 0");
        return;
      }
      if (!this.realName) {
        this.$message.error("Please enter your name");
        return;
      }
      if (!this.identityId) {
        this.$message.error("Please enter your ID number");
        return;
      }

      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "commission_tixian",
          money: this.tx_price,
          realName: this.realName,
          identityId: this.identityId,
          type: "0"
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: "Application successful",
            type: "success"
          });
          this.sqtx_show = false;
          this.tx_price = 0;
          this.realName = "";
          this.identityId = "";
          this.get_user();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSizeChange(e) {},
    handleCurrentChange(e) {
      this.pages.page = e;
      this.get_lists();
    },
    get_lists() {
      // 这里应该调用API获取销售数据
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userPerformance",
          ...this.pages
        }
      }).then(res => {
        if (res.code == 200) {
          console.log("列表", res);
          this.price_tc = res.data.totalCommissionPrice;
          this.price_z = res.data.totalOrderPrice;
          this.order_num = res.data.totalCount;
          this.lists = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    handle_sqtx() {
      this.sqtx_show = true;
    },
    handleClose() {
      this.sqtx_show = false;
    },
    get_user() {
      //
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo"
        }
      }).then(res => {
        if (res.code == 200) {
          console.log("用户", res);
          this.commission = res.data.commission;
        }
      });
    },
    get_setting() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_config"
        }
      }).then(res => {
        if (res.code == 200) {
          console.log("用户", res);
          this.tixianBili = res.data.tixianBili;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 70px;
    background: #fff;
    line-height: 70px;
    font-size: 20px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    color: #1e262e;

    img {
      width: 22px;
      margin-right: 10px;
    }
  }
  .page_box {
    width: 100%;
    height: 826px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    margin-top: 12px;
    padding: 32px;
    .page_btns {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .btns {
        width: 393px;
        height: 80px;
        background: #ec6a2b;
        border-radius: 10px 10px 10px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #ffffff;
        font-weight: bold;
        cursor: pointer;
        gap: 14px;
        img {
          width: 20px;
        }
      }
    }
    .page_top {
      width: 100%;
      height: 238px;
      background: #00306b;
      margin-top: 32px;
      padding: 18px 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .lefts {
        display: flex;
        align-items: flex-start;
        gap: 60px;
        margin-top: 20px;

        .left_box {
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
          border-right: 1px solid #ffffff;

          &:last-child {
            border: none;
          }

          .left_num {
            font-weight: bold;
            font-size: 32px;
            color: #ffffff;
            line-height: 1.2;
          }

          .left_text {
            font-weight: 400;
            font-size: 14px;
            color: #ffffff;
            line-height: 1.4;
          }
        }
      }

      .rights {
        width: 100%;
        display: flex;
        justify-content: flex-end;

        .right_text {
          font-weight: 400;
          font-size: 14px;
          color: #ffffff;
          cursor: pointer;
          text-decoration: underline;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    .page_bom {
      margin-top: 28px;
      background: #ffffff;

      .transaction-list {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .transaction-item {
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          padding: 20px 24px;

          .transaction-time {
            font-size: 14px;
            color: #666666;
            margin-bottom: 16px;
            font-weight: 400;
          }

          .transaction-content {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .transaction-row {
              display: flex;
              align-items: flex-start;

              .transaction-label {
                font-size: 14px;
                color: #999999;
                min-width: 180px;
                margin-right: 12px;
              }

              .transaction-value {
                font-size: 14px;
                color: #1f1f1f;
                flex: 1;
                word-break: break-all;
              }
            }
          }
        }
      }
    }
    .page_pages {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 20px;
    }
  }
  .dia_box {
    padding: 0;

    .form_flex {
      display: flex;
      align-items: flex-start;
      margin-bottom: 24px;

      .title {
        font-weight: 400;
        font-size: 20px;
        color: #666666;
        width: 190px;
        text-align: right;
        line-height: 56px;
        margin-right: 15px;
      }

      .inputs {
        .input_input {
          width: 580px;
          height: 56px;
          background: #ffffff;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          padding: 0 16px;
          font-size: 20px;
          color: #1f1f1f;

          &::placeholder {
            color: #999999;
            font-size: 20px;
          }

          &:focus {
            outline: none;
            border-color: #c0c0c0;
          }
        }

        .info_text {
          margin-top: 16px;

          .info_item {
            font-size: 18px;
            color: #5e5e5e;
            margin-bottom: 8px;
            line-height: 1.6;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }

    .flex_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 40px;

      .btns {
        cursor: pointer;
        width: 200px;
        height: 48px;
        background: #f27b3f;
        border-radius: 4px;
        font-weight: bold;
        font-size: 16px;
        color: #ffffff;
        text-align: center;
        line-height: 48px;
        border: none;
        transition: background 0.3s;

        &:hover {
          background: #e06a2e;
        }
      }
    }

    .btn_text {
      text-align: center;
      font-weight: 400;
      font-size: 18px;
      color: #5e5e5e;
      margin-top: 32px;
      line-height: 25px;

      div {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 提现弹框样式
/deep/ .withdraw-dialog {
  .el-dialog__header {
    .el-dialog__title {
      font-size: 24px;
      color: #1e262e;
      font-weight: bold;
    }

    .el-dialog__title {
      font-size: 20px;
      color: #1e262e;
      font-weight: 400;
    }
  }

  .el-dialog__body {
    padding: 40px 60px;
    background: #ffffff;
  }

  .el-dialog {
    background: #ffffff;
  }
}
</style>










