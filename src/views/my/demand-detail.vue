<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>我的需求</span>
        <span style="margin: 0 10px">></span>
        <span>{{ workOrderName(demandInfo) }}详情</span>
      </div>
    </div>
    <div class="page-ctx">
      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="demand-info">
          <p class="demand-date">{{ demandInfo.created_at }}</p>
          <i class="col-line"></i>
          <p class="demand-number">编号：{{ demandInfo.serialNo }}</p>
        </div>
        <div class="demand-status" :class="getStatusClass()">
          状态：{{ checkStatus(demandInfo.checkStatus) }}
        </div>
      </div>

      <!-- 售后运维需求表详情 -->
      <div class="demand-content">
        <h3 class="content-title">{{ workOrderName(demandInfo) }}</h3>
        <div class="form-table">
          <template v-if="demandInfo.workOrderType === 1">
            <div class="form-row">
              <div class="form-label">设备类型：</div>
              <div class="form-value">{{ deviceTypeName(demandInfo) }}</div>
            </div>
            <div class="form-row">
              <div class="form-label">设备地质：</div>
              <div class="form-value">{{ demandInfo.deviceAddress }}</div>
            </div>
            <div class="form-row">
              <div class="form-label">设备位置：</div>
              <div class="form-value">
                {{ demandInfo.deviceAddress }}
              </div>
            </div>
            <div class="form-row">
              <div class="form-label">故障现象：</div>
              <div class="form-value">
                {{ demandInfo.faultDescription }}
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
                  <tr v-for="(item, index) in demandInfo.productJson" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.guige }}</td>
                    <td>{{ item.num }}</td>
                    <td>{{ item.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <div class="form-row" v-if="demandInfo.workOrderType == 1">
            <div class="form-label">图片：</div>
            <div class="form-value">
              <div class="upload-images">
                <div
                  class="upload-image"
                  v-for="(item, index) in demandInfo.photosJson"
                  :key="index"
                >
                  <img :src="item.url" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="form-row" v-if="demandInfo.workOrderType != 1">
            <div class="form-label">附件：</div>
            <div class="form-value">
              <div class="upload-images">
                <div
                  class="upload-image"
                  v-for="(item, index) in demandInfo.attachJson"
                  :key="index"
                >
                  <img :src="item.url" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-label">补充说明：</div>
            <div class="form-value">
              {{ demandInfo.remark }}
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
            <span class="info-value">{{ demandInfo.companyName }}</span>
            <span class="info-label">联系人：</span>
            <span class="info-value">{{ demandInfo.contactPerson }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ demandInfo.contact }}</span>
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
      id: "",
      demandType: "",
      demandInfo: {},
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
    this.id = this.$route.query.id; // 修复参数获取
    this.initDemandInfo();
  },
  methods: {
    initDemandInfo() {
      // 从路由参数获取信息
      this.$api({
        url: "workorderDetail",
        method: "post",
        data: {
          id: this.id,
        },
      }).then((res) => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.demandInfo = {
            ...data,
            photosJson: JSON.parse(data.photosJson || "[]"),
            productJson: JSON.parse(data.productJson || "[]"),
            attachJson: JSON.parse(data.attachJson || "[]"),
          };
          console.log(this.demandInfo);
        }
      });
    },
    getStatusClass() {
      if (this.demandInfo.checkStatus == 2) {
        return "status-processed";
      } else if (this.demandInfo.checkStatus == 1) {
        return "status-viewed";
      } else {
        return "status-processing";
      }
    },
  },
};
</script>

<style lang="less" scoped src="./demand-detail.less"></style>
