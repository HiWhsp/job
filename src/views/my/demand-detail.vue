<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>我的需求</span>
        <span style="margin: 0 10px">></span>
        <span>{{ title }}详情</span>
      </div>
    </div>
    <div class="page-ctx">
      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="demand-info">
          <p class="demand-date">{{ demandInfo.publishTime }}</p>
          <i class="col-line"></i>
          <p class="demand-number">编号：{{ demandInfo.contact }}</p>
        </div>
        <div class="demand-status" :class="getStatusClass()">
          状态：{{ demandInfo.statusText }}
        </div>
      </div>

      <!-- 售后运维需求表详情 -->
      <div class="demand-content">
        <h3 class="content-title">{{ title }}</h3>
        <div class="form-table">
          <template v-if="demandType === 'maintenance'">
            <div class="form-row">
              <div class="form-label">设备类型：</div>
              <div class="form-value">光伏</div>
            </div>
            <div class="form-row">
              <div class="form-label">设备地质：</div>
              <div class="form-value">设备需要设备地质设备地质</div>
            </div>
            <div class="form-row">
              <div class="form-label">设备位置：</div>
              <div class="form-value">
                设备位置设备位置设备位置设备位置设备位置设备位置设备
              </div>
            </div>
            <div class="form-row">
              <div class="form-label">故障现象：</div>
              <div class="form-value">
                故障现象故障现象故障现象故障现象故障现象故障现象故障现象故障现象故障现象故障现象故障现象故障现象故障现象故障现象故障现象
              </div>
            </div>
          </template>

          <!-- 光储充相关产品需求表详情 -->
          <template v-else>
            <div class="product-table">
              <table>
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>名称</th>
                    <th>规格</th>
                    <th>数量</th>
                    <th>资料提供</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>光储一体机</td>
                    <td>100KW/215KWH</td>
                    <td>10台</td>
                    <td>有资料/EC认证，包安装</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>PCS</td>
                    <td>200KW</td>
                    <td>10台</td>
                    <td>有相关海外认证</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <div class="form-row">
            <div class="form-label">图片：</div>
            <div class="form-value">
              <div class="upload-images">
                <div class="upload-image">
                  <span class="upload-placeholder">图片1</span>
                </div>
                <div class="upload-image">
                  <span class="upload-placeholder">图片2</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-label">补充说明：</div>
            <div class="form-value">
              补充说明补充说明补充说明补充说明补充说明补充说明补充说明补充说明补充说明补充说明补充说明补充说明补充说明补充说明补充说明
            </div>
          </div>
        </div>
      </div>

      <!-- 我的信息 -->
      <div class="my-info">
        <h3 class="info-title">我的信息</h3>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">企业名称：</span>
            <span class="info-value">{{ demandInfo.company }}</span>
            <span class="info-label">联系人：</span>
            <span class="info-value">张三</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ demandInfo.phone }}</span>
            <span class="info-label">邮箱：</span>
            <span class="info-value">{{ demandInfo.email }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      demandType: "",
      demandInfo: {
        publishTime: "2021-08-18 13:29",
        contact: "565884455112454",
        statusText: "",
        company: "XXXXXXXX科技有限公司",
        phone: "010-12345678",
        email: "815625979@qq.com",
      },
    };
  },
  mounted() {
    this.title = this.$route.query.id; // 修复参数获取
    this.initDemandInfo();
  },
  methods: {
    initDemandInfo() {
      // 从路由参数获取信息
      const query = this.$route.query;
      this.demandType = query.type || "default";
      this.demandInfo.publishTime = query.publishTime || "2021-08-18 13:29";
      this.demandInfo.contact = query.contact || "565884455112454";
      this.demandInfo.company = query.company || "XXXXXXXX科技有限公司";

      // 根据类型设置状态文本
      if (this.demandType === "maintenance") {
        this.demandInfo.statusText =
          "已处理（生成工作指导：OPS-2024-US-CA-001）";
      } else if (this.demandType === "photovoltaic") {
        this.demandInfo.statusText = "已查看（1个工作日即将到期请尽快回复）";
      } else {
        this.demandInfo.statusText = "处理中";
      }
    },
    getStatusClass() {
      if (this.demandInfo.statusText.includes("已处理")) {
        return "status-processed";
      } else if (this.demandInfo.statusText.includes("已查看")) {
        return "status-viewed";
      } else {
        return "status-processing";
      }
    },
  },
};
</script>

<style lang="less" scoped src="./demand-detail.less"></style>
