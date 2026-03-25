<template>
  <div class="order-detail-page">
    <div class="page-title">订单详情</div>

    <!-- 订单基础信息 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">订单基础信息</span>
      </div>
      <div class="section-body">
        <!-- 一行三列 -->
        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">订单编号：</span>
            <span class="field-value">{{ detail.orderNo }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">下单时间：</span>
            <span class="field-value">{{ detail.created_at }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">销售金额：</span>
            <span class="field-value">{{ detail.orderPrice }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">订单类型：</span>
            <span class="field-value">{{ orderTypeText(detail.orderType) }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">是否需要审批：</span>
            <span class="field-value">{{ isApprovalText(detail.isApproval) }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">支付方式：</span>
            <span class="field-value">{{ payTypeText(detail.payType) }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">是否付款：</span>
            <span class="field-value">{{ isPayText(detail.isPay) }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">付款金额：</span>
            <span class="field-value">{{ detail.payPrice }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">库存是否满足要求：</span>
            <span class="field-value">{{ isManKuCunText(detail.isManKuCun) }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">是否接受分批发货：</span>
            <span class="field-value">{{ isMoreFaHuoText(detail.isMoreFaHuo) }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">包装规格：</span>
            <span class="field-value">{{ packTypeText(detail.packType, detail.packStr) }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">订单状态：</span>
            <el-tag :type="orderStatusTagType" size="small">
              {{ orderStatusText(detail.orderStatus) }}
            </el-tag>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">回款状态：</span>
            <el-tag :type="paymentStatusTagType" size="small">
              {{ payStatusText(detail.payStatus) }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="24" class="field-item field-images">
            <span class="field-label">合同图片：</span>
            <div class="image-list">
              <el-image v-for="(img, index) in detail.contractimages" :key="index" :src="img" fit="cover"
                class="thumb-image" />
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="24" class="field-item field-images">
            <span class="field-label">付款凭证：</span>
            <div class="image-list">
              <el-image v-for="(img, index) in detail.payImage" :key="index" :src="img" fit="cover"
                class="thumb-image" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 客户信息 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">客户信息</span>
      </div>
      <div class="section-body">
        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">客户编码：</span>
            <span class="field-value">{{ detail.customer.code }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">客户名称：</span>
            <span class="field-value">{{ detail.customer.name }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">客户属地：</span>
            <span class="field-value">{{ detail.customer.territory }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">客户区域：</span>
            <span class="field-value">{{ detail.customer.region }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">客户属性A：</span>
            <span class="field-value">{{ detail.customer.attr }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">客户属性B：</span>
            <span class="field-value">{{ detail.customer.attrB }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">客户直接联系人：</span>
            <span class="field-value">{{ detail.customer.contactPerson }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">客户联系电话：</span>
            <span class="field-value">{{ detail.customer.contactPhone }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">公司电话：</span>
            <span class="field-value">{{ detail.customer.companyPhone }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">户名：</span>
            <span class="field-value">{{ detail.customer.bankAccountName }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">账号：</span>
            <span class="field-value">{{ detail.customer.bankAccountNo }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">开户行：</span>
            <span class="field-value">{{ detail.customer.bankName }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">收货地址：</span>
            <span class="field-value">{{ detail.customer.address }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">收货人：</span>
            <span class="field-value">{{ detail.customer.receiver }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">收货人联系方式：</span>
            <span class="field-value">{{ detail.customer.receiverPhone }}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 产品信息 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">产品信息</span>
      </div>
      <div class="section-body">
        <el-table :data="detail.productList" class="product-table">
          <!-- <el-table-column type="selection" width="48" align="center" /> -->
          <el-table-column prop="code" label="产品编码" min-width="140" />
          <el-table-column prop="name" label="产品名称" min-width="160" />
          <el-table-column prop="spec" label="规格" min-width="140" />
          <el-table-column prop="category" label="所属分类" min-width="120" />
          <el-table-column prop="unit" label="单位" width="80" />
          <el-table-column prop="guidePrice" label="指导单价" min-width="120" />
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column prop="totalPrice" label="总价" min-width="120" />
          <el-table-column prop="stockQty" label="库存数量" min-width="100" />
          <el-table-column label="库存状态" min-width="100">
            <template slot-scope="scope">
              <span :class="[
                'stock-status-text',
                scope.row.stockStatus === '缺货' ? 'is-shortage' : 'is-normal'
              ]">
                {{ scope.row.stockStatus }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 外购产品信息 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">外购产品信息</span>
      </div>
      <div class="section-body">
        <el-table :data="detail.externalProductList" class="product-table">
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column prop="name" label="产品名称" min-width="160" />
          <el-table-column prop="spec" label="规格" min-width="140" />
          <el-table-column prop="unitPrice" label="单价" min-width="100" />
          <el-table-column prop="quantity" label="数量" min-width="80" />
          <el-table-column prop="arrivalQty" label="到货数量" min-width="100" />
          <el-table-column label="是否缺货" min-width="100">
            <template slot-scope="scope">
              <span :class="[
                'stock-status-text',
                scope.row.isShortage ? 'is-shortage' : 'is-normal'
              ]">
                {{ scope.row.isShortage ? '缺货' : '有货' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="总价" min-width="120" />
          <el-table-column prop="unit" label="单位" width="80" />
        </el-table>
      </div>
    </div>


    <div class="form-footer">
      <el-button type="primary" v-if="detail.orderStatus == 4" @click="submitOutboundShip">发货</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDeliveryApprovalDetail',

  data() {
    return {
      orderId: '',
      // 与 staff_order 表字段对应
      detail: {
        orderNo: '',
        created_at: '',
        orderPrice: '',
        orderType: null, // 1销售订单, 2样品订单
        priceType: null, // 1经销商, 2终端指导价格
        isApproval: null, // 1需要审核, 2不需要
        payType: null, // 1现结, 2账期, 3分期付款
        isPay: null, // 0未付款, 1已付款
        payPrice: '',
        isManKuCun: null, // 1满足, 2不满足
        isMoreFaHuo: null, // 1是, 2否
        packType: null, // 1标准彩盒, 2标准白盒, 3无包装, 4客户定制包装, 5其他
        packStr: '',
        contractimages: [],
        payImage: [],
        orderStatus: null, // 1待营销总监审核, 2待总经理审核, 3缺货审核, 4待发货, 5缺货, 6暂停, 7已发货, -1驳回
        payStatus: null, // 1未回款, 2部分回款, 3全部回款
        estimateTime: '',
        paymentTerm: '',
        paymentTermTime: '',
        reviewJson: '',
        reviewJson2: '',
        customerId: null,
        customer: {
          code: '',
          name: '',
          territory: '',
          region: '',
          attr: '',
          attrB: '',
          contactPerson: '',
          contactPhone: '',
          companyPhone: '',
          address: '',
          receiver: '',
          receiverPhone: '',
          bankAccountName: '',
          bankAccountNo: '',
          bankName: '',
          bankCode: ''
        },
        // 产品信息列表
        productList: [],
        // 外购产品信息列表
        externalProductList: []
      },
      /** 订单原始 productJson / foreignProductJson，用于申请出库 id 列表 */
      _productJsonRaw: [],
      _foreignProductJsonRaw: []
    };
  },

  computed: {
    orderStatusTagType() {
      const s = Number(this.detail.orderStatus);
      if (s === 5 || s === -1) return 'danger'; // 缺货, 驳回
      if (s === 7) return 'success'; // 已发货
      if (s === 6) return 'warning'; // 暂停
      return 'info';
    },
    paymentStatusTagType() {
      const s = Number(this.detail.payStatus);
      if (s === 1) return 'info'; // 未回款
      if (s === 2) return 'warning'; // 部分回款
      if (s === 3) return 'success'; // 全部回款
      return 'info';
    }
  },

  mounted() {
    const id = this.$route.query.id;
    if (!id) {
      this.$message.warning('缺少订单id');
      return;
    }
    this.orderId = String(id);
    this.loadDetail();
  },

  methods: {
    _splitImages(val) {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      if (typeof val !== 'string') return [];
      return val
        .split(',')
        .map(s => (s || '').trim())
        .filter(Boolean);
    },
    // 1销售订单, 2样品订单
    orderTypeText(v) {
      const s = Number(v);
      if (s === 1) return '销售订单';
      if (s === 2) return '样品订单';
      return v != null ? String(v) : '—';
    },
    // 1经销商, 2终端指导价格
    priceTypeText(v) {
      const s = Number(v);
      if (s === 1) return '经销商';
      if (s === 2) return '终端指导价格';
      return v != null ? String(v) : '—';
    },
    // 1需要审核, 2不需要
    isApprovalText(v) {
      const s = Number(v);
      if (s === 1) return '需要审核';
      if (s === 2) return '不需要';
      return v != null ? String(v) : '—';
    },
    // 1现结, 2账期, 3分期付款
    payTypeText(v) {
      const s = Number(v);
      if (s === 1) return '现结';
      if (s === 2) return '账期';
      if (s === 3) return '分期付款';
      return v != null ? String(v) : '—';
    },
    // 0未付款, 1已付款
    isPayText(v) {
      const s = Number(v);
      if (s === 0) return '未付款';
      if (s === 1) return '已付款';
      return v != null ? String(v) : '—';
    },
    // 库存是否满足: 1满足, 2不满足
    isManKuCunText(v) {
      const s = Number(v);
      if (s === 1) return '满足';
      if (s === 2) return '不满足';
      return v != null ? String(v) : '—';
    },
    // 是否接受分批发货: 1是, 2否
    isMoreFaHuoText(v) {
      const s = Number(v);
      if (s === 1) return '是';
      if (s === 2) return '否';
      return v != null ? String(v) : '—';
    },
    // 1标准彩盒, 2标准白盒, 3无包装, 4客户定制包装, 5其他(输入形式)
    packTypeText(type, packStr) {
      const s = Number(type);
      if (s === 1) return '标准彩盒';
      if (s === 2) return '标准白盒';
      if (s === 3) return '无包装';
      if (s === 4) return '客户定制包装';
      if (s === 5) return packStr ? `其他(${packStr})` : '其他';
      if (packStr) return packStr;
      return type != null ? String(type) : '—';
    },
    // 1待营销总监审核, 2待总经理审核, 3缺货审核, 4待发货, 5缺货, 6暂停, 7已发货, -1驳回
    orderStatusText(v) {
      const s = Number(v);
      const map = {
        1: '待营销总监审核',
        2: '待总经理审核',
        3: '缺货审核',
        4: '待发货',
        5: '缺货',
        6: '暂停',
        7: '已发货',
        [-1]: '驳回'
      };
      return map[s] != null ? map[s] : (v != null ? String(v) : '—');
    },
    // 1未回款, 2部分回款, 3全部回款
    payStatusText(status) {
      const s = Number(status);
      if (s === 1) return '未回款';
      if (s === 2) return '部分回款';
      if (s === 3) return '全部回款';
      return status != null ? String(status) : '—';
    },
    formatReviewJson(val) {
      if (!val) return '—';
      if (typeof val === 'string') {
        try {
          const arr = JSON.parse(val);
          return Array.isArray(arr) ? arr.map((it) => (it && it.remark) || JSON.stringify(it)).join('；') : val;
        } catch (_) {
          return val;
        }
      }
      return Array.isArray(val) ? val.map((it) => (it && it.remark) || JSON.stringify(it)).join('；') : String(val);
    },
    loadDetail() {
      if (!this.orderId) return;
      this.$api({
        url: '/getStaffOrder',
        method: 'post',
        data: { id: String(this.orderId) }
      })
        .then((res) => {
          if (!res || res.code !== 200 || !res.data) {
            this.$message.error('获取订单详情失败');
            return;
          }
          const data = res.data;

          const customerAddress = data.customerAddress || {};
          const productList = this.normalizeOrderLineArray(data.productJson);
          const foreignList = this.normalizeOrderLineArray(data.foreignProductJson);
          this._productJsonRaw = productList;
          this._foreignProductJsonRaw = foreignList;
          const orderStatusTitle = data.orderStatusTitle || this.orderStatusText(data.orderStatus);

          this.detail = {
            ...this.detail,
            orderNo: data.orderNo || '',
            created_at: data.created_at || '',
            orderPrice: data.orderPrice != null ? data.orderPrice : '',
            orderType: data.orderType,
            priceType: data.priceType,
            isApproval: data.isApproval,
            payType: data.payType,
            isPay: data.isPay,
            payPrice: data.payPrice != null ? data.payPrice : '',
            isManKuCun: data.isManKuCun,
            isMoreFaHuo: data.isMoreFaHuo,
            packType: data.packType,
            packStr: data.packStr != null ? String(data.packStr) : '',
            contractimages: this._splitImages(data.contractimages || data.contractImages),
            payImage: this._splitImages(data.paylmage || data.payImage),
            orderStatus: data.orderStatus,
            payStatus: data.payStatus,
            estimateTime: data.estimateTime || '',
            paymentTerm: data.paymentTerm || '',
            paymentTermTime: data.paymentTermTime || data.aymentTermTime || '',
            reviewJson: data.reviewJson || '',
            reviewJson2: data.reviewJson2 || '',
            customerId: data.customerId != null ? data.customerId : null,
            productList: productList.map((it) => {
              const product = it.product || {};
              const inventory = it.inventory || {};
              return {
                code: product.productNo || '',
                name: product.title || '',
                spec: inventory.keyVals || '',
                category: '',
                unit: product.unit || '',
                guidePrice: it.yPrice || '',
                quantity: it.num || '',
                totalPrice: it.totalPrice || '',
                stockQty: '',
                stockStatus: orderStatusTitle || ''
              };
            }),
            externalProductList: foreignList.map((it) => {
              const fp = it.foreign_product || {};
              const isShortage = orderStatusTitle.includes('缺货');
              return {
                name: fp.title || '外购产品',
                spec: fp.keyVals || '',
                unitPrice: it.price || '',
                quantity: it.num || '',
                arrivalQty: '',
                isShortage,
                totalPrice: it.totalPrice || '',
                unit: fp.unit || ''
              };
            })
          };
          if (data.customerId != null && data.customerId !== '') {
            this.loadCustomerDetail(String(data.customerId));
          }
        })
        .catch((err) => {
          this.$message.error((err && err.msg) ? err.msg : '获取订单详情失败');
        });
    },
    /** 根据 detail.customerId 调用客户详情接口 getCustomer，回填客户信息 */
    loadCustomerDetail(customerId) {
      if (!customerId) return;
      this.$api({
        url: '/getCustomer',
        method: 'post',
        data: { id: customerId }
      })
        .then((res) => {
          if (!res || !res.data) return;
          const data = res.data;
          const payment = this._parseCustomerJson(data.paymentJson);
          const address = this._parseCustomerJson(data.addressJson);
          this.detail.customer = {
            ...this.detail.customer,
            code: data.customerNo ?? '',
            name: data.title ?? '',
            territory: data.territory === 1 ? "国内" : data.territory === 2 ? "国外" : (data.territory ?? ""),
            region: data.region ?? '',
            attr: data.attributeA ?? '',
            attrB: data.attributeB ?? '',
            contactPerson: data.contact ?? '',
            contactPhone: data.phone ?? '',
            companyPhone: data.companyPhone ?? '',
            bankAccountName: payment.account ?? '',
            bankAccountNo: payment.code ?? '',
            bankName: payment.bank ?? '',
            address: address.address ?? this.detail.customer.address,
            receiver: address.name ?? this.detail.customer.receiver,
            receiverPhone: address.phone ?? this.detail.customer.receiverPhone
          };
        })
        .catch(() => {
          this.$message.error('获取客户详情失败');
        });
    },
    _parseCustomerJson(val) {
      if (val == null) return {};
      if (typeof val === 'object') return val;
      try {
        return typeof val === 'string' ? JSON.parse(val || '{}') : {};
      } catch (e) {
        return {};
      }
    },
    /** productJson、foreignProductJson 可能是数组或 JSON 字符串（甚至再包一层字符串） */
    normalizeOrderLineArray(val) {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string' && val.trim()) {
        try {
          let a = JSON.parse(val);
          if (typeof a === 'string' && a.trim().startsWith('[')) {
            try {
              a = JSON.parse(a);
            } catch (_) {
              return [];
            }
          }
          return Array.isArray(a) ? a : [];
        } catch (e) {
          return [];
        }
      }
      return [];
    },
    outboundLineId(it) {
      if (!it) return '';
      const raw =
        it.id != null && String(it.id).trim() !== ''
          ? it.id
          : it.inventoryId != null && String(it.inventoryId).trim() !== ''
            ? it.inventoryId
            : '';
      return raw != null ? String(raw).trim() : '';
    },
    buildOutboundIdsPayload(arr) {
      return this.normalizeOrderLineArray(arr)
        .map((it) => {
          const id = this.outboundLineId(it);
          return id ? { id } : null;
        })
        .filter(Boolean);
    },
    /** 待发货：直接申请出库 POST addStaffOutboundOrder（不走弹框） */
    submitOutboundShip() {
      if (Number(this.detail.orderStatus) !== 4) return;
      const staffOrderId = String(this.orderId || '').trim();
      if (!staffOrderId) {
        this.$message.warning('缺少订单 id');
        return;
      }
      const productPayload = this.buildOutboundIdsPayload(this._productJsonRaw);
      if (!productPayload.length && (this.detail.productList || []).length > 0) {
        this.$message.warning('订单产品明细缺少可出库行 id，无法申请出库');
        return;
      }
      const foreignPayload = this.buildOutboundIdsPayload(this._foreignProductJsonRaw);
      const loading = this.$loading({
        lock: true,
        fullscreen: true,
        text: '申请出库中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.35)'
      });
      this.$api({
        url: '/addStaffOutboundOrder',
        method: 'post',
        data: {
          staffOrderId,
          productJson: JSON.stringify(productPayload),
          foreignProductJson: JSON.stringify(foreignPayload)
        }
      })
        .then((res) => {
          if (res && res.code === 200) {
            this.$message.success('申请出库成功');
            this.loadDetail();
          } else {
            this.$message.error((res && res.msg) || '申请出库失败');
          }
        })
        .catch((err) => {
          this.$message.error((err && err.msg) ? err.msg : '申请出库失败');
        })
        .finally(() => {
          loading.close();
        });
    },
    handleCancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.order-detail-page {
  padding: 22px 34px;
  background: #fff;
}

.page-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 50px;
  text-align: left;
}

.section-card {
  margin-bottom: 24px;

  ::v-deep .el-card__body {
    padding: 16px 20px 12px;
  }
}

.section-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  margin-bottom: 40px;
  border-bottom: 1px solid #E5E5E5;
}

.section-title {
  position: relative;
  padding-left: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #2373C8;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    bottom: 2px;
    width: 8px;
    height: 21px;
    background: #2373c8;
    border-radius: 1px;
  }
}

.section-body {
  .field-row {
    margin-bottom: 15px;
  }
}

.field-item {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.field-label {
  width: 140px;
  text-align: left;
  color: #333333;
}

.field-value {
  color: #333;
}

.field-images {
  align-items: flex-start;
}

.image-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}

.thumb-image {
  width: 120px;
  height: 80px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background: #f5f7fa;
}

.review-json {
  word-break: break-all;
  white-space: pre-wrap;
}

.form-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f1f1;
  text-align: left;

  .el-button {
    width: 112px;
    height: 38px;
    padding: 10px 24px;
  }

  .el-button--primary {
    background: #2373C8 !important;
    border: none;
  }
}

</style>