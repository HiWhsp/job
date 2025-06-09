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
            <img :src="hexiaoma" alt="" style="width: 100%" />
          </div>
        </div>
        <div class="download-code">
          <div class="download-title" @click="downloadCode">下载核销码</div>
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
      hexiaoma: "",
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
  mounted() {
    this.hexiaoma = localStorage.getItem("hexiaoma") || "";
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
    downloadCode() {
      // 下载核销码
      const a = document.createElement("a");
      a.download = "hexiaoma.png";
      a.href = this.hexiaoma;
      a.click();
    },
  },
};
</script>

<style lang="less" scoped src="./pay-success.less"></style>
