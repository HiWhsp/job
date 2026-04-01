<template>
  <div class="view-wrap product-out-apply-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <!-- <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" style="width: 140px">
            <el-option label="申请单" value="1" />
            <el-option label="已完成" value="2" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="queryParams.keyword" placeholder="出库单号/订单编号/客户名称" clearable style="width: 260px" />
        </el-form-item>
        <el-form-item label="时间筛选" prop="dateRange">
          <el-date-picker v-model="queryParams.dateRange" type="daterange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" value-format="yyyy-MM-dd" style="width: 340px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-title">产品出库申请</div>
        <div class="table-acts">
          <el-button size="small" @click="handleExport">导出</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table ref="tableRef" :height="tableHeight" :data="tableData" header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName">
          <el-table-column label="序号" width="70" align="center">
            <template slot-scope="scope">
              {{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="outNo" label="出库单号" min-width="110" show-overflow-tooltip />
          <el-table-column prop="customerName" label="客户名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="region" label="属地" width="90" align="center" />
          <el-table-column prop="receiveAddress" label="收货地址" min-width="220" show-overflow-tooltip />
          <el-table-column prop="orderNo" label="所属订单号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="applyTime" label="申请时间" width="120" align="center" />
          <!-- <el-table-column label="状态" width="100" align="center">
            <template slot-scope="{ row }">
              {{ row.orderStatus === 2 ? '已完成' : '申请单' }}
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="280" align="left">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleViewDetail(row)">查看详情</span>
                <template v-if="row.orderStatus !== 2">
                  <span class="row-act" @click="handleShip(row)">立即发货</span>
                  <span class="row-act" @click="handleUploadQc(row)">上传出库质检单</span>
                </template>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="queryParams.pageSize"
            layout="total, prev, pager, next, jumper" :total="total" />
        </div>
      </div>
    </div>

    <!-- 发货弹框：sendNo + sendImages（多图英文逗号拼接） -->
    <el-dialog title="发货" :visible.sync="shipDialogVisible" width="600px" :close-on-click-modal="false" append-to-body
      @close="handleShipDialogClose">
      <el-form ref="shipFormRef" :model="shipForm" label-width="100px">
        <el-form-item label="物流单号：" prop="logisticsNo">
          <el-input v-model="shipForm.logisticsNo" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="发货照片：">
          <el-upload
            class="ship-photo-uploader"
            list-type="picture-card"
            :action="uploadAction"
            name="file"
            :file-list="shipForm.photoList"
            accept="image/*"
            :limit="9"
            :on-success="handleShipUploadSuccess"
            :on-remove="handleShipUploadRemove"
            :http-request="handleShipUploadRequest"
          >
            <div class="upload-inner">
              <i class="el-icon-plus" />
              <span class="upload-plus-text">添加照片</span>
            </div>
          </el-upload>
          <div class="upload-hint">可多张，提交时多个地址英文逗号拼接</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="shipSubmitLoading" @click="submitShip">提交</el-button>
        <el-button @click="shipDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 上传出库质检单：qualityImages 多图英文逗号拼接 -->
    <el-dialog title="上传出库质检单" :visible.sync="qcDialogVisible" width="600px" :close-on-click-modal="false" append-to-body
      @close="handleQcDialogClose">
      <el-form label-width="120px">
        <el-form-item label="质检单图片：">
          <el-upload
            class="ship-photo-uploader"
            list-type="picture-card"
            :action="uploadAction"
            name="file"
            :file-list="qcForm.photoList"
            accept="image/*"
            :limit="9"
            :on-success="handleQcUploadSuccess"
            :on-remove="handleQcUploadRemove"
            :http-request="handleQcUploadRequest"
          >
            <div class="upload-inner">
              <i class="el-icon-plus" />
              <span class="upload-plus-text">添加图片</span>
            </div>
          </el-upload>
          <div class="upload-hint">可多张，多个地址英文逗号拼接提交</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="qcSubmitLoading" @click="submitQc">提交</el-button>
        <el-button @click="qcDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 出库详情抽屉：从右到左打开，800px -->
    <el-drawer title="出库详情" :visible.sync="detailDrawerVisible" direction="rtl" size="800px" append-to-body
      :close-on-click-modal="false" @closed="onDetailDrawerClosed">
      <div class="detail-drawer">
        <div class="detail-base-info">
          <div class="info-line">
            <div class="info-item"><span class="label">出库单号：</span><span class="value">{{ detailInfo.outNo }}</span>
            </div>
            <div class="info-item"><span class="label">申请时间：</span><span class="value">{{ detailInfo.outTime }}</span>
            </div>
          </div>
          <div v-if="detailInfo.sendTime" class="info-line">
            <div class="info-item"><span class="label">发货时间：</span><span class="value">{{ detailInfo.sendTime }}</span></div>
          </div>

          <div class="info-line">
            <div class="info-item"><span class="label">所属订单号：</span><span class="value">{{ detailInfo.orderNo }}</span>
            </div>
            <div class="info-item"><span class="label">客户名称：</span><span class="value">{{ detailInfo.customerName
                }}</span>
            </div>
          </div>

          <div class="info-line">
            <div class="info-item"><span class="label">属地：</span><span class="value">{{ detailInfo.region }}</span>
            </div>
            <div class="info-item"><span class="label">收货地址：</span><span class="value">{{ detailInfo.receiveAddress
                }}</span></div>
          </div>
          <div class="info-line">
            <div class="info-item"><span class="label">收货人：</span><span class="value">{{ detailInfo.receiver }}</span>
            </div>
            <div class="info-item"><span class="label">收货人联系方式方式：</span><span class="value">{{ detailInfo.receiverPhone
                }}</span></div>
          </div>
        </div>

        <div class="detail-section">
          <div class="section-title"><span class="section-bar"></span><span>产品信息</span></div>
          <el-table :data="detailProducts" border header-cell-class-name="table-header-cell">
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" min-width="140" show-overflow-tooltip />
            <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" width="80" align="center" />
            <el-table-column prop="quantity" label="出库数量" width="120" align="center" />
          </el-table>
        </div>

        <div class="detail-section">
          <div class="section-title"><span class="section-bar"></span><span>外购产品</span></div>
          <el-table :data="detailOutsourcedProducts" border header-cell-class-name="table-header-cell">
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" min-width="140" show-overflow-tooltip />
            <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" width="80" align="center" />
            <el-table-column prop="quantity" label="出库数量" width="120" align="center" />
          </el-table>
        </div>

        <div class="detail-footer">
          <el-button type="primary" @click="detailDrawerVisible = false">确定</el-button>
          <el-button @click="detailDrawerVisible = false">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from "axios";
import { UPLOAD_ROOT } from "@/config/env.js";

const LIST_API = "/getStaffOutboundOrderList";
const DETAIL_API = "/getStaffOutboundOrder";
const SHIP_API = "/sendStaffOutboundOrder";
const QC_API = "/setStaffOutboundOrderQuality";

export default {
  name: "WarehouseProductOutApply",
  data() {
    return {
      uploadAction: UPLOAD_ROOT,
      queryParams: {
        status: "2",
        keyword: "",
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      shipDialogVisible: false,
      shipSubmitLoading: false,
      currentShipRow: null,
      shipForm: {
        logisticsNo: "",
        photoList: []
      },
      qcDialogVisible: false,
      qcSubmitLoading: false,
      currentQcRow: null,
      qcForm: {
        photoList: []
      },
      detailDrawerVisible: false,
      detailInfo: {
        outNo: "",
        outTime: "",
        sendTime: "",
        orderNo: "",
        region: "",
        customerName: "",
        receiveAddress: "",
        receiver: "",
        receiverPhone: ""
      },
      detailProducts: [],
      detailOutsourcedProducts: []
    };
  },
  mounted() {
    this.setView();
    this.loadList();
  },
  methods: {
    setView() {
      this.$nextTick(() => {
        const refTable = this.$refs.tableRef;
        if (!refTable) return;
        const tableEl = refTable.$el || refTable;
        const tableOffsetTop = tableEl.offsetTop + 85;
        this.tableHeight = Math.max(window.innerHeight - tableOffsetTop - 80, 200);
        const that = this;
        window.onresize = function () {
          const top = tableEl.offsetTop + 84 + 80;
          that.tableHeight = Math.max(window.innerHeight - top, 200);
        };
      });
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    loadList() {
      const dr = this.queryParams.dateRange;
      const start_time = Array.isArray(dr) && dr[0] ? dr[0] : "";
      const end_time = Array.isArray(dr) && dr[1] ? dr[1] : "";
      this.$api({
        url: LIST_API,
        method: "post",
        data: {
          page: String(this.queryParams.pageNum),
          limit: String(this.queryParams.pageSize),
          status: this.queryParams.status != null && this.queryParams.status !== "" ? String(this.queryParams.status) : "",
          start_time,
          end_time,
          keyword: this.queryParams.keyword || ""
        }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list.map(it => {
              const addr = it.customerAddress || {};
              return {
                id: it.id,
                orderStatus: Number(it.orderStatus) || 0,
                outNo: it.orderNo || "",
                customerName: it.customerTitle || "",
                region: it.customerTerritory || "",
                receiveAddress: addr.address || "",
                orderNo: it.staffOrderNo || "",
                applyTime: (it.created_at || "").slice(0, 10)
              };
            });
            this.total = res.data.count != null ? res.data.count : list.length;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
        .catch(() => {
          this.tableData = [];
          this.total = 0;
        });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.loadList();
    },
    resetQuery() {
      this.queryParams.status = "1";
      this.queryParams.keyword = "";
      this.queryParams.dateRange = null;
      this.queryParams.pageNum = 1;
      this.$refs.queryForm && this.$refs.queryForm.resetFields();
      this.loadList();
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.loadList();
    },
    handleExport() {
      // TODO: 导出
      this.$message.info("导出");
    },
    handleShip(row) {
      this.currentShipRow = row;
      this.shipForm.logisticsNo = "";
      this.shipForm.photoList = [];
      this.shipDialogVisible = true;
    },
    handleShipDialogClose() {
      this.currentShipRow = null;
      this.shipForm.logisticsNo = "";
      this.shipForm.photoList = [];
      this.shipSubmitLoading = false;
    },
    handleShipUploadRequest(option) {
      const formData = new FormData();
      formData.append("file", option.file);
      const token = localStorage.getItem("token");
      axios
        .post(UPLOAD_ROOT, formData, {
          headers: { Authorization: "Bearer " + token },
          timeout: 60000
        })
        .then(res => {
          const data = res.data || res;
          const payload = data && data.data ? data.data : data;
          const url = (payload && (payload.path || payload.url)) || (data && data.path) || "";
          option.onSuccess({ url });
        })
        .catch(err => {
          this.$message.error(
            (err.response && err.response.data && err.response.data.msg) || "上传失败"
          );
          option.onError(err);
        });
    },
    handleShipUploadSuccess(res, file, fileList) {
      this.shipForm.photoList = fileList || [];
      const r = res || (file && file.response);
      const payload = r && r.data ? r.data : r;
      const url =
        (payload && (payload.path || payload.url)) || (r && r.path) || (file && file.url) || "";
      if (url && file) file.url = url;
    },
    handleShipUploadRemove(file, fileList) {
      this.shipForm.photoList = fileList || [];
    },
    collectImageUrls(fileList) {
      const list = fileList || [];
      return list
        .map(f => f.url || (f.response && (f.response.url || f.response.path)) || "")
        .map(s => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean);
    },
    submitShip() {
      const id = this.currentShipRow && this.currentShipRow.id != null ? String(this.currentShipRow.id) : "";
      if (!id) {
        this.$message.warning("缺少出库单id");
        return;
      }
      const sendNo = (this.shipForm.logisticsNo || "").trim();
      if (!sendNo) {
        this.$message.warning("请输入物流单号");
        return;
      }
      const urls = this.collectImageUrls(this.shipForm.photoList);
      if (!urls.length) {
        this.$message.warning("请上传至少一张发货照片");
        return;
      }
      this.shipSubmitLoading = true;
      this.$api({
        url: SHIP_API,
        method: "post",
        data: {
          id,
          sendNo,
          sendImages: urls.join(",")
        }
      })
        .then(res => {
          this.shipSubmitLoading = false;
          if (res && res.code === 200) {
            this.$message.success("提交成功");
            this.shipDialogVisible = false;
            this.handleShipDialogClose();
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || "提交失败");
          }
        })
        .catch(() => {
          this.shipSubmitLoading = false;
          this.$message.error("提交失败");
        });
    },
    handleUploadQc(row) {
      this.currentQcRow = row;
      this.qcForm.photoList = [];
      this.qcDialogVisible = true;
    },
    handleQcDialogClose() {
      this.currentQcRow = null;
      this.qcForm.photoList = [];
      this.qcSubmitLoading = false;
    },
    handleQcUploadRequest(option) {
      this.handleShipUploadRequest(option);
    },
    handleQcUploadSuccess(res, file, fileList) {
      this.qcForm.photoList = fileList || [];
      const r = res || (file && file.response);
      const payload = r && r.data ? r.data : r;
      const url =
        (payload && (payload.path || payload.url)) || (r && r.path) || (file && file.url) || "";
      if (url && file) file.url = url;
    },
    handleQcUploadRemove(file, fileList) {
      this.qcForm.photoList = fileList || [];
    },
    submitQc() {
      const id = this.currentQcRow && this.currentQcRow.id != null ? String(this.currentQcRow.id) : "";
      if (!id) {
        this.$message.warning("缺少出库单id");
        return;
      }
      const urls = this.collectImageUrls(this.qcForm.photoList);
      if (!urls.length) {
        this.$message.warning("请上传至少一张质检单图片");
        return;
      }
      this.qcSubmitLoading = true;
      this.$api({
        url: QC_API,
        method: "post",
        data: {
          id,
          qualityImages: urls.join(",")
        }
      })
        .then(res => {
          this.qcSubmitLoading = false;
          if (res && res.code === 200) {
            this.$message.success("提交成功");
            this.qcDialogVisible = false;
            this.handleQcDialogClose();
            this.loadList();
          } else {
            this.$message.error((res && res.msg) || "提交失败");
          }
        })
        .catch(() => {
          this.qcSubmitLoading = false;
          this.$message.error("提交失败");
        });
    },
    mapProductRows(list) {
      if (!Array.isArray(list)) return [];
      return list.map(it => {
        const p = it.product || {};
        const inv = it.inventory || {};
        return {
          productName: p.title || "",
          spec: inv.keyVals || inv.sn || "",
          unit: p.unit || "",
          quantity: it.num != null ? String(it.num) : ""
        };
      });
    },
    mapForeignProductRows(list) {
      if (!Array.isArray(list)) return [];
      return list.map(it => {
        const fp = it.foreign_product || {};
        return {
          productName: fp.title || "外购产品",
          spec: fp.keyVals || "",
          unit: fp.unit || "",
          quantity: it.num != null ? String(it.num) : ""
        };
      });
    },
    handleViewDetail(row) {
      const id = row.id != null ? String(row.id) : "";
      if (!id) {
        this.$message.warning("缺少出库单id");
        return;
      }
      const loading = this.$loading({ lock: true, text: "加载中...", spinner: "el-icon-loading" });
      this.$api({
        url: DETAIL_API,
        method: "post",
        data: { id }
      })
        .then(res => {
          loading.close();
          if (res && res.code === 200 && res.data) {
            const d = res.data;
            const addr = d.customerAddress || {};
            this.detailInfo = {
              outNo: d.orderNo || "",
              outTime: d.created_at || "",
              sendTime: d.sendTime || "",
              orderNo: d.staffOrderNo || "",
              region: d.customerTerritory || "",
              customerName: d.customerTitle || "",
              receiveAddress: addr.address || "",
              receiver: addr.name || "",
              receiverPhone: addr.phone || ""
            };
            this.detailProducts = this.mapProductRows(d.productJson);
            this.detailOutsourcedProducts = this.mapForeignProductRows(d.foreignProductJson);
            this.detailDrawerVisible = true;
          } else {
            this.$message.error((res && res.msg) || "获取详情失败");
          }
        })
        .catch(() => {
          loading.close();
          this.$message.error("获取详情失败");
        });
    },
    onDetailDrawerClosed() {
      this.detailProducts = [];
      this.detailOutsourcedProducts = [];
      this.detailInfo = {
        outNo: "",
        outTime: "",
        sendTime: "",
        orderNo: "",
        region: "",
        customerName: "",
        receiveAddress: "",
        receiver: "",
        receiverPhone: ""
      };
    }
  }
};
</script>

<style lang="less" scoped>
.product-out-apply-page {
  background: #fff;
  border-radius: 8px;
}

.search-section {
  text-align: left;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.search-form {
  ::v-deep .el-form-item {
    margin-bottom: 0;
    margin-right: 16px;
  }

  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }

  ::v-deep .el-input__inner,
  ::v-deep .el-date-editor {
    border-radius: 4px;
    border-color: #dcdfe6;
  }

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }

  .el-button:not(.el-button--primary) {
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
}

.table-view {
  overflow: hidden;
}

.table-util-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  margin: 0 27px 25px;
  background: #fff;
  border-bottom: 1px solid #edf0f6;

  .table-title {
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }

  .table-acts {
    display: flex;
    align-items: center;
    gap: 10px;

    .el-button--primary {
      background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
      border: none;
    }

    .el-button:not(.el-button--primary) {
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
    }
  }
}

.table-box {
  margin: 0 27px;

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

    .el-table__body tr:hover>td {
      background: #f5f7fa !important;
    }
  }
}

.row-acts {
  display: flex;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;

  .row-act {
    color: #3377fe;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      text-decoration: underline;
    }

    &+.row-act {
      margin-left: 8px;
    }
  }
}

.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-dialog__footer {
  text-align: center;
}

.ship-photo-uploader {
  display: flex;
  flex-wrap: wrap;

  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  ::v-deep .el-upload-list__item {
    width: 120px;
    height: 120px;
  }

  .upload-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  ::v-deep .el-icon-plus {
    font-size: 26px;
    color: #909399;
  }

  .upload-plus-text {
    margin-top: 8px;
    color: #909399;
    font-size: 12px;
  }
}

.upload-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

/* 详情抽屉 */
::v-deep .el-drawer__header {
  height: 60px;
  line-height: 60px;
  font-size: 18px;
  color: #333;
  font-weight: bold;
  text-align: left;
  border-bottom: 1px solid #eeeeee;
  padding: 0 16px;
}

.detail-drawer {
  padding: 0 24px 20px;
  height: 100%;
  overflow: auto;
}

.detail-base-info {
  padding: 16px 0 6px;

  .info-line {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .info-item {
    min-width: 300px;
    text-align: left;
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: start;

    .label {
      color: #333;
      min-width: 112px;
      display: inline-block;
    }

    .value {
      margin-left: 12px;
      color: #333;
    }
  }
}

.detail-section {
  margin-top: 18px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #2373c8;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e5e5;

  .section-bar {
    width: 8px;
    height: 20px;
    background: #2373c8;
    border-radius: 2px;
    margin-right: 8px;
  }
}

.detail-footer {
  margin-top: 24px;
  padding: 20px 0 10px;
  text-align: right;
  border-top: 1px solid #eeeeee;

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
