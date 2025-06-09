<template>
  <div class="company-history">
    <div class="content">
      <h2 class="main-title">成立至今的 <span>标志化事件</span></h2>

      <div class="timeline">
        <div
          class="timeline-item"
          v-for="(item, index) in historyData"
          :key="item.id"
          :class="index % 2 === 0 ? 'right' : 'left'"
        >
          <template v-if="index % 2 === 0">
            <div class="timeline-dot">
              <div class="inner-circle"></div>
              <div class="outer-ring"></div>
            </div>
            <div class="timeline-content">
              <div class="content-box">
                <div class="text-section">
                  <div class="year">{{ item.title }}</div>
                  <div class="date-item" v-for="child in item.data" :key="child.id">
                    <span class="text">{{ child.title }}</span>
                    <span class="date">{{ child.date }}</span>
                  </div>
                </div>
                <div class="image-section">
                  <img :src="item.thumb" alt="2025" />
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="timeline-dot">
              <div class="inner-circle"></div>
              <div class="outer-ring"></div>
            </div>
            <div class="timeline-content">
              <div class="content-box">
                <div class="image-section">
                  <img :src="item.thumb" alt="2024" />
                </div>
                <div class="text-section">
                  <div class="year">{{ item.title }}</div>

                  <div class="date-item" v-for="child in item.data" :key="child.id">
                    <span class="date">{{ child.date }}</span>
                    <span class="text">{{ child.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompanyHistory",
  data() {
    return {
      historyData: [],
    };
  },
  mounted() {
    this.getHistoryData();
  },
  methods: {
    getHistoryData() {
      this.$api({
        url: "getCompanyHistory",
        method: "get",
      }).then((res) => {
        this.historyData = res.data;
      });
    },
  },
};
</script>

<style scoped lang="less" src="./CompanyHistory.less"></style>
