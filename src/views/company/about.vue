<template>
  <div class="about-page">
    <div class="about-header">
      <p>关于我们</p>
    </div>
    <!-- 顶部关于我们区域 -->
    <div class="about-section">
      <div class="about-content">
        <div class="about-text">
          <h1 class="about-title">
            <span class="about-title-bg">ABOUT</span>
            <span class="about-title-main">关于</span>
          </h1>
          <h2 class="company-name">重庆法焰科技有限公司简介</h2>
          <p class="company-description">
            重庆法焰科技有限公司成立于2025年6月25日，是一家专注于为客户提供专业、全面法律服务解决方案的创新型企业。公司坐落于重庆核心商务区，凭借地缘优势与行业资源整合能力，持续为各类客户打造优质的法律支持体系。
          </p>
        </div>
        <div class="about-image">
          <div class="image-container">
            <img
              src="@/assets/img/company/about-img1.jpg"
              alt="法焰科技"
              class="company-image"
            />
            <div class="image-overlay"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心业务板块详解 -->
    <div class="business-section">
      <div class="business-content">
        <!-- 左侧导航 -->
        <div class="business-nav">
          <h2 class="business-title">
            <img
              src="@/assets/img/company/business-title.png"
              alt="核心业务板块详解"
            />
            核心业务板块详解
          </h2>
          <div
            v-for="(item, index) in businessItems"
            :key="index"
            class="nav-item"
            :class="{ active: activeTab === index }"
            @click="setActiveTab(index)"
          >
            <div class="nav-number">
              {{ String(index + 1).padStart(2, "0") }}
            </div>
            <div class="nav-text">{{ item.title }}</div>
            <div class="nav-arrow">
              <img src="@/assets/img/company/business-arrow.png" alt="箭头" />
            </div>
          </div>
        </div>

        <!-- 右侧内容区域 -->
        <div class="business-details">
          <div class="details-header">
            <h3 class="details-title">{{ currentBusiness.title }}</h3>
            <div class="dropdown-arrow">
              <img src="@/assets/img/company/arrow-down.png" alt="箭头" />
            </div>
          </div>

          <div class="details-cards">
            <div
              v-for="(card, index) in currentBusiness.cards"
              :key="index"
              class="detail-card"
            >
              <div class="card-header">
                <div class="card-icon">
                  <img :src="card.icon" alt="图标" />
                </div>
                <h4 class="card-title">{{ card.title }}</h4>
              </div>
              <p class="card-description">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 资源优势与服务理念 -->
    <div class="about-section">
      <div class="about-section-left">
        <div class="left-content">
          <div class="content-title">
            <img src="@/assets/img/company/content-title.png" alt="法焰科技" />
            资源优势与服务理念
          </div>
          <div class="content-description">
            <p>
              重庆法焰科技有限公司依托重庆本地大型律师团队，始终秉持“专业为基、诚信为本、高效为要”的理念，以客户需求为导向提供法律服务。未来，公司将持续拓展服务边界，计划推出法律知识培训、企业合规体系搭建等新业务，致力于成为客户身边长期可靠的法律伙伴。
            </p>
          </div>
        </div>
      </div>
      <div class="about-section-right">
        <img src="@/assets/img/company/right-bg.jpg" alt="法焰科技" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      activeTab: 0,
      businessItems: [
        {
          title: "合同文书范本销售",
          cards: [
            {
              icon: require("@/assets/img/company/card1.png"),
              title: "范本种类",
              description:
                "涵盖生产经营、买卖交易、商务租赁、生活消费、劳动人事、家装家居、婚姻家庭、建设工程、公司管理、农资农业、诉讼文书、证明文件等，既涉及企业经营所需的合同文本，也包含个人事务常用文书，总计超过200个细分品类。",
            },
            {
              icon: require("@/assets/img/company/card2.png"),
              title: "范本优势",
              description:
                "所有合同范本均由资深律师团队结合最新法律法规修订，标注填写说明，既保证规范性又具备灵活性，客户可根据实际需求直接修改使用，大幅降低文书起草时间与法律风险。",
            },
            {
              icon: require("@/assets/img/company/card3.png"),
              title: "服务形式",
              description:
                "采用线上或线下购买（下载）合同范本，即可添加律师微信获取合同审核、签约指导、及法律咨询等增值服务。",
            },
            {
              icon: require("@/assets/img/company/card4.png"),
              title: "服务优势",
              description:
                "购买文书合同范本，即可享受“律师合同审核、签约指导、以及终生法律咨询服务”，全方位筑牢交易安全防线，让每一次合作都无后顾之忧。",
            },
          ],
        },
        {
          title: "免费律师中介服务",
          cards: [
            {
              icon: require("@/assets/img/company/card5.png"),
              title: "匹配流程",
              description:
                "客户通过线上或线下提供案件信息后，后台律师将结合案件类型、涉案金额、地域、律师费预算等因素，从合作的律师中筛选出2-3名匹配度最高的候选律师。同时提供律师专业方向、执业年限等详细资料，辅助客户决策。",
            },
            {
              icon: require("@/assets/img/company/card6.png"),
              title: "覆盖领域",
              description:
                "除常规的离婚纠纷、刑事辩护、建设工程纠纷、工伤、交通事故、劳动纠纷、企业法律顾问外，还包含知识产权侵权、医疗纠纷、涉外法律事务、金融借贷纠纷等专业领域。针对复杂案件，可组建跨领域律师团队联合办理。无论什么案件，我们都能精准匹配到对应专业方向的律师，让客户享受到专业、对口的法律服务。",
            },
          ],
        },
        {
          title: "免费法律咨询服务",
          cards: [
            {
              icon: require("@/assets/img/company/card7.png"),
              title: "服务渠道",
              description:
                "提供电话咨询、微信咨询及线下门店面对面咨询三种方式，满足不同客户的沟通习惯。",
            },
            {
              icon: require("@/assets/img/company/card8.png"),
              title: "服务内容",
              description:
                "解答法律常识疑问、分析案件初步解决方案、指引维权流程等。例如针对劳动纠纷客户，会详细说明仲裁时效、举证要点、经济补偿金计算方式等关键信息。",
            },
            {
              icon: require("@/assets/img/company/card9.png"),
              title: "团队配置",
              description:
                "咨询团队由10年以上执业经验的律师组成，确保解答的准确性与实用性。",
            }
          ],
        },
      ],
    };
  },
  computed: {
    currentBusiness() {
      return this.businessItems[this.activeTab];
    },
  },
  mounted() {
    // this.$api({
    //   url: "setting",
    // })
  },
  methods: {
    setActiveTab(index) {
      this.activeTab = index;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./about.less";
</style>
