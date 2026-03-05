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
            <span class="field-value">{{ detail.orderTime }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">销售金额：</span>
            <span class="field-value">{{ detail.orderAmount }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">订单类型：</span>
            <span class="field-value">{{ detail.orderType }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">是否需要审批：</span>
            <span class="field-value">{{ detail.needApprove ? '是' : '否' }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">支付方式：</span>
            <span class="field-value">{{ detail.payMethod }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">是否付款：</span>
            <span class="field-value">{{ detail.needMark ? '是' : '否' }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">付款金额：</span>
            <span class="field-value">{{ detail.payAmount }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">是否签约与分批发货：</span>
            <span class="field-value">{{ detail.batchDelivery ? '是' : '否' }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">是否接受分批发货：</span>
            <span class="field-value">{{ detail.packageSpec }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">包装规格：</span>
            <span class="field-value">{{ detail.packageSpec }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">订单状态：</span>
            <el-tag :type="orderStatusTagType" size="small">
              {{ detail.orderStatus }}
            </el-tag>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">回款状态：</span>
            <el-tag :type="paymentStatusTagType" size="small">
              {{ detail.paymentStatus }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="24" class="field-item field-images">
            <span class="field-label">合同图片：</span>
            <div class="image-list">
              <el-image v-for="(img, index) in detail.contractImages" :key="index" :src="img" fit="cover"
                class="thumb-image" />
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="24" class="field-item field-images">
            <span class="field-label">付款凭证：</span>
            <div class="image-list">
              <el-image v-for="(img, index) in detail.payImages" :key="index" :src="img" fit="cover"
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
            <span class="field-value">{{ detail.customer.region }}</span>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="field-row">
          <el-col :span="8" class="field-item">
            <span class="field-label">客户区域：</span>
            <span class="field-value">{{ detail.customer.contactPerson }}</span>
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
            <span class="field-value">{{ detail.customer.address }}</span>
          </el-col>
          <el-col :span="8" class="field-item">
            <span class="field-label">收货人联系方式：</span>
            <span class="field-value">{{ detail.customer.address }}</span>
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
          <el-table-column type="selection" width="48" align="center" />
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
      <el-button type="primary" @click="openDeliveryDialog">发货</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>

    <!-- 审批发货弹框 -->
    <el-dialog
      title="审批发货"
      :visible.sync="deliveryDialogVisible"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="deliveryForm"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="审批：">
          <el-radio-group v-model="deliveryForm.approveType">
            <el-radio label="batch">审批发货</el-radio>
            <el-radio label="lack">库存不足</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="交货时间：">
          <el-date-picker
            v-model="deliveryForm.deliveryTime"
            type="date"
            placeholder="请设置"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitDelivery">提交</el-button>
        <el-button @click="deliveryDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderDeliveryApprovalDetail',

  data() {
    return {
      // 模拟详情数据，后续可替换为接口返回
      detail: {
        orderNo: '2026001-999',
        orderTime: '2026-01-01',
        orderAmount: '2545.00',
        orderType: '销售订单',
        needApprove: true,
        payMethod: '现金',
        needMark: true,
        payAmount: '2500.00',
        batchDelivery: false,
        packageSpec: '箱/盒',
        orderStatus: '待审核', // 示例：待审核 / 待发货 / 已发货
        paymentStatus: '待回款', // 示例：待回款 / 部分回款 / 全部回款
        contractImages: [],
        payImages: [],
        customer: {
          code: 'L2026001',
          name: '浙江实安医疗科技有限公司',
          region: '国内',
          attr: '美团',
          attrB: '经销商',
          contactPerson: '郭珊珊',
          contactPhone: '15931263178',
          companyPhone: '0573-84986384',
          address: '浙江省嘉兴市经济技术开发区某某路 123 号',
          bankAccountName: '浙江实安医疗科技有限公司',
          bankAccountNo: '76454212657855',
          bankName: '中国银行',
          bankCode: '***********'
        },
        // 产品信息列表
        productList: [
          {
            code: '4578786954',
            name: '单层牙托盘',
            spec: '98,A1,10mm',
            category: '树脂盘',
            unit: '盒',
            guidePrice: 15.0,
            quantity: 20,
            totalPrice: 300.0,
            stockQty: 60,
            stockStatus: '有货'
          },
          {
            code: '4578786954',
            name: '单层牙托盘',
            spec: '98,A1,10mm',
            category: '树脂盘',
            unit: '盒',
            guidePrice: 20.0,
            quantity: 20,
            totalPrice: 4000.0,
            stockQty: 60,
            stockStatus: '缺货'
          }
        ],
        // 外购产品信息列表
        externalProductList: [
          {
            name: '单层牙托盘',
            spec: '98,A1,10mm',
            unitPrice: 2000.0,
            quantity: 20,
            arrivalQty: 40,
            isShortage: false,
            totalPrice: 40000.0,
            unit: '盒'
          },
          {
            name: '单层牙托盘',
            spec: '98,A1,10mm',
            unitPrice: 2000.0,
            quantity: 20,
            arrivalQty: 40,
            isShortage: true,
            totalPrice: 40000.0,
            unit: '盒'
          }
        ]
      },
      // 审批发货弹框
      deliveryDialogVisible: false,
      deliveryForm: {
        approveType: 'batch', // batch: 审批发货, lack: 库存不足
        deliveryTime: ''
      }
    };
  },

  computed: {
    orderStatusTagType() {
      const status = this.detail.orderStatus;
      if (status === '待审核') return 'info';
      if (status === '待发货' || status === '部分发货') return 'warning';
      if (status === '已发货') return 'success';
      return 'info';
    },
    paymentStatusTagType() {
      const status = this.detail.paymentStatus;
      if (status === '待回款') return 'info';
      if (status === '部分回款') return 'warning';
      if (status === '全部回款') return 'success';
      return 'info';
    }
  },

  mounted() {
    // TODO: 根据路由参数请求详情接口并替换 detail
  },

  methods: {
    openDeliveryDialog() {
      this.deliveryDialogVisible = true;
    },
    submitDelivery() {
      if (!this.deliveryForm.approveType) {
        this.$message.error('请选择审批结果');
        return;
      }
      if (!this.deliveryForm.deliveryTime) {
        this.$message.error('请选择交货时间');
        return;
      }
      // TODO: 调用审批发货接口，传递 deliveryForm 与订单信息
      this.$message.success('提交成功');
      this.deliveryDialogVisible = false;
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

:deep(.el-dialog__header) {
  height: 60px;
  padding: 0 24px 0;
  background: #F7F7F7;
  text-align: left;
  .el-dialog__title {
    line-height: 60px;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
  }
}
:deep(.el-dialog__body){
  padding: 30px 80px;
}
</style>