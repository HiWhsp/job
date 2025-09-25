<template>
  <div class="my-orders">
    <div class="order-content">
      <el-table
        :data="orderList"
        :empty-text="'暂无订单数据'"
        v-loading="loading"
        height="400"
      >
        <el-table-column prop="orderNo" label="订单编号" align="center">
        </el-table-column>

        <el-table-column
          prop="title"
          label="订单名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column prop="payPrice" label="订单金额" align="center">
          <template slot-scope="scope">
            <span class="order-amount">¥{{ scope.row.payPrice }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="下单时间" align="center">
          <template slot-scope="scope">
            <span class="order-time">{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="downloadStatus" label="下载状态" align="center">
          <template slot-scope="scope">
            <span class="order-time">{{
              scope.row.had_download ? "已下载" : "未下载"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="downloadStatus" label="" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleDownload(scope.row)"
              >立即下载</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="totalOrders"
          background
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyOrders",
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalOrders: 0,
      orderList: [],
    };
  },
  methods: {
    // 处理下载
    handleDownload(order) {
      // 设置下载状态
      this.$set(order, "downloading", true);
      this.$api({
        url: "contractReal",
        method: "post",
        data: {
          articleId: order.articleId,
        },
      }).then((res) => {
        if(res.code == 200) {
          window.open(res.data.doc_url, "_blank");
          this.$api({
            url: "cofirmDownload",
            method: "post",
            data: {
              articleId: order.articleId,
            },
          })
          this.loadData();
        }else {
          this.$message.error(res.msg);
          this.loadData();
        }
      })
    },

    // 每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1; // 重置到第一页
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    // 模拟加载数据
    loadData() {
      this.loading = true;
      this.$api({
        url: "getMyOrder",
        method: "get",
        data: {
          page: this.currentPage,
          pageSize: this.pageSize,
        },
      }).then((res) => {
        this.orderList = res.data.list;
        this.totalOrders = res.data.count;
      });
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.my-orders {

  .page-header {
    background: #fff;
    padding: 20px;
    border-bottom: 1px solid #e8e8e8;

    h2 {
      color: #333;
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }
  }

  .order-content {
    /deep/ .el-table {
      .el-table__header {
        .has-gutter {
          th.el-table__cell {
            background: #eaedf5;
            color: #363130;
            font-weight: 500;
          }
        }
      }
    }

    /deep/ .el-button--primary {
      width: 88px;
      height: 30px;
      background: #ffffff;
      border: 1px solid #4e57d9;
      color: #4e57d9;
      font-size: 14px;
    }

    // 分页容器样式
    .pagination-container {
      margin-top: 50px;
      display: flex;
      justify-content: center;

      /deep/ .el-pagination {
        .el-pagination__total {
          color: #666;
          font-size: 14px;
        }

        .el-pagination__sizes {
          .el-select .el-input {
            width: 110px;
          }
        }

        .el-pager li {
          color: #666;

          &.active {
            color: #409eff;
            font-weight: 500;
          }
        }

        .btn-prev,
        .btn-next {
          color: #666;

          &:hover {
            color: #409eff;
          }
        }

        .el-pagination__jump {
          color: #666;

          .el-input__inner {
            color: #666;
          }
        }
      }
    }
  }
}

// 加载状态样式优化
/deep/ .el-loading-mask {
  background-color: rgba(255, 255, 255, 0.8);
}

// 消息提示样式
/deep/ .el-message {
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
