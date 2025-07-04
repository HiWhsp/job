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
          <!-- <span class="count"
              >({{ tab.key === "all" ? demandList.length : getTypeCount(tab.key) }})</span
            > -->
        </div>
      </div>

      <!-- 需求列表 -->
      <div class="demand-list">
        <el-empty v-if="demandList.length === 0" description="暂无数据" />

        <div v-for="item in demandList" :key="item.id" class="demand-item">
          <!-- 售后运维需求 -->
          <template v-if="item.workOrderType == 1">
            <div class="demand-header">
              <div class="demand-type maintenance">
                {{ checkStatus(item.checkStatus) }}
              </div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.created_at }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.serialNo }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ workOrderName(item) }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.deviceType">
                  <span class="label">设备类型：</span>
                  <span class="value">{{ deviceTypeName(item) }}</span>
                </div>
                <div class="detail-row" v-if="item.deviceGuige">
                  <span class="label">设备规格：</span>
                  <span class="value">{{ item.deviceGuige }}</span>
                </div>
                <div class="detail-row" v-if="item.deviceAddress">
                  <span class="label">设备位置：</span>
                  <span class="value">{{ item.deviceAddress }}</span>
                </div>
                <div class="detail-row" v-if="item.faultDescription">
                  <span class="label">故障现象：</span>
                  <span class="value">{{ item.faultDescription }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 光伏充电桩产品需求 -->
          <template v-else-if="item.workOrderType === 2">
            <div class="demand-header">
              <div class="demand-type photovoltaic">
                {{ checkStatus(item.checkStatus) }}
              </div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.created_at }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.serialNo }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ workOrderName(item) }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.companyName">
                  <span class="label">企业名称：</span>
                  <span class="value">{{ item.companyName }}</span>
                </div>
                <div class="detail-row" v-if="item.address">
                  <span class="label">地址：</span>
                  <span class="value">{{ item.address }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 新能源光储充项目需求 -->
          <template v-else-if="item.workOrderType === 3">
            <div class="demand-header">
              <div class="demand-type energy_storage">
                {{ checkStatus(item.checkStatus) }}
              </div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.created_at }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.serialNo }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ workOrderName(item) }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.projectName">
                  <span class="label">项目名称：</span>
                  <span class="value">{{ item.projectName }}</span>
                </div>
                <div class="detail-row" v-if="item.projectAddress">
                  <span class="label">项目地点：</span>
                  <span class="value">{{ item.projectAddress }}</span>
                </div>
                <div class="detail-row" v-if="item.projectScale">
                  <span class="label">项目规模：</span>
                  <span class="value">{{ item.projectScale }}</span>
                </div>
                <div class="detail-row" v-if="item.projectTypeStr">
                  <span class="label">技术类型：</span>
                  <span class="value">{{ item.projectTypeStr }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 项目转让需求 -->
          <template v-else-if="item.workOrderType === 4">
            <div class="demand-header">
              <div class="demand-type project_transfer">
                {{ checkStatus(item.checkStatus) }}
              </div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.created_at }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.serialNo }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ workOrderName(item) }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.projectName">
                  <span class="label">项目名称：</span>
                  <span class="value">{{ item.projectName }}</span>
                </div>
                <div class="detail-row" v-if="item.projectAddress">
                  <span class="label">项目地点：</span>
                  <span class="value">{{ item.projectAddress }}</span>
                </div>
                <div class="detail-row" v-if="item.projectScale">
                  <span class="label">项目规模：</span>
                  <span class="value">{{ item.projectScale }}</span>
                </div>
                <div class="detail-row" v-if="item.projectTypeStr">
                  <span class="label">项目类型：</span>
                  <span class="value">{{ item.projectTypeStr }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 光伏材料/储电池/老旧电站改造合同需求 -->
          <template v-else-if="item.workOrderType === 5">
            <div class="demand-header">
              <div class="demand-type material_contract">
                {{ checkStatus(item.checkStatus) }}
              </div>
              <div class="demand-header-info">
                <div class="demand-time">{{ item.created_at }}</div>
                <div class="demand-type-icon"></div>
                <div class="contact-info">编号：{{ item.serialNo }}</div>
              </div>
            </div>
            <div class="demand-content">
              <div class="demand-title">
                {{ workOrderName(item) }}
                <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
              </div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.companyName">
                  <span class="label">公司名称：</span>
                  <span class="value">{{ item.companyName }}</span>
                </div>
                <div class="detail-row" v-if="item.address">
                  <span class="label">回收地点：</span>
                  <span class="value">{{ item.address }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- 默认展示 (兜底) -->
          <!-- <template v-else>
            <div class="demand-header">
              <div class="demand-type default">{{ item.typeName }}</div>
              <div class="demand-time">{{ item.publishTime }}</div>
              <div class="contact-info">联系：{{ item.contact }}</div>
            </div>
            <div class="demand-content">
              <div class="demand-title">{{ item.title }}</div>
              <div class="demand-details">
                <div class="detail-row" v-if="item.companyName">
                  <span class="label">公司名称：</span>
                  <span class="value">{{ item.companyName }}</span>
                </div>
                <div class="detail-row" v-if="item.address">
                  <span class="label">回收地点：</span>
                  <span class="value">{{ item.address }}</span>
                </div>
              </div>
            </div>
            <div class="demand-actions">
              <button class="detail-btn" @click="viewDetail(item)">查看详情</button>
            </div>
          </template> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "",
      demandList: [],
      total: 0,
      tabs: [
        { key: "", label: "全部" },
        { key: "maintenance", label: "售后运维" },
        { key: "photovoltaic", label: "光伏充电桩" },
        { key: "energy_storage", label: "新能源光储充" },
        { key: "project_transfer", label: "项目转让" },
        { key: "material_contract", label: "光伏材料合同" },
      ],
    };
  },
  computed: {
    // 审核状态
    checkStatus() {
      return (status) => {
        return {
          0: "待查看",
          1: "已查看",
          2: "已处理",
        }[status];
      };
    },
    // 需求类型
    workOrderName() {
      return (item) => {
        return {
          1: "售后运维需求表",
          2: "光储充相关产品需求表",
          3: "新能源光储充项目投融资信息需求表",
          4: "项目转让需求表",
          5: "光伏组件/锂电池/铅酸电池回收业务信息表",
        }[item.workOrderType];
      };
    },
    // 设备类型
    deviceTypeName() {
      return (item) => {
        return {
          1: "光伏",
          2: "储能",
          3: "拆冲",
          4: item.otherDevice,
        }[item.deviceType];
      };
    },
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "myCreateWorkorderList",
        method: "get",
        data: {
          workOrderType: this.activeTab,
        },
      }).then((res) => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.demandList = data.list;
          this.total = data.totalCount;
        }
      });
    },
    switchTab(tab) {
      this.activeTab = tab;
      this.setView();
    },
    viewDetail(item) {
      // 处理查看详情逻辑
      console.log("查看详情:", item);
      // 这里可以跳转到详情页面或打开详情弹窗
      this.$router.push({
        path: "demand-detail",
        query: {
          id: item.id,
        },
      });
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
