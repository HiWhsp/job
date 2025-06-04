<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="核心亮点" name="first">
        <verticalLineTitle tabTitle="核心亮点"> </verticalLineTitle>
        <div class="firstTab">
          根据维深信息wellsenn
          XR的调研和跟踪统计，2024年Q1全球VR销量为172万台，同比下滑9%。一季度销量下滑的主要原因主要来自于Meta、索尼PS
          VR2以及PICO，其中Meta 销量下滑了10%，索尼PS VR2下滑57%，苹果Vision
          Pro一季度取得29万台销量，部分弥补了Meta 、索尼PS
          VR2以及PICO的销量下滑。预计2024年全球实现844万台销量规模，较2023年增长12%，2024年VR市场将扭转过去两年的销量下滑趋势，重回正增长轨道，但今明两年VR行业仍处于销量小年。
                 2024年一季度全球AR销量为11.3万台，同比增长16%。一季度属于淡季，增量销量贡献来自于消费级AR眼镜公司Xreal、雷鸟、Rokid、Viture等，一季度全球缺乏重磅新品发布上市，整体来看一季度同比增速较低。预计2024年全球AR销量为65万台，增速为27%，增长来源主要来自于BB观影眼镜的持续增长，以及信息提示类眼镜贡献一定的增量，此外，AI+AR眼镜预计2024年将是行业发展的新变量。
                 本报告按区域（中国/海外），按场景（B端/C端）、按品牌厂商销量份额等多个维度进行了分类统计分析了全球VR/AR产业Q1销量情况，报告共计19页，含22份数据图表，完整报告请付费购买或加入wellsenn
          XR会员查看。
        </div>
      </el-tab-pane>
      <el-tab-pane label="研究方法" name="second">
        <verticalLineTitle tabTitle="研究方法"> </verticalLineTitle>
        <div class="firstTab">
          根据维深信息wellsenn
          XR的调研和跟踪统计，2024年Q1全球VR销量为172万台，同比下滑9%。一季度销量下滑的主要原因主要来自于Meta、索尼PS
          VR2以及PICO，其中Meta 销量下滑了10%，索尼PS VR2下滑57%，苹果Vision
          Pro一季度取得29万台销量，部分弥补了Meta 、索尼PS
          VR2以及PICO的销量下滑。预计2024年全球实现844万台销量规模，较2023年增长12%，2024年VR市场将扭转过去两年的销量下滑趋势，重回正增长轨道，但今明两年VR行业仍处于销量小年。
                 2024年一季度全球AR销量为11.3万台，同比增长16%。一季度属于淡季，增量销量贡献来自于消费级AR眼镜公司Xreal、雷鸟、Rokid、Viture等，一季度全球缺乏重磅新品发布上市，整体来看一季度同比增速较低。预计2024年全球AR销量为65万台，增速为27%，增长来源主要来自于BB观影眼镜的持续增长，以及信息提示类眼镜贡献一定的增量，此外，AI+AR眼镜预计2024年将是行业发展的新变量。
                 本报告按区域（中国/海外），按场景（B端/C端）、按品牌厂商销量份额等多个维度进行了分类统计分析了全球VR/AR产业Q1销量情况，报告共计19页，含22份数据图表，完整报告请付费购买或加入wellsenn
          XR会员查看。
        </div>
      </el-tab-pane>
      <el-tab-pane label="数据来源" name="third">
        <verticalLineTitle tabTitle="数据来源"> </verticalLineTitle>
        <div class="firstTab">
          根据维深信息wellsenn
          XR的调研和跟踪统计，2024年Q1全球VR销量为172万台，同比下滑9%。一季度销量下滑的主要原因主要来自于Meta、索尼PS
        </div>
      </el-tab-pane>
      <el-tab-pane label="评论" name="fourth">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import verticalLineTitle from "@/components/ellsennComponents/components/verticalLineTitle.vue";
export default {
  components: {
    verticalLineTitle,
  },
  props: {},
  name: "tabCard",
  data() {
    return {
      activeName: "first",
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
<style scoped lang="less" src="./tabCard.less"></style>
