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
        }
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

  methods: {}
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
</style>