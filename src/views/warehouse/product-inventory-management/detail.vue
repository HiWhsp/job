<template>
    <div class="view-wrap product-inventory-detail">
        <div class="page-title">查看详情</div>

        <!-- 产品信息 -->
        <div class="block-section">
            <div class="block-title">
                <span class="block-title-bar" />
                <span>产品信息</span>
            </div>
            <div class="info-grid">
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">产品编码</span>
                        <span class="info-value">{{ productInfo.code }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">产品名称</span>
                        <span class="info-value">{{ productInfo.name }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">所属分类</span>
                        <span class="info-value">{{ productInfo.categoryName }}</span>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">规格</span>
                        <span class="info-value">{{ productInfo.spec }}</span>
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
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">库存预警数量</span>
                        <span class="info-value">{{ productInfo.warnQuantity }}</span>
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
                            <el-table-column prop="quantityBefore" label="入库前数量" min-width="120" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="quantityAfter" label="入库后数量" min-width="120" align="center"
                                show-overflow-tooltip />
                            <el-table-column label="操作" width="160" align="center" fixed="right">
                                <template slot-scope="{ row }">
                                    <span class="row-acts">
                                        <span class="row-act" @click="handleInDetail(row)">查看详情</span>
                                        <span class="row-act" @click="handleInEdit(row)">编辑</span>
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
                            <el-table-column prop="orderNo" label="对应出库单号" min-width="140" align="center"
                                show-overflow-tooltip />
                            <el-table-column prop="customerName" label="客户名称" min-width="180" show-overflow-tooltip />
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
        <el-drawer title="入库详情" :visible.sync="inDetailDrawerVisible" direction="rtl" size="800px"
            :before-close="closeInDetailDrawer">
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
                        <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="unit" label="单位" width="80" align="center" />
                        <el-table-column prop="quantity" label="本次入库数量" width="120" align="center" />
                    </el-table>
                </div>
                <div class="in-detail-footer">
                    <el-button type="primary" @click="confirmInDetail">确定</el-button>
                    <el-button @click="closeInDetailDrawer">取消</el-button>
                </div>
            </div>
        </el-drawer>

        <!-- 出库详情抽屉：从右向左打开，宽度 800px -->
        <el-drawer title="出库详情" :visible.sync="outDetailDrawerVisible" direction="rtl" size="800px"
            :before-close="closeOutDetailDrawer">
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
                    <div class="wrap">
                        <div class="in-detail-info-item">
                            <span class="label">客户名称：</span>
                            <span class="value">{{ outDetailInfo.customerName }}</span>
                        </div>
                    </div>
                </div>
                <div class="in-detail-table-wrap">
                    <el-table :data="outDetailGoodsList" border header-cell-class-name="table-header-cell">
                        <el-table-column type="index" label="序号" width="60" align="center" />
                        <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="spec" label="规格" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="unit" label="单位" width="80" align="center" />
                        <el-table-column prop="quantity" label="本次出库数量" width="120" align="center" />
                    </el-table>
                </div>
                <div class="in-detail-footer">
                    <el-button type="primary" @click="confirmOutDetail">确定</el-button>
                    <el-button @click="closeOutDetailDrawer">取消</el-button>
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
                            <el-date-picker
                                v-model="editInForm.inTime"
                                type="date"
                                placeholder="默认今天"
                                value-format="yyyy-MM-dd"
                                style="width: 100%"
                            />
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" class="add-product-btn" @click="openEditAddProductDialog">添加产品</el-button>
                </div>
                <div class="add-in-table-wrap">
                    <el-table :data="editInProductList" border header-cell-class-name="table-header-cell">
                        <el-table-column label="序号" width="70" align="center">
                            <template slot-scope="{ $index }">{{ String($index + 1).padStart(3, '0') }}</template>
                        </el-table-column>
                        <el-table-column label="产品名称" min-width="140">
                            <template slot-scope="{ row }">
                                <el-input v-if="row.isEditing" v-model="row.productName" placeholder="搜索选择" size="small" />
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
                                <el-input v-if="row.isEditing" v-model.number="row.quantity" placeholder="请输入" size="small" />
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

        <!-- 编辑入库：添加产品弹框（与列表新增入库一致） -->
        <el-dialog
            title="添加产品"
            :visible.sync="editProductDialogVisible"
            width="820px"
            custom-class="add-product-dialog"
            :close-on-click-modal="false"
            append-to-body
            @close="closeEditProductDialog"
        >
            <div class="dialog-search">
                <el-form :model="editProductQuery" ref="editProductQueryForm" inline label-width="80px">
                    <el-form-item label="关键词" prop="keyword">
                        <el-input
                            v-model="editProductQuery.keyword"
                            placeholder="产品名称/产品编码"
                            clearable
                            style="width: 220px"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchEditProduct">搜索</el-button>
                        <el-button @click="resetEditProductQuery">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="dialog-table-wrap">
                <el-table
                    ref="editProductTable"
                    :data="editProductList"
                    max-height="380"
                    header-cell-class-name="table-header-cell"
                    @selection-change="handleEditProductSelectionChange"
                >
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column prop="productNo" label="产品编码" min-width="120" show-overflow-tooltip />
                    <el-table-column prop="title" label="产品名称" min-width="140" show-overflow-tooltip />
                    <el-table-column prop="spec" label="规格" min-width="140" show-overflow-tooltip />
                    <el-table-column prop="cateTitle" label="所属分类" min-width="120" show-overflow-tooltip />
                    <el-table-column label="本次入库数量" width="120" align="center">
                        <template slot-scope="{ row }">
                            <el-input v-model="row.quantity" placeholder="请输入" size="small" style="width: 90px" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位" width="80" align="center" />
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editProductDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmEditAddProduct">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
const DETAIL_API = '/getProductKuCun';
const LOG_LIST_API = '/getProductKuCunLogList';
/** 库存变动记录详情：出入库单条记录 id */
const LOG_DETAIL_API = '/getProductKuCunLog';
/** 新增/编辑入库（编辑时多传 id） */
const ADD_IN_API = '/addProductKuCunRu';
const PRODUCT_LIST_API = '/getProductList';

export default {
    name: 'ProductInventoryDetail',

    data() {
        return {
            kuCunId: '',
            inventoryId: '',
            productInfo: {
                code: '',
                name: '',
                categoryName: '',
                spec: '',
                unit: '',
                stockQuantity: '',
                warnQuantity: ''
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
                outTime: '',
                customerName: ''
            },
            outDetailGoodsList: [],
            editInDrawerVisible: false,
            editInDrawerTitle: '编辑入库',
            editInRecordId: null,
            editInForm: {
                inTime: ''
            },
            editInProductList: [],
            editInRowId: 0,
            // 编辑入库：添加产品弹框
            editProductDialogVisible: false,
            editProductQuery: {
                keyword: '',
                pageNum: 1,
                pageSize: 50
            },
            editProductList: [],
            editProductSelected: []
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
                        const product = d.product || {};
                        const inventory = d.inventory || {};
                        this.inventoryId =
                            d.inventoryId != null
                                ? String(d.inventoryId)
                                : inventory.id != null
                                    ? String(inventory.id)
                                    : '';
                        this.productInfo = {
                            code: product.productNo || '',
                            name: product.title || '',
                            categoryName: d.cateTitle || '',
                            spec: inventory.keyVals || inventory.sn || '',
                            unit: product.unit || '',
                            stockQuantity: d.num != null ? String(d.num) : '',
                            warnQuantity: d.yjNum != null ? String(d.yjNum) : ''
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
        // 入库记录 type=1
        loadInList() {
            if (!this.inventoryId) {
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
                    type: '1',
                    inventoryId: this.inventoryId
                }
            })
                .then(res => {
                    if (res && res.code === 200 && res.data) {
                        const raw = Array.isArray(res.data.list) ? res.data.list : [];
                        const list = raw.map(it => ({
                            id: it.id,
                            kuNo: it.kuNo || '',
                            inQuantity: it.num != null ? String(it.num) : '',
                            inDate: it.created_at || '',
                            quantityBefore: it.yNum != null ? String(it.yNum) : '',
                            quantityAfter: it.xNum != null ? String(it.xNum) : ''
                        }));
                        const kw = (this.inQueryParams.orderNo || '').trim();
                        this.inTableData = kw
                            ? list.filter(r => (r.kuNo || '').indexOf(kw) !== -1)
                            : list;
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
            this.$refs.inQueryForm && this.$refs.inQueryForm.resetFields();
            this.inQueryParams.pageNum = 1;
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
        _parseJson(val) {
            if (val == null || val === '') return null;
            if (typeof val === 'object') return val;
            try {
                return typeof val === 'string' ? JSON.parse(val) : val;
            } catch (e) {
                return null;
            }
        },
        /** 单对象详情里解析多行明细（goodsList / productJson 等） */
        _parseLogDetailGoods(d) {
            if (!d || typeof d !== 'object') return [];
            let arr = null;
            if (Array.isArray(d.goodsList)) arr = d.goodsList;
            else if (Array.isArray(d.products)) arr = d.products;
            else if (Array.isArray(d.list)) arr = d.list;
            else if (d.productJson != null) {
                const p = this._parseJson(d.productJson);
                if (Array.isArray(p)) arr = p;
            }
            if (arr && arr.length) {
                return arr.map(it => ({
                    productName: it.title || it.productName || it.name || '',
                    spec:
                        it.spec ||
                        it.keyVals ||
                        (it.inventory && (it.inventory.keyVals || it.inventory.sn)) ||
                        '',
                    unit: it.unit || '',
                    quantity:
                        it.num != null
                            ? String(it.num)
                            : it.quantity != null
                                ? String(it.quantity)
                                : ''
                }));
            }
            const p = d.product || {};
            const inv = d.inventory || {};
            if (p.title || p.productNo || inv.keyVals) {
                return [
                    {
                        productName: p.title || '',
                        spec: inv.keyVals || inv.sn || '',
                        unit: p.unit || '',
                        quantity: d.num != null ? String(d.num) : ''
                    }
                ];
            }
            return [];
        },
        /**
         * 详情接口 data 可能是数组（同一 kuNo 多条规格）或单对象
         * 示例数组项：product / inventory / num / kuNo / created_at
         */
        normalizeLogDetailResponse(data) {
            if (Array.isArray(data)) {
                if (!data.length) {
                    return { header: {}, goods: [] };
                }
                const first = data[0];
                const header = {
                    kuNo: first.kuNo || '',
                    created_at: first.created_at || '',
                    customerName:
                        first.customerName ||
                        (first.customer &&
                            (first.customer.title || first.customer.name || first.customer.companyName)) ||
                        ''
                };
                const goods = data.map(it => {
                    const p = it.product || {};
                    const inv = it.inventory || {};
                    return {
                        productName: p.title || '',
                        spec: inv.keyVals || inv.sn || '',
                        unit: p.unit || '',
                        quantity: it.num != null ? String(it.num) : ''
                    };
                });
                return { header, goods };
            }
            const d = data && typeof data === 'object' ? data : {};
            let goods = this._parseLogDetailGoods(d);
            if (!goods.length) {
                goods = [
                    {
                        productName: this.productInfo.name,
                        spec: this.productInfo.spec,
                        unit: this.productInfo.unit,
                        quantity: d.num != null ? String(d.num) : ''
                    }
                ];
            }
            return {
                header: {
                    kuNo: d.kuNo || d.orderNo || '',
                    created_at: d.created_at || d.inTime || d.outTime || d.time || '',
                    customerName:
                        d.customerName ||
                        (d.customer &&
                            (d.customer.title || d.customer.name || d.customer.companyName)) ||
                        ''
                },
                goods
            };
        },
        applyLogDetailToInDrawer(data) {
            const { header, goods } = this.normalizeLogDetailResponse(data);
            this.inDetailInfo = {
                orderNo: header.kuNo || '',
                inTime: header.created_at || ''
            };
            this.inDetailGoodsList = goods;
        },
        applyLogDetailToOutDrawer(data) {
            const { header, goods } = this.normalizeLogDetailResponse(data);
            this.outDetailInfo = {
                orderNo: header.kuNo || '',
                outTime: header.created_at || '',
                customerName: header.customerName || ''
            };
            this.outDetailGoodsList = goods;
        },
        fetchLogDetail(id) {
            return this.$api({
                url: LOG_DETAIL_API,
                method: 'post',
                data: { id: String(id) }
            });
        },
        handleInDetail(row) {
            const id = row.id != null ? String(row.id) : '';
            if (!id) {
                this.$message.warning('缺少变动记录id');
                return;
            }
            this.fetchLogDetail(id)
                .then(res => {
                    if (res && res.code === 200 && res.data != null) {
                        this.applyLogDetailToInDrawer(res.data);
                        this.inDetailDrawerVisible = true;
                    } else {
                        this.$message.error((res && res.msg) || '获取详情失败');
                    }
                })
                .catch(() => {
                    this.$message.error('获取详情失败');
                });
        },
        closeInDetailDrawer(done) {
            if (typeof done === 'function') {
                done();
            } else {
                this.inDetailDrawerVisible = false;
            }
        },
        confirmInDetail() {
            this.inDetailDrawerVisible = false;
        },
        /**
         * 编辑入库：根据 getProductKuCunLog 返回（数组或单对象）回填表格
         */
        applyEditInFromDetail(data) {
            let rows = [];
            this.editInRowId = 0;
            if (Array.isArray(data)) {
                data.forEach(it => {
                    const p = it.product || {};
                    const inv = it.inventory || {};
                    this.editInRowId += 1;
                    rows.push({
                        _key: this.editInRowId,
                        productName: p.title || '',
                        spec: inv.keyVals || inv.sn || '',
                        unit: p.unit || '',
                        quantity: it.num != null ? String(it.num) : '',
                        productId:
                            it.productId != null ? String(it.productId) : p.id != null ? String(p.id) : '',
                        inventoryId:
                            it.inventoryId != null
                                ? String(it.inventoryId)
                                : inv.id != null
                                    ? String(inv.id)
                                    : '',
                        isEditing: false
                    });
                });
            } else {
                const d = data || {};
                const p = d.product || {};
                const inv = d.inventory || {};
                this.editInRowId = 1;
                rows = [
                    {
                        _key: 1,
                        productName: p.title || '',
                        spec: inv.keyVals || inv.sn || '',
                        unit: p.unit || '',
                        quantity: d.num != null ? String(d.num) : '',
                        productId:
                            d.productId != null ? String(d.productId) : p.id != null ? String(p.id) : '',
                        inventoryId:
                            d.inventoryId != null
                                ? String(d.inventoryId)
                                : inv.id != null
                                    ? String(inv.id)
                                    : '',
                        isEditing: false
                    }
                ];
            }
            this.editInProductList = rows;
            let firstTime = '';
            if (Array.isArray(data) && data.length) {
                firstTime = (data[0].created_at || '').slice(0, 10);
            } else if (data && data.created_at) {
                firstTime = (data.created_at || '').slice(0, 10);
            }
            this.editInForm.inTime = firstTime || this.getTodayStr();
        },
        handleInEdit(row) {
            const id = row.id != null ? String(row.id) : '';
            if (!id) {
                this.$message.warning('缺少记录id');
                return;
            }
            this.editInDrawerTitle = '编辑入库';
            this.editInRecordId = row.id;
            const loading = this.$loading({ lock: true, text: '加载中...', spinner: 'el-icon-loading' });
            this.fetchLogDetail(id)
                .then(res => {
                    loading.close();
                    if (res && res.code === 200 && res.data != null) {
                        this.applyEditInFromDetail(res.data);
                        this.editInDrawerVisible = true;
                    } else {
                        this.$message.error((res && res.msg) || '获取入库单失败');
                    }
                })
                .catch(() => {
                    loading.close();
                    this.$message.error('获取入库单失败');
                });
        },
        getTodayStr() {
            const d = new Date();
            return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
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
            this.editInRowId = 0;
        },
        confirmEditIn() {
            const recordId = this.editInRecordId != null ? String(this.editInRecordId) : '';
            if (!recordId) {
                this.$message.warning('缺少编辑记录id');
                return;
            }
            if (!this.editInProductList.length) {
                this.$message.warning('请添加产品');
                return;
            }
            if (this.editInProductList.some(r => r.isEditing)) {
                this.$message.warning('请先保存正在编辑的行');
                return;
            }
            const kuInfos = [];
            for (let i = 0; i < this.editInProductList.length; i++) {
                const r = this.editInProductList[i];
                const q = String(r.quantity || '').trim();
                const num = Number(q);
                if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
                    this.$message.warning('请为每行填写有效的正整数入库数量');
                    return;
                }
                if (!r.inventoryId || !r.productId) {
                    this.$message.warning('明细缺少产品或规格信息，请通过「添加产品」选择');
                    return;
                }
                kuInfos.push({
                    id: String(r.inventoryId),
                    productId: String(r.productId),
                    num: String(num)
                });
            }
            this.$api({
                url: ADD_IN_API,
                method: 'post',
                data: {
                    kuInfos: JSON.stringify(kuInfos),
                    id: recordId
                }
            })
                .then(res => {
                    if (res && res.code === 200) {
                        this.$message.success('保存成功');
                        this.editInDrawerVisible = false;
                        this.editInRecordId = null;
                        this.editInForm.inTime = '';
                        this.editInProductList = [];
                        this.editInRowId = 0;
                        this.loadInList();
                    } else {
                        this.$message.error((res && res.msg) || '保存失败');
                    }
                })
                .catch(() => {
                    this.$message.error('保存失败');
                });
        },
        openEditAddProductDialog() {
            this.editProductDialogVisible = true;
            this.$nextTick(() => {
                this.searchEditProduct();
            });
        },
        closeEditProductDialog() {
            this.editProductQuery.keyword = '';
            this.editProductQuery.pageNum = 1;
            this.editProductSelected = [];
            this.$nextTick(() => {
                this.$refs.editProductTable && this.$refs.editProductTable.clearSelection();
            });
        },
        searchEditProduct() {
            const params = {
                limit: String(this.editProductQuery.pageSize),
                page: String(this.editProductQuery.pageNum),
                keyword: this.editProductQuery.keyword || '',
                cateId: ''
            };
            this.$api({
                url: PRODUCT_LIST_API,
                method: 'post',
                data: params
            })
                .then(res => {
                    if (res && res.code === 200 && res.data) {
                        const list = Array.isArray(res.data.list) ? res.data.list : [];
                        this.editProductList = list.map(it => ({
                            id: it.id != null ? String(it.id) : '',
                            title: it.title || '',
                            productNo: it.productNo || '',
                            spec: it.keyVals || '',
                            unit: it.unit || '',
                            cateTitle: it.cateTitle || '',
                            inventoryId: it.inventoryId != null ? String(it.inventoryId) : '',
                            quantity: ''
                        }));
                    } else {
                        this.editProductList = [];
                    }
                })
                .catch(() => {
                    this.editProductList = [];
                });
        },
        resetEditProductQuery() {
            this.$refs.editProductQueryForm && this.$refs.editProductQueryForm.resetFields();
            this.editProductQuery.pageNum = 1;
            this.searchEditProduct();
        },
        handleEditProductSelectionChange(selection) {
            this.editProductSelected = selection || [];
        },
        confirmEditAddProduct() {
            const sel = this.editProductSelected || [];
            if (!sel.length) {
                this.$message.warning('请先勾选要添加的产品');
                return;
            }
            for (let i = 0; i < sel.length; i++) {
                const p = sel[i];
                const q = String(p.quantity || '').trim();
                if (!q) {
                    this.$message.warning('请为勾选的产品填写本次入库数量');
                    return;
                }
                const num = Number(q);
                if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
                    this.$message.warning('入库数量须为正整数');
                    return;
                }
                if (!p.inventoryId) {
                    this.$message.warning('所选产品缺少规格/库存记录，请确认产品已维护规格');
                    return;
                }
            }
            sel.forEach(p => {
                const num = Number(String(p.quantity).trim());
                const existing = this.editInProductList.find(
                    r => r.productId === p.id && r.inventoryId === p.inventoryId
                );
                if (existing) {
                    existing.quantity = String((Number(existing.quantity) || 0) + num);
                } else {
                    this.editInRowId += 1;
                    this.editInProductList.push({
                        _key: this.editInRowId,
                        productName: p.title,
                        spec: p.spec,
                        unit: p.unit || '',
                        quantity: String(num),
                        productId: p.id,
                        inventoryId: p.inventoryId,
                        isEditing: false
                    });
                }
            });
            this.editProductDialogVisible = false;
            this.$message.success('添加成功');
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
        // 出库记录 type=2
        loadOutList() {
            if (!this.inventoryId) {
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
                    type: '2',
                    inventoryId: this.inventoryId
                }
            })
                .then(res => {
                    if (res && res.code === 200 && res.data) {
                        const raw = Array.isArray(res.data.list) ? res.data.list : [];
                        const list = raw.map(it => ({
                            id: it.id,
                            kuNo: it.kuNo || '',
                            outQuantity: it.num != null ? String(it.num) : '',
                            outDate: it.created_at || '',
                            orderNo: it.kuNo || '',
                            customerName: ''
                        }));
                        const kw = (this.outQueryParams.orderNo || '').trim();
                        this.outTableData = kw
                            ? list.filter(r => (r.kuNo || '').indexOf(kw) !== -1)
                            : list;
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
            this.$refs.outQueryForm && this.$refs.outQueryForm.resetFields();
            this.outQueryParams.pageNum = 1;
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
                this.$message.warning('缺少变动记录id');
                return;
            }
            this.fetchLogDetail(id)
                .then(res => {
                    if (res && res.code === 200 && res.data != null) {
                        this.applyLogDetailToOutDrawer(res.data);
                        this.outDetailDrawerVisible = true;
                    } else {
                        this.$message.error((res && res.msg) || '获取详情失败');
                    }
                })
                .catch(() => {
                    this.$message.error('获取详情失败');
                });
        },
        closeOutDetailDrawer(done) {
            if (typeof done === 'function') {
                done();
            } else {
                this.outDetailDrawerVisible = false;
            }
        },
        confirmOutDetail() {
            this.outDetailDrawerVisible = false;
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

.dialog-search {
    margin-bottom: 12px;
}
</style>
