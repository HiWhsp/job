<script>
export default {
  name: "index",
  data() {
    return {
      tabIndex: 1,
      queryParams: {}, // 查询参数
      list_order: [{}], // 订单
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
          value: 1,
          label: "待审核结果"
        }, {
          value: 1,
          label: "已完成"
        }, {
          value: 1,
          label: "复测"
        }, {
          value: 1,
          label: "待结算"
        }, {
          value: 1,
          label: "样品回收"
        }, {
          value: 1,
          label: "差评/异议"
        }, {
          value: 1,
          label: "超期/即将超期"
        }
      ], // 订单状态
      updateResultVisible: false,
      count: 1,
      pagination: {
        page: 1,
        pageNum: 10
      },
      realRules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    setView() {

    },
    handleQuery() {

    },
    resetQuery() {

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
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="100px">
          <el-form-item label="测试项目" prop="phone">
            <el-select v-model="queryParams.orderUrl" placeholder="请选择测试项目">
              <el-option
                  v-for="item in payList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态" prop="goodsName">
            <el-select v-model="queryParams.orderUrl" placeholder="请选择报告审核状态">
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
                end-placeholder="结束日期">
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
          <el-table-column prop="date" label="订单号"></el-table-column>
          <el-table-column prop="date" label="项目名称"></el-table-column>
          <el-table-column prop="date" label="金额"></el-table-column>
          <el-table-column prop="date" label="样品数"></el-table-column>
          <el-table-column prop="date" label="对接人"></el-table-column>
          <el-table-column prop="date" label="回收"></el-table-column>
          <el-table-column prop="date" label="订单状态"></el-table-column>
          <el-table-column prop="date" label="样品状态"></el-table-column>
          <el-table-column prop="date" label="报告审核状态"></el-table-column>
          <el-table-column prop="date" label="寄样时间"></el-table-column>
          <el-table-column prop="date" label="完成时间"></el-table-column>
          <el-table-column label="操作" fixed="right" width="220">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="goUrl('/supplier-order-detail')">详情</el-button>
              <el-button type="text" size="mini" @click="updateResultVisible = true">查看报告</el-button>
              <el-button type="text" size="mini" @click="goUrl('/supplier-order-detail')">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="count" class="pagination-box"
           style="margin-top: 40px; text-align: center;">
        <el-pagination background layout="total, prev, pager, next" @current-change="setView"
                       :current-page.sync="pagination.page" :page-size="pagination.pageNum"
                       :total="count"></el-pagination>
      </div>
    </div>

    <el-dialog title="查看报告" :visible.sync="updateResultVisible">
      <div class="updateResult">
        <div class="title">
          <p>订单号：4545121232</p>
          <p>项目名称：氧氮氢分析仪</p>
        </div>
        <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture">
          <div class="upload-tit">点击上传报告 +</div>
        </el-upload>
        <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture">
          <div class="upload-tit">点击上传仪器测试结果 +</div>
        </el-upload>
      </div>
    </el-dialog>
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
