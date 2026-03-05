<template>
    <div class="view-wrap customer-page">
        <!-- 搜索/筛选区域 -->
        <div class="search-section">
            <el-form :model="queryParams" ref="queryForm" inline class="search-form" label-width="80px">
                <div class="search-row">
                    <el-form-item label="关键词">
                        <el-input v-model="queryParams.keyword" placeholder="公司名称/姓名/电话" clearable
                            style="width: 260px" />
                    </el-form-item>
                    <el-form-item label="业务员">
                        <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 140px">
                            <el-option label="启用" value="1" />
                            <el-option label="禁用" value="0" />
                        </el-select>
                    </el-form-item>
                    <!-- 时间筛选 -->
                    <el-form-item label="时间筛选">
                        <el-date-picker v-model="queryParams.date" type="daterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" clearable style="width: 236px" />
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
                <div class="table-tabs">
                    <div v-for="(tab, index) in auditTabs" :key="index" class="tab-item"
                        :class="{ active: auditTab === tab.value }" @click="handleAuditTabChange(tab.value)">
                        {{ tab.label }}
                    </div>
                </div>
                <div class="table-acts">
                    <!-- <el-button type="primary" size="small" @click="handleImport">客户导入</el-button> -->
                    <el-button type="primary" size="small" @click="handleExport">导出</el-button>
                    <!-- <el-button type="primary" size="small" @click="handleAdd">新增客户</el-button> -->
                </div>
            </div>
            <div class="table-box">
                <el-table ref="tableH" :height="tableHeight" :data="tableData"
                    header-cell-class-name="table-header-cell" :row-class-name="tableRowClassName">
                    <el-table-column type="index" label="序号" width="70" align="center" />
                    <el-table-column prop="orderNo" label="询盘编号" min-width="130" show-overflow-tooltip />
                    <el-table-column prop="customerName" label="公司名称" min-width="200" show-overflow-tooltip>
                        <template slot-scope="{ row }">
                            <span class="link-name" @click="handleView(row)">{{ row.customerName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dosageForm" label="姓名" min-width="80" show-overflow-tooltip />
                    <el-table-column prop="address" label="电话" min-width="260" show-overflow-tooltip />
                    <el-table-column prop="orderType" label="询盘内容" min-width="110" show-overflow-tooltip />
                    <el-table-column prop="deliveryPlanTime" label="询盘时间" min-width="140" show-overflow-tooltip />
                    <el-table-column prop="payMethod" label="业务员" min-width="110" show-overflow-tooltip />
                    <el-table-column label="操作" width="220" align="center" fixed="right">
                        <template slot-scope="{ row }">
                            <span class="row-acts">
                                <span class="row-act" @click="handleView(row)">查看详情</span>
                                <span class="row-act" @click="handleAudit(row)">分配业务员</span>
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-wrap">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="queryParams.pageNum" :page-sizes="[10, 20, 50, 100]"
                        :page-size="queryParams.pageSize" layout="total, prev, pager, next, jumper" :total="total" />
                </div>
            </div>
        </div>

        <!-- 分配业务员弹框 -->
        <el-dialog
            :visible.sync="auditDialogVisible"
            title="分配业务员"
            :close-on-click-modal="false"
            width="480px"
            custom-class="assign-dialog"
        >
            <el-form label-width="80px" class="assign-form">
                <el-form-item label="业务员：">
                    <el-select v-model="assignSalesman" placeholder="请选择" clearable style="width: 260px">
                        <el-option
                            v-for="item in salesmanOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="assign-dialog-footer">
                <el-button type="primary" @click="handleAssignSubmit">提交</el-button>
                <el-button @click="auditDialogVisible = false">取消</el-button>
            </div>
        </el-dialog>

        <!-- 询盘详情 Drawer -->
        <el-drawer
            title="询盘详情"
            :visible.sync="detailDrawerVisible"
            direction="rtl"
            size="800px"
            :append-to-body="true"
            :with-header="true"
        >
            <div class="inquiry-drawer-body">
                <el-row :gutter="24" class="inquiry-row">
                    <el-col :span="8" class="inquiry-item">
                        <span class="inquiry-label">询盘编号：</span>
                        <span class="inquiry-value">{{ inquiryDetail.inquiryNo }}</span>
                    </el-col>
                    <el-col :span="16" class="inquiry-item">
                        <span class="inquiry-label">公司名称：</span>
                        <span class="inquiry-value">{{ inquiryDetail.companyName }}</span>
                    </el-col>
                </el-row>

                <el-row :gutter="24" class="inquiry-row">
                    <el-col :span="8" class="inquiry-item">
                        <span class="inquiry-label">姓名：</span>
                        <span class="inquiry-value">{{ inquiryDetail.contactName }}</span>
                    </el-col>
                    <el-col :span="16" class="inquiry-item">
                        <span class="inquiry-label">电话：</span>
                        <span class="inquiry-value">{{ inquiryDetail.phone }}</span>
                    </el-col>
                </el-row>

                <el-row :gutter="24" class="inquiry-row">
                    <el-col :span="8" class="inquiry-item">
                        <span class="inquiry-label">询盘时间：</span>
                        <span class="inquiry-value">{{ inquiryDetail.inquiryTime }}</span>
                    </el-col>
                    <el-col :span="16" class="inquiry-item">
                        <span class="inquiry-label">业务员：</span>
                        <span class="inquiry-value">{{ inquiryDetail.salesman || '-' }}</span>
                    </el-col>
                </el-row>

                <el-row :gutter="24" class="inquiry-row">
                    <el-col :span="24" class="inquiry-item inquiry-item-block">
                        <span class="inquiry-label">询盘内容：</span>
                        <span class="inquiry-value inquiry-content">{{ inquiryDetail.content }}</span>
                    </el-col>
                </el-row>

                <div class="inquiry-drawer-footer">
                    <el-button type="primary" @click="detailDrawerVisible = false">确定</el-button>
                    <el-button @click="detailDrawerVisible = false">取消</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>

export default {
    name: 'InquiryDataList',
    data() {
        return {
            queryParams: {
                keyword: '',
                status: '',
                region: '',
                attr: '',
                type: '',
                pageNum: 1,
                pageSize: 20
            },
            total: 0,
            tableHeight: 0,
            tableData: [
                {
                    id: 1,
                    orderNo: '2020001-959',
                    customerName: '浙江立汇医疗科技有限公司',
                    dosageForm: '颗粒',
                    address: '浙江立汇医疗科技有限公司天目大道566号',
                    orderAmount: '2564.00',
                    orderType: '标研订单',
                    orderStatus: '待审批',
                    deliveryPlanTime: '2026-01-08',
                    payMethod: '预付款',
                    deliveryMethod: '快递',
                    accountPeriod: '1个月',
                    accountDate: '2026-01-05',
                    payDueDate: '2026-02-05',
                    paymentStatus: '待回款',
                    auditStatus: 'pending',
                    orderTime: '2026-01-05'
                },
                {
                    id: 2,
                    orderNo: '2020001-965',
                    customerName: '浙江中汇医疗科技有限公司',
                    dosageForm: '颗粒',
                    address: '浙江中汇医疗科技有限公司天目大道566号',
                    orderAmount: '2564.00',
                    orderType: '标研订单',
                    orderStatus: '待发货',
                    deliveryPlanTime: '2026-01-10',
                    payMethod: '预付款',
                    deliveryMethod: '快递',
                    accountPeriod: '2个月',
                    accountDate: '2026-01-05',
                    payDueDate: '2026-03-05',
                    paymentStatus: '部分回款',
                    auditStatus: 'pending',
                    orderTime: '2026-01-05'
                },
                {
                    id: 3,
                    orderNo: '2020001-978',
                    customerName: '示例客户C',
                    dosageForm: '颗粒',
                    address: '示例客户C的收货地址',
                    orderAmount: '1280.00',
                    orderType: '标研订单',
                    orderStatus: '已发货',
                    deliveryPlanTime: '2026-01-06',
                    payMethod: '预付款',
                    deliveryMethod: '快递',
                    accountPeriod: '1个月',
                    accountDate: '2026-01-06',
                    payDueDate: '2026-02-06',
                    paymentStatus: '全部回款',
                    auditStatus: 'audited',
                    orderTime: '2026-01-06'
                }
            ],
            rowToDelete: null,
            auditDialogVisible: false,
            rowToAudit: null,
            auditTab: 'delivery',
            auditTabs: [
                { label: '待分配', value: 'delivery' },
                { label: '已分配', value: 'delivered' }
            ],
            detailDrawerVisible: false,
            inquiryDetail: {
                inquiryNo: '',
                companyName: '',
                contactName: '',
                phone: '',
                inquiryTime: '',
                salesman: '',
                content: ''
            },
            assignSalesman: '',
            salesmanOptions: [
                { label: '业务员A', value: 'A' },
                { label: '业务员B', value: 'B' }
            ]
        };
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
            // TODO: 根据 auditTab 调用接口获取列表
            this.total = this.tableData.length;
        },
        handleAuditTabChange(value) {
            this.auditTab = value;
            this.queryParams.pageNum = 1;
            this.loadList();
        },
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.loadList();
        },
        resetQuery() {
            this.$refs.queryForm.resetFields();
            this.queryParams.pageNum = 1;
            this.loadList();
        },
        handleView(row) {
            const safeRow = row || {};
            this.inquiryDetail = {
                inquiryNo: safeRow.orderNo || '',
                companyName: safeRow.customerName || '',
                contactName: safeRow.dosageForm || '',
                phone: safeRow.address || '',
                inquiryTime: safeRow.orderTime || safeRow.deliveryPlanTime || '',
                salesman: safeRow.payMethod || '',
                content: safeRow.orderType || ''
            };
            this.detailDrawerVisible = true;
        },
        handleAudit(row) {
            this.rowToAudit = row;
            this.auditDialogVisible = true;
        },
        handleAuditConfirm({ auditStatus, auditRemark }) {
            if (!this.rowToAudit) return;
            // TODO: 调用审核接口，传入 this.rowToAudit.id, auditStatus, auditRemark
            this.$message.success(auditStatus === 'approve' ? '审核已通过' : '已拒绝');
            this.rowToAudit = null;
            this.loadList();
        },
        handleEdit(row) {
            // TODO: 编辑
            this.$message.info('编辑：' + row.name);
        },
        handleAdd() {
            this.$router.push('/manager/customer-add');
        },
        handleImport() {
            // TODO: 客户导入
            this.$message.info('客户导入');
        },
        handleExport() {
            // TODO: 导出
            this.$message.info('导出');
        },
        handleSizeChange(val) {
            this.queryParams.pageSize = val;
            this.loadList();
        },
        handleCurrentChange(val) {
            this.queryParams.pageNum = val;
            this.loadList();
        },
        handleAssignSubmit() {
            if (!this.assignSalesman) {
                this.$message.warning('请选择业务员');
                return;
            }
            // TODO: 分配业务员接口，可使用 this.rowToAudit 与 this.assignSalesman
            this.$message.success('分配成功');
            this.auditDialogVisible = false;
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
        background: linear-gradient(90deg, #157DE9 0%, #3697FD 100%) !important;
    }
}

.table-view {
    overflow: hidden;
}

.table-util-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0;
    margin: 0 27px 25px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;

    .table-tabs {
        display: flex;
        align-items: center;
        gap: 32px;
        height: 44px;
        position: relative;

        .tab-item {
            font-size: 15px;
            color: #909399;
            cursor: pointer;
            padding: 0 4px 16px;
            position: relative;
            transition: color 0.2s;

            &:hover {
                color: #606266;
            }

            &.active {
                color: #3377fe;
                font-weight: 500;

                &::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -4px;
                    height: 2px;
                    background: #3377fe;
                    border-radius: 1px;
                }
            }
        }
    }

    .table-acts {
        display: flex;
        align-items: center;
        gap: 10px;

        .el-button {
            background: linear-gradient(90deg, #157DE9 0%, #3697FD 100%) !important;
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

        .el-table__body tr:hover>td {
            background: #f5f7fa !important;
        }
    }
}

.link-name {
    color: #2373C8;
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

        &+.row-act::before {
            content: '';
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

.inquiry-drawer-body {
    position: relative;
    height: 100%;
    padding: 18px 24px 88px;
    box-sizing: border-box;
}

.inquiry-row {
    margin-bottom: 18px;
}

.inquiry-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #303133;
    line-height: 22px;
}

.inquiry-item-block {
    align-items: flex-start;
}

.inquiry-label {
    width: 80px;
    color: #606266;
    flex: none;
}

.inquiry-value {
    color: #303133;
    word-break: break-all;
}

.inquiry-content {
    display: inline-block;
    max-width: 100%;
}

.inquiry-drawer-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px 24px;
    border-top: 1px solid #ebeef5;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}
:deep(.el-drawer__header) {
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    text-align: left;
    padding: 0 24px;
    border-bottom: 1px solid #EDF0F6;
}

.assign-form {
    padding: 0 20px 0 0;

    ::v-deep .el-form-item {
        margin-bottom: 0;
    }

    ::v-deep .el-form-item__label {
        color: #606266;
        font-size: 14px;
    }

    ::v-deep .el-select {
        width: 260px;
    }

    ::v-deep .el-input__inner,
    ::v-deep .el-select .el-input__inner {
        border-radius: 4px;
    }
}

.assign-dialog-footer {
    display: flex;
    align-items: center;
    justify-content: center;

    .el-button {
        min-width: 88px;
    }

    .el-button--primary {
        margin-right: 12px;
    }
}
</style>