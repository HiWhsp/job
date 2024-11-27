<script>
export default {
  name: "assign",
  data() {
    return {
      tabIndex: 1,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      queryParams: {}, // 查询参数
      list_order: [{}], // 订单
      payList: [], // 测试项目
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
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length != 1
    },
  }
}
</script>

<template>
  <div class="content">
    <div class="section-order">
      <div class="section-title">
        <div class="label">
          <div class="label-item pointer">
            已分派订单
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
          <el-form-item label="订单编号" prop="orderSn">
            <el-input
                v-model="queryParams.orderSn"
                placeholder="请输入订单号"
                clearable
            />
          </el-form-item>
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
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" size="mini" :disabled="single">
            批量接单
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" :disabled="single">
            批量驳回
          </el-button>
        </el-col>
      </el-row>
      <div class="order-box">
        <el-table :data="list_order" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection"/>
          <el-table-column prop="date" label="订单号"></el-table-column>
          <el-table-column prop="date" label="项目名称"></el-table-column>
          <el-table-column prop="date" label="仪器型号"></el-table-column>
          <el-table-column prop="date" label="金额"></el-table-column>
          <el-table-column prop="date" label="样品数"></el-table-column>
          <el-table-column prop="date" label="对接人"></el-table-column>
          <el-table-column prop="date" label="回收"></el-table-column>
          <el-table-column prop="date" label="订单状态"></el-table-column>
          <el-table-column prop="date" label="样品状态"></el-table-column>
          <el-table-column prop="date" label="寄样时间"></el-table-column>
          <el-table-column prop="date" label="完成时间"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="goUrl('/supplier-order-detail')">查看</el-button>
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

  .el-row {
    margin-top: 10px;
    margin-left: 35px !important;
  }

  .order-box {
    margin-top: 10px;
    padding: 0 40px;

    /deep/ .el-table th.el-table__cell {
      background: #EAECEE;;
      color: #333333;
    }
  }
}

.el-button--primary {
  background-color: #00479D;
  color: #fff;
  border-color: #00479D;
}
</style>
