<template>
    <div class="view-wrap product-inventory-detail">
        <div class="page-title">查看详情</div>

        <!-- 产品信息 -->
        <div class="block-section">
            <div class="block-title">
                <span class="block-title-bar" />
                <span>包装信息</span>
            </div>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">包装编码</span>
                        <span class="info-value">{{ productInfo.code }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">包装名称</span>
                        <span class="info-value">{{ productInfo.name }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">对应产品</span>
                        <span class="info-value">{{ productInfo.categoryName }}</span>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">客户名称</span>
                        <span class="info-value">{{ productInfo.customerName }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">单位</span>
                        <span class="info-value">{{ productInfo.unit }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">库存数量</span>
                        <span class="info-value">{{ productInfo.stockQuantity }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 出入库记录 -->
        <div class="block-section">
            <div class="block-title">
                <span class="block-title-bar" />
                <span>出入库记录</span>
            </div>
            <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                <!-- 入库记录 -->
                <el-tab-pane label="入库记录" name="in">
                    <div class="search-section">
                        <el-form :model="inQueryParams" ref="inQueryForm" inline class="search-form" label-width="80px">
                            <el-form-item label="入库单号">
                                <el-input v-model="inQueryParams.orderNo" placeholder="请输入" clearable
                                    style="width: 260px" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="handleInQuery">搜索</el-button>
                                <el-button @click="resetInQuery">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="table-box">
                        <el-table :data="inTableData" header-cell-class-name="table-header-cell"
                            :row-class-name="tableRowClassName">
                            <el-table-column prop="inQuantity" label="本次入库数量" min-width="120" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="inDate" label="入库日期" min-width="120" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="quantityBefore" label="变动前数量" min-width="110" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="quantityAfter" label="变动后数量" min-width="110" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="kuNo" label="单号" min-width="140" align="center"
                                show-overflow-tooltip />
                            <el-table-column label="操作" width="160" align="center" fixed="right">
                                <template slot-scope="{ row }">
                                    <span class="row-acts">
                                        <span class="row-act" @click="handleInDetail(row)">查看详情</span>
                                        <!-- <span class="row-act" @click="handleInEdit(row)">编辑</span> -->
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-wrap">
                            <el-pagination @size-change="handleInSizeChange" @current-change="handleInCurrentChange"
                                :current-page="inQueryParams.pageNum" :page-sizes="[10, 20, 50]"
                                :page-size="inQueryParams.pageSize" layout="total, prev, pager, next"
                                :total="inTotal" />
                        </div>
                    </div>
                </el-tab-pane>

                <!-- 出库记录 -->
                <el-tab-pane label="出库记录" name="out">
                    <div class="search-section">
                        <el-form :model="outQueryParams" ref="outQueryForm" inline class="search-form"
                            label-width="80px">
                            <el-form-item label="出库单号">
                                <el-input v-model="outQueryParams.orderNo" placeholder="请输入" clearable
                                    style="width: 260px" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="handleOutQuery">搜索</el-button>
                                <el-button @click="resetOutQuery">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="table-box">
                        <el-table :data="outTableData" header-cell-class-name="table-header-cell"
                            :row-class-name="tableRowClassName">
                            <el-table-column prop="outQuantity" label="本次出库数量" min-width="120" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="outDate" label="出库日期" min-width="120" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="quantityBefore" label="变动前数量" min-width="110" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="quantityAfter" label="变动后数量" min-width="110" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="kuNo" label="单号" min-width="140" align="center"
                                show-overflow-tooltip />
                            <el-table-column label="操作" width="120" align="center" fixed="right">
                                <template slot-scope="{ row }">
                                    <span class="row-acts">
                                        <span class="row-act" @click="handleOutDetail(row)">查看详情</span>
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-wrap">
                            <el-pagination @size-change="handleOutSizeChange" @current-change="handleOutCurrentChange"
                                :current-page="outQueryParams.pageNum" :page-sizes="[10, 20, 50]"
                                :page-size="outQueryParams.pageSize" background
                                layout="total, prev, pager, next, jumper" :total="outTotal" />
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 入库详情抽屉：从右向左打开，宽度 800px -->
        <el-drawer title="入库详情" :visible.sync="inDetailDrawerVisible" direction="rtl" size="800px" append-to-body
            :close-on-click-modal="false" @closed="onInDetailDrawerClosed">
            <div class="in-detail-drawer">
                <div class="in-detail-info">
                    <div class="in-detail-info-item">
                        <span class="label">入库单号：</span>
                        <span class="value">{{ inDetailInfo.orderNo }}</span>
                    </div>
                    <div class="in-detail-info-item">
                        <span class="label">入库时间：</span>
                        <span class="value">{{ inDetailInfo.inTime }}</span>
                    </div>
                </div>
                <div class="in-detail-table-wrap">
                    <el-table :data="inDetailGoodsList" border header-cell-class-name="table-header-cell">
                        <el-table-column type="index" label="序号" width="60" align="center" />
                        <el-table-column prop="packName" label="包装名称" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="unit" label="单位" width="80" align="center" />
                        <el-table-column prop="quantity" label="本次入库数量" width="120" align="center" />
                    </el-table>
                </div>
                <div class="in-detail-footer">
                    <el-button type="primary" @click="inDetailDrawerVisible = false">确定</el-button>
                    <el-button @click="inDetailDrawerVisible = false">取消</el-button>
                </div>
            </div>
        </el-drawer>

        <!-- 出库详情抽屉：从右向左打开，宽度 800px -->
        <el-drawer title="出库详情" :visible.sync="outDetailDrawerVisible" direction="rtl" size="800px" append-to-body
            :close-on-click-modal="false" @closed="onOutDetailDrawerClosed">
            <div class="in-detail-drawer">
                <div class="out-detail-info">
                    <div class="wrap">
                        <div class="in-detail-info-item">
                            <span class="label">出库单号：</span>
                            <span class="value">{{ outDetailInfo.orderNo }}</span>
                        </div>
                        <div class="in-detail-info-item">
                            <span class="label">出库时间：</span>
                            <span class="value">{{ outDetailInfo.outTime }}</span>
                        </div>
                    </div>
                    <!-- <div class="wrap">
                        <div class="in-detail-info-item">
                            <span class="label">出库单名称：</span>
                            <span class="value">{{ outDetailInfo.customerName }}</span>
                        </div>
                        <div class="in-detail-info-item">
                            <span class="label">出库单备注：</span>
                            <span class="value">{{ outDetailInfo.customerName }}</span>
                        </div>
                    </div> -->
                </div>
                <div class="in-detail-table-wrap">
                    <el-table :data="outDetailGoodsList" border header-cell-class-name="table-header-cell">
                        <el-table-column type="index" label="序号" width="60" align="center" />
                        <el-table-column prop="packName" label="包装名称" min-width="120" show-overflow-tooltip />
                        <!-- <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip /> -->
                        <el-table-column prop="unit" label="单位" width="80" align="center" />
                        <el-table-column prop="quantity" label="本次出库数量" width="120" align="center" />
                    </el-table>
                </div>
                <div class="in-detail-footer">
                    <el-button type="primary" @click="outDetailDrawerVisible = false">确定</el-button>
                    <el-button @click="outDetailDrawerVisible = false">取消</el-button>
                </div>
            </div>
        </el-drawer>

        <!-- 编辑入库抽屉：从右向左打开，宽度 800px，样式同新增入库 -->
        <el-drawer :title="editInDrawerTitle" :visible.sync="editInDrawerVisible" direction="rtl" size="800px"
            :before-close="closeEditInDrawer">
            <div class="add-in-drawer">
                <div class="add-in-form-head">
                    <el-form label-width="90px" class="add-in-form">
                        <el-form-item label="入库时间：">
                            <el-date-picker v-model="editInForm.inTime" type="date" placeholder="默认今天"
                                value-format="yyyy-MM-dd" style="width: 100%" />
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" class="add-product-btn" @click="addEditInProduct">添加产品</el-button>
                </div>
                <div class="add-in-table-wrap">
                    <el-table :data="editInProductList" border header-cell-class-name="table-header-cell">
                        <el-table-column label="序号" width="70" align="center">
                            <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
                        </el-table-column>
                        <el-table-column label="产品名称" min-width="140">
                            <template slot-scope="{ row }">
                                <el-input v-if="row.isEditing" v-model="row.productName" placeholder="搜索选择"
                                    size="small" />
                                <span v-else>{{ row.productName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="规格" min-width="120">
                            <template slot-scope="{ row }">
                                <el-input v-if="row.isEditing" v-model="row.spec" placeholder="搜索选择" size="small" />
                                <span v-else>{{ row.spec }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" width="80" align="center">
                            <template slot-scope="{ row }">
                                <el-input v-if="row.isEditing" v-model="row.unit" size="small" placeholder="单位" />
                                <span v-else>{{ row.unit }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="本次入库数量" width="120" align="center">
                            <template slot-scope="{ row }">
                                <el-input v-if="row.isEditing" v-model.number="row.quantity" placeholder="请输入"
                                    size="small" />
                                <span v-else>{{ row.quantity }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140" align="center" fixed="right">
                            <template slot-scope="{ row, $index }">
                                <span class="row-acts">
                                    <template v-if="row.isEditing">
                                        <span class="row-act" @click="saveEditInProduct($index)">保存</span>
                                    </template>
                                    <template v-else>
                                        <span class="row-act" @click="editEditInProduct($index)">编辑</span>
                                        <span class="row-act" @click="deleteEditInProduct($index)">删除</span>
                                    </template>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="in-detail-footer">
                    <el-button type="primary" @click="confirmEditIn">确定</el-button>
                    <el-button @click="closeEditInDrawer">取消</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
const DETAIL_API = '/getForeignPackKuCun';
const LOG_LIST_API = '/getForeignPackKuCunLogList';
const LOG_DETAIL_API = '/getForeignPackKuCunLog';

export default {
    name: 'ExternalPackageFromCustomerDetail',

    data() {
        return {
            kuCunId: '',
            /** 出入库记录列表用 */
            foreignPackId: '',
            productInfo: {
                code: '',
                name: '',
                categoryName: '',
                customerName: '',
                unit: '',
                stockQuantity: ''
            },
            activeTab: 'in',
            inQueryParams: {
                orderNo: '',
                pageNum: 1,
                pageSize: 20
            },
            inTotal: 0,
            inTableData: [],
            outQueryParams: {
                orderNo: '',
                pageNum: 1,
                pageSize: 20
            },
            outTotal: 0,
            outTableData: [],
            inDetailDrawerVisible: false,
            inDetailInfo: {
                orderNo: '',
                inTime: ''
            },
            inDetailGoodsList: [],
            outDetailDrawerVisible: false,
            outDetailInfo: {
                orderNo: '',
                outTime: ''
            },
            outDetailGoodsList: [],
            editInDrawerVisible: false,
            editInDrawerTitle: '编辑入库',
            editInRecordId: null,
            editInForm: {
                inTime: ''
            },
            editInProductList: []
        };
    },

    created() {
        this.kuCunId = this.$route.query.id || '';
        this.loadProductInfo();
    },

    methods: {
        loadProductInfo() {
            const id = this.kuCunId;
            if (!id) {
                this.$message.warning('缺少库存记录id');
                return;
            }
            this.$api({
                url: DETAIL_API,
                method: 'post',
                data: { id: String(id) }
            })
                .then(res => {
                    if (res && res.code === 200 && res.data) {
                        const d = res.data;
                        const fp = d.foreign_pack || {};
                        this.foreignPackId =
                            d.foreignPackId != null
                                ? String(d.foreignPackId)
                                : fp.id != null
                                    ? String(fp.id)
                                    : '';
                        const pt = d.productTitle;
                        const ct = d.customerTitle;
                        this.productInfo = {
                            code: fp.packNo || '',
                            name: fp.title || '',
                            categoryName: pt != null && String(pt) !== '' ? String(pt) : '—',
                            customerName: ct != null && String(ct) !== '' ? String(ct) : '—',
                            unit: fp.unit || '',
                            stockQuantity: d.num != null ? String(d.num) : '0'
                        };
                        if (this.activeTab === 'in') {
                            this.loadInList();
                        } else {
                            this.loadOutList();
                        }
                    } else {
                        this.$message.error((res && res.msg) || '获取详情失败');
                    }
                })
                .catch(() => {
                    this.$message.error('获取详情失败');
                });
        },
        handleTabClick(tab) {
            if (tab.name === 'in') {
                this.loadInList();
            } else {
                this.loadOutList();
            }
        },
        tableRowClassName({ rowIndex }) {
            return rowIndex % 2 === 1 ? 'row-even' : '';
        },
        mapLogRow(it) {
            return {
                id: it.id,
                kuNo: it.kuNo || '',
                inQuantity: it.num != null ? String(it.num) : '',
                inDate: it.created_at || '',
                outQuantity: it.num != null ? String(it.num) : '',
                outDate: it.created_at || '',
                quantityBefore: it.yNum != null ? String(it.yNum) : '',
                quantityAfter: it.xNum != null ? String(it.xNum) : ''
            };
        },
        loadInList() {
            if (!this.foreignPackId) {
                this.inTableData = [];
                this.inTotal = 0;
                return;
            }
            this.$api({
                url: LOG_LIST_API,
                method: 'post',
                data: {
                    page: String(this.inQueryParams.pageNum),
                    limit: String(this.inQueryParams.pageSize),
                    keyword: this.inQueryParams.orderNo || '',
                    type: '1',
                    foreignPackId: this.foreignPackId
                }
            })
                .then(res => {
                    if (res && res.code === 200 && res.data) {
                        const raw = Array.isArray(res.data.list) ? res.data.list : [];
                        this.inTableData = raw.map(it => this.mapLogRow(it));
                        this.inTotal = res.data.count != null ? res.data.count : raw.length;
                    } else {
                        this.inTableData = [];
                        this.inTotal = 0;
                    }
                })
                .catch(() => {
                    this.inTableData = [];
                    this.inTotal = 0;
                });
        },
        handleInQuery() {
            this.inQueryParams.pageNum = 1;
            this.loadInList();
        },
        resetInQuery() {
            this.inQueryParams.orderNo = '';
            this.inQueryParams.pageNum = 1;
            this.$refs.inQueryForm && this.$refs.inQueryForm.resetFields();
            this.loadInList();
        },
        handleInSizeChange(val) {
            this.inQueryParams.pageSize = val;
            this.loadInList();
        },
        handleInCurrentChange(val) {
            this.inQueryParams.pageNum = val;
            this.loadInList();
        },
        fetchLogDetail(id) {
            return this.$api({
                url: LOG_DETAIL_API,
                method: 'post',
                data: { id: String(id) }
            });
        },
        /** 变动详情：data 可为多条包装明细数组 */
        normalizeForeignPackLogDetail(data) {
            if (Array.isArray(data)) {
                if (!data.length) {
                    return { header: {}, goods: [] };
                }
                const first = data[0];
                const header = {
                    kuNo: first.kuNo || '',
                    time: first.created_at || ''
                };
                const goods = data.map(it => {
                    const fp = it.foreign_pack || {};
                    return {
                        packName: fp.title || '',
                        unit: fp.unit || '',
                        quantity: it.num != null ? String(it.num) : ''
                    };
                });
                return { header, goods };
            }
            const d = data && typeof data === 'object' ? data : {};
            const fp = d.foreign_pack || {};
            return {
                header: {
                    kuNo: d.kuNo || '',
                    time: d.created_at || ''
                },
                goods: [
                    {
                        packName: fp.title || '',
                        unit: fp.unit || '',
                        quantity: d.num != null ? String(d.num) : ''
                    }
                ]
            };
        },
        handleInDetail(row) {
            const id = row.id != null ? String(row.id) : '';
            if (!id) {
                this.$message.warning('缺少记录id');
                return;
            }
            this.fetchLogDetail(id)
                .then(res => {
                    if (res && res.code === 200 && res.data != null) {
                        const { header, goods } = this.normalizeForeignPackLogDetail(res.data);
                        this.inDetailInfo = {
                            orderNo: header.kuNo || '',
                            inTime: header.time || ''
                        };
                        this.inDetailGoodsList = goods.length ? goods : [];
                        this.inDetailDrawerVisible = true;
                    } else {
                        this.$message.error((res && res.msg) || '获取详情失败');
                    }
                })
                .catch(() => {
                    this.$message.error('获取详情失败');
                });
        },
        onInDetailDrawerClosed() {
            this.inDetailGoodsList = [];
            this.inDetailInfo = { orderNo: '', inTime: '' };
        },
        handleInEdit(row) {
            this.editInDrawerTitle = '编辑入库';
            this.editInRecordId = row.id;
            this.editInForm.inTime = row.inDate || this.getTodayStr();
            this.editInProductList = [
                { productName: '单层牙齿盘', spec: '98,A1,10mm', unit: '盒', quantity: 10, isEditing: false },
                { productName: '单层牙齿盘', spec: '98,A1,10mm', unit: '盒', quantity: 10, isEditing: false }
            ];
            this.editInDrawerVisible = true;
        },
        getTodayStr() {
            const d = new Date();
            return (
                d.getFullYear() +
                '-' +
                String(d.getMonth() + 1).padStart(2, '0') +
                '-' +
                String(d.getDate()).padStart(2, '0')
            );
        },
        closeEditInDrawer(done) {
            if (typeof done === 'function') {
                done();
            } else {
                this.editInDrawerVisible = false;
            }
            this.editInRecordId = null;
            this.editInForm.inTime = '';
            this.editInProductList = [];
        },
        confirmEditIn() {
            this.$message.success('保存成功');
            this.editInDrawerVisible = false;
            this.editInRecordId = null;
            this.editInForm.inTime = '';
            this.editInProductList = [];
            this.loadInList();
        },
        addEditInProduct() {
            this.editInProductList.push({
                productName: '',
                spec: '',
                unit: '盒',
                quantity: '',
                isEditing: true
            });
        },
        saveEditInProduct(index) {
            const row = this.editInProductList[index];
            if (!row.productName || row.quantity === '' || row.quantity === undefined) {
                this.$message.warning('请填写产品名称和本次入库数量');
                return;
            }
            this.$set(row, 'isEditing', false);
        },
        editEditInProduct(index) {
            this.$set(this.editInProductList[index], 'isEditing', true);
        },
        deleteEditInProduct(index) {
            this.editInProductList.splice(index, 1);
        },
        loadOutList() {
            if (!this.foreignPackId) {
                this.outTableData = [];
                this.outTotal = 0;
                return;
            }
            this.$api({
                url: LOG_LIST_API,
                method: 'post',
                data: {
                    page: String(this.outQueryParams.pageNum),
                    limit: String(this.outQueryParams.pageSize),
                    keyword: this.outQueryParams.orderNo || '',
                    type: '2',
                    foreignPackId: this.foreignPackId
                }
            })
                .then(res => {
                    if (res && res.code === 200 && res.data) {
                        const raw = Array.isArray(res.data.list) ? res.data.list : [];
                        this.outTableData = raw.map(it => this.mapLogRow(it));
                        this.outTotal = res.data.count != null ? res.data.count : raw.length;
                    } else {
                        this.outTableData = [];
                        this.outTotal = 0;
                    }
                })
                .catch(() => {
                    this.outTableData = [];
                    this.outTotal = 0;
                });
        },
        handleOutQuery() {
            this.outQueryParams.pageNum = 1;
            this.loadOutList();
        },
        resetOutQuery() {
            this.outQueryParams.orderNo = '';
            this.outQueryParams.pageNum = 1;
            this.$refs.outQueryForm && this.$refs.outQueryForm.resetFields();
            this.loadOutList();
        },
        handleOutSizeChange(val) {
            this.outQueryParams.pageSize = val;
            this.loadOutList();
        },
        handleOutCurrentChange(val) {
            this.outQueryParams.pageNum = val;
            this.loadOutList();
        },
        handleOutDetail(row) {
            const id = row.id != null ? String(row.id) : '';
            if (!id) {
                this.$message.warning('缺少记录id');
                return;
            }
            this.fetchLogDetail(id)
                .then(res => {
                    if (res && res.code === 200 && res.data != null) {
                        const { header, goods } = this.normalizeForeignPackLogDetail(res.data);
                        this.outDetailInfo = {
                            orderNo: header.kuNo || '',
                            outTime: header.time || ''
                        };
                        this.outDetailGoodsList = goods.length ? goods : [];
                        this.outDetailDrawerVisible = true;
                    } else {
                        this.$message.error((res && res.msg) || '获取详情失败');
                    }
                })
                .catch(() => {
                    this.$message.error('获取详情失败');
                });
        },
        onOutDetailDrawerClosed() {
            this.outDetailGoodsList = [];
            this.outDetailInfo = { orderNo: '', outTime: '' };
        }
    }
};
</script>

<style lang="less" scoped>
.product-inventory-detail {
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

.block-section {
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
}

.block-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #2373C8;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #E5E5E5;

    .block-title-bar {
        width: 8px;
        height: 20px;
        background: #2373C8;
        border-radius: 2px;
        margin-right: 8px;
    }
}

.info-grid {
    padding: 20px 24px;
}

.info-row {
    display: flex;
    margin-bottom: 16px;

    &:last-child {
        margin-bottom: 0;
    }
}

.info-item {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;

    .info-label {
        color: #606266;
        font-size: 14px;
        width: 110px;
        flex-shrink: 0;
        text-align: left;
    }

    .info-value {
        color: #303133;
        font-size: 14px;
    }
}

.search-section {
    padding: 30px 0;
    margin-bottom: 0;
    text-align: left;
    border-top: 1px solid #EDF0F6;
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

    ::v-deep .el-input__inner {
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

::v-deep .el-tabs__header {
    margin-bottom: 0;
}

::v-deep .el-tabs__item {
    font-size: 14px;
    color: #606266;

    &.is-active {
        color: #157de9;
        font-weight: 500;
    }
}

::v-deep .el-tabs__ink-bar {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%);
}

::v-deep .el-tabs__active-bar {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%);
}

::v-deep .el-tabs__nav-wrap::after {
    display: none;
}

::v-deep .el-tabs__content {
    overflow: visible;
}

.table-box {
    margin-top: 0;

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
    padding: 16px 0;
    display: flex;
    justify-content: flex-end;
}

::v-deep .el-drawer__header {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    color: #333;
    font-weight: bold;
    text-align: left;
    padding-left: 30px;
    border-bottom: 1px solid #EEEEEE;
    padding: 0 16px;
}

/* 入库详情抽屉内容 */
.in-detail-drawer {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.in-detail-info {
    margin-bottom: 20px;
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: center;
    padding: 0 60px;

    .in-detail-info-item {
        margin-bottom: 8px;
        flex: 1;
        text-align: left;

        .label {
            color: #333;
        }

        .value {
            margin-left: 24px;
        }
    }
}

.out-detail-info {
    margin-bottom: 20px;
    font-size: 14px;
    color: #333;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0 60px;

    .wrap {
        display: flex;
        align-items: center;

        .in-detail-info-item {
            margin-bottom: 0;
            flex: 1;
            text-align: left;

            .label {
                color: #333;
            }

            .value {
                margin-left: 24px;
            }
        }
    }
}

.in-detail-table-wrap {
    flex: 1;
    overflow: auto;
    padding: 0 30px;

    ::v-deep .el-table {
        font-size: 14px;

        .table-header-cell {
            background: #f5f7fa;
            color: #303133;
            font-weight: 500;
        }
    }
}

.in-detail-footer {
    margin-top: 24px;
    padding: 20px 15px;
    text-align: right;
    border-top: 1px solid #EEEEEE;

    .el-button--primary {
        background: #2373C8 !important;
        border: none;
    }

    .el-button:not(.el-button--primary) {
        background: #fff;
        border: 1px solid #B8B8B8;
        color: #6A6A6A;
    }
}

/* 编辑入库/新增入库抽屉 */
.add-in-drawer {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 4px;
}

.add-in-form-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 0 20px 0 0;

    .add-in-form {
        flex: 1;

        ::v-deep .el-form-item {
            margin-bottom: 0;
        }

        ::v-deep .el-form-item__label {
            color: #333;
        }
    }

    .add-product-btn {
        flex-shrink: 0;
        margin-left: 16px;
    }
}

.add-in-table-wrap {
    flex: 1;
    overflow: auto;
    padding: 0 0 16px;

    ::v-deep .el-table {
        font-size: 14px;

        .table-header-cell {
            background: #f5f7fa;
            color: #303133;
            font-weight: 500;
        }
    }
}
</style>
