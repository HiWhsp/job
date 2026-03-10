<template>
  <div class="view-wrap material-purchase-in-storage-detail-page">
    <div class="page-title">采购单详情</div>

    <div class="section-title"><span class="section-bar"></span><span>订单基础信息</span></div>
    <div class="base-info-grid">
      <div class="grid-item"><span class="label">采购单号：</span><span class="value">{{ detailInfo.purchaseNo }}</span>
      </div>
      <div class="grid-item"><span class="label">提交时间：</span><span class="value">{{ detailInfo.submitTime }}</span>
      </div>
      <div class="grid-item"><span class="label">订单金额：</span><span class="value">{{ detailInfo.orderAmount }}</span>
      </div>
      <div class="grid-item"><span class="label">采购单名称：</span><span class="value">{{ detailInfo.purchaseName }}</span>
      </div>
      <div class="grid-item">
        <span class="label">订单状态：</span>
        <span :class="detailInfo.status === 'stored' ? 'tag tag-success' : 'tag tag-gray'">
          {{ detailInfo.status === 'stored' ? '已入库' : '待审核' }}
        </span>
      </div>
      <div class="grid-item"><span class="label">采购合同：</span><span class="value file-link">{{ detailInfo.contractName
          }}</span></div>
    </div>

    <div class="section-title"><span class="section-bar"></span><span>原料信息</span></div>
    <div class="table-box">
      <el-table :data="detailMaterials" header-cell-class-name="table-header-cell" :row-class-name="tableRowClassName">
        <el-table-column prop="code" label="原料编码" min-width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="原料名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
        <el-table-column prop="purchaseQty" label="采购数量" width="100" align="center" />
        <el-table-column label="入库数量" width="140" align="center">
          <template slot-scope="{ row }">
            <el-input v-if="detailInfo.status !== 'stored'" v-model="row.inQty" size="small" placeholder="请输入"
              style="width: 90px" />
            <span v-else>{{ row.inQty }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="所属分类" min-width="120" show-overflow-tooltip />
        <el-table-column prop="unit" label="单位" width="80" align="center" />
      </el-table>
    </div>

    <div class="section-title"><span class="section-bar"></span><span>审核</span></div>
    <div class="table-box">
      <el-table :data="auditList" header-cell-class-name="table-header-cell">
        <el-table-column prop="auditor" label="审核人" min-width="120" />
        <el-table-column prop="auditTime" label="审核时间" min-width="160" />
        <el-table-column label="审核状态" width="120" align="center">
          <template slot-scope="{ row }">
            <span :class="row.auditStatus === 'pass' ? 'tag tag-success' : 'tag tag-gray'">
              {{ row.auditStatus === 'pass' ? '审核通过' : '待审核' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="auditRemark" label="审核备注" min-width="140" />
      </el-table>
    </div>

    <!-- 质检入库（待审核状态） -->
    <div v-if="detailInfo.status !== 'stored'" ref="qcSection" class="qc-in-section">
      <div class="section-title"><span class="section-bar"></span><span>质检入库</span></div>
      <div class="qc-row">
        <span class="qc-label">入库质检单：</span>
        <el-upload action="#" :auto-upload="false" list-type="picture-card" :limit="1" :file-list="qcForm.photoList"
          :on-change="handleQcPhotoChange" :on-remove="handleQcPhotoRemove">
          <div class="upload-plus-icon-box">
            <i class="el-icon-plus"></i>
            <span class="upload-plus-text">添加照片</span>
          </div>
        </el-upload>
      </div>
      <div class="qc-actions">
        <el-button type="primary" @click="confirmInStorage">确定入库</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>

    <!-- 已入库（已入库状态） -->
    <div v-else class="stored-section">
      <div class="section-title"><span class="section-bar"></span><span>入库</span></div>
      <div class="table-box">
        <el-table :data="inStorageList" header-cell-class-name="table-header-cell">
          <el-table-column prop="inPerson" label="入库人员" min-width="160" />
          <el-table-column prop="inTime" label="入库时间" min-width="200" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarehouseMaterialPurchaseSingleInStorageDetail',
  data() {
    return {
      detailId: '',
      detailInfo: {
        status: 'pending',
        purchaseNo: '2026001-999',
        submitTime: '2006-01-01',
        orderAmount: '2545.00',
        purchaseName: '采购单名称',
        contractName: '采购合同.pdf'
      },
      detailMaterials: [],
      auditList: [
        { auditor: '总经理', auditTime: '2026-3-23  15:23:24', auditStatus: 'pass', auditRemark: '审核通过' }
      ],
      qcForm: {
        photoList: []
      },
      inStorageList: [{ inPerson: '库管员', inTime: '2026-3-23  15:23:24' }]
    };
  },
  created() {
    this.detailId = this.$route.query.id || '';
    const status = this.$route.query.status;
    this.detailInfo.status = status === 'stored' ? 'stored' : 'pending';
    this.loadDetail();
  },
  mounted() {
    const focusQc = String(this.$route.query.focusQc || '') === '1';
    if (focusQc && this.detailInfo.status !== 'stored') {
      this.$nextTick(() => {
        const el = this.$refs.qcSection;
        el && el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? 'row-even' : '';
    },
    loadDetail() {
      // TODO: 调用详情接口，根据 this.detailId 赋值
      this.detailMaterials = Array.from({ length: 10 }, () => ({
        code: '4578786954',
        name: '原料名称',
        spec: '98,A1,10mm',
        purchaseQty: 20,
        inQty: this.detailInfo.status === 'stored' ? 20 : '',
        categoryName: '原料分类',
        unit: '盒'
      }));
    },
    handleQcPhotoChange(file, fileList) {
      this.qcForm.photoList = fileList.slice(-1);
    },
    handleQcPhotoRemove(file, fileList) {
      this.qcForm.photoList = fileList;
    },
    confirmInStorage() {
      // TODO: 提交质检入库接口（入库数量 + 质检单照片）
      this.$message.success('入库成功');
      this.$router.back();
    },
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.material-purchase-in-storage-detail-page {
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

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #2373c8;
  margin: 14px 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;

  .section-bar {
    width: 8px;
    height: 20px;
    background: #2373c8;
    border-radius: 2px;
    margin-right: 8px;
  }
}

.base-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px 24px;
  padding: 6px 0 8px;

  .grid-item {
    text-align: left;
    font-size: 14px;
    color: #333;

    .label {
      color: #333;
      margin-right: 8px;
    }
  }

  .file-link {
    color: #2373c8;
    cursor: pointer;
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

    .el-table__body tr.row-even td {
      background: #f3f7fa;
    }
  }
}

.tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 18px;
}

.tag-gray {
  background: #f2f2f2;
  color: #666;
}

.tag-success {
  background: #dff6df;
  color: #2aa84a;
}

.qc-in-section {
  margin-top: 12px;
}

.qc-row {
  display: flex;
  align-items: flex-start;
  padding: 8px 0 0;

  .qc-label {
    width: 96px;
    text-align: left;
    font-size: 14px;
    color: #333;
    padding-top: 10px;
  }
}

.upload-plus-icon-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 149px;
  span {
    line-height: 24px;
  }
}

.upload-plus-text {
  margin-top: 10px;
  color: #909399;
  font-size: 12px;
}

.qc-actions {
  padding: 18px 0 8px;
  border-top: 1px solid #eeeeee;
  margin-top: 18px;
  text-align: left;

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
