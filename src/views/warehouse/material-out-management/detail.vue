<template>
  <div class="view-wrap material-out-detail-page">
    <div class="page-title">出库详情</div>
    <div class="detail-base-info">
      <div class="info-line">
        <div class="info-item"><span class="label">出库单号：</span><span class="value">{{ detailInfo.outNo }}</span></div>
        <div class="info-item"><span class="label">出库时间：</span><span class="value">{{ detailInfo.outTime }}</span></div>
      </div>
      <div class="info-line">
        <div class="info-item"><span class="label">出库单名称：</span><span class="value">{{ detailInfo.outName }}</span></div>
        <div class="info-item"><span class="label">出库单备注：</span><span class="value">{{ detailInfo.remark }}</span></div>
      </div>
    </div>

    <div class="table-box">
      <el-table :data="detailMaterials" border header-cell-class-name="table-header-cell">
        <el-table-column label="序号" width="70" align="center">
          <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
        </el-table-column>
        <el-table-column prop="materialName" label="原料名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="spec" label="规格" min-width="140" show-overflow-tooltip />
        <el-table-column prop="unit" label="单位" width="80" align="center" />
        <el-table-column prop="quantity" label="本次出库数量" width="120" align="center" />
      </el-table>
    </div>

    <div class="page-footer">
      <el-button type="primary" @click="$router.back()">确定</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>

<script>
const DETAIL_API = '/getMaterialOutboundOrder';

export default {
  name: 'WarehouseMaterialOutManagementDetail',
  data() {
    return {
      detailInfo: {
        outNo: '',
        outTime: '',
        outName: '',
        remark: ''
      },
      detailMaterials: []
    };
  },
  created() {
    this.loadDetail();
  },
  methods: {
    loadDetail() {
      const id = this.$route.query.id != null ? String(this.$route.query.id) : '';
      if (!id) {
        this.$message.warning('缺少出库单 id');
        return;
      }
      this.$api({
        url: DETAIL_API,
        method: 'post',
        data: { id }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const d = res.data;
            this.detailInfo = {
              outNo: d.outboundNo || '',
              outTime: d.created_at || '',
              outName: d.title || '',
              remark: d.cont || ''
            };
            let products = d.productJson;
            if (typeof products === 'string') {
              try {
                products = JSON.parse(products);
              } catch (e) {
                products = [];
              }
            }
            if (!Array.isArray(products)) products = [];
            this.detailMaterials = products.map(p => ({
              materialName: p.title || '',
              spec: p.keyVals || '',
              unit: p.unit || '',
              quantity: p.num != null ? p.num : ''
            }));
          } else {
            this.$message.error((res && res.msg) || '获取详情失败');
          }
        })
        .catch(() => {
          this.$message.error('获取详情失败');
        });
    }
  }
};
</script>

<style lang="less" scoped>
.material-out-detail-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.page-title {
  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: bold;
  font-size: 20px;
  color: #333333;
  line-height: 28px;
  margin-bottom: 24px;
  text-align: left;
}

.detail-base-info {
  padding: 8px 0 10px;
  .info-line {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  .info-item {
    flex: 1;
    min-width: 0;
    text-align: left;
    font-size: 14px;
    color: #333;
    .label {
      margin-right: 12px;
    }
  }
}

.table-box {
  ::v-deep .el-table {
    font-size: 14px;
    .table-header-cell {
      background: #f5f7fa;
      color: #303133;
      font-weight: 500;
    }
  }
}

.page-footer {
  margin-top: 24px;
  text-align: right;
  border-top: 1px solid #eeeeee;
  padding-top: 18px;
  .el-button--primary {
    background: #2373c8 !important;
    border: none;
  }
  .el-button:not(.el-button--primary) {
    background: #fff;
    border: 1px solid #b8b8b8;
    color: #6a6a6a;
  }
}
</style>
