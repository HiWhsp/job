<template>
  <div class="newsInsights">
    <div class="topSearch">
      <div class="topSearchWrap">
        <div class="topSearchLeft">
          <div class="topSearchLogo">
            <img class="topSearchLogoImg" src="@img/ellsenn/logo.png" alt="" />
          </div>
          <div class="topSearchText">关于我们</div>
        </div>
      </div>
    </div>
    <div class="tabNav">
      <div class="tabNavWrap">
        <div
          class="tabNavItem"
          v-for="item in tabNavList"
          :key="item.index"
          :class="{ active: activeIndex === item.index }"
          @click="handleTabNavClick(item.index)"
        >
          <div class="tabNavItemText">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="layout">
        <AboutUs v-if="activeIndex === 1" />
        <CompanyHistory v-if="activeIndex === 2" />
        <CompanyNews v-if="activeIndex === 3" />
        <ExternalCommittee v-if="activeIndex === 4" />
        <HonorWall v-if="activeIndex === 5" />
        <CompanyTeam v-if="activeIndex === 6" />
        <CompanyClients v-if="activeIndex === 7" />
        <ContactUs v-if="activeIndex === 8" />
        <JoinUs v-if="activeIndex === 9" />
      </div>
    </div>
  </div>
</template>
<script>
import AboutUs from "./components/AboutUs.vue";
import CompanyHistory from "./components/CompanyHistory.vue";
import CompanyNews from "./components/CompanyNews.vue";
import ExternalCommittee from "./components/ExternalCommittee.vue";
import HonorWall from "./components/HonorWall.vue";
import CompanyTeam from "./components/CompanyTeam.vue";
import CompanyClients from "./components/CompanyClients.vue";
import ContactUs from "./components/ContactUs.vue";
import JoinUs from "./components/JoinUs.vue";

export default {
  components: {
    AboutUs,
    CompanyHistory,
    CompanyNews,
    ExternalCommittee,
    HonorWall,
    CompanyTeam,
    CompanyClients,
    ContactUs,
    JoinUs,
  },
  props: {},
  name: "newsInsights",
  data() {
    return {
      activeIndex: 1,
      tabNavList: [
        {
          index: 1,
          name: "公司简介",
        },
        {
          index: 2,
          name: "公司历程",
        },
        {
          index: 3,
          name: "公司新闻",
        },
        {
          index: 4,
          name: "外部专业委员",
        },
        {
          index: 5,
          name: "荣誉墙",
        },
        {
          index: 6,
          name: "公司团队",
        },
        {
          index: 7,
          name: "公司客户",
        },
        {
          index: 8,
          name: "联系我们",
        },
        {
          index: 9,
          name: "加入我们",
        },
      ],
    };
  },
  mounted() {
    this.activeIndex = +this.$route.query.activeIndex || 1;
  },
  methods: {
    onBtnClick(i) {
      console.log(i, "onBtnClick");
    },
    handleTabNavClick(index) {
      this.activeIndex = index;
    },
  },
};
</script>
<style
  scoped
  lang="less"
  src="@/components/ellsennComponents/components/topSearch.less"
></style>
<style scoped lang="less" src="./index.less"></style>
