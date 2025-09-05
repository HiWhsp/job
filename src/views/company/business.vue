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
            <div class="icon-documents"></div>
          </div>
          <h3 class="card-title">服务形式</h3>
          <p class="card-content">
            线上购买（下载）合同范本，线下提供专业法律服务支持，满足不同客户需求。
          </p>
        </div>
        <div class="template-card">
          <div class="card-icon">
            <div class="icon-documents"></div>
          </div>
          <h3 class="card-title">范本品类</h3>
          <p class="card-content">
            涵盖房地产、人事、建设工程、公司管理、知识产权、合同文本等多个专业领域，提供全面的法律文书模板。
          </p>
        </div>
        <div class="template-card">
          <div class="card-icon">
            <div class="icon-documents"></div>
          </div>
          <h3 class="card-title">增值服务</h3>
          <p class="card-content">
            购买（下载）合同范本，享受专业法律服务，包括合同审查、法律咨询等增值服务。
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
            线上咨询平台，线下门店服务，多渠道满足客户法律咨询需求。
          </p>
        </div>

        <div class="central-graphic">
          <div class="consultation-icon">
            <div class="icon-consultation"></div>
          </div>
        </div>

        <div class="service-content">
          <h3 class="content-title">服务内容</h3>
          <p class="content-text">
            提供专业法律咨询、案件分析、法律意见等服务，帮助客户解决各类法律问题。
          </p>
        </div>

        <div class="team-config">
          <h3 class="content-title">团队配置</h3>
          <p class="content-text">
            拥有10年以上执业经验的专业律师团队，提供高质量的法律服务保障。
          </p>
        </div>
      </div>
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
