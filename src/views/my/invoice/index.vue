<script>
export default {
  name: "index",
  data() {
    return {
      selectTab: {title: "全部明细", status: "0"},
      list_tab: [
        {title: "全部明细", status: "0"},
        {title: "支付记录", status: "1"},
        {title: "充值记录", status: "2"},
      ],

      list_jilu: [{}],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 1,
      requestVisible: false
    }
  },
  methods: {
    onDetail() {
      this.$router.push("/invoiceDetail");
    },
    // 获取数据
    onRequest() {
      this.$router.push("/invoiceApply");
      // this.requestVisible = true
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="section-title">
      <div class="label">订单发票</div>
    </div>
    <div class="invoice-container">
      <div class="card">
        <p class="title">可索取发票金额</p>
        <div class="info"><span class="money">￥0</span></div>
        <div class="btn back" @click="onRequest">索取发票</div>
      </div>
      <div class="card">
        <p class="title">默认发票信息</p>
        <div class="info">
          <p>发票抬头：</p>
          <p>企业税号：</p>
        </div>
        <div class="btn">管理发票信息</div>
      </div>
      <div class="card">
        <p class="title">默认电子邮箱</p>
        <div class="info">
          <p>邮箱：</p>
        </div>
        <div class="btn">管理电子邮箱</div>
      </div>
      <div class="card">
        <p class="title">默认收件地址</p>
        <div class="info">
          <p>上海市辖区黄浦区4545645645号</p>
        </div>
        <div class="btn">管理收件地址</div>
      </div>
    </div>

    <div class="inner">
      <div class="tab-box">
        <div
            class="tab-item"
            v-for="(item, index) in list_tab"
            :key="index"
            @click="selectTab = item"
            :class="item.title == selectTab.title ? 'active' : ''"
        >
          {{ item.title }}
        </div>
      </div>

      <div class="bottom-info">
        <div class="list-wrap" v-if="count">
          <div class="jilu-list">
            <div class="item item-title">
              <div class="item-1">订单号</div>
              <div class="item-2">申请时间</div>
              <div class="item-3">发票抬头</div>
              <div class="item-4">发票金额</div>
              <div class="item-5">发票类型</div>
              <div class="item-6">发票状态</div>
              <div class="item-7">是否回款</div>
              <div class="item-8">操作</div>
            </div>

            <div class="item-box" v-for="(item, index) in list_jilu" :key="index">
              <div class="item item_other">
                <div class="item-1">454566456456478</div>
                <div class="item-2">2023-04-18</div>
                <div class="item-3 ellipsis-1">嘉析检测技术服务（厦门）有限公司</div>
                <div class="item-4">200.00</div>
                <div class="item-5">普通发票</div>
                <div class="item-6">
                  <span class="state-1">已开票</span>
                </div>
                <div class="item-7">是</div>
                <div class="item-8">
                  <span @click="onDetail">发票详情</span>
                  <span>下载</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pagination-box" v-if="count">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :total="count"
                :current-page="pagination.page"
                :page-size="pagination.pageNum"
                @current-change="changePage"
            >
            </el-pagination>
          </div>
        </div>
        <el-empty v-else description="暂无记录..."></el-empty>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="requestVisible" width="30%">
      <span>可索取发票金额为0，暂不可索取发票</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="requestVisible = false">我知道了</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 0 100px;
  background-color: #fff;

  .section-title {
    border-bottom: 1px solid #dedede;
    .flex-between();
    height: 56px;
    padding: 0 32px;

    .label {
      font-size: 18px;
      font-weight: 400;
      color: #333333;
    }
  }

  .invoice-container {
    height: 205px;
    margin: 32px;
    background: #F2F7FE;
    display: flex;

    .card {
      padding-left: 25px;
      padding-right: 120px;
      margin: 20px 0 30px;
      border-right: 1px dashed #BCBCBC;
      display: flex;
      flex-direction: column;

      &:last-child {
        border-right: none;
        padding-right: 0;
      }

      .title {
        font-weight: 400;
        font-size: 18px;
        color: #212529;
      }

      .info {
        flex: 1;
        margin-top: 24px;

        p {
          font-weight: 400;
          font-size: 14px;
          color: #818181;
        }

        .money {
          font-weight: 400;
          font-size: 24px;
          color: #333333;
        }
      }

      .btn {
        cursor: pointer;
        width: 133px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 3px;
        border: 1px solid #00479D;
        font-weight: 400;
        font-size: 14px;
        color: #00479D;
      }

      .back {
        background-color: #00479D;
        color: #fff;
      }
    }
  }

  .inner {
    padding: 0 30px;

    .tab-box {
      margin-top: 24px;
      flex: 2;
      // border-bottom: 1px solid #eee;

      .flex();

      .tab-item {
        cursor: pointer;
        padding-bottom: 10px;
        border-bottom: 3px solid transparent;
        margin-right: 55px;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333333;

        &.active {
          border-bottom: 3px solid @theme;
          font-weight: bold;
          color: @theme;
        }
      }
    }

    .bottom-info {
      margin-top: 20px;
      margin-bottom: 50px;
    }

    .jilu-list {
      margin-bottom: 30px;
      border: 1px solid #e5e5e5;

      .item {
        text-align: left;
        .flex-between();
        padding: 20px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        font-weight: 400;
        color: #5B5B5B;

        &.item-title {
          background: #f5f5f5;
          border-bottom: 1px solid #e5e5e5;
          font-size: 14px;
          font-weight: bold;
          color: #666666;
        }

        &-1 {
          width: 125px;
        }

        &-2 {
          width: 90px;
        }

        &-3 {
          width: 220px;
        }

        &-4 {
          width: 60px;
        }

        &-5 {
          width: 60px;
        }

        &-6 {
          width: 60px;

          .state-1 {
            color: #00A527;
          }
        }

        &-7 {
          width: 60px;
        }

        &-8 {
          width: 110px;

          span {
            cursor: pointer;
            color: #00479D;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>