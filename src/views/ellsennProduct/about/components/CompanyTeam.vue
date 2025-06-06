<template>
  <div class="external-committee">
    <div class="content">
      <h2>公司团队</h2>
      <div class="activity-guests">
        <div class="guests-grid">
          <div class="guest-card" v-for="(guest, index) in guestList" :key="index">
            <div class="guest-avatar">
              <img :src="guest.avatar" :alt="guest.name" />
            </div>
            <div class="guest-info">
              <div class="guest-name">{{ guest.name }}</div>
              <div class="guest-company">{{ guest.company }}</div>
              <div class="guest-position">{{ guest.position }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExternalCommittee",
  data() {
    return {
      guestList: [
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "张薇",
          position: "AI技术专家",
          company:
            "亚联网董事长，中国国际光电博览会副秘书长，深圳市增强现实技术应用协会副会长兼专家委会成员，深圳市光电行业协会副会长。职场生涯，深耕商业科技领域15年以上，作为妈妈，潜心研究教育方向。",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "张薇",
          position: "AI技术专家",
          company: "科技创新有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "张薇",
          position: "AI技术专家",
          company: "科技创新有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "张薇",
          position: "AI技术专家",
          company: "科技创新有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "张薇",
          position: "AI技术专家",
          company: "科技创新有限公司",
        },
        {
          avatar: require("@img/ellsenn/wechat.png"),
          name: "张薇",
          position: "AI技术专家",
          company:
            "亚联网董事长，中国国际光电博览会副秘书长，深圳市增强现实技术应用协会副会长兼专家委会成员，深圳市光电行业协会副会长。职场生涯，深耕商业科技领域15年以上，作为妈妈，潜心研究教育方向。",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped lang="less" src="./CompanyTeam.less"></style>
