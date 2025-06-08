<template>
  <div class="meetingRegistration">
    <div class="top">
      <div class="topContent">
        <page_breadcrumb :option="nav_option" />
      </div>
    </div>
    <div class="bottom">
      <div class="container">
        <!-- 顶部选项卡 -->
        <div class="tabs">
          <div class="tab-item active">
            <div class="tab-circle">
              <img src="@/assets/img/pay/order.png" alt="" />
            </div>
            <div class="tab-text">确认订单信息</div>
          </div>
          <div class="tab-item">
            <div class="tab-circle">
              <img src="@/assets/img/pay/card.png" alt="" />
            </div>
            <div class="tab-text">支付订单</div>
          </div>
        </div>

        <!-- 报名活动信息 -->
        <div class="activity-section">
          <h3 class="section-title">报名活动信息</h3>
          <div class="activity-info">
            <div class="activity-details">
              <div class="activity-header">
                <span class="activity-tag">活动信息</span>
                <div class="price-section">
                  <span class="price-label">价格</span>
                  <span class="quantity-label">数量</span>
                  <span class="total-label">合计</span>
                </div>
              </div>

              <div class="activity-content">
                <div class="activity-info-left">
                  <h4 class="activity-title">
                    {{ activityDetails.title }}
                  </h4>
                  <div class="activity-meta">
                    <div class="meta-item">
                      <span
                        >活动时间：{{ activityDetails.start_time }} 至
                        {{ activityDetails.end_time }}</span
                      >
                    </div>
                    <div class="meta-item">
                      <span>活动地点：{{ activityDetails.location }}</span>
                    </div>
                  </div>
                </div>

                <div class="activity-info-right">
                  <div class="price">¥{{ activityDetails.price }}</div>
                  <div class="quantity-control">
                    <button class="quantity-btn" @click="decreaseQuantity">
                      -
                    </button>
                    <input
                      type="text"
                      v-model="quantity"
                      class="quantity-input"
                      readonly
                    />
                    <button class="quantity-btn" @click="increaseQuantity">
                      +
                    </button>
                  </div>
                  <div class="total-price">¥{{ totalPrice.toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 报名信息表单 -->
        <div class="form-section">
          <h3 class="section-title">请填写报名信息</h3>
          <div class="form-content">
            <div class="form-group">
              <label class="form-label">姓名</label>
              <input
                type="text"
                v-model="formData.name"
                class="form-input"
                placeholder="请输入"
              />
            </div>

            <div class="form-group">
              <label class="form-label">电话</label>
              <input
                type="tel"
                v-model="formData.phone"
                class="form-input"
                placeholder="请输入"
              />
            </div>

            <div class="form-group">
              <label class="form-label">公司</label>
              <input
                type="text"
                v-model="formData.company"
                class="form-input"
                placeholder="请输入"
              />
            </div>

            <div class="form-group">
              <label class="form-label">职位</label>
              <input
                type="text"
                v-model="formData.position"
                class="form-input"
                placeholder="请输入"
              />
            </div>
          </div>
        </div>

        <!-- 底部统计和按钮 -->
        <div class="bottom-section">
          <div class="summary">
            <span>总计：{{ quantity }}</span>
            <span class="total-amount">总额：¥{{ totalPrice.toFixed(2) }}</span>
          </div>
          <button class="next-btn" @click="nextStep">下一步</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page_breadcrumb from "@/components/page/page-breadcrumb.vue";
export default {
  name: "meetingRegistration",
  components: {
    page_breadcrumb,
  },
  data() {
    return {
      quantity: 1,
      unitPrice: 88.0,
      id: "",
      activityDetails: {},
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
    totalPrice() {
      return this.quantity * this.activityDetails.price;
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getActivityDetails();
  },
  methods: {
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    nextStep() {
      // 表单验证
      if (
        !this.formData.name ||
        !this.formData.phone ||
        !this.formData.company ||
        !this.formData.position
      ) {
        this.$message.warning("请填写完整的报名信息");
        return;
      }

      this.$api({
        url: "createOrder",
        method: "post",
        data: {
          product_activities_id: this.id,
          num: this.quantity,
          name: this.formData.name,
          mobile: this.formData.phone,
          company_title: this.formData.company,
          position: this.formData.position,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("信息提交成功，即将跳转到支付页面");
          this.$router.push({
            path: "/pay",
            query: {
              order_no: res.data.order_no,
              amount: res.data.price,
              title: res.data.title,
            },
          });
        }
      });
    },
    getActivityDetails() {
      this.$api({
        url: "confirmOrder",
        method: "get",
        data: { id: this.id },
      }).then((res) => {
        if (res.code == 200) {
          this.activityDetails = res.data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped src="./index.less"></style>
