<script>
export default {
  name: "purchase-count",
  data() {
    return {
      tableData: [],
      total: {},
      data: [],
      keyword: ''
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'cgOrderStatistics',
        method: 'post',
        data: {
          start_time: this.data ? this.data[0] : '',
          end_time: this.data ? this.data[1] : '',
          keyword: this.keyword
        }
      }).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.data_list
          this.total = res.data;
        }
      })
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="main-title">
      <span>采购统计</span>
    </div>
    <div class="page-ctx">
      <div class="search">
        <el-date-picker
            v-model="data"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        <div class="search-box">
          <input v-model="keyword" placeholder="输入商品名称、订单号" type="text"/>
          <button @click="setView">搜索</button>
        </div>
      </div>
      <el-table
          :data="tableData"
          height="250"
          style="width: 100%">
        <el-table-column
            label="供应商名称"
            prop="supply_name"
            width="180">
        </el-table-column>
        <el-table-column
            label="商品类目"
            prop="material_type_name"
            width="180">
        </el-table-column>
        <el-table-column
            label="商品规格"
            prop="guige">
        </el-table-column>
        <el-table-column
            label="单价"
            prop="notax_single_price">
        </el-table-column>
        <el-table-column
            label="采购数量"
            prop="notax_num">
        </el-table-column>
        <el-table-column
            label="采购额"
            prop="notax_subtotal">
        </el-table-column>
      </el-table>
      <div class="money-box">
        <div class="money-num">
          总采购数量：<span class="num">{{ total.total_num }}</span>
        </div>
        <div class="money-item">
          <div class="item">
            合计采购额：<span class="num">￥{{ total.total_taxed_price }}</span>（含税）
          </div>
          <div class="item">
            合计采购额：<span class="num">￥{{ total.total_notax_price }}</span>（不含税）
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page {
  text-align: left;
  padding-bottom: 80px;
  padding-top: 0;

  .main-title {
    .flex-between();
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
    margin-top: 10px;
    padding: 20px 30px;
    background: #fff;
  }

  .money-box {
    text-align: right;
    background: #F5F5F5;
    padding: 15px 40px;
    display: flex;
    justify-content: end;
    align-items: end;

    .count {
      font-weight: bold;
      color: #666;
    }

    .money-num {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      margin-right: 40px;

      .num {
        font-weight: bold;
        font-size: 20px;
        color: #F42424;
      }
    }

    .money-item {
      display: flex;
      flex-direction: column;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .item {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        margin-right: 40px;

        .num {
          font-weight: bold;
          font-size: 20px;
          color: #F42424;
        }
      }
    }
  }

  .search {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: 20px;

    .search-box {
      margin-left: 10px;
      .flex();
      min-width: 260px;
      height: 35px;

      input {
        background: #fff;
        flex: 2;
        height: 40px;
        border: 1px solid #DCDFE6;
        border-right: none;
        outline: none;
        padding-left: 10px;
        font-size: 12px;
      }

      button {
        width: 50px;
        height: 40px;
        background: #ffffff;
        border: 1px solid #e2e2e2;
        color: #7d7d7d;

        &:last-child {
          border-left: 0;
        }
      }
    }
  }
}
</style>
