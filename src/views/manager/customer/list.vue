<template>
  <div class="view-wrap customer-page">
    <!-- 搜索/筛选区域 -->
    <div class="search-section">
      <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
        <div class="search-row">
          <el-form-item label="关键词">
            <el-input
              v-model="queryParams.keyword"
              placeholder="客户编码/客户名称/联系人/电话"
              clearable
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item label="客户属地">
            <el-select
              v-model="queryParams.belong"
              placeholder="请选择"
              clearable
              style="width: 140px"
            >
              <el-option
                v-for="item in customerBelongOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户区域">
            <el-select
              v-model="queryParams.region"
              placeholder="客户区域"
              clearable
              style="width: 140px"
            >
              <el-option
                v-for="item in customerRegionOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="客户属性A">
            <el-select
              v-model="queryParams.attrA"
              placeholder="客户属性A"
              clearable
              style="width: 140px"
            >
              <el-option
                v-for="item in customerAttrAOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="search-row">
          <el-form-item label="客户属性B">
            <el-select
              v-model="queryParams.attrB"
              placeholder="客户属性B"
              clearable
              style="width: 140px"
            >
              <el-option
                v-for="item in customerAttrBOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="table-view">
      <div class="table-util-bar">
        <div class="table-title">客户列表</div>
        <div class="table-acts">
          <el-button type="primary" size="small" @click="handleImport">客户导入</el-button>
          <el-button type="primary" size="small" @click="handleExport">导出</el-button>
          <el-button type="primary" size="small" @click="handleAdd">新增客户</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="tableH"
          :height="tableHeight"
          :data="tableData"
          header-cell-class-name="table-header-cell"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="code" label="客户编码" min-width="100" show-overflow-tooltip />
          <el-table-column prop="name" label="客户名称" min-width="180" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span class="link-name" @click="handleView(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="territory" label="客户属地" min-width="90" show-overflow-tooltip />
          <el-table-column prop="region" label="客户区域" min-width="90" show-overflow-tooltip />
          <el-table-column prop="attrA" label="客户属性A" min-width="100" show-overflow-tooltip />
          <el-table-column prop="attrB" label="客户属性B" min-width="100" show-overflow-tooltip />
          <el-table-column
            prop="contactPerson"
            label="客户直接联系人"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="contactPhone"
            label="客户联系电话"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="companyPhone" label="公司电话" min-width="120" show-overflow-tooltip />
          <el-table-column prop="address" label="收货地址" min-width="200" show-overflow-tooltip />
          <el-table-column prop="receiver" label="收货人" min-width="90" show-overflow-tooltip />
          <el-table-column
            prop="receiverPhone"
            label="收货人联系方式"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="introducer" label="客户引入人" min-width="100" show-overflow-tooltip />
          <el-table-column prop="manager" label="客户负责人" min-width="100" show-overflow-tooltip />
          <el-table-column prop="other" label="其他" min-width="120" show-overflow-tooltip />
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span class="row-acts">
                <span class="row-act" @click="handleView(row)">查看详情</span>
                <span class="row-act" @click="handleEdit(row)">编辑</span>
                <span class="row-act" @click="handleDelete(row)">删除</span>
              </span>
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

    <!-- 删除确认弹框 -->
    <delete-dialog :visible.sync="deleteDialogVisible" @confirm="handleDeleteConfirm" />

    <!-- 查看详情 Drawer（从右往左展开） -->
    <detail-drawer :visible.sync="detailDrawerVisible" :detail-row="detailRow" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import DeleteDialog from "../components/delete-dialog.vue";
import DetailDrawer from "../components/detail-drawer.vue";

export default {
  name: "Customer",

  components: {
    DeleteDialog,
    DetailDrawer
  },
  data() {
    return {
      queryParams: {
        keyword: "",
        belong: "",
        region: "",
        attrA: "",
        attrB: "",
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      tableHeight: 0,
      tableData: [],
      selectedRows: [],
      deleteDialogVisible: false,
      rowToDelete: null,
      detailDrawerVisible: false,
      detailRow: null
    };
  },

  computed: {
    ...mapState([
      "customerBelongOptions",
      "customerRegionOptions",
      "customerAttrAOptions",
      "customerAttrBOptions"
    ])
  },

  mounted() {
    this.setView();
    this.loadList();
  },

  methods: {
    /** 设置表格高度（与 mtOrder 一致：可视区高度 - 表格顶部距离 - 头部 - 分页） */
    setView() {
      this.$nextTick(() => {
        const refTable = this.$refs.tableH;
        if (!refTable) return;
        const tableEl = refTable.$el ? refTable.$el : refTable;
        // 84 为头部高度，80 为分页高度
        const tableOffsetTop = tableEl.offsetTop + 85;
        const windowHeight = window.innerHeight;
        this.tableHeight = Math.max(windowHeight - tableOffsetTop, 200);
        const that = this;
        window.onresize = function() {
          const top = tableEl.offsetTop + 84 + 80;
          that.tableHeight = Math.max(window.innerHeight - top, 200);
        };
      });
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? "row-even" : "";
    },
    /** 将接口单条数据映射为表格行（含 addressJson/otherJson 解析） */
    mapApiRowToTableRow(item) {
      let addressObj = {};
      try {
        addressObj =
          typeof item.addressJson === "string"
            ? JSON.parse(item.addressJson || "{}")
            : item.addressJson || {};
      } catch (e) {
        addressObj = {};
      }
      const otherObj = item.otherJson || {};
      const territoryText =
        item.territory === 1 ? "国内" : item.territory === 2 ? "国外" : "";
      return {
        ...item,
        code: item.customerNo ?? "",
        name: item.title ?? "",
        territory: territoryText,
        region: item.region ?? "",
        attrA: item.attributeA ?? "",
        attrB: item.attributeB ?? "",
        contactPerson: item.contact ?? "",
        contactPhone: item.phone ?? "",
        companyPhone: item.companyPhone ?? "",
        address: addressObj.address ?? "",
        receiver: addressObj.name ?? "",
        receiverPhone: addressObj.phone ?? "",
        introducer: otherObj.introducer ?? "",
        manager: otherObj.superintendent ?? "",
        other: otherObj.other ?? ""
      };
    },
    loadList() {
      const params = {
        page: String(this.queryParams.pageNum),
        limit: String(this.queryParams.pageSize),
        keyword: this.queryParams.keyword || "",
        territory: this.queryParams.belong || "",
        region: this.queryParams.region || "",
        attributeA: this.queryParams.attrA || "",
        attributeB: this.queryParams.attrB || ""
      };
      this.$api({
        url: "/getCustomerList",
        method: "post",
        data: params
      })
        .then(res => {
          if (res && res.data) {
            const list = res.data.list || res.data.rows || [];
            this.tableData = list.map(row => this.mapApiRowToTableRow(row));
            this.total =
              res.data.count ?? res.data.total ?? this.tableData.length;
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
      this.$refs["queryForm"].resetFields();
      this.queryParams = {
        keyword: "",
        belong: "",
        region: "",
        attrA: "",
        attrB: "",
        pageNum: 1,
        pageSize: 20
      };
      this.loadList();
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    _parseJsonField(val) {
      if (val == null) return {};
      if (typeof val === "object") return val;
      try {
        return typeof val === "string" ? JSON.parse(val || "{}") : {};
      } catch (e) {
        return {};
      }
    },
    /** 调用详情接口并打开抽屉 */
    handleView(row) {
      const id = row.id;
      if (id == null || id === "") {
        this.$message.warning("缺少客户 id");
        return;
      }
      this.detailRow = null;
      this.detailDrawerVisible = true;
      this.$api({
        url: "/getCustomer",
        method: "post",
        data: {
          id: id
        }
      })
        .then(res => {
          if (res && res.data) {
            this.detailRow = this.mapDetailApiToDrawer(res.data);
          } else {
            this.$message.error("获取详情失败");
            this.detailDrawerVisible = false;
          }
        })
        .catch(() => {
          this.$message.error("获取详情失败");
          this.detailDrawerVisible = false;
        });
    },
    /** 将详情接口返回的数据映射为详情抽屉展示结构 */
    mapDetailApiToDrawer(data) {
      const payment = this._parseJsonField(data.paymentJson);
      const address = this._parseJsonField(data.addressJson);
      const other =
        data.otherJson && typeof data.otherJson === "object"
          ? data.otherJson
          : this._parseJsonField(data.otherJson);
      const licenseList = Array.isArray(data.licenseImage)
        ? data.licenseImage
        : [];
      const territoryText =
        data.territory === 1 ? "国内" : data.territory === 2 ? "国外" : "";
      return {
        ...data,
        code: data.customerNo ?? "",
        name: data.title ?? "",
        territory: territoryText,
        region: data.region ?? "",
        attrA: data.attributeA ?? "",
        attrB: data.attributeB ?? "",
        contactPerson: data.contact ?? "",
        contactPhone: data.phone ?? "",
        companyPhone: data.companyPhone ?? "",
        termMonth: data.termMonth ?? "",
        businessLicense: data.businessLicenseImage ?? "",
        medicalLicense1: licenseList[0] ?? "",
        accountName: payment.account ?? "",
        accountNo: payment.code ?? "",
        bankName: payment.bank ?? "",
        address: address.address ?? "",
        receiver: address.name ?? "",
        receiverPhone: address.phone ?? "",
        introducer: other.introducer ?? "",
        manager: other.superintendent ?? "",
        other: other.other ?? ""
      };
    },
    handleEdit(row) {
      this.$router.push({ path: "/manager/customer/add", query: { id: row.id } });
    },
    handleDelete(row) {
      this.rowToDelete = row;
      this.deleteDialogVisible = true;
    },
    handleDeleteConfirm() {
      if (!this.rowToDelete) return;
      const id = this.rowToDelete.id;
      this.$api({
        url: "/delCustomer",
        method: "post",
        data: { id: String(id) }
      })
        .then(() => {
          this.$message.success("删除成功");
          this.rowToDelete = null;
          this.deleteDialogVisible = false;
          this.loadList();
        })
        .catch(err => {
          this.$message.error(err && err.msg ? err.msg : "删除失败");
        });
    },
    handleAdd() {
      this.$router.push("/manager/customer/add");
    },
    handleImport() {
      // TODO: 客户导入
      this.$message.info("客户导入");
    },
    handleExport() {
      // TODO: 导出
      this.$message.info("导出");
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.loadList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.loadList();
    }
  }
};
</script>

<style lang="less" scoped>
.customer-page {
  background: #fff;
  // border: 1px solid #E6E6E6;
  border-radius: 8px;
}

.search-section {
  padding: 20px 24px;
  margin-bottom: 20px;
}

.search-form {
  .search-row {
    margin-bottom: 16px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  ::v-deep .el-form-item {
    margin-bottom: 0;
  }

  ::v-deep .el-form-item__label {
    color: #303133;
    font-size: 14px;
  }

  ::v-deep .el-input,
  ::v-deep .el-select {
    width: 236px !important;
  }

  ::v-deep .el-input__inner,
  ::v-deep .el-select .el-input__inner {
    padding-right: 15px;
    width: 236px;
    border-radius: 4px;
    border-color: #dcdfe6;
  }

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
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

    .el-button {
      background: linear-gradient(90deg, #157de9 0%, #3697fd 100%) !important;
    }
  }
}

.table-box {
  width: 100%;
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

.link-name {
  color: #2373c8;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.status-enable {
  color: #67c23a;
}

.status-disable {
  color: #909399;
}

.row-acts {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  .row-act {
    color: #3377fe;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      text-decoration: underline;
    }

    & + .row-act::before {
      content: "";
      display: inline-block;
      width: 1px;
      height: 12px;
      background: #dcdfe6;
      margin: 0 8px;
      vertical-align: middle;
    }
  }
}

.pagination-wrap {
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}
</style>
