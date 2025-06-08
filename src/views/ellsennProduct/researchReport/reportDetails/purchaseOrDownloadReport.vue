<template>
  <div class="container">
    <!-- 蓝色标题区域 -->
    <div class="title-section">
      <span class="title">{{ data.contacts ? data.contacts.title : "" }}</span>
      <span class="subtitle">
        {{ data.contacts ? data.contacts.info : "" }}
      </span>
    </div>
    <!-- 内容区域 -->
    <div class="content-section">
      <div class="contact-info">
        <div
          class="info-item"
          v-for="(item, index) in contactInfo"
          :key="index"
        >
          <span class="label">{{ item.label }}：</span>
          <span class="value">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  name: "purchaseOrDownloadReport",
  data() {
    return {
      contactInfo: [],
    };
  },
  watch: {
    data: {
      handler(newVal) {
        this.contactInfo = [
          {
            label: "联系人",
            value: this.data.contacts ? this.data.contacts.contacts_name : "",
          },
          {
            label: "微信号",
            value: this.data.contacts ? this.data.contacts.wx : "",
          },
          {
            label: "联系电话",
            value: this.data.contacts ? this.data.contacts.mobile : "",
          },
          {
            label: "联系邮箱",
            value: this.data.contacts ? this.data.contacts.email : "",
          },
        ];
      },
      deep: true,
    },
  },
  mounted() {},
};
</script>
<style scoped lang="less" src="./purchaseOrDownloadReport.less"></style>
