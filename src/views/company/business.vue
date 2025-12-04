<template>
  <div class="business-page">
    <div class="business-header">
      <p>业务范围</p>
    </div>

    <!-- 合同文书范本销售 -->
    <div class="contract-templates-section">
      <h2 class="section-title">合同文书范本销售</h2>
      <div class="templates-cards">
        <div class="template-card">
          <div class="card-icon">
            <img
              src="@/assets/img/company/business/template-icon1.png"
              alt=""
            />
          </div>
          <h3 class="card-title">服务形式</h3>
          <p class="card-content">
            线上购买（下载）合同范本，客户可添加律师微信获取增值服务。
          </p>
        </div>
        <div class="template-card">
          <div class="card-icon">
            <img
              src="@/assets/img/company/business/template-icon2.png"
              alt=""
            />
          </div>
          <h3 class="card-title">范本品类</h3>
          <p class="card-content">
            涵盖生产经营、买卖交易、商务租赁、生活消费、劳动人事、家装家居、婚姻家庭、建设工程、公司管理、农资农业、诉讼文书、证明文件等超过200个细分品类，既包含企业经营所需合同文本，也涉及个人事务常用文书。
          </p>
        </div>
        <div class="template-card">
          <div class="card-icon">
            <img
              src="@/assets/img/company/business/template-icon3.png"
              alt=""
            />
          </div>
          <h3 class="card-title">增值服务</h3>
          <p class="card-content">
            购买（下载）合同范本，即可享受律师合同审核、签约指导及终生法律咨询服务。
          </p>
        </div>
      </div>
    </div>

    <!-- 免费律师中介服务 -->
    <div class="lawyer-service-section">
      <h2 class="section-title">免费律师中介服务</h2>
      <div class="lawyer-cards">
        <div class="lawyer-card">
          <h3 class="card-title">匹配流程</h3>
          <p class="card-content">
            客户线上或线下提供案件信息后，后台律师结合案件类型、涉案金额、地域、律师费预算等因素，从合作律师中筛选出2-3名匹配度最高的候选律师，并提供律师专业方向、执业年限等详细资料辅助客户决策。
          </p>
          <div class="card-icon">
            <img src="@/assets/img/company/business/lawyer-card1.png" alt="" />
          </div>
        </div>
        <div class="lawyer-card">
          <h3 class="card-title">匹配流程</h3>
          <p class="card-content">
            包括离婚纠纷、刑事辩护、建设工程纠纷、工伤、交通事故、劳动纠纷、企业法律顾问、知识产权侵权、医疗纠纷、涉外法律事务、金融借贷纠纷等。针对复杂案件，可组建跨领域律师团队联合办理。
          </p>
          <div class="card-icon">
            <img src="@/assets/img/company/business/lawyer-card2.png" alt="" />
          </div>
        </div>
      </div>
    </div>

    <!-- 免费法律咨询服务 -->
    <div class="consultation-section">
      <h2 class="section-title">免费法律咨询服务</h2>
      <div class="consultation-content">
        <div class="service-channels">
          <h3 class="content-title">服务渠道</h3>
          <p class="content-text">
            提供电话咨询、微信咨询及线下门店面对面咨询三种方式。
          </p>
        </div>

        <div class="service-content">
          <h3 class="content-title">服务内容</h3>
          <p class="content-text">
            解答法律常识疑问、分析案件初步解决方案、指引维权流程等，例如针对劳动纠纷客户，详细说明仲裁时效、举证要点、经济补偿金计算方式等关键信息。
          </p>
        </div>

        <div class="team-config">
          <h3 class="content-title">团队配置</h3>
          <p class="content-text">
            咨询团队由10年以上执业经验的律师组成，确保解答的准确性与实用性。
          </p>
        </div>
      </div>
    </div>
    <!-- 规划拓展业务 -->
    <div class="planning-section">
      <h2 class="section-title">规划拓展业务</h2>
      <p class="planning-text">未来计划推出法律知识培训、企业合规体系搭建等新业务，持续拓展服务边界。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Business",
};
</script>

<style lang="less" scoped>
@import "./business.less";
</style>
<style scoped lang="less" src="@/assets/h5css/business.less"></style>

