<template>
  <div class="page">
    <div class="main-title">
      <span>我的需求</span>
    </div>
    <div class="page-ctx">
      <!-- tab切换 -->
      <div class="tab-container">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          {{ tab.label }}
          <span class="count"
            >({{ tab.key === "all" ? demandList.length : getTypeCount(tab.key) }})</span
          >
        </div>
      </div>

      <!-- 需求列表 -->
      <div class="demand-list">
        <el-empty v-if="filteredDemandList.length === 0" description="暂无数据" />

        <div v-for="item in filteredDemandList" :key="item.id" class="demand-item">
          <!-- 售后运维需求 -->
          <template v-if="item.type === 'maintenance'">
            <div class="demand-header">
              <div class="demand-type maintenance">{{ item.typeName }}</div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.publishTime }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.contact }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ item.title }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.company">
                  <span class="label">公司名称：</span>
                  <span class="value">{{ item.company }}</span>
                </div>
                <div class="detail-row" v-if="item.location">
                  <span class="label">所在地区：</span>
                  <span class="value">{{ item.location }}</span>
                </div>
                <div class="detail-row" v-if="item.description">
                  <span class="label">需求描述：</span>
                  <span class="value">{{ item.description }}</span>
                </div>
                <div class="detail-row" v-if="item.requirements">
                  <span class="label">具体需求：</span>
                  <span class="value">{{ item.requirements }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 光伏充电桩产品需求 -->
          <template v-else-if="item.type === 'photovoltaic'">
            <div class="demand-header">
              <div class="demand-type photovoltaic">{{ item.typeName }}</div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.publishTime }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.contact }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ item.title }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.company">
                  <span class="label">企业名称：</span>
                  <span class="value">{{ item.company }}</span>
                </div>
                <div class="detail-row" v-if="item.location">
                  <span class="label">地址：</span>
                  <span class="value">{{ item.location }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 新能源光储充项目需求 -->
          <template v-else-if="item.type === 'energy_storage'">
            <div class="demand-header">
              <div class="demand-type energy_storage">{{ item.typeName }}</div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.publishTime }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.contact }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ item.title }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.projectType">
                  <span class="label">项目类型：</span>
                  <span class="value">{{ item.projectType }}</span>
                </div>
                <div class="detail-row" v-if="item.location">
                  <span class="label">项目地点：</span>
                  <span class="value">{{ item.location }}</span>
                </div>
                <div class="detail-row" v-if="item.description">
                  <span class="label">项目规模：</span>
                  <span class="value">{{ item.description }}</span>
                </div>
                <div class="detail-row" v-if="item.requirements">
                  <span class="label">技术类型：</span>
                  <span class="value">{{ item.requirements }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 项目转让需求 -->
          <template v-else-if="item.type === 'project_transfer'">
            <div class="demand-header">
              <div class="demand-type project_transfer">
                {{ item.typeName }}
              </div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.publishTime }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.contact }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ item.title }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.projectScale">
                  <span class="label">项目名称：</span>
                  <span class="value">{{ item.projectScale }}</span>
                </div>
                <div class="detail-row" v-if="item.location">
                  <span class="label">项目地点：</span>
                  <span class="value">{{ item.location }}</span>
                </div>
                <div class="detail-row" v-if="item.transferPrice">
                  <span class="label">项目规模：</span>
                  <span class="value">{{ item.transferPrice }}</span>
                </div>
                <div class="detail-row" v-if="item.description">
                  <span class="label">项目类型：</span>
                  <span class="value">{{ item.description }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 光伏材料/储电池/老旧电站改造合同需求 -->
          <template v-else-if="item.type === 'material_contract'">
            <div class="demand-header">
              <div class="demand-type material_contract">
                {{ item.typeName }}
              </div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.publishTime }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.contact }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ item.title }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.company">
                  <span class="label">公司名称：</span>
                  <span class="value">{{ item.company }}</span>
                </div>
                <div class="detail-row" v-if="item.materialType">
                  <span class="label">回收地点：</span>
                  <span class="value">{{ item.materialType }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 默认展示 (兜底) -->
          <template v-else>
            <div class="demand-header">
              <div class="demand-type default">{{ item.typeName }}</div>
              <div class="demand-time">{{ item.publishTime }}</div>
              <div class="contact-info">联系：{{ item.contact }}</div>
            </div>
            <div class="demand-content">
              <div class="demand-title">{{ item.title }}</div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.company">
                  <span class="label">公司名称：</span>
                  <span class="value">{{ item.company }}</span>
                </div>
                <div class="detail-row" v-if="item.location">
                  <span class="label">所在地区：</span>
                  <span class="value">{{ item.location }}</span>
                </div>
                <div class="detail-row" v-if="item.description">
                  <span class="label">需求描述：</span>
                  <span class="value">{{ item.description }}</span>
                </div>
              </div>
            </div>
            <div class="demand-actions">
              <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "all",
      demandList: [
        {
          id: 1,
          type: "maintenance",
          typeName: "状态：已查看（1-3个工作日邮箱或电话回复您）",
          title: "售后运维需求表",
          publishTime: "2021-08-18 13:29",
          contact: "56584455171454",
          company: "武汉",
          location: "武汉市",
          description: "本项目为自己家房顶安装对应的新能源储能设备符合国家政策",
          requirements: "详询能期维锁周知交家",
        },
        {
          id: 2,
          type: "photovoltaic",
          typeName: "光伏充电桩产品需求表",
          title: "光伏充电桩产品需求表",
          publishTime: "2021-08-18 13:29",
          contact: "56584455171454",
          company: "XXXXXXXX科技有限公司",
          location: "江苏省江阴市",
          power: "50MW",
          budget: "500-800万元",
          description: "需要建设光伏充电桩项目",
          requirements: "符合国家储能建设的需要性",
        },
        {
          id: 3,
          type: "energy_storage",
          typeName: "新能源光储充项目的需要数据需求表",
          title: "新能源光储充项目的需要数据需求表",
          publishTime: "2021-08-18 13:29",
          contact: "56584455171454",
          projectType: "光储充一体化项目",
          location: "江苏省无锡市",
          description: "本项目为自己家房顶安装对应的新能源储能设备符合国家政策",
          requirements: "详询新能源对应的储能自动化的符合国家合作储能",
          timeline: "2024年6月前完成",
        },
        {
          id: 4,
          type: "project_transfer",
          typeName: "项目转让需求表",
          title: "项目转让需求表",
          publishTime: "2021-08-18 13:29",
          contact: "56584455171454",
          projectScale: "100MW光伏电站",
          location: "山东省济南市",
          transferPrice: "8000万元",
          description: "本项目为自己家房顶安装对应的新能源储能设备符合国家政策",
          requirements: "详询新能源对应的储能自动化的符合国家合作储能",
        },
        {
          id: 5,
          type: "material_contract",
          typeName: "光伏材料/储电池/老旧电站改造的业务合同需求表",
          title: "光伏材料/储电池/老旧电站改造的业务合同需求表",
          publishTime: "2021-08-18 13:29",
          contact: "56584455171454",
          company: "XXXXXXXX科技有限公司",
          materialType: "单晶硅组件",
          quantity: "1000块",
          location: "江苏省常州市",
          deliveryTime: "2024年3月底",
          description: "需要采购单晶硅组件用于光伏电站建设",
          requirements: "符合国家标准，质保25年",
        },
      ],
      tabs: [
        { key: "all", label: "全部" },
        { key: "maintenance", label: "售后运维" },
        { key: "photovoltaic", label: "光伏充电桩" },
        { key: "energy_storage", label: "新能源光储充" },
        { key: "project_transfer", label: "项目转让" },
        { key: "material_contract", label: "光伏材料合同" },
      ],
    };
  },
  computed: {
    filteredDemandList() {
      if (this.activeTab === "all") {
        return this.demandList;
      }
      return this.demandList.filter((item) => item.type === this.activeTab);
    },
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
    viewDetail(item) {
      // 处理查看详情逻辑
      console.log("查看详情:", item);
      // 这里可以跳转到详情页面或打开详情弹窗
    },
    getTabName(tabKey) {
      const tab = this.tabs.find((t) => t.key === tabKey);
      return tab ? tab.label : "全部";
    },
    getTypeCount(type) {
      return this.demandList.filter((item) => item.type === type).length;
    },
    // 联系供应商
    contactSupplier(item) {
      console.log("联系供应商:", item);
      // 这里可以打开联系供应商的弹窗或跳转
    },
    // 提交报价
    submitQuote(item) {
      console.log("提交报价:", item);
      // 这里可以打开报价表单弹窗
    },
    // 表示感兴趣
    showInterest(item) {
      console.log("感兴趣:", item);
      // 这里可以提交感兴趣的申请
    },
    // 我要供货
    submitSupply(item) {
      console.log("我要供货:", item);
      // 这里可以打开供货申请表单
    },
  },
};
</script>

<style lang="less" scoped src="./demand-list.less"></style>
