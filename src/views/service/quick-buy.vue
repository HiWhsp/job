<template>
  <div class="page">
    <div class="service-img">
      <h1>服务中心</h1>
      <p>Service Center</p>
    </div>
    <pageBreadcrumb :option="nav_option" />
    <div class="inner">
      <div class="page-ctx">
        <div class="quick-buy-form">
          <!-- 顶部说明和操作区域 -->
          <div class="instruction-section">
            <p class="instruction-text">
              您可以选择下载模板,按模板批量填写您的需求,再上传文件,也可以在下方表格中直接填写您的需求。
            </p>
            <div class="action-buttons">
              <div class="download-section">
                <el-button
                  class="download-btn"
                  @click="downloadTemplate"
                  icon="el-icon-download"
                >
                  点我下载模板
                </el-button>
                <p class="btn-desc">按照模版批量填写您的需求</p>
              </div>
              <div class="arrow-icon">
                <img src="@img/batch/line.png" alt="" />
              </div>
              <div class="upload-section">
                <el-button
                  type="primary"
                  class="upload-btn"
                  @click="triggerFileUpload"
                  icon="el-icon-upload2"
                  :loading="uploadingFile"
                  :disabled="uploadingFile"
                >
                  上传文件
                </el-button>
                <p class="btn-desc">填写好后批量上传</p>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              style="display: none"
              @change="handleFileSelect"
              accept=".xlsx,.xls,.csv"
            />
          </div>

          <!-- 商品信息表格 -->
          <div class="table-section">
            <div class="table-header">
              <table class="product-table">
                <thead>
                  <tr>
                    <th width="100">序号</th>
                    <th>材质名称</th>
                    <th>规格</th>
                    <th>技术要求</th>
                    <th>数量</th>
                    <th>交付时间</th>
                    <th width="100"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in productList" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <el-input
                        v-model="item.material"
                        placeholder="请填写"
                        class="table-input"
                      />
                    </td>
                    <td>
                      <el-input
                        v-model="item.sku"
                        placeholder="请填写"
                        class="table-input"
                      />
                    </td>
                    <td>
                      <el-input
                        v-model="item.content"
                        placeholder="请填写要求信息..."
                        class="table-input"
                      />
                    </td>
                    <td>
                      <div class="quantity-control">
                        <el-button
                          size="mini"
                          @click="decreaseQuantity(index)"
                          :disabled="item.num <= 1"
                        >
                          -
                        </el-button>
                        <span class="quantity-number">{{ item.num }}</span>
                        <el-button size="mini" @click="increaseQuantity(index)">
                          +
                        </el-button>
                      </div>
                    </td>
                    <td>
                      <el-date-picker
                        v-model="item.deliverTime"
                        type="date"
                        placeholder="请选择"
                        class="table-date-picker"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      />
                    </td>
                    <td>
                      <el-button
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="removeProduct(index)"
                        :disabled="productList.length <= 1"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <el-empty
                style="width: 100%"
                v-if="productList.length === 0"
                description="暂无数据"
              />
              <el-button type="primary" class="add-btn" @click="addProduct">
                添加
              </el-button>
            </div>
          </div>

          <!-- 联系信息区域 -->
          <div class="contact-section">
            <div class="contact-form">
              <div class="form-row">
                <div class="form-item required">
                  <label>*您的联系方式:</label>
                  <el-input
                    v-model="contactInfo.phone"
                    placeholder="请输入手机号或邮箱"
                    class="contact-input"
                    @blur="handleContactBlur"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-item required">
                  <label>*送货地址:</label>
                  <el-input
                    v-model="contactInfo.address"
                    placeholder="请输入"
                    class="contact-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="submit-section">
            <el-button
              type="primary"
              class="submit-btn"
              @click="submitOrder"
              :loading="submitting"
            >
              提交
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
import axios from "axios";
import { API_ROOT } from "@/config/env.js";
export default {
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      nav_option: [
        { title: "服务中心" },
        { title: "快速购物", route: "/quick-buy" },
      ],
      productList: [],
      contactInfo: {
        phone: "",
        address: "",
      },
      buyId: "",
      submitting: false,
      uploadingFile: false,
    };
  },
  methods: {
    // 下载模板
    downloadTemplate() {
      // 这里可以创建一个Excel模板文件供下载
      const templateData = [
        ["序号", "材质名称", "规格", "技术要求", "数量", "交付时间"],
        ["1", "平凸透镜", "请填写", "请填写要求信息...", "1", "请选择"],
      ];

      // 简单的CSV格式下载
      const csvContent = templateData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "快速购物模板.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.$message.success("模板下载成功！");
    },

    // 触发文件上传
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },

    // 处理文件选择
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const allowedExtensions = [".xlsx", ".xls", ".csv"];
      const fileName = file.name.toLowerCase();
      const isValidType = allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
      );
      if (!isValidType) {
        this.$message.error("仅支持上传 .xlsx/.xls/.csv 文件");
        event.target.value = "";
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.$message.error("文件大小不能超过 10MB");
        event.target.value = "";
        return;
      }

      this.uploadBuyInfoFile(file);
    },

    // 上传批量采购文件
    uploadBuyInfoFile(file) {
      this.uploadingFile = true;
      const formData = new FormData();
      formData.append("filepath", file);
      formData.append("action", "serve_uploadWithBuyInfo");

      const userId = localStorage.getItem("userId") || "";
      const token = localStorage.getItem("token") || "";
      if (userId) formData.append("userId", userId);
      if (token) formData.append("token", token);

      const uploadUrl =
        process.env.NODE_ENV !== "production"
          ? `${API_ROOT}/service.php`
          : "/service.php";

      axios({
        url: uploadUrl,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          const list = Array.isArray(res.data?.details) ? res.data.details : [];
          this.buyId = res.data?.buyId || "";
          if (list.length > 0) {
            this.productList = list;
            this.$message.success("文件上传成功，数据已填充");
          } else {
            this.$message.success("文件上传成功");
          }
        })
        .catch((err) => {
          const msg = err?.msg || err?.message || "文件上传失败";
          this.$message.error(msg);
        })
        .finally(() => {
          this.uploadingFile = false;
          if (this.$refs.fileInput) {
            this.$refs.fileInput.value = "";
          }
        });
    },

    // 添加商品
    addProduct() {
      this.productList.push({
        material: "",
        sku: "",
        content: "",
        num: 1,
        deliverTime: "",
      });
    },

    // 删除商品
    removeProduct(index) {
      if (this.productList.length > 1) {
        this.productList.splice(index, 1);
      }
    },

    // 增加数量
    increaseQuantity(index) {
      this.productList[index].num++;
    },

    // 减少数量
    decreaseQuantity(index) {
      if (this.productList[index].num > 1) {
        this.productList[index].num--;
      }
    },

    // 校验联系方式（支持手机号和邮箱）
    validateContact(value) {
      if (!value) {
        return "请输入您的联系方式";
      }
      
      // 手机号正则：1开头的11位数字
      const phonePattern = /^1[3-9]\d{9}$/;
      // 邮箱正则
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (phonePattern.test(value)) {
        return "";
      } else if (emailPattern.test(value)) {
        return "";
      } else {
        return "请输入正确的手机号或邮箱格式";
      }
    },

    // 处理联系方式输入框失焦事件
    handleContactBlur() {
      if (this.contactInfo.phone) {
        const error = this.validateContact(this.contactInfo.phone);
        if (error) {
          this.$message.warning(error);
        }
      }
    },

    // 提交订单
    submitOrder() {
      // 验证必填字段
      if (!this.contactInfo.phone) {
        this.$message.error("请输入您的联系方式");
        return;
      }
      
      // 校验联系方式格式
      const contactError = this.validateContact(this.contactInfo.phone);
      if (contactError) {
        this.$message.error(contactError);
        return;
      }
      
      if (!this.contactInfo.address) {
        this.$message.error("请输入送货地址");
        return;
      }

      // 验证商品信息
      const hasEmptyProduct = this.productList.some(
        (item) =>
          !item.material || !item.sku || !item.content || !item.deliverTime
      );

      if (hasEmptyProduct) {
        this.$message.error("请完善商品信息");
        return;
      }

      this.submitting = true;
      this.$api({
        url: "/service.php",
        method: "post",
        data: {
          action: "serve_quickBuy",
          buyInfo: JSON.stringify(this.productList),
          phone: this.contactInfo.phone,
          address: this.contactInfo.address,
          buyId: this.buyId,
        },
      })
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("提交成功");
            this.productList = [];
            this.contactInfo = {
              phone: "",
              address: "",
            };
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err.msg);
        })
        .finally(() => {
          this.submitting = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  background: #f5f5f5;
  text-align: left;
  min-height: 100vh;

  .inner {
    padding-top: 0px;
    padding-bottom: 100px;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }
}

.service-img {
  background-image: url("../../assets/img/banner/service.png");
  height: 560px;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 56px;
    color: #fff;
  }
  p {
    font-size: 24px;
    color: #fff;
  }
}

.quick-buy-form {
  padding: 40px;
  margin-top: 40px;

  // 顶部说明和操作区域
  .instruction-section {
    margin-bottom: 40px;

    .instruction-text {
      font-size: 16px;
      color: #666;
      text-align: center;
      margin-bottom: 30px;
      line-height: 1.6;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;

      .download-section,
      .upload-section {
        display: flex;
        flex-direction: column;
        align-items: center;

        .download-btn {
          background: #ffeded;
          border: 2px solid #f74747;
          color: #f74747;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .upload-btn {
          background: #e5222b;
          border: 2px solid #e5222b;
          color: #fff;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .btn-desc {
          font-size: 12px;
          color: #999;
          margin: 0;
          text-align: center;
        }
      }

      .arrow-icon {
        margin-bottom: 15px;
      }
    }
  }

  // 表格区域
  .table-section {
    margin-bottom: 40px;

    .table-header {
      .product-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;

        thead {
          background: #fff;

          th {
            padding: 15px 10px;
            text-align: center;
            font-weight: 600;
            color: #333;
            font-size: 14px;
          }
        }

        tbody {
          tr {
            td {
              padding: 10px;
              text-align: center;
              vertical-align: middle;

              .table-input {
                width: 100%;

                .el-input__inner {
                  border: 1px solid #e0e0e0;
                  border-radius: 4px;
                  height: 36px;
                  font-size: 13px;

                  &:focus {
                    border-color: #409eff;
                  }
                }
              }

              .quantity-control {
                display: flex;
                align-items: center;
                justify-content: center;

                .el-button {
                  width: 28px;
                  height: 28px;
                  padding: 0;
                  border-radius: 4px;
                  font-size: 14px;
                  font-weight: bold;
                }

                .quantity-number {
                  display: inline-block;
                  background: #ffffff;
                  min-width: 30px;
                  height: 26px;
                  line-height: 26px;
                  text-align: center;
                  font-weight: 500;
                  color: #333;
                }
              }

              .table-date-picker {
                width: 100%;

                .el-input__inner {
                  border: 1px solid #e0e0e0;
                  border-radius: 4px;
                  height: 36px;
                  font-size: 13px;

                  &:focus {
                    border-color: #409eff;
                  }
                }
              }
            }
          }
        }
      }

      .add-btn {
        background: #2e4c87;
        border-color: #2e4c87;
        color: #fff;
        padding: 10px 20px;
        border-radius: 6px;
        font-size: 14px;
      }
    }
  }

  // 联系信息区域
  .contact-section {
    margin-bottom: 40px;

    .contact-form {
      display: flex;
      align-items: center;
      gap: 20px;
      .form-row {
        flex: 1;
        margin-bottom: 20px;
        display: flex;
        align-items: center;

        .form-item {
          flex: 1;
          display: flex;
          align-items: center;
          &.required {
            label {
              color: #ff4757;
            }
          }

          label {
            width: 130px;
            display: block;
            font-size: 14px;
            color: #333;
            font-weight: 500;
          }

          .contact-input {
            .el-input__inner {
              height: 50px;
              border: 1px solid #e0e0e0;
              border-radius: 6px;
              font-size: 14px;
              padding: 0 15px;

              &:focus {
                border-color: #409eff;
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
              }
            }
          }
        }
      }
    }
  }

  // 提交按钮区域
  .submit-section {
    text-align: center;

    .submit-btn {
      background: #2e4c87;
      border-color: #2e4c87;
      color: #fff;
      padding: 15px 50px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      min-width: 120px;
    }
  }
}

.bread-box {
  background: #ffffff;
  padding: 16px 0;
  border-bottom: 1px solid #e4e4e4;

  .bread-inner {
    margin: 0 auto;
    a {
      display: inline-flex;
      align-items: center;

      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;

      img {
        margin-right: 10px;
      }
    }

    .link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .route-link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .arrow {
      margin: 0 6px;
      color: #aeaeae;
    }

    > *:last-child {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #000000;
    }

    .search-item {
      color: #aeaeae;
    }
    .search-keyword {
      color: #2e4c87;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .quick-buy-form {
    padding: 20px;
    margin-top: 20px;

    .instruction-section {
      .action-buttons {
        flex-direction: column;
        gap: 20px;

        .arrow-icon {
          transform: rotate(90deg);
        }
      }
    }

    .table-section {
      .table-header {
        .product-table {
          font-size: 12px;

          thead th,
          tbody td {
            padding: 8px 5px;
          }
        }
      }
    }
  }
}
</style>
