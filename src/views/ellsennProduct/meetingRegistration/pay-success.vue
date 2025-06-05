<template>
  <div class="meetingRegistration">
    <div class="top">
      <div class="topContent">
        <page_breadcrumb :option="nav_option" />
      </div>
    </div>
    <div class="bottom">
      <div class="container">
        <div class="success-notice">
          <div class="success-icon">
            <img src="@/assets/img/pay/success.png" alt="" />
          </div>
          <div class="success-content">
            <div class="success-title">支付成功</div>
            <div class="success-subtitle">已为您生成核销码</div>
          </div>
        </div>
        <div class="success-code">
          <div class="code-content">
            <div class="code-title">
              <p>2025 AI/AR智能眼镜智能制造高峰论坛</p>
              <p>0589 3652 4526</p>
            </div>
            <div class="code-qrcode">
              <!-- <img src="@/assets/img/pay/qrcode.png" alt="" /> -->
            </div>
          </div>
        </div>
        <div class="download-code">
          <div class="download-title">下载核销码</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page_breadcrumb from "@/components/page/page-breadcrumb.vue";
export default {
  name: "pay",
  components: {
    page_breadcrumb,
  },
  data() {
    return {
      quantity: 1,
      unitPrice: 88.0,
      selectedPayment: "alipay", // 默认选择支付宝
      formData: {
        name: "",
        phone: "",
        company: "",
        position: "",
      },
    };
  },
  computed: {
    nav_option() {
      let option = [
        {
          route: "/newsInsights",
          title: "产业活动",
          title2: "meetingRegistration",
        },
        {
          route: "",
          title: this.$route.meta.title,
          title: this.$route.meta.title,
        },
      ];
      return option;
    },
  },
  methods: {
    selectPayment(type) {
      this.selectedPayment = type;
    },
    handlePay() {
      // 处理支付逻辑
      console.log("选择的支付方式:", this.selectedPayment);
      // 这里可以调用支付接口
    },
  },
};
</script>

<style lang="less" scoped src="./pay-success.less"></style>
