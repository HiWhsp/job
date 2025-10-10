<template>
  <div class="my-orders">
    <div class="order-content">
      <el-table
        :data="orderList"
        :empty-text="'暂无下载数据'"
        v-loading="loading"
        height="400"
      >
        <el-table-column
          prop="name"
          label=""
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="">
            <img
              style="width: 40px; height: 40px"
              src="../../assets/img/common/word.png"
              alt=""
            />
          </template>
        </el-table-column>

        <el-table-column prop="title" label="合同名称" align="center">
          <template slot-scope="scope">
            <span class="order-amount">{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="下载时间" align="center">
          <template slot-scope="scope">
            <span class="order-time">{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="downloadStatus" label="文档大小" align="center">
          <template slot-scope="scope">
            <span class="order-time">{{ scope.row.size || 0 + "MB" }}</span>
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
  name: "down",
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      orderList: [
        {
          id: 1,
          orderNumber: "123456789",
          name: "写字楼办公室房屋租赁合同范本",
          amount: "10.00",
          orderTime: "2025-08-08 17:59:38",
          downloadStatus: "downloaded",
          downloading: false,
        },
        {
          id: 2,
          orderNumber: "123456790",
          name: "写字楼办公室房屋租赁合同范本",
          amount: "10.00",
          orderTime: "2025-08-08 17:59:38",
          downloadStatus: "not_downloaded",
          downloading: false,
        },
        {
          id: 3,
          orderNumber: "123456791",
          name: "写字楼办公室房屋租赁合同范本",
          amount: "10.00",
          orderTime: "2025-08-08 17:59:38",
          downloadStatus: "downloaded",
          downloading: false,
        },
        {
          id: 4,
          orderNumber: "123456792",
          name: "商铺租赁合同模板",
          amount: "15.00",
          orderTime: "2025-08-07 14:30:25",
          downloadStatus: "not_downloaded",
          downloading: false,
        },
        {
          id: 5,
          orderNumber: "123456793",
          name: "房屋买卖合同范本",
          amount: "20.00",
          orderTime: "2025-08-07 10:15:42",
          downloadStatus: "downloaded",
          downloading: false,
        },
        {
          id: 6,
          orderNumber: "123456794",
          name: "劳动合同模板",
          amount: "8.00",
          orderTime: "2025-08-06 16:45:18",
          downloadStatus: "not_downloaded",
          downloading: false,
        },
        {
          id: 7,
          orderNumber: "123456795",
          name: "借款合同范本",
          amount: "12.00",
          orderTime: "2025-08-06 09:20:33",
          downloadStatus: "downloaded",
          downloading: false,
        },
        {
          id: 8,
          orderNumber: "123456796",
          name: "服务合同模板",
          amount: "18.00",
          orderTime: "2025-08-05 20:10:55",
          downloadStatus: "not_downloaded",
          downloading: false,
        },
        {
          id: 9,
          orderNumber: "123456797",
          name: "技术开发合同范本",
          amount: "25.00",
          orderTime: "2025-08-05 15:30:12",
          downloadStatus: "downloaded",
          downloading: false,
        },
        {
          id: 10,
          orderNumber: "123456798",
          name: "保密协议模板",
          amount: "6.00",
          orderTime: "2025-08-04 11:25:40",
          downloadStatus: "not_downloaded",
          downloading: false,
        },
        {
          id: 11,
          orderNumber: "123456799",
          name: "股权转让协议范本",
          amount: "30.00",
          orderTime: "2025-08-04 08:45:22",
          downloadStatus: "downloaded",
          downloading: false,
        },
        {
          id: 12,
          orderNumber: "123456800",
          name: "合伙协议模板",
          amount: "22.00",
          orderTime: "2025-08-03 19:15:18",
          downloadStatus: "not_downloaded",
          downloading: false,
        },
      ],
      totalOrders: 0,
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
        if (res.code == 200) {
          window.open(res.data.doc_url, "_blank");
          this.loadData();
        } else {
          this.$message.error(res.msg);
          this.loadData();
        }
      });
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
        url: "getMyDownload",
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
