<template>
  <div class="activity-guests">
    <div class="guests-grid">
      <div class="guest-card" v-for="(guest, index) in guestList" :key="index">
        <div class="guest-avatar">
          <img :src="guest.avatar" :alt="guest.name" />
        </div>
        <div class="guest-info">
          <div class="guest-name">{{ guest.name }}</div>
          <div class="guest-position">{{ guest.position }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActivityGuests",
  props: {
    guests: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    guestList() {
      return this.guests.length > 0 ? this.guests : this.defaultGuests;
    },
  },
  data() {
    return {
      defaultGuests: [
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "张薇",
          position: "AI技术专家",
          company: "科技创新有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "李明",
          position: "智能制造总监",
          company: "智能科技集团",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "王强",
          position: "AR产品负责人",
          company: "未来科技有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "刘敏",
          position: "智能眼镜研发总监",
          company: "创新科技股份",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "陈博",
          position: "人工智能架构师",
          company: "智慧制造集团",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "赵雪",
          position: "产品策略总监",
          company: "前沿科技有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "孙杰",
          position: "技术创新负责人",
          company: "智能设备科技",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "周华",
          position: "AI算法专家",
          company: "算法科技有限公司",
        },
      ],
    };
  },
};
</script>

<style scoped lang="less" src="./activeityGuests.less"></style>
