<template>
  <div class="layout">
    <template v-if="data.id === 1">
      <div class="left">
        <img class="left-img" :src="data.img" alt="" />
      </div>
      <div class="right">
        <div class="title">{{ data.title }}</div>
        <div class="sub">{{ data.sub }}</div>
        <div class="right-bottom">
          <div class="right-bottom-info">
            <div class="right-bottom-info-status">{{ data.status }}</div>
            <div class="right-bottom-info-item">{{ data.time }}</div>
            <div class="right-bottom-info-item">{{ data.name }}</div>
            <div class="right-bottom-info-item">{{ data.tips }}</div>
          </div>
          <div class="right-bottom-btn-group">
            <div class="right-bottom-btn right-bottom-btn-download">
              下载 <img src="@img/ellsenn/pdf.png" alt="" />
              <img src="@img/ellsenn/word.png" alt="" />
            </div>
            <div
              class="right-bottom-btn right-bottom-btn-primary"
              @click="onBtnClick"
            >
              在线阅读
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="data.id === 2">
      <div class="item-image">
        <img :src="data.image" alt="新闻图片" />
      </div>
      <div class="item-content">
        <div class="titleAndDes">
          <div class="item-title">{{ data.title }}</div>
          <div class="item-description">{{ data.description }}</div>
        </div>
        <div class="item-meta">
          <span>{{ data.date }}</span>
          <span>{{ data.source }}</span>
        </div>
      </div>
    </template>
    <template v-if="data.id === 3">
      <div class="item-image">
        <img :src="data.url" alt="新闻图片" />
      </div>
      <div class="item-content">
        <div class="cardContent">
          <div class="activeTitle">{{ data.title }}</div>
          <div class="activeTime">
            <img class="activeIcon" src="@img/ellsenn/time.png" alt="" />
            <div>活动时间：{{ data.time }}</div>
          </div>
          <div class="activeLocation">
            <img class="activeIcon" src="@img/ellsenn/location.png" alt="" />
            <div class="activeLocationText">
              活动地点：{{ data.location }}
              <img src="@/assets/home/icon1.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      default: () => ({
        img: require("@img/ellsenn/test.png"),
        title: "2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告",
        sub: "2025-2031年中国锰黄铜行业市场深度研究及发展趋势预测报告，主要包括行业下游产业链分析，行业各区域市场概况，行业主要优势企业分析，行业发展前景预测等内容。",
        status: "公共服务",
        time: "2025-04-22",
        name: "梁昊",
        tips: "世界互联网大会",
      }),
    },
  },
  name: "reportCard",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onBtnClick() {
      this.$router.push({
        path: "/reportDetails",
        query: {
          id: this.data.id,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.item-image {
  width: 204px;
  height: 152px;
  margin-right: 30px;
  img {
    width: 204px;
    height: 100%;
    object-fit: cover;
  }
}
.item-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .item-title {
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 500;
    color: #000000;
  }
  .item-description {
    font-family: Microsoft YaHei;
    font-size: 16px;
    color: #696d80;
    margin-top: 37px;
  }
  .item-meta {
    font-family: Microsoft YaHei;
    font-size: 14px;
    line-height: 24px;
    color: #afbac4;
    span {
      margin-right: 10px;
    }
  }
}

.activeTitle {
  font-family: Microsoft YaHei;
  font-size: 18px;
  color: #111111;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 这里是超出几行省略 */
  overflow: hidden;
}
.activeTime {
  margin: 26px 0px 11px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: Microsoft YaHei;
  font-size: 13px;
  color: #666666;
}
.activeLocation {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: Microsoft YaHei;
  font-size: 13px;
  color: #666666;

  .activeLocationText {
    display: flex;
    flex-direction: row;
    align-items: center;
    img {
      margin-left: 5px;
      width: 16px;
    }
  }
}
.activeIcon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
</style>
<style scoped lang="less" src="./reportCard.less"></style>
