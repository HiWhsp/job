<template>
  <div class="view-wrap inventory-check-page">
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="90px">
        <el-form-item label="盘点名称">
          <el-input v-model="queryParams.checkName" placeholder="请输入" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="盘点单号">
          <el-input v-model="queryParams.checkNo" placeholder="请输入" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="时间筛选">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-title">原料库存盘点</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleAddCheck">新增盘点</el-button>
          <el-button size="small" @click="handleExport">导出</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="tableRef"
          :height="tableHeight"
          :data="tableData"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
        >
          <el-table-column label="序号" width="70" align="center">
            <template slot-scope="scope">
              {{ String((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1).padStart(3, '0') }}
            </template>
          </el-table-column>
          <el-table-column prop="checkNo" label="盘点单号" min-width="140" show-overflow-tooltip />
          <el-table-column prop="checkName" label="盘点名称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip />
          <el-table-column prop="checkTime" label="盘点时间" width="170" align="center" />
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-act" @click="handleViewDetail(row)">查看详情</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryParams.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="queryParams.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
          />
        </div>
      </div>
    </div>

    <el-dialog
      title="新增盘点"
      :visible.sync="addCheckDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @close="handleAddCheckDialogClose"
    >
      <el-form ref="addCheckForm" :model="addCheckForm" :rules="addCheckRules" label-width="100px">
        <el-form-item label="盘点名称：" prop="checkName">
          <el-input v-model="addCheckForm.checkName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="addCheckForm.remark" type="textarea" :rows="3" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="盘点图片：" prop="attachmentUrl">
          <el-upload
            class="check-upload"
            list-type="picture-card"
            :action="uploadAction"
            name="file"
            :file-list="checkFileList"
            accept="image/*"
            :limit="1"
            :on-success="handleCheckUploadSuccess"
            :on-remove="handleCheckUploadRemove"
            :http-request="handleCheckUploadRequest"
          >
            <div class="upload-inner">
              <i class="el-icon-plus" />
              <span class="upload-tip">添加图片</span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="handleAddCheckSubmit">提交</el-button>
        <el-button @click="addCheckDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-drawer
      title="盘点详情"
      :visible.sync="stocktakDetailVisible"
      direction="rtl"
      size="560px"
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="stocktak-detail-drawer-wrap"
      @closed="onStocktakDetailClosed"
    >
      <div class="stocktak-detail-drawer">
        <div class="stocktak-detail-info">
          <div class="row-wrap">
            <div class="info-row">
              <span class="label">盘点名称：</span>
              <span class="value">{{ stocktakDetail.title }}</span>
            </div>
            <div class="info-row">
              <span class="label">盘点单号：</span>
              <span class="value">{{ stocktakDetail.stocktakNo }}</span>
            </div>
          </div>
          <div class="info-row">
            <span class="label">备注：</span>
            <div class="value value-multiline">{{ stocktakDetail.cont || '—' }}</div>
          </div>
          <div v-if="isImageUrl(stocktakDetail.url)" class="info-row">
            <span class="label">盘点图片：</span>
            <div class="value">
              <el-image
                class="detail-thumb"
                :src="stocktakDetail.url"
                fit="contain"
                :preview-src-list="[stocktakDetail.url]"
              />
            </div>
          </div>
          <div v-else-if="stocktakDetail.url" class="info-row">
            <span class="label">附件：</span>
            <div class="value">{{ stocktakDetail.url }}</div>
          </div>
        </div>
        <div class="stocktak-detail-footer">
          <el-button type="primary" @click="stocktakDetailVisible = false">确定</el-button>
          <el-button @click="stocktakDetailVisible = false">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from 'axios';
import { UPLOAD_ROOT } from '@/config/env.js';

const LIST_API = '/getMaterialStocktakList';
const ADD_API = '/addMaterialStocktak';
const DETAIL_API = '/getMaterialStocktakInfo';

export default {
  name: 'WarehouseMaterialInventoryCheck',

  data() {
    return {
      queryParams: {
        checkName: '',
        checkNo: '',
        dateRange: null,
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      submitLoading: false,
      uploadAction: UPLOAD_ROOT,
      checkFileList: [],
      addCheckDialogVisible: false,
      addCheckForm: {
        checkName: '',
        remark: '',
        attachmentUrl: ''
      },
      addCheckRules: {
        checkName: [{ required: true, message: '请输入盘点名称', trigger: 'blur' }],
        attachmentUrl: [{ required: true, message: '请上传盘点图片', trigger: 'change' }]
      },
      stocktakDetailVisible: false,
      stocktakDetail: {
        title: '',
        stocktakNo: '',
        cont: '',
        url: '',
        created_at: '',
        updated_at: ''
      }
    };
  },

  mounted() {
    this.setView();
    this.loadList();
  },

  methods: {
    isImageUrl(str) {
      if (!str || typeof str !== 'string') return false;
      return /^https?:\/\//i.test(str) || /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(str);
    },
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
      return rowIndex % 2 === 1 ? 'row-even' : '';
    },
    loadList() {
      const dr = this.queryParams.dateRange;
      const start_time = Array.isArray(dr) && dr[0] ? dr[0] : '';
      const end_time = Array.isArray(dr) && dr[1] ? dr[1] : '';
      this.$api({
        url: LIST_API,
        method: 'post',
        data: {
          page: String(this.queryParams.pageNum),
          limit: String(this.queryParams.pageSize),
          title: this.queryParams.checkName || '',
          stocktakNo: this.queryParams.checkNo || '',
          start_time,
          end_time
        }
      })
        .then(res => {
          if (res && res.code === 200 && res.data) {
            const list = Array.isArray(res.data.list) ? res.data.list : [];
            this.tableData = list.map(it => ({
              id: it.id,
              checkNo: it.stocktakNo || '',
              checkName: it.title || '',
              remark: it.cont || '',
              checkTime: it.created_at || ''
            }));
            this.total = res.data.count != null ? res.data.count : list.length;
          } else {
            this.tableData = [];
            this.total = 0;
            if (res && res.msg) this.$message.error(res.msg);
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
      this.queryParams.checkName = '';
      this.queryParams.checkNo = '';
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
    handleAddCheck() {
      this.addCheckDialogVisible = true;
    },
    handleViewDetail(row) {
      const id = row.id != null ? String(row.id) : '';
      if (!id) {
        this.$message.warning('缺少盘点单 id');
        return;
      }
      const loading = this.$loading({ lock: true, text: '加载中...', spinner: 'el-icon-loading' });
      this.$api({
        url: DETAIL_API,
        method: 'post',
        data: { id }
      })
        .then(res => {
          loading.close();
          if (res && res.code === 200 && res.data) {
            const d = res.data;
            this.stocktakDetail = {
              title: d.title || '',
              stocktakNo: d.stocktakNo || '',
              cont: d.cont || '',
              url: d.url || '',
              created_at: d.created_at || '',
              updated_at: d.updated_at || ''
            };
            this.stocktakDetailVisible = true;
          } else {
            this.$message.error((res && res.msg) || '获取详情失败');
          }
        })
        .catch(() => {
          loading.close();
          this.$message.error('获取详情失败');
        });
    },
    onStocktakDetailClosed() {
      this.stocktakDetail = {
        title: '',
        stocktakNo: '',
        cont: '',
        url: '',
        created_at: '',
        updated_at: ''
      };
    },
    handleExport() {
      this.$message.info('导出');
    },
    handleAddCheckDialogClose() {
      this.addCheckForm.checkName = '';
      this.addCheckForm.remark = '';
      this.addCheckForm.attachmentUrl = '';
      this.checkFileList = [];
      this.$refs.addCheckForm && this.$refs.addCheckForm.resetFields();
    },
    handleCheckUploadRequest(option) {
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
    handleCheckUploadSuccess(res, file, fileList) {
      this.checkFileList = fileList || [];
      const r = res || (file && file.response);
      const payload = r && r.data ? r.data : r;
      const url =
        (r && r.url) ||
        (payload && (payload.path || payload.url)) ||
        (r && r.path) ||
        (file && file.url) ||
        '';
      if (url && file) file.url = url;
      if (url) {
        this.addCheckForm.attachmentUrl = url;
        this.$nextTick(() => {
          this.$refs.addCheckForm && this.$refs.addCheckForm.validateField('attachmentUrl');
        });
      }
    },
    handleCheckUploadRemove(file, fileList) {
      this.checkFileList = fileList || [];
      this.addCheckForm.attachmentUrl = '';
    },
    handleAddCheckSubmit() {
      this.$refs.addCheckForm.validate(valid => {
        if (!valid) return;
        const url = this.addCheckForm.attachmentUrl;
        if (!url) {
          this.$message.warning('请上传盘点图片');
          return;
        }
        this.submitLoading = true;
        this.$api({
          url: ADD_API,
          method: 'post',
          data: {
            title: this.addCheckForm.checkName,
            cont: this.addCheckForm.remark || '',
            url
          }
        })
          .then(res => {
            this.submitLoading = false;
            if (res && res.code === 200) {
              this.$message.success('提交成功');
              this.addCheckDialogVisible = false;
              this.handleAddCheckDialogClose();
              this.loadList();
            } else {
              this.$message.error((res && res.msg) || '提交失败');
            }
          })
          .catch(() => {
            this.submitLoading = false;
            this.$message.error('提交失败');
          });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.inventory-check-page {
  background: #fff;
  border-radius: 8px;
  height: 100%;
}

.search-section {
  padding: 20px 24px;
  margin-bottom: 20px;
  text-align: left;
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
    .el-table__body tr:hover > td {
      background: #f5f7fa !important;
    }
  }
}

.row-act {
  color: #3377fe;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
}

.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
}

.check-upload {
  display: flex;
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 1;
    display: flex;
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
    .el-icon-plus {
      font-size: 28px;
      margin-bottom: 8px;
      color: #8c939d;
    }
  }
  .upload-tip {
    font-size: 12px;
    color: #909399;
  }
}

::v-deep .el-dialog__footer {
  text-align: center;
}

::v-deep .stocktak-detail-drawer-wrap {
  .el-drawer__header {
    margin-bottom: 0;
    padding: 20px 20px 12px;
    font-weight: bold;
    font-size: 16px;
    border-bottom: 1px solid #eee;
  }
  .el-drawer__body {
    padding: 0;
  }
}

.stocktak-detail-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 0 16px;
}

.stocktak-detail-info {
  flex: 1;
  overflow: auto;
  padding: 20px 24px 0;
  font-size: 14px;
  color: #333;

  .row-wrap {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .info-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 26px;
    line-height: 22px;

    .label {
      flex-shrink: 0;
      width: 96px;
      color: #606266;
      text-align: right;
    }

    .value {
      flex: 1;
      margin-left: 12px;
      color: #303133;
      word-break: break-all;
    }

    .value-multiline {
      white-space: pre-wrap;
    }
  }

  .detail-thumb {
    max-width: 280px;
    max-height: 200px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    cursor: pointer;
  }
}

.stocktak-detail-footer {
  margin-top: auto;
  padding: 16px 24px 0;
  text-align: right;
  border-top: 1px solid #eee;

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    border: none;
  }
}
</style>
