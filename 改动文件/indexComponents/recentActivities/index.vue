<template>
  <div class="recentActivities">
    <div class="recentActivitiesContent">
      <comp-title title="近期活动" :icon="require('./icon.png')"></comp-title>

     <div class='activeContent'>
      <activity-card
        v-for="(item, index) in activityList"
        :data="item"
      ></activity-card>
     </div>
    </div>
  </div>
</template>
<script>
import compTitle from '../components/title/title.vue';
import activityCard from './activityCard.vue';
export default {
  components: {
    compTitle,
    activityCard,
  },
  props: {},
  name: 'recentActivities',
  data() {
    return {
      activityList: [
        {
          url: require('./test.png'),
          title: '2025年全球AI/AR智能眼镜智能制造高峰论坛',
          location: '北京XXXX万豪酒店',
          time: '2025-01-01 至 2025-04-03',
        },
        {
          url: require('./test.png'),
          title: '2025年全球AI/AR智能眼镜智能制造高峰论坛',
          location: '北京XXXX万豪酒店',
          time: '2025-01-01 至 2025-04-03',
        },
        {
          url: require('./test.png'),
          title: '2025年全球AI/AR智能眼镜智能制造高峰论坛',
          location: '北京XXXX万豪酒店',
          time: '2025-01-01 至 2025-04-03',
        },
        {
          url: require('./test.png'),
          title: '2025年全球AI/AR智能眼镜智能制造高峰论坛',
          location: '北京XXXX万豪酒店',
          time: '2025-01-01 至 2025-04-03',
        },
      ],
    };
  },
  created() {},
  mounted() {},
};
</script>
<style scoped lang="less" src="./index.less"></style>
