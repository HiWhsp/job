<template>
  <div class="view-wrap material-purchase-in-storage-detail-page">
    <div class="page-title">采购单详情</div>

    <div class="section-title"><span class="section-bar" /><span>订单基础信息</span></div>
    <div class="base-info-grid">
      <div class="grid-item">
        <span class="label">采购单号：</span>
        <span class="value">{{ detailInfo.purchaseNo }}</span>
      </div>
      <div class="grid-item">
        <span class="label">采购单名称：</span>
        <span class="value">{{ detailInfo.title }}</span>
      </div>
      <div class="grid-item">
        <span class="label">下单时间：</span>
        <span class="value">{{ detailInfo.submitTime }}</span>
      </div>
      <div class="grid-item">
        <span class="label">订单金额：</span>
        <span class="value">{{ detailInfo.orderAmount }}</span>
      </div>
      <div class="grid-item">
        <span class="label">所属订单号：</span>
        <span class="value">{{ detailInfo.staffOrderNo }}</span>
      </div>
      <div class="grid-item">
        <span class="label">客户：</span>
        <span class="value">{{ detailInfo.customerTitle }}</span>
      </div>
      <div class="grid-item">
        <span class="label">预计到货：</span>
        <span class="value">{{ detailInfo.expectedTime || '—' }}</span>
      </div>
      <div class="grid-item">
        <span class="label">总数量：</span>
        <span class="value">{{ detailInfo.allNum != null && detailInfo.allNum !== '' ? detailInfo.allNum : '—' }}</span>
      </div>
      <div class="grid-item">
        <span class="label">订单状态：</span>
        <span :class="orderStatusTagClass">{{ orderStatusText }}</span>
      </div>
      <div v-if="detailInfo.pdfUrl" class="grid-item grid-item--full">
        <span class="label">附件：</span>
        <a class="file-link" :href="detailInfo.pdfUrl" target="_blank" rel="noopener">查看</a>
      </div>
    </div>

    <div class="section-title"><span class="section-bar" /><span>原料信息</span></div>
    <div class="table-box">
      <el-table :data="detailMaterials" header-cell-class-name="table-header-cell" :row-class-name="tableRowClassName">
        <el-table-column prop="code" label="原料编码" min-width="120" show-overflow-tooltip />
        <el-table-column prop="name" label="原料名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
        <el-table-column prop="purchaseQty" label="采购数量" width="100" align="center" />
        <el-table-column prop="price" label="单价" width="100" align="center" />
        <el-table-column label="本次入库数量" width="140" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-if="canEditRkNum"
              v-model="row.rkNumInput"
              size="small"
              placeholder="请输入"
              style="width: 100px"
            />
            <span v-else>{{ row.rkNumDisplay }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="所属分类" min-width="100" show-overflow-tooltip />
        <el-table-column prop="unit" label="单位" width="80" align="center" />
      </el-table>
    </div>

    <div class="section-title"><span class="section-bar" /><span>审核记录</span></div>
    <div class="table-box">
      <el-table :data="auditList" header-cell-class-name="table-header-cell">
        <el-table-column prop="auditor" label="审核人" min-width="120" />
        <el-table-column prop="auditTime" label="审核时间" min-width="160" />
        <el-table-column label="审核状态" width="120" align="center">
          <template slot-scope="{ row }">
            <span :class="row.auditStatus === 'pass' ? 'tag tag-success' : 'tag tag-gray'">
              {{ row.statusTxt || '—' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="auditRemark" label="备注" min-width="140" show-overflow-tooltip />
      </el-table>
    </div>

    <div v-if="canQcIn" ref="qcSection" class="qc-in-section">
      <div class="section-title"><span class="section-bar" /><span>质检入库</span></div>
      <div class="qc-row">
        <span class="qc-label">入库质检单：</span>
        <el-upload
          class="qc-upload"
          list-type="picture-card"
          :action="uploadAction"
          name="file"
          :file-list="qcFileList"
          accept="image/*"
          :limit="1"
          :on-success="handleQcUploadSuccess"
          :on-remove="handleQcUploadRemove"
          :http-request="handleQcUploadRequest"
        >
          <div class="upload-box">
            <i class="el-icon-plus" />
            <span class="upload-plus-text">添加照片</span>
          </div>
        </el-upload>
      </div>
      <div class="upload-hint">上传质检照片后点击确定入库</div>
      <div class="qc-actions">
        <el-button type="primary" :loading="ruKuSubmitLoading" @click="confirmInStorage">确定入库</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>

    <div v-if="Number(orderStatus) === 6 && detailInfo.ruKuNo" class="stored-section">
      <div class="section-title"><span class="section-bar" /><span>入库信息</span></div>
      <div class="table-box">
        <el-table :data="inStorageList" header-cell-class-name="table-header-cell">
          <el-table-column prop="ruKuNo" label="入库单号" min-width="160" show-overflow-tooltip />
          <el-table-column prop="inTime" label="入库时间" min-width="170" show-overflow-tooltip />
          <el-table-column label="质检照片" min-width="120" align="center">
            <template slot-scope="{ row }">
              <el-image
                v-if="row.image"
                class="stored-thumb"
                :src="row.image"
                fit="cover"
                :preview-src-list="[row.image]"
              />
              <span v-else>—</span>
            </template>
          </el-table-column>
          <el-table-column prop="inPerson" label="操作人" min-width="120" show-overflow-tooltip />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { UPLOAD_ROOT } from '@/config/env.js';

const DETAIL_API = '/getPurchaseMaterialOrder';
const RU_KU_API = '/ruKuPurchaseMaterialOrder';

export default {
  name: 'WarehouseMaterialPurchaseSingleInStorageDetail',
  data() {
    return {
      detailId: '',
      orderStatus: null,
      detailInfo: {
        purchaseNo: '',
        title: '',
        submitTime: '',
        orderAmount: '',
        staffOrderNo: '',
        customerTitle: '',
        expectedTime: '',
        allNum: '',
        pdfUrl: '',
        ruKuNo: ''
      },
      detailMaterials: [],
      auditList: [],
      qcFileList: [],
      qcImageUrl: '',
      uploadAction: UPLOAD_ROOT,
      ruKuSubmitLoading: false,
      inStorageList: []
    };
  },
  computed: {
    orderStatusText() {
      const s = Number(this.orderStatus);
      switch (s) {
        case 1:
          return '生产副总审核';
        case 2:
          return '总经理审核';
        case 3:
          return '待财务付款';
        case 4:
          return '待采购';
        case 5:
          return '待入库';
        case 6:
          return '已入库';
        case -1:
          return '审核未通过';
        default:
          return '—';
      }
    },
    orderStatusTagClass() {
      const s = Number(this.orderStatus);
      if (s === 6) return 'tag tag-success';
      if (s === -1) return 'tag tag-danger';
      return 'tag tag-gray';
    },
    canQcIn() {
      return Number(this.orderStatus) === 5;
    },
    canEditRkNum() {
      return this.canQcIn;
    }
  },
  created() {
    this.detailId = this.$route.query.id != null ? String(this.$route.query.id) : '';
    this.loadDetail();
  },
  mounted() {
    const focusQc = String(this.$route.query.focusQc || '') === '1';
    if (focusQc) {
      this._focusQcPending = true;
      this.$nextTick(() => {
        this.tryScrollQc();
        setTimeout(() => this.tryScrollQc(), 400);
      });
    }
  },
  methods: {
    tryScrollQc() {
      if (!this._focusQcPending || !this.canQcIn) return;
      const el = this.$refs.qcSection;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this._focusQcPending = false;
      }
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? 'row-even' : '';
    },
    safeParseJson(val, fallback) {
      if (val == null || val === '') return fallback;
      if (typeof val === 'object') return val;
      try {
        return JSON.parse(val);
      } catch (e) {
        return fallback;
      }
    },
    normalizeProductJson(d) {
      let products = d.productJson;
      if (typeof products === 'string') {
        products = this.safeParseJson(products, []);
      }
      return Array.isArray(products) ? products : [];
    },
    mapMaterialLine(line) {
      const info = line.info || {};
      const material = line.material || {};
      const inventory = line.inventory || {};
      const materialId = line.materialId != null ? line.materialId : material.id;
      const inventoryId = line.inventoryId != null ? line.inventoryId : (inventory && inventory.id);
      const rk = line.rkNum != null ? String(line.rkNum) : '';
      const num = line.num != null ? String(line.num) : '';
      const code = material.materialNo || info.materialNo || info.productNo || line.materialNo || '';
      const name = material.title || info.title || line.title || '';
      const spec = (inventory && inventory.keyVals) || info.keyVals || line.keyVals || '';
      const unit = material.unit || info.unit || line.unit || '';
      return {
        lineId: line.id,
        materialId,
        inventoryId,
        code,
        name,
        spec,
        unit,
        purchaseQty: num,
        price: line.price != null ? line.price : '',
        categoryName: line.cateTitle || info.cateTitle || material.cateTitle || '',
        rkNumDisplay: rk,
        rkNumInput: Number(this.orderStatus) === 5 ? num : rk
      };
    },
    loadDetail() {
      if (!this.detailId) {
        this.$message.warning('缺少采购单 id');
        return;
      }
      this.$api({
        url: DETAIL_API,
        method: 'post',
        data: { id: this.detailId }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const d = res.data;
            this.orderStatus = d.orderStatus;
            this.detailInfo = {
              purchaseNo: d.purchaseNo || '',
              title: d.title || '',
              submitTime: d.created_at || '',
              orderAmount: d.price != null ? d.price : '',
              staffOrderNo: d.staffOrderNo != null ? String(d.staffOrderNo) : '',
              customerTitle: d.customerTitle || '',
              expectedTime: d.expectedTime || '',
              allNum: d.allNum != null ? d.allNum : '',
              pdfUrl: d.pdfUrl || '',
              ruKuNo: d.ruKuNo || ''
            };
            const products = this.normalizeProductJson(d);
            this.detailMaterials = products.map(line => this.mapMaterialLine(line));
            let reviews = d.reviewJson;
            reviews = this.safeParseJson(reviews, []);
            if (!Array.isArray(reviews)) reviews = [];
            this.auditList = reviews.map(r => ({
              auditor: r.name || '',
              auditTime: r.created_at || '',
              auditStatus: String(r.status) === '1' ? 'pass' : 'other',
              statusTxt: r.statusTxt || '',
              auditRemark: r.cont || ''
            }));
            const ruKu = this.safeParseJson(d.ruKuJson, null);
            if (Number(d.orderStatus) === 6 && (d.ruKuNo || ruKu)) {
              this.inStorageList = [
                {
                  ruKuNo: d.ruKuNo || '—',
                  inTime: (ruKu && ruKu.created_at) || d.updated_at || '',
                  image: (ruKu && ruKu.image) || '',
                  inPerson: (ruKu && ruKu.name) || ''
                }
              ];
            } else {
              this.inStorageList = [];
            }
            this.$nextTick(() => {
              this.tryScrollQc();
              setTimeout(() => this.tryScrollQc(), 300);
            });
          } else {
            this.$message.error((res && res.msg) || '加载详情失败');
          }
        })
        .catch(() => {
          this.$message.error('加载详情失败');
        });
    },
    handleQcUploadRequest(option) {
      const formData = new FormData();
      formData.append('file', option.file);
      const token = localStorage.getItem('token');
      axios
        .post(UPLOAD_ROOT, formData, {
          headers: { Authorization: 'Bearer ' + token },
          timeout: 60000
        })
        .then(res => {
          const data = res.data || res;
          const payload = data && data.data ? data.data : data;
          const url = (payload && (payload.path || payload.url)) || (data && data.path) || '';
          option.onSuccess({ url });
        })
        .catch(err => {
          this.$message.error(
            (err.response && err.response.data && err.response.data.msg) || '上传失败'
          );
          option.onError(err);
        });
    },
    handleQcUploadSuccess(res, file, fileList) {
      this.qcFileList = fileList || [];
      const r = res || (file && file.response);
      const payload = r && r.data ? r.data : r;
      const url =
        (r && r.url) ||
        (payload && (payload.path || payload.url)) ||
        (r && r.path) ||
        (file && file.url) ||
        '';
      if (url && file) file.url = url;
      this.qcImageUrl = url || '';
    },
    handleQcUploadRemove(file, fileList) {
      this.qcFileList = fileList || [];
      this.qcImageUrl = '';
    },
    confirmInStorage() {
      if (!this.qcImageUrl) {
        this.$message.warning('请上传质检照片');
        return;
      }
      if (!this.detailMaterials.length) {
        this.$message.warning('无原料明细');
        return;
      }
      const productJson = [];
      for (let i = 0; i < this.detailMaterials.length; i++) {
        const row = this.detailMaterials[i];
        const q = String(row.rkNumInput != null ? row.rkNumInput : '').trim();
        const n = Number(q);
        if (q === '' || isNaN(n) || n < 0 || !Number.isInteger(n)) {
          this.$message.warning(`请为「${row.name || '原料'}」填写有效的非负整数入库数量`);
          return;
        }
        const max = Number(row.purchaseQty);
        if (!isNaN(max) && n > max) {
          this.$message.warning(`「${row.name || '原料'}」入库数量不能大于采购数量 ${row.purchaseQty}`);
          return;
        }
        if (row.lineId == null || row.materialId == null || row.inventoryId == null) {
          this.$message.warning('明细缺少行 id、materialId 或 inventoryId，请检查接口数据');
          return;
        }
        productJson.push({
          id: String(row.lineId),
          materialId: String(row.materialId),
          inventoryId: String(row.inventoryId),
          rkNum: String(n)
        });
      }
      this.ruKuSubmitLoading = true;
      this.$api({
        url: RU_KU_API,
        method: 'post',
        data: {
          id: this.detailId,
          image: this.qcImageUrl,
          productJson: JSON.stringify(productJson)
        }
      })
        .then(res => {
          this.ruKuSubmitLoading = false;
          if (res && res.code === 200) {
            this.$message.success('入库成功');
            this.$router.back();
          } else {
            this.$message.error((res && res.msg) || '入库失败');
          }
        })
        .catch(() => {
          this.ruKuSubmitLoading = false;
          this.$message.error('入库失败');
        });
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

    &.grid-item--full {
      grid-column: 1 / -1;
    }

    .label {
      color: #606266;
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

.tag-danger {
  background: #fde2e2;
  color: #f56c6c;
}

.qc-in-section {
  margin-top: 12px;
}

.qc-row {
  display: flex;
  align-items: flex-start;
  padding: 8px 0 0;

  .qc-label {
    width: 110px;
    text-align: left;
    font-size: 14px;
    color: #333;
    padding-top: 10px;
    flex-shrink: 0;
  }
}

.qc-upload {
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
  }
  ::v-deep .el-upload-list__item {
    width: 120px;
    height: 120px;
  }
  .upload-plus-text {
    line-height: 20px;
  }
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.upload-plus-text {
  margin-top: 6px;
  color: #909399;
  font-size: 12px;
}

.upload-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
  padding-left: 110px;
  text-align: left;
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

.stored-section {
  margin-top: 8px;
}

.stored-thumb {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
