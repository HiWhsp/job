<script>
export default {
  name: "purchase-count",
  data() {
    return {
      tableData: []
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
      <el-table
          :data="tableData"
          height="250"
          style="width: 100%">
        <el-table-column
            prop="date"
            label="供应商名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="商品类目"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="商品规格">
        </el-table-column>
        <el-table-column
            prop="address"
            label="单价">
        </el-table-column>
        <el-table-column
            prop="address"
            label="采购数量">
        </el-table-column>
        <el-table-column
            prop="address"
            label="采购额">
        </el-table-column>
      </el-table>
      <div class="money-box">
        <div class="money-num">
          总采购数量：<span class="num">33</span>
        </div>
        <div class="money-item">
          <div class="item">
            合计采购额：<span class="num">￥4000.00</span>（含税）
          </div>
          <div class="item">
            合计采购额：<span class="num">￥4000.00</span>（不含税）
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
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
}
</style>