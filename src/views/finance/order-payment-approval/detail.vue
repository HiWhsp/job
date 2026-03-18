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
            <span class="field-value">{{ detail.created_at || detail.orderTime }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">销售金额：</span>
            <span class="field-value">{{ detail.orderPrice != null ? detail.orderPrice : detail.orderAmount }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">订单类型：</span>
            <span class="field-value">{{ orderTypeText(detail.orderType) }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">是否需要审批：</span>
            <span class="field-value">{{ isApprovalText(detail.isApproval != null ? detail.isApproval : (detail.needApprove ? 1 : 2)) }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">支付方式：</span>
            <span class="field-value">{{ payTypeText(detail.payType != null ? detail.payType : detail.payMethod) }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">是否付款：</span>
            <span class="field-value">{{ isPayText(detail.isPay != null ? detail.isPay : (detail.needMark ? 1 : 0)) }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">付款金额：</span>
            <span class="field-value">{{ detail.payPrice != null ? detail.payPrice : detail.payAmount }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">库存是否满足要求：</span>
            <span class="field-value">{{ isManKuCunText(detail.isManKuCun != null ? detail.isManKuCun : (detail.batchDelivery ? 1 : 2)) }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">是否接受分批发货：</span>
            <span class="field-value">{{ isMoreFaHuoText(detail.isMoreFaHuo != null ? detail.isMoreFaHuo : detail.packageSpec) }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">包装规格：</span>
            <span class="field-value">{{ packTypeText(detail.packType, detail.packStr || detail.packageSpec) }}</span>
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
              {{ payStatusText(detail.payStatus != null ? detail.payStatus : detail.paymentStatus) }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="24" class="field-item field-images">
            <span class="field-label">合同图片：</span>
            <div class="image-list">
              <el-image
                v-for="(img, index) in (detail.contractimages || detail.contractImages || [])"
                :key="index"
                :src="img"
                fit="cover"
                class="thumb-image"
              />
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="24" class="field-item field-images">
            <span class="field-label">付款凭证：</span>
            <div class="image-list">
              <el-image
                v-for="(img, index) in (detail.payImage || detail.payImages || [])"
                :key="index"
                :src="img"
                fit="cover"
                class="thumb-image"
              />
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
            <span class="field-value">{{ detail.customer.territory || detail.customer.region }}</span>
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
            <span class="field-value">{{ detail.customer.receiver || detail.customer.address }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">收货人联系方式：</span>
            <span class="field-value">{{ detail.customer.receiverPhone || detail.customer.address }}</span>
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

    <!-- 订单总金额 -->
    <div class="order-total-row">
      <span class="order-total-label">订单总金额:</span>
      <span class="order-total-value">{{ orderTotal }}</span>
    </div>

    <!-- 审批记录 - 主管审核 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">主管审核</span>
      </div>
      <div class="section-body">
        <el-table :data="detail.supervisorApprovalList" class="record-table" border>
          <el-table-column prop="approver" label="审核人" min-width="120" />
          <el-table-column prop="approvalTime" label="审核时间" min-width="160" />
          <el-table-column label="审核状态" min-width="120">
            <template slot-scope="{ row }">
              <el-tag :type="row.approvalStatus === '审核通过' ? 'success' : 'info'" size="small">{{ row.approvalStatus }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approvalRemark" label="审核备注" min-width="140" show-overflow-tooltip />
        </el-table>
      </div>
    </div>

    <!-- 审批记录 - 管理员审核 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">管理员审核</span>
      </div>
      <div class="section-body">
        <el-table :data="detail.managerApprovalList" class="record-table" border>
          <el-table-column prop="approver" label="审核人" min-width="120" />
          <el-table-column prop="approvalTime" label="审核时间" min-width="160" />
          <el-table-column label="审核状态" min-width="120">
            <template slot-scope="{ row }">
              <el-tag :type="row.approvalStatus === '缺货' ? 'danger' : 'success'" size="small">{{ row.approvalStatus }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryTime" label="发货时间" min-width="120" />
        </el-table>
      </div>
    </div>

    <!-- 发货记录 -->
    <div class="section-card">
      <div class="section-header">
        <span class="section-title">发货记录</span>
      </div>
      <div class="section-body">
        <el-table :data="detail.deliveryList" class="record-table" border>
          <el-table-column prop="deliveryNo" label="发货单号" min-width="120" />
          <el-table-column prop="logisticsNo" label="物流单号" min-width="160" />
          <el-table-column label="发货照片" min-width="200">
            <template slot-scope="{ row }">
              <div class="image-list delivery-photos">
                <template v-if="(row.deliveryPhotos || []).length">
                  <el-image
                    v-for="(img, idx) in row.deliveryPhotos"
                    :key="idx"
                    :src="img"
                    fit="cover"
                    class="thumb-image"
                  />
                </template>
                <span v-else class="no-photos">—</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryTime" label="发货时间" min-width="160" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderDeliveryApprovalDetail",

  data() {
    return {
      productTotal: 0,
      externalProductTotal: 0,
      detail: {
        orderNo: "",
        created_at: "",
        orderPrice: "",
        orderType: "",
        customerId: null,
        isApproval: null,
        payType: null,
        isPay: null,
        payPrice: "",
        isManKuCun: null,
        isMoreFaHuo: null,
        packType: null,
        packStr: "",
        orderStatus: null,
        payStatus: null,
        paymentStatus: null,
        contractImages: [],
        contractimages: [],
        payImage: [],
        payImages: [],
        customer: {
          code: "",
          name: "",
          region: "",
          territory: "",
          attr: "",
          attrB: "",
          contactPerson: "",
          contactPhone: "",
          companyPhone: "",
          address: "",
          bankAccountName: "",
          bankAccountNo: "",
          bankName: "",
          bankCode: "",
          receiver: "",
          receiverPhone: ""
        },
        productList: [],
        externalProductList: [],
        supervisorApprovalList: [],
        managerApprovalList: [],
        deliveryList: []
      },
      // 审批发货弹框
      deliveryForm: {
        approveType: "batch", // batch: 审批发货, lack: 库存不足
        deliveryTime: ""
      }
    };
  },

  computed: {
    orderStatusTagType() {
      const v = this.detail.orderStatus;
      const s = typeof v === "number" || (typeof v === "string" && /^-?\d+$/.test(v)) ? Number(v) : null;
      // 1生产副总审核 2总经理审核 3待财务付款 4待采购 5质检入库 6已完成 -1审核未通过
      if (s != null) {
        if (s === -1) return "danger";
        if (s === 6) return "success";
        if (s === 3) return "warning";
        return "info";
      }
      if (v === "待发货" || v === "部分发货") return "warning";
      if (v === "已发货") return "success";
      return "info";
    },
    paymentStatusTagType() {
      const v = this.detail.payStatus != null ? this.detail.payStatus : this.detail.paymentStatus;
      const s = typeof v === "number" || (typeof v === "string" && /^-?\d+$/.test(v)) ? Number(v) : null;
      if (s != null) {
        if (s === 1) return "info";
        if (s === 2) return "warning";
        if (s === 3) return "success";
        return "info";
      }
      if (v === "部分回款") return "warning";
      if (v === "全部回款") return "success";
      return "info";
    },
    orderTotal() {
      const p = parseFloat(this.productTotal) || 0;
      const e = parseFloat(this.externalProductTotal) || 0;
      return (p + e).toFixed(2);
    }
  },

  mounted() {
    const id = this.$route.query.id || this.$route.params.id;
    if (!id) {
      this.$message.warning("缺少订单id");
      return;
    }
    this.loadDetail(id);
  },

  methods: {
    _parseCustomerJson(val) {
      if (val == null) return {};
      if (typeof val === "object") return val;
      try {
        return typeof val === "string" ? JSON.parse(val || "{}") : {};
      } catch (e) {
        return {};
      }
    },
    /** 根据 detail.customerId 调用客户详情接口 getCustomer，回填客户信息 */
    loadCustomerDetail(customerId) {
      if (!customerId) return;
      this.$api({
        url: "/getCustomer",
        method: "post",
        data: { id: String(customerId) }
      })
        .then(res => {
          if (!res || !res.data) return;
          const data = res.data;
          const payment = this._parseCustomerJson(data.paymentJson);
          const address = this._parseCustomerJson(data.addressJson);
          this.detail.customer = {
            ...this.detail.customer,
            code: data.customerNo ?? "",
            name: data.title ?? "",
            territory: data.territory === 1 ? "国内" : data.territory === 2 ? "国外" : (data.territory ?? ""),
            region: data.region ?? "",
            attr: data.attributeA ?? "",
            attrB: data.attributeB ?? "",
            contactPerson: data.contact ?? "",
            contactPhone: data.phone ?? "",
            companyPhone: data.companyPhone ?? "",
            bankAccountName: payment.account ?? "",
            bankAccountNo: payment.code ?? "",
            bankName: payment.bank ?? "",
            address: address.address ?? this.detail.customer.address,
            receiver: address.name ?? this.detail.customer.receiver,
            receiverPhone: address.phone ?? this.detail.customer.receiverPhone
          };
        })
        .catch(() => {
          this.$message.error("获取客户详情失败");
        });
    },
    loadDetail(id) {
      this.$api({
        url: "/getStaffOrder",
        method: "post",
        data: { id: String(id) }
      })
        .then(res => {
          if (!res || res.code !== 200 || !res.data) {
            this.$message.error("获取订单详情失败");
            return;
          }
          const d = res.data;

          const parseImages = val => {
            if (Array.isArray(val)) return val;
            if (typeof val === "string" && val.trim()) {
              return val.split(",").map(s => s.trim()).filter(Boolean);
            }
            return [];
          };

          const productList = Array.isArray(d.productJson)
            ? d.productJson.map(item => {
                const p = item.product || {};
                const inv = item.inventory || {};
                return {
                  code: p.productNo || inv.sn || "",
                  name: p.title || "",
                  spec: inv.keyVals || "",
                  category: "",
                  unit: p.unit || "",
                  guidePrice: item.yPrice,
                  quantity: item.num,
                  totalPrice: item.totalPrice,
                  stockQty: "",
                  stockStatus: Number(d.orderStatus) === 5 ? "缺货" : "有货"
                };
              })
            : [];

          const externalProductList = Array.isArray(d.foreignProductJson)
            ? d.foreignProductJson.map(item => {
                const fp = item.foreign_product || {};
                return {
                  name: fp.keyVals || "",
                  spec: fp.keyVals || "",
                  unitPrice: item.price,
                  quantity: item.num,
                  arrivalQty: "",
                  isShortage: Number(d.orderStatus) === 5,
                  totalPrice: item.totalPrice,
                  unit: fp.unit || ""
                };
              })
            : [];

          const supervisorApprovalList = Array.isArray(d.reviewJson)
            ? d.reviewJson.map(r => ({
                approver: r.name || "",
                approvalTime: r.created_at || "",
                approvalStatus: r.statusTxt || "",
                approvalRemark: r.cont || ""
              }))
            : [];

          const managerApprovalList = Array.isArray(d.reviewJson2)
            ? d.reviewJson2.map(r => ({
                approver: r.name || "",
                approvalTime: r.created_at || "",
                approvalStatus: r.statusTxt || "",
                deliveryTime: r.estimateTime || ""
              }))
            : [];

          const deliveryList = Array.isArray(d.outboundJson)
            ? d.outboundJson.map(o => ({
                deliveryNo: o.orderNo || "",
                logisticsNo: o.sendNo || "",
                deliveryPhotos: parseImages(o.sendImages),
                deliveryTime: o.sendTime || ""
              }))
            : [];

          const contractImages = parseImages(d.contractImages);
          const payImages = parseImages(d.payImage);

          const addr = d.customerAddress || {};

          this.productTotal = productList.reduce((sum, item) => {
            const v = parseFloat(item.totalPrice) || 0;
            return sum + v;
          }, 0);
          this.externalProductTotal = externalProductList.reduce((sum, item) => {
            const v = parseFloat(item.totalPrice) || 0;
            return sum + v;
          }, 0);

          this.detail = {
            orderNo: d.orderNo || "",
            created_at: d.created_at || "",
            orderPrice: d.orderPrice || "",
            orderType: d.orderType,
            customerId: d.customerId != null ? d.customerId : null,
            isApproval: d.isApproval,
            payType: d.payType,
            isPay: d.isPay,
            payPrice: d.payPrice,
            isManKuCun: d.isManKuCun,
            isMoreFaHuo: d.isMoreFaHuo,
            packType: d.packType,
            packStr: d.packStr,
            orderStatus: d.orderStatus,
            payStatus: d.payStatus,
            paymentStatus: d.paymentStatus,
            contractImages,
            contractimages: contractImages,
            payImage: payImages,
            payImages: payImages,
            customer: {
              code: "",
              name: d.customerTitle || "",
              region: d.customerTerritory || "",
              territory: d.customerTerritory || "",
              attr: "",
              attrB: "",
              contactPerson: addr.name || "",
              contactPhone: addr.phone || "",
              companyPhone: "",
              address: addr.address || "",
              bankAccountName: "",
              bankAccountNo: "",
              bankName: "",
              bankCode: "",
              receiver: addr.name || "",
              receiverPhone: addr.phone || ""
            },
            productList,
            externalProductList,
            supervisorApprovalList,
            managerApprovalList,
            deliveryList
          };

          if (d.customerId != null && d.customerId !== "") {
            this.loadCustomerDetail(String(d.customerId));
          }
        })
        .catch(() => {
          this.$message.error("获取订单详情失败");
        });
    },
    // 1销售订单, 2样品订单
    orderTypeText(v) {
      const s = Number(v);
      if (s === 1) return "销售订单";
      if (s === 2) return "样品订单";
      return v != null ? String(v) : "—";
    },
    // 1需要审核, 2不需要
    isApprovalText(v) {
      const s = Number(v);
      if (s === 1) return "需要审核";
      if (s === 2) return "不需要";
      if (typeof v === "boolean") return v ? "需要审核" : "不需要";
      return v != null ? String(v) : "—";
    },
    // 1现结, 2账期, 3分期付款
    payTypeText(v) {
      const s = Number(v);
      if (s === 1) return "现结";
      if (s === 2) return "账期";
      if (s === 3) return "分期付款";
      return v != null ? String(v) : "—";
    },
    // 0未付款, 1已付款
    isPayText(v) {
      const s = Number(v);
      if (s === 0) return "未付款";
      if (s === 1) return "已付款";
      if (typeof v === "boolean") return v ? "已付款" : "未付款";
      return v != null ? String(v) : "—";
    },
    // 库存是否满足: 1满足, 2不满足
    isManKuCunText(v) {
      const s = Number(v);
      if (s === 1) return "满足";
      if (s === 2) return "不满足";
      if (typeof v === "boolean") return v ? "满足" : "不满足";
      return v != null ? String(v) : "—";
    },
    // 是否接受分批发货: 1是, 2否
    isMoreFaHuoText(v) {
      const s = Number(v);
      if (s === 1) return "是";
      if (s === 2) return "否";
      if (typeof v === "boolean") return v ? "是" : "否";
      return v != null ? String(v) : "—";
    },
    // 1标准彩盒, 2标准白盒, 3无包装, 4客户定制包装, 5其他(输入形式)
    packTypeText(type, packStr) {
      const s = Number(type);
      if (s === 1) return "标准彩盒";
      if (s === 2) return "标准白盒";
      if (s === 3) return "无包装";
      if (s === 4) return "客户定制包装";
      if (s === 5) return packStr ? `其他(${packStr})` : "其他";
      if (packStr) return packStr;
      return type != null ? String(type) : "—";
    },
    // 1待营销总监审核, 2待总经理审核, 3缺货审核, 4待发货, 5缺货, 6暂停, 7已发货, -1驳回
    orderStatusText(v) {
      const s = Number(v);
      const map = {
        1: "生产副总审核",
        2: "总经理审核",
        3: "待财务付款",
        4: "待采购",
        5: "质检入库",
        6: "已完成",
        [-1]: "审核未通过"
      };
      if (!Number.isNaN(s) && map[s] != null) return map[s];
      return v != null ? String(v) : "—";
    },
    // 1未回款, 2部分回款, 3全部回款
    payStatusText(status) {
      const s = Number(status);
      if (s === 1) return "未回款";
      if (s === 2) return "部分回款";
      if (s === 3) return "全部回款";
      if (status === "待回款") return "未回款";
      return status != null ? String(status) : "—";
    },
    submitDelivery() {
      if (!this.deliveryForm.approveType) {
        this.$message.error("请选择审批结果");
        return;
      }
      if (!this.deliveryForm.deliveryTime) {
        this.$message.error("请选择交货时间");
        return;
      }
      // TODO: 调用审批发货接口，传递 deliveryForm 与订单信息
      this.$message.success("提交成功");
      this.deliveryDialogVisible = false;
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
  .block-total {
    text-align: right;
    font-size: 16px;
    color: #333;
    height: 50px;
    line-height: 50px;
    padding: 0 100px;
    background: #eeeeee;
    font-weight: bold;
  }
}

.order-total-row {
  margin-top: 24px;
  padding: 16px 0;
  text-align: left;
  font-size: 16px;
  color: #333;
  font-weight: bold;
}

.order-total-label {
  margin-right: 8px;
}

.order-total-value {
  font-weight: bold;
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
  width: 160px;
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

.record-table {
  margin-bottom: 0;
}

.delivery-photos {
  min-height: 40px;

  .no-photos {
    color: #909399;
  }
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
    background: #2373c8 !important;
    border: none;
  }
}

:deep(.el-dialog__header) {
  height: 60px;
  padding: 0 24px 0;
  background: #f7f7f7;
  text-align: left;
  .el-dialog__title {
    line-height: 60px;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
  }
}
:deep(.el-dialog__body) {
  padding: 30px 80px;
}
</style>