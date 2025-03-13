<script>
export default {
  name: "index",
  data() {
    return {
      tabIndex: 1,
      queryParams: {}, // 查询参数
      list_order: [], // 订单
      payList: [], // 测试项目
      isRePay: [
        {
          value: '',
          label: "全部"
        }, {
          value: 1,
          label: "已分派"
        }, {
          value: 2,
          label: "运输中"
        }, {
          value: 3,
          label: "待上传结果"
        }, {
          value: 4,
          label: "待审核结果"
        }, {
          value: 5,
          label: "已完成"
        }, {
          value: 6,
          label: "复测"
        }, {
          value: 7,
          label: "待结算"
        }, {
          value: 8,
          label: "样品回收"
        }, {
          value: 9,
          label: "差评/异议"
        }, {
          value: 10,
          label: "超期/即将超期"
        }
      ], // 订单状态
      updateResultVisible: false,
      count: 0,
      pagination: {
        page: 1,
        pageNum: 10
      }
    }
  },
  computed: {
    isRePayFilter() {
      return function (status) {
        return this.isRePay.find(item => item.value === status)
      }
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'store/order_list',
        method: 'post',
        data: {
          status: 11,
          ...this.queryParams
        }
      }).then(res => {
        if (res.code === 200) {
          this.list_order = res.data;
          this.count = res.count;
        }
      })
    },
    // 查看报告
    lock(id) {
      this.$api({
        url: 'store/order_detail',
        method: 'post',
        data: {
          orderId: id
        }
      }).then(res => {
        this.updateResultVisible = true
      })
    },
    handleQuery() {
      this.pagination.page = 1;
      if (this.queryParams.date) {
        this.queryParams.start_time = this.queryParams.date[0]
        this.queryParams.end_time = this.queryParams.date[1]
      } else {
        this.queryParams.start_time = ''
        this.queryParams.end_time = ''
      }
      this.setView();
    },
    resetQuery() {
      this.pagination.page = 1
      this.queryParams = {}
      this.handleQuery()
    },
    goUrl(url) {
      this.$router.push(url);
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="section-order">
      <div class="section-title">
        <div class="label">
          <div class="label-item pointer">
            报告管理
          </div>
        </div>
        <div class="search">
          <el-input placeholder="请输入仪器名/订单号">
            <template slot="append">搜索</template>
          </el-input>
        </div>
      </div>

      <div class="search-filter">
        <el-form ref="queryForm" :inline="true" :model="queryParams" label-width="100px" size="small">
          <el-form-item label="项目名称" prop="phone">
            <el-input v-model="queryParams.title" placeholder="请输入项目名称"></el-input>
<!--            <el-select v-model="queryParams.orderUrl" placeholder="请选择测试项目">-->
<!--              <el-option-->
<!--                  v-for="item in payList"-->
<!--                  :key="item.value"-->
<!--                  :label="item.label"-->
<!--                  :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
          </el-form-item>
          <el-form-item label="审核状态" prop="goodsName">
            <el-select v-model="queryParams.yp_status" placeholder="请选择报告审核状态">
              <el-option
                  v-for="item in isRePay"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期筛选" prop="goodsName">
            <el-date-picker
                v-model="queryParams.date"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="datetimerange">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleQuery">搜索</el-button>
            <el-button size="mini" type="primary" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="order-box">
        <el-table :data="list_order" style="width: 100%">
          <el-table-column label="订单号" prop="orderId"></el-table-column>
          <el-table-column label="项目名称" prop="title" width="220px">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.title : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="金额" prop="price">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.price : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="样品数" prop="price">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.yp_num : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="对接人" prop="contact_user"></el-table-column>
          <el-table-column label="回收" prop="if_recover">
            <template slot-scope="scope">
              <p v-if="scope.row.if_recover == 1">是</p>
              <p v-else>否</p>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" prop="date">
            <template slot-scope="scope">
              <p>{{ getStatus(scope.row.status) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="样品状态" prop="yp_status">
            <template slot-scope="scope">
              <p>{{ getYpStatus(scope.row.yp_status) || '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="报告审核状态" prop="yp_status">
            <template slot-scope="scope">
              <p>{{ isRePayFilter(scope.row.status).label || '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="寄样时间" prop="yp_at"></el-table-column>
          <el-table-column label="完成时间" prop="complate_at"></el-table-column>
          <el-table-column fixed="right" label="操作" width="220">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="goUrl(`/supplier-order-detail?orderId=${scope.row.id}`)">详情</el-button>
              <el-button size="mini" type="text" @click="lock(scope.row.id)">查看报告</el-button>
<!--              <el-button size="mini" type="text" @click="goUrl('/supplier-order-detail')">修改</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="count" class="pagination-box"
           style="margin-top: 40px; text-align: center;">
        <el-pagination :current-page.sync="pagination.page" :page-size="pagination.pageNum" :total="count"
                       background layout="total, prev, pager, next"
                       @current-change="setView"></el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="updateResultVisible" title="查看报告">
      <div class="updateResult">
        <p class="tip">
          <span class="red">驳回原因：</span>
          <span>这里是一段驳回原因</span>
        </p>
        <div class="title">
          <p>订单号：4545121232</p>
          <p>项目名称：氧氮氢分析仪</p>
        </div>
        <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            class="upload-demo"
            list-type="picture">
          <div class="upload-tit">点击上传报告 +</div>
        </el-upload>
        <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            class="upload-demo"
            list-type="picture">
          <div class="upload-tit">点击上传仪器测试结果 +</div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.content {
  background: #fff;
  padding-bottom: 100px;
}

.section-order {
  width: 100%;

  .section-title {
    padding: 0 10px;
    border-bottom: 1px solid #dedede;
    .flex-between();
    height: 56px;
    padding-right: 32px;

    .label {
      font-size: 18px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #333333;
      display: flex;

      .label-item {
        position: relative;
        padding: 0 18px;
        margin-right: 18px;
        font-size: 16px;
        color: #333333;

        span {
          margin-left: 5px;
          color: #3399FF;
        }

        &.active {
          &:after {
            content: '';
            display: inline-block;
            width: 100%;
            height: 2px;
            background: #3399FF;
            position: absolute;
            bottom: -17px;
            left: 0;
          }
        }
      }
    }

    .search {
      width: 250px;

      .el-input {
        border: 1px solid #00479D;
      }

      /deep/ .el-input__inner {
        border-radius: 0;
        border: none;
      }

      /deep/ .el-input-group__append {
        cursor: pointer;
        background: #00479D;
        color: #fff;
        border-radius: 0;
        border: none;
      }
    }
  }

  .search-filter {
    padding: 25px 10px 0;

    .el-button {
      border: 1px solid #00479D;
      color: #00479D;
    }

    .el-button--primary {
      background-color: #00479D;
      color: #fff;
    }

    .interval {
      .el-input {
        width: 90px;
      }

      span {
        margin: 0 10px;
      }
    }
  }

  .order-box {
    margin-top: 50px;
    padding: 0 40px;

    /deep/ .el-table th.el-table__cell {
      background: #EAECEE;;
      color: #333333;
    }
  }
}

.updateResult {
  padding: 0 250px 0 70px;

  .tip {
    margin-bottom: 20px;

    font-weight: 400;
    font-size: 14px;
    color: #333333;

    .red {
      color: #FF0000;
    }
  }

  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .upload-demo {
    margin-bottom: 20px;
  }

  .upload-tit {
    font-weight: 400;
    font-size: 14px;
    color: #00479D;
  }
}
</style>
