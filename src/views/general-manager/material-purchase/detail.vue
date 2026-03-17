<template>
  <div class="purchase-detail-page">
    <div class="page-title">采购单详情</div>

    <!-- 订单基础信息 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">订单基础信息</span>
      </div>
      <div class="section-body">
        <el-row :gutter="24" class="field-row">
          <el-col :span="12" class="field-item">
            <span class="field-label">采购单号：</span>
            <span class="field-value">{{ detail.purchaseNo }}</span>
          </el-col>
          <el-col :span="12" class="field-item">
            <span class="field-label">采购单名称：</span>
            <span class="field-value">{{ detail.purchaseName }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="field-row">
          <el-col :span="12" class="field-item">
            <span class="field-label">提交时间：</span>
            <span class="field-value">{{ detail.submitTime }}</span>
          </el-col>
          <el-col :span="12" class="field-item">
            <span class="field-label">订单状态：</span>
            <el-tag :type="statusTagType" size="small" effect="plain">{{ orderStatusText(detail.orderStatus) }}</el-tag>
          </el-col>
        </el-row>
        <el-row :gutter="24" class="field-row">
          <el-col :span="12" class="field-item">
            <span class="field-label">订单金额：</span>
            <span class="field-value">{{ detail.orderAmount }}</span>
          </el-col>
          <el-col :span="12" class="field-item">
            <span class="field-label">审核备注：</span>
            <span class="field-value">{{ detail.auditRemark || '--' }}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 原料信息 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">原料信息</span>
      </div>
      <div class="section-body">
        <el-table :data="detail.materialList" class="material-table" :row-class-name="tableRowClassName">
          <el-table-column prop="materialCode" label="原料编码" />
          <el-table-column prop="materialName" label="原料名称" />
          <el-table-column prop="spec" label="规格" />
          <el-table-column prop="quantity" label="数量" align="center" />
          <el-table-column prop="category" label="所属分类" />
          <el-table-column prop="unit" label="单位" align="center" />
        </el-table>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="form-footer">
      <el-button type="primary" v-if="String(detail.orderStatus) === '2'" @click="handleAudit">审核</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaterialPurchaseDetail',
  data() {
    return {
      detail: {
        purchaseNo: '2026001-999',
        purchaseName: '采购单名称',
        submitTime: '2026-01-01',
        orderStatus: '待审核',
        orderAmount: '2545.00',
        auditRemark: '',
        materialList: [
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' },
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' },
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' },
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' },
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' },
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' },
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' },
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' },
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' },
          { materialCode: '4578786954', materialName: '原料名称', spec: '98,A1,10mm', quantity: 20, category: '原料分类', unit: '盒' }
        ]
      }
    }
  },
  computed: {
    statusTagType() {
      const s = Number(this.detail.orderStatus)
      if (s === -1) return 'danger'
      if (s === 6) return 'success'
      if (s === 3) return 'warning'
      return 'info'
    }
  },
  mounted() {
    const id = this.$route.query.id || this.$route.params.id
    if (id) {
      this.loadDetail(id)
    } else {
      this.$message.warning('缺少采购单id')
    }
  },
  methods: {
    orderStatusText(v) {
      const s = Number(v)
      const map = {
        1: '生产副总审核',
        2: '总经理审核',
        3: '待财务付款',
        4: '待采购',
        5: '质检入库',
        6: '已完成',
        [-1]: '审核未通过'
      }
      return map[s] != null ? map[s] : (v != null ? String(v) : '—')
    },
    loadDetail(id) {
      this.$api({
        url: '/getPurchaseMaterialOrder',
        method: 'post',
        data: { id: String(id) }
      })
        .then((res) => {
          if (!res || res.code !== 200 || !res.data) {
            this.$message.error('获取采购单详情失败')
            return
          }
          const d = res.data
          const productJson = Array.isArray(d.productJson) ? d.productJson : []
          const materialList = productJson.map(item => {
            const info = (item && item.info) ? item.info : {}
            return {
              materialCode: info.sn || '',
              materialName: info.title || '',
              spec: info.keyVals || '',
              quantity: item && item.num != null ? item.num : '',
              category: info.productCateTitle || '',
              unit: info.unit || '—',
              raw: item
            }
          })

          // 兼容：列表字段为 title/price/created_at/orderStatus 等
          this.detail = {
            ...this.detail,
            purchaseNo: d.purchaseNo || '',
            purchaseName: d.title || d.purchaseName || '',
            submitTime: d.updated_at || d.submitTime || '',
            orderStatus: d.orderStatus != null ? d.orderStatus : (d.status || ''),
            orderAmount: d.price != null ? d.price : (d.orderAmount || ''),
            auditRemark: d.cont || d.auditRemark || '',
            materialList
          }
        })
        .catch(() => {
          this.$message.error('获取采购单详情失败')
        })
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? 'row-even' : ''
    },
    handleAudit() {
      // TODO: 跳转审核或打开审核弹框
      this.$message.info('审核')
    },
    handleCancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.purchase-detail-page {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  padding-bottom: 32px;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 24px;
  text-align: left;
}

.section-card {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.section-title {
  position: relative;
  padding-left: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #2373c8;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 2px;
    bottom: 2px;
    width: 4px;
    height: 20px;
    background: #2373c8;
    border-radius: 2px;
  }
}

.section-body {
  .field-row {
    margin-bottom: 16px;
  }
}

.field-item {
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.field-label {
  min-width: 100px;
  text-align: left;
  color: #333;
}

.field-value {
  color: #333;
}

.material-table {
  ::v-deep .el-table__header th {
    background: #f5f7fa;
    color: #303133;
    font-weight: 500;
  }

  ::v-deep .el-table__body tr.row-even td {
    background: #fafafa;
  }

  ::v-deep .el-tag--plain {
    border: 1px solid #dcdfe6;
    background: #fff;
    color: #606266;
  }
}

.form-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f1f1;
  text-align: left;

  .el-button {
    min-width: 112px;
    height: 38px;
    padding: 10px 24px;
  }

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }

  .el-button:not(.el-button--primary) {
    background: #fff;
    border-color: #dcdfe6;
    color: #606266;
  }
}
</style>
