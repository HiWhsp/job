<template>
  <div class="newsInsight">
    <div class="newsContent">
      <div class="newsLeft">
        <comp-title
          title="新闻洞察"
          :icon="require('./report.png')"
        ></comp-title>
        <left-card
          v-for="(item, index) in leftCardList"
          :data="item"
        ></left-card>
      </div>
      <div class="newsRight">
        <comp-title
          title="维深测评"
          :icon="require('./report.png')"
        ></comp-title>
        <right-card
          v-for="(item, index) in rightCardList"
          :data="item"
        ></right-card>
      </div>
    </div>
  </div>
</template>
<script>
import compTitle from '../components/title/title.vue';
import leftCard from './leftCard.vue';
import rightCard from './rightCard.vue';
export default {
  components: {
    compTitle,
    rightCard,
    leftCard,
  },
  props: {},
  name: 'newsInsight',
  data() {
    return {
      leftCardList: [
        {
          url: require('./test.png'),
          title: 'VR/AR产业2024年第二季度销量跟踪报告',
          info: '未来，随着政策红利的持续释放和市场机制的不断完善，中国消费名品将引领新一轮消费热潮，为构建新发展格局注入澎湃动力。',
          time: '2024-08-07',
        },
        {
          url: require('./test.png'),
          title: 'VR/AR产业2024年第二季度销量跟踪报告',
          info: '未来，随着政策红利的持续释放和市场机制的不断完善，中国消费名品将引领新一轮消费热潮，为构建新发展格局注入澎湃动力。',
          time: '2024-08-07',
        },
        {
          url: require('./test.png'),
          title: 'VR/AR产业2024年第二季度销量跟踪报告',
          info: '未来，随着政策红利的持续释放和市场机制的不断完善，中国消费名品将引领新一轮消费热潮，为构建新发展格局注入澎湃动力。',
          time: '2024-08-07',
        },
      ],
      rightCardList: [
        {
          title: '从“性价比”到“心价比”，激发消费升级潜能',
          time: '2025-04-23',
          status: 1,
        },
        {
          title: '从“性价比”到“心价比”，激发消费升级潜能',
          time: '2025-04-23',
          status: 1,
        },
        {
          title: '从“性价比”到“心价比”，激发消费升级潜能',
          time: '2025-04-23',
          status: 1,
        },
        {
          title: '从“性价比”到“心价比”，激发消费升级潜能',
          time: '2025-04-23',
          status: 1,
        },
      ],
    };
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./index.less"></style>
