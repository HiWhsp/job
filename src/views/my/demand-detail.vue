<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>My Demands</span>
        <span style="margin: 0 10px">></span>
        <span>{{ workOrderName(demandInfo) }} Details</span>
      </div>
    </div>
    <div class="page-ctx">
      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="demand-info">
          <p class="demand-date">{{ demandInfo.created_at }}</p>
          <i class="col-line"></i>
          <p class="demand-number">Number: {{ demandInfo.serialNo }}</p>
        </div>
        <div class="demand-status" :class="getStatusClass()">
          Status: {{ checkStatus(demandInfo.checkStatus) }}
        </div>
      </div>

      <!-- 售后运维需求表详情 -->
      <div class="demand-content">
        <h3 class="content-title">{{ workOrderName(demandInfo) }}</h3>
        <div class="form-table">
          <template v-if="demandInfo.workOrderType == 1">
            <div class="form-row">
              <div class="form-label">Type:</div>
              <div class="form-value">{{ deviceTypeName(demandInfo) }}</div>
            </div>
            <div class="form-row">
              <div class="form-label">Location:</div>
              <div class="form-value">{{ demandInfo.deviceAddress }}</div>
            </div>
            <div class="form-row">
              <div class="form-label">Position:</div>
              <div class="form-value">
                {{ demandInfo.deviceAddress }}
              </div>
            </div>
            <div class="form-row">
              <div class="form-label">Description:</div>
              <div class="form-value">
                {{ demandInfo.faultDescription }}
              </div>
            </div>
          </template>

          <!-- 光储充相关产品需求表详情 -->
          <template v-if="demandInfo.workOrderType == 2">
            <div class="product-table">
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Specification</th>
                    <th>Quantity</th>
                    <th>Data Provision</th>
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

          <template v-if="demandInfo.workOrderType == 5">
            <div class="product-table">
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Type</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in demandInfo.productJson" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.type }}</td>
                    <td class="image-cell">
                      <img :src="item.image" alt="" />
                      <span class="preview-btn" @click="previewImage(item.image)"
                        >Preview</span
                      >
                    </td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.num }}</td>
                    <td>{{ item.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <template v-if="[3, 4].includes(demandInfo.workOrderType)">
            <div class="form-row">
              <div class="form-label">Name:</div>
              <div class="form-value">{{ demandInfo.projectName }}</div>
            </div>
            <div class="form-row">
              <div class="form-label">Location:</div>
              <div class="form-value">{{ demandInfo.projectAddress }}</div>
            </div>
            <div class="form-row">
              <div class="form-label">Scale:</div>
              <div class="form-value">
                {{ demandInfo.projectScale }}
              </div>
            </div>
            <div class="form-row">
              <div class="form-label">Type:</div>
              <div class="form-value">
                {{ demandInfo.projectTypeStr }}
              </div>
            </div>
            <div class="form-row" v-if="demandInfo.workOrderType == 3">
              <div class="form-label">Progress:</div>
              <div class="form-value">
                {{ demandInfo.projectProgress }}
              </div>
            </div>
          </template>

          <div class="form-row" v-if="demandInfo.workOrderType == 1">
            <div class="form-label">Images:</div>
            <div class="form-value">
              <div class="upload-images">
                <div
                  class="upload-image"
                  v-for="(item, index) in demandInfo.photos_full"
                  :key="index"
                >
                  <img :src="item" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="form-row" v-if="demandInfo.workOrderType != 1">
            <div class="form-label">Attachments:</div>
            <div class="form-value">
              <div class="upload-images">
                <div
                  class="upload-image"
                  v-for="(item, index) in demandInfo.attach_full"
                  :key="index"
                >
                  <img :src="item" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-label">Notes:</div>
            <div class="form-value">
              {{ demandInfo.remark }}
            </div>
          </div>
        </div>
      </div>

      <!-- 我的信息 -->
      <div class="my-info">
        <h3 class="info-title">My Information</h3>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">Company Name:</span>
            <span class="info-value">{{ demandInfo.companyName }}</span>
            <span class="info-label">Contact Person:</span>
            <span class="info-value">{{ demandInfo.contactPerson }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Contact Phone:</span>
            <span class="info-value">{{ demandInfo.contact }}</span>
            <span class="info-label">Email:</span>
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
          0: "Pending Review",
          1: "Reviewed",
          2: "Processed",
        }[status];
      };
    },
    // 需求类型
    workOrderName() {
      return (item) => {
        return {
          1: "After-sales Maintenance Demand Form",
          2: "Project Product Demand Form",
          3: "Project Financing Form",
          4: "Project Transfer Form",
          5: "Product Recycling Form",
        }[item.workOrderType];
      };
    },
    // 设备类型
    deviceTypeName() {
      return (item) => {
        return {
          1: "Photovoltaic",
          2: "Energy Storage",
          3: "Charging Station",
          4: "Chai Fa",
          5: item.otherDevice,
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
        url: "requireDetail",
        method: "post",
        data: {
          id: this.id,
        },
      }).then((res) => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.demandInfo = {
            ...data,
            photosJson: data.photosJson,
            productJson: data.productJson,
            attachJson: data.attachJson,
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
    previewImage(image) {
      window.open(image, "_blank");
    },
  },
};
</script>

<style lang="less" scoped src="./demand-detail.less"></style>
