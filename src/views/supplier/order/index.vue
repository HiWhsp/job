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
          value: '0',
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
      // isRePay: [
      //   {
      //     value: '',
      //     label: "全部"
      //   }, {
      //     value: 10,
      //     label: "待支付"
      //   }, {
      //     value: 20,
      //     label: "待实验"
      //   }, {
      //     value: 30,
      //     label: "实验中"
      //   }, {
      //     value: 40,
      //     label: "已完成"
      //   }, {
      //     value: 50,
      //     label: "售后"
      //   }
      // ], // 订单状态
      keyword: '',
      count: 0,
      pagination: {
        page: 1,
        limit: 10
      }
    }
  },
  mounted() {
    this.setView();
  },
  computed: {
    // 订单状态
    getStatus() {
      return function (status) {
        switch (status) {
          case 10:
            return '待支付';
          case 20:
            return '待实验';
          case 30:
            return '实验中';
          case 40:
            return '已完成';
          case 50:
            return '售后';
        }
      }
    },
    // 样品状态 1待寄送 2待接收 3 已接收 4待回收
    getYpStatus() {
      return function (status) {
        switch (status) {
          case 1:
            return '待寄送';
          case 2:
            return '待接收';
          case 3:
            return '已接收';
          case 4:
            return '待回收';
        }
      }
    }
  },
  methods: {
    setView() {
      this.$api({
        url: 'store/order_list',
        method: 'post',
        data: {
          keyword: this.keyword,
          status: this.queryParams.status || 0,
          start_time: this.queryParams.start_time,
          end_time: this.queryParams.end_time,
          orderId: this.queryParams.orderId,
          title: this.queryParams.title,
          ...this.pagination,
        }
      }).then(res => {
        if (res.code == 200) {
          this.list_order = res.data;
          this.count = res.count;
        }
      })
    },
    handleQuery() {
      this.pagination.page = 1
      if (this.queryParams.date) {
        this.queryParams.start_time = this.queryParams.date[0]
        this.queryParams.end_time = this.queryParams.date[1]
      } else {
        this.queryParams.start_time = ''
        this.queryParams.end_time = ''
      }
      this.setView()
    },
    resetQuery() {
      this.pagination.page = 1
      this.queryParams = {}
      this.setView()
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
            全部订单
          </div>
        </div>
        <div class="search flex">
          <el-input placeholder="请输入仪器名/订单号" v-model="keyword"></el-input>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
        </div>
      </div>

      <div class="search-filter">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="100px">
          <el-form-item label="订单编号" prop="orderId">
            <el-input
                v-model="queryParams.orderId"
                placeholder="请输入订单号"
                clearable
            />
          </el-form-item>
          <el-form-item label="测试项目" prop="title">
            <el-input
                v-model="queryParams.title"
                placeholder="请输入测试项目"
                clearable
            />
            <!--            <el-select v-model="queryParams.title" placeholder="请选择测试项目">-->
            <!--              <el-option-->
            <!--                  v-for="item in payList"-->
            <!--                  :key="item.value"-->
            <!--                  :label="item.label"-->
            <!--                  :value="item.value">-->
            <!--              </el-option>-->
            <!--            </el-select>-->
          </el-form-item>
          <el-form-item label="订单状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择订单状态">
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
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="order-box">
        <el-table :data="list_order" style="width: 100%">
          <el-table-column prop="orderId" label="订单号"></el-table-column>
          <el-table-column prop="title" label="项目名称">
            <template slot-scope="scope">
              <p>{{ scope.row.order.title }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="model_no" label="仪器型号"></el-table-column>
          <el-table-column prop="price" label="金额">
            <template slot-scope="scope">
              <p>{{ scope.row.order.price }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="样品数">
            <template slot-scope="scope">
              <p>{{ scope.row.order.yp_num }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="contact_user" label="对接人"></el-table-column>
          <el-table-column prop="if_recover" label="回收">
            <template slot-scope="scope">
              <p v-if="scope.row.if_recover == 1">是</p>
              <p v-else>否</p>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="订单状态">
            <template slot-scope="scope">
              <p>{{ getStatus(scope.row.status) }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="yp_status" label="样品状态">
            <template slot-scope="scope">
              <p>{{ getYpStatus(scope.row.yp_status) || '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="寄样时间"></el-table-column>
          <el-table-column prop="updated_at" label="完成时间"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="goUrl(`/supplier-order-detail?orderId=${scope.row.id}`)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="count" class="pagination-box"
           style="margin-top: 40px; text-align: center;">
        <el-pagination background layout="total, prev, pager, next" @current-change="setView"
                       :current-page.sync="pagination.page" :page-size.sync="pagination.limit"
                       :total="count"></el-pagination>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
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

      /deep/ .el-button--primary {
        background: #00479D;
        color: #fff;
        border-color: #00479D;
        border-radius: 0;
        height: 42px;
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
</style>
