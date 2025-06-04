<template>
  <div class="container">
    <!-- 蓝色标题区域 -->
    <div class="title-section">
      <span class="title">购买/下载报告</span>
      <span class="subtitle">
        购买/下载报告，请联系维深助理，微信号：wellsenn001
      </span>
    </div>
    <!-- 内容区域 -->
    <div class="content-section">
      <div class="contact-info">
        <div class="info-item" v-for="(item, index) in contactInfo" :key="index">
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
  props: {},
  name: 'purchaseOrDownloadReport',
  data() {
    return {
      contactInfo: [
        { label: '联系人', value: 'W' },
        { label: '微信号', value: 'wellsenn001' },
        { label: '联系电话', value: '18611823719' },
        { label: '联系邮箱', value: 'abc@wellsenn.com' },
      ],
    };
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./purchaseOrDownloadReport.less"></style>
