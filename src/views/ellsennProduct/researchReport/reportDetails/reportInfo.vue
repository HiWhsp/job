<template>
  <div class="reportInfo">
    <div class="container">
      <div class="containerLeft">
        <img class="img" :src="data.image" alt="" />
      </div>
      <div class="containerRight">
        <div>
          <div class="rightTopBtn">
            <el-button type="primary">{{ data.category_name }}</el-button>
          </div>
          <div class="rightTopTitle">{{ data.title }}</div>
          <div class="rightTopSubTitle">
            {{ data.info }}
          </div>
          <div class="rightTopInfo">
            <div class="rightTopInfoLayout">
              <div class="rightTopInfoTitle">版权所有</div>
              <div class="infoText">{{ data.copyright }}</div>
              <div class="authorLabel">{{ data.copyright_type }}</div>
            </div>
            <div class="rightTopInfoLayout">
              <div class="rightTopInfoTitle">报告作者</div>
              <div class="infoText">{{ data.author }}</div>
            </div>
            <div class="rightTopInfoLayout">
              <div class="rightTopInfoTitle">发布时间</div>
              <div class="infoText">{{ data.release_time }}</div>
            </div>
            <div class="rightTopInfoLayout">
              <div class="rightTopInfoTitle">资料下载</div>
              <div class="downLoad" @click="onDownloadClick('word')">下载WORD文件</div>
              <div class="downLoad" @click="onDownloadClick('pdf')">下载PDF文件</div>
            </div>
          </div>
        </div>

        <div class="rightTopBtnGroup">
          <el-button class="payBtn" type="primary"><img src="@img/ellsenn/dinggou.png" alt="">立即订购</el-button>
          <el-button class="checkBtn" type="primary"><img src="@img/ellsenn/lock.png" alt="">在线查看</el-button>
          <el-button class="contactBtn"><img src="@img/ellsenn/kefu.png" alt="">联系助理</el-button>
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
      default: () => ({
        title: 'VR/AR产业2024年第二季度销量跟踪报告',
        subTitle:
          '根据江阴联安wellsenn XR的调研和跟踪统计，2024年Q1全球VR销量为172万台，同比下滑9%。一季度销量下滑的主要原因主要来自于Meta、索尼PS VR2以及PICO，其中Meta 销量下滑了10%，索尼PS VR2下滑57%，苹果Vision Pro一季度取得29万台销量，部分弥补了Meta 、索尼PS VR2以及PICO的销量下滑。预计2024年全球实现844万台销量规模，较2023年增长12%，2024年VR市场将扭转过去两年的销量下滑趋势，重回正增长轨道，但今明两年VR行业仍处于销量小年。',
        author: 'Wellsenn XR',
        user: '孙靖翔',
        time: '2025-04-22',
      }),
    },
  },
  name: 'reportInfo',
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onDownloadClick(type) {
      window.open(this.data[type + '_file'], '_blank');
    },
  },
};
</script>
<style scoped lang="less" src="./reportInfo.less"></style>
