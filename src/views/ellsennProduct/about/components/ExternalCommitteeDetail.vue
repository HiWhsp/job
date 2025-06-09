<template>
  <div class="external-committee-detail">
    <div class="detail-top">
      <page_breadcrumb :option="nav_option" />
    </div>
    <div class="detail-container">
      <!-- 头部信息区域 -->
      <div class="header-section">
        <div class="avatar-section">
          <img :src="memberInfo.thumb" alt="头像" class="avatar" />
        </div>
        <div class="info-section">
          <h1 class="name">{{ memberInfo.name }}</h1>
          <p class="title">{{ memberInfo.position }}</p>
          <div class="description">
            <h3>简介：</h3>
            <p>{{ memberInfo.info }}</p>
          </div>
          <div class="expertise">
            <h3>擅长领域：</h3>
            <p>{{ memberInfo.field }}</p>
          </div>
        </div>
      </div>

      <!-- 标签页导航 -->
      <div class="tabs-nav">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-item', { active: activeTab === index }]"
          @click="activeTab = index"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 标签页内容 -->
      <div class="tabs-content">
        <div v-if="activeTab === 0" class="tab-panel">
          <div class="content-section">
            <h4>【人物简介】</h4>
            <p>{{ memberInfo.info }}</p>
          </div>
          <!-- <div class="content-section">
            <h4>【研究方向】</h4>
            <p>{{ memberInfo.research_direction }}</p>
          </div>
          <div class="content-section">
            <h4>【研究成果】</h4>
            <p>{{ memberInfo.achievement }}</p>
          </div>
          <div class="content-section">
            <h4>【科研项目】</h4>
            <p>{{ memberInfo.research_project }}</p>
          </div>
          <div class="content-section">
            <h4>【论文著作】</h4>
            <p>{{ memberInfo.publications }}</p>
          </div> -->
        </div>
        <div v-else-if="activeTab === 1" class="tab-panel">
          <div class="content-section">
            <h4>研究方向</h4>
            <p>{{ memberInfo.research_direction }}</p>
          </div>
        </div>
        <div v-else-if="activeTab === 2" class="tab-panel">
          <div class="content-section">
            <h4>研究成果</h4>
            <p>{{ memberInfo.achievement }}</p>
          </div>
        </div>
        <div v-else-if="activeTab === 3" class="tab-panel">
          <div class="content-section">
            <h4>科研项目</h4>
            <p>{{ memberInfo.research_project }}</p>
          </div>
        </div>
        <div v-else-if="activeTab === 4" class="tab-panel">
          <div class="content-section">
            <h4>论文著作</h4>
            <p>{{ memberInfo.publications }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page_breadcrumb from "@/components/page/page-breadcrumb.vue";
export default {
  name: "ExternalCommitteeDetail",
  components: {
    page_breadcrumb,
  },
  computed: {
    nav_option() {
      let option = [
        {
          route: "/about?activeIndex=4",
          title: "外部专业委员",
          title2: "about",
        },
        {
          route: "",
          title: this.$route.meta.title,
          title: this.$route.meta.title,
        },
      ];
      return option;
    },
  },
  data() {
    return {
      activeTab: 0,
      tabs: [
        { label: "人物简介" },
        { label: "研究方向" },
        { label: "研究成果" },
        { label: "科研项目" },
        { label: "论文著作" },
      ],
      memberInfo: {
        name: "何万城",
        avatar: require("@/assets/img/ellsenn/reportDetail.png"), // 需要替换为实际头像路径
        title:
          "维深信息(Wellsenn XR)公司创始人兼首席分析师，深圳市虚拟现实技术应用协会副会长。",
        description:
          '维深信息创始人，"创客北京"创新创业大赛评委。西安电子科技大学软件与微电子学院特聘研究员。A轮投资顾问及研发总监，曾任中科创达、VR陀螺等行业媒体投资顾问分析师。15年科技产业投资及技术研发经验，曾任XR产业技术工程师，曾2015年起先后主导创建XR产业发展联盟及深圳虚拟现实产业联合会投资者工作委员会，致力于XR产业投资顾问及研发50强。',
        expertise:
          "机关文案管理机关文案管理机关文案管理机关文案管理机关文案管理机关文案管理机关文案管理机关文案管理机关文案管理机关文案管理。",
        biography:
          "王发展，男，1965年10月生，博士（后），教授。《热加工工艺》杂志编委。2003年6月毕业于西安交通大学材料科学与工程学院，获工学博士学位。2003.10－2005.10在浙江大学材料科学与工程学院从事博士后研究工作。2004.4－2006.10在日本东京工业大学材料科学与工程学院访问学者。",
        research:
          "近年来致力于数值化设计及数值模拟，在塑性变形理论的分析设计及数值元分析，一维塑性变形理论化学的合成及其数值模拟，充进功能化材料的制备与研究。",
        achievements:
          "获国家自然科学基金二等奖1项（排名第八），二等奖1项（排名第一），获陕西省科学技术一等奖一等奖1项（排名第一），二等奖2项（排名1和第8项一110项二），获国家发改委专利奖。发明专利专利40项。",
        projects:
          '入选国际Who\'s Who in Science and Engineering(10th Anniversary,2008-2009)参与了包括"863"、"十五"攻关等重大科研项目6项，深圳市高新技术产业化项目1项，教育产业化信息管理1项，企业横向课题6项。',
        publications:
          "出版专著2部，教材2部。自1994年起主要从事新材料科学技术的研究及其科研成果，发表学术论文200余篇，其中SCI收录25篇。",
      },
    };
  },
  mounted() {
    this.getMemberInfo();
  },
  methods: {
    getMemberInfo() {
      this.$api({
        url: "getCompanyMemberDetail",
        method: "get",
        data: {
          id: this.$route.query.id,
        },
      }).then((res) => {
        this.memberInfo = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./ExternalCommitteeDetail.less";
</style>
