<template>
  <div class="page">
    <div class="main-title flex">
      <img src="@img/my/nav-4.png" alt="" />
      <span>客户管理</span>
    </div>

    <div class="page-ctx">
      <p style="display: flex; justify-content: flex-end">
        <button @click="do_address_add()" class="btn-c">
          <!-- <img src="@img/address-add.png" alt="" /> -->
          <i class="el-icon-circle-plus"></i>
          <span class="add-text">添加客户信息</span>
        </button>
      </p>

      <div class="center">
        <div class="address-table">
          <!-- 表头 -->
          <div class="table-header">
            <div class="header-cell">客户名称</div>
            <div class="header-cell">营业执照</div>
            <div class="header-cell">添加时间</div>
            <div class="header-cell">状态</div>
          </div>

          <!-- 表格内容 -->
          <div class="table-body">
            <div
              class="table-row"
              v-for="(item, index) in list_address"
              :key="index"
            >
              <div class="table-cell">{{ item.nickname }}</div>
              <div class="table-cell">
                <el-image :src="item.license1"></el-image>
              </div>
              <div class="table-cell">{{ item.createdTime }}</div>
              <div class="table-cell">{{ item.checkStatus }}</div>
              <!-- <div class="table-cell">
                <span class="action-link" @click="do_address_edit(item)"
                  >修改</span
                >
                <span
                  class="action-link delete"
                  @click="do_address_delete(item.id)"
                  >删除</span
                >
              </div>
              <div class="table-cell">
                <span v-if="item.moren == 1" class="default-btn">默认地址</span>
                <span
                  v-else
                  class="action-link"
                  @click="do_address_set_default(item.id)"
                  >设为默认地址</span
                >
              </div> -->
            </div>
          </div>
        </div>

        <el-empty
          v-if="!list_address.length"
          description="尚未添加地址"
        ></el-empty>
      </div>
    </div>

    <!-- 添加客户信息弹窗 -->
    <el-dialog
      title="添加客户信息"
      :visible.sync="showModal"
      width="500px"
      :before-close="closeModal"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      custom-class="customer-modal"
    >
      <div class="modal-inner">
        <el-form :model="form" :rules="rules" ref="customerForm">
          <!-- label-width="100px" -->
          <!-- <div class="form-item">
            <span class="label required">客户名称:</span>
            <el-form-item prop="nickname">
              <el-input
                v-model="form.nickname"
                placeholder="请输入客户名称"
                clearable
              ></el-input>
            </el-form-item>
          </div> -->
          <div class="form-item">
            <span class="label required">公司名称:</span>
            <el-form-item prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入公司名"
                clearable
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-item">
            <span class="label">手机号:</span>
            <el-form-item prop="phone">
              <el-input
                v-model="form.phone"
                placeholder="请输入注册手机"
                clearable
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-item">
            <span class="label">邮箱:</span>
            <el-form-item prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入注册邮箱"
                clearable
              ></el-input>
            </el-form-item>
          </div>
         
          <div class="form-item">
            <span class="label required">统一社会信用代码:</span>
            <el-form-item prop="unified_code ">
              <el-input
                v-model="form.unified_code "
                placeholder="请输入统一社会信用代码"
                clearable
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-item">
            <span class="label required">营业执照:</span>
            <el-form-item prop="license1">
              <div class="upload-section">
                <div class="upload-area">
                  <el-upload
                    class="upload-demo"
                    accept="image/*"
                    :name="UPLOAD_NAME"
                    :action="UPLOAD_ACTION"
                    :data="mix_upload_data"
                    :on-success="(res) => upload_on_success(res, 'license1')"
                    :before-upload="upload_before_upload"
                  >
                    <div class="upload-box" v-if="!form.license1">
                      <div class="upload-icon">+</div>
                      <div class="upload-text">上传图片</div>
                    </div>
                    <div class="uploaded-image" v-else>
                      <img :src="form.license1" alt="已上传图片" />
                      <div class="image-overlay">
                        <span class="reupload-text">重新上传</span>
                      </div>
                    </div>
                  </el-upload>
                </div>

                <div class="sample-area">
                  <div class="sample-image">
                    <img src="@img/enterprise-cert/sample1.png" alt="示意图" />
                  </div>
                  <div class="sample-text">示意图</div>
                </div>
              </div>

              <div class="upload-tips">
                <div>支持JPG/PNG格式图片</div>
                <div>不大于5M</div>
                <div>彩色扫描或复印件</div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          class="btn-confirm"
          @click="throttle_do_submit()"
          :loading="loading"
        >
          确定
        </el-button>
        <el-button class="btn-cancel" @click="closeModal"> 取消 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";

export default {
  name: "customer-management",
  components: {},
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,
      pagination: {
        page: 1,
        pageNum: 100,
      },
      list_address: [],

      // 弹窗相关
      showModal: false,
      loading: false,

      // 表单数据
      form: {
        title: "",
        phone: "",
        email: "",
        license1: "",
        unified_code :'',
      },

      // 表单验证规则
      rules: {
        title: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        unified_code : [
          { required: true, message: "请输入统一社会信用代码", trigger: "blur" },
        ],
        // phone: [
        //   { required: true, message: "请输入手机号", trigger: "blur" },
        //   {
        //     pattern: /^1[3-9]\d{9}$/,
        //     message: "请输入正确的手机号",
        //     trigger: "blur",
        //   },
        // ],
        // email: [
        //   { required: true, message: "请输入邮箱", trigger: "blur" },
        //   { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        // ],
        license1: [
          { required: true, message: "请上传营业执照", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    ...mapState([""]),
  },
  created() {
    this.setView();
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },
  methods: {
    throttle_do_submit() {},

    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_getCustomerList",
          ...this.pagination,
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.list_address = data.list;
        }
      });
    },

    // 打开添加客户弹窗
    do_address_add() {
      this.showModal = true;
      this.resetForm();
    },

    // 重置表单
    resetForm() {
      this.form = {
        nickname: "",
        phone: "",
        email: "",
        license1: "",
      };
      this.$nextTick(() => {
        this.$refs.customerForm && this.$refs.customerForm.clearValidate();
      });
    },

    // 关闭弹窗
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    // 提交表单
    do_submit() {
      this.$refs.customerForm.validate((valid) => {
        if (valid) {
          this.loading = true;

          this.$api({
            url: "/service.php",
            method: "post",
            data: {
              action: "users_saveUserCompany",
              ...this.form,
            },
          }).then((res) => {
            let { code, msg } = res;
            alert(res).then(() => {
              this.loading = false;
            });
            if (code == 200) {
              this.closeModal();
              this.setView();
            }
          });
        } else {
          return false;
        }
      });
    },

    // 上传相关
    upload_on_success(res, field) {
      let { code, data, msg } = res;
      alert(res);
      if (code == 200) {
        this.form[field] = res.data;
        // 触发表单验证
        this.$nextTick(() => {
          this.$refs.customerForm.validateField(field);
        });
      }
    },

    upload_before_upload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5; // 文件大小限制5M
      if (!isLt5M) {
        alertErr("上传文件大小不能超过 5MB!");
        return false;
      }

      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        alertErr("上传文件只能是 JPG/PNG 格式!");
        return false;
      }

      return true;
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    img {
      width: 22px;
      margin-right: 10px;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 55px 32px;
    background: #fff;
    .btn-c {
      display: flex;
      align-items: center;
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      background: #fff;
      color: #7853b2;
      font-size: 14px;
      margin-bottom: 25px;
      border: 1px solid #7853b2;
      padding: 10px 16px;
      // font-weight: bold;

      img {
        width: 20px;
      }

      .el-icon-circle-plus {
        font-size: 18px;
      }
      .add-text {
        margin-left: 5px;
      }
    }
  }
}

// 地址表格
.address-table {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;

  .table-header {
    display: flex;
    background: #f9f9f9;
    border-bottom: 1px solid #e5e5e5;

    .header-cell {
      flex: 1;
      padding: 16px 12px;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      text-align: center;
      // border-right: 1px solid #e5e5e5;

      &:last-child {
        border-right: none;
      }

      // 四等份布局
      &:nth-child(1) {
        flex: 1;
      } // 客户名称
      &:nth-child(2) {
        flex: 1;
      } // 营业执照
      &:nth-child(3) {
        flex: 1;
      } // 添加时间
      &:nth-child(4) {
        flex: 1;
      } // 状态
    }
  }

  .table-body {
    .table-row {
      display: flex;
      border-bottom: 1px solid #e5e5e5;

      &:last-child {
        border-bottom: none;
      }

      .table-cell {
        flex: 1;
        padding: 16px 12px;
        font-size: 14px;
        color: #333333;
        text-align: center;
        // border-right: 1px solid #e5e5e5;
        line-height: 1.4;
        word-break: break-all;

        &:last-child {
          border-right: none;
        }

        // 四等份布局
        &:nth-child(1) {
          flex: 1;
        } // 客户名称
        &:nth-child(2) {
          flex: 1;
        } // 营业执照
        &:nth-child(3) {
          flex: 1;
        } // 添加时间
        &:nth-child(4) {
          flex: 1;
        } // 状态

        .action-link {
          color: #7853b2;
          cursor: pointer;
          margin-right: 12px;
          font-size: 14px;

          &:last-child {
            margin-right: 0;
          }

          &.delete {
            color: #1F1F1F;
          }

          &:hover {
            text-decoration: underline;
          }
        }

        .default-btn {
          display: inline-block;
          padding: 4px 12px;
          background: #7853b2;
          color: #ffffff;
          font-size: 12px;
          border-radius: 4px;
          text-align: center;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/address-list.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>

<!-- 弹窗样式 -->
<style scoped lang="less">
/deep/ .customer-modal {
  min-width: 40vw;

  .modal-inner {
    padding: 0 68px;
    .form-item {
      margin-bottom: 20px;
      display: flex;
      align-items: flex-start;

      .label {
        width: 140px;
        text-align: right;
        padding-right: 10px;
        padding-top: 10px;
        font-size: 14px;
        color: #333333;

        &.required {
          &::before {
            margin-right: 3px;
            content: "*";
            color: #ff0000;
          }
        }
      }

      .el-form-item {
        flex: 1;
        margin-bottom: 0;

        .el-input {
          width: 100%;

          .el-input__inner {
            border: 1px solid #d4d4d4;
            border-radius: 4px;
            font-size: 14px;
            color: #606266;
            height: 40px;
            line-height: 40px;

            &:focus {
              border-color: #7853b2;
            }
          }
        }
      }

      .upload-section {
        display: flex;
        gap: 20px;
        margin-bottom: 15px;

        .upload-area {
          .upload-box {
            width: 120px;
            height: 120px;
            border: 2px dashed #be9bdf;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #fff;

            &:hover {
              border-color: #7853b2;
              background: #f7efff;
            }

            .upload-icon {
              font-size: 30px;
              color: #be9bdf;
              margin-bottom: 8px;
            }

            .upload-text {
              font-size: 12px;
              color: #be9bdf;
              text-align: center;
            }
          }

          .uploaded-image {
            position: relative;
            width: 120px;
            height: 120px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .image-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.3s ease;

              .reupload-text {
                color: #ffffff;
                font-size: 12px;
                font-weight: 500;
              }
            }

            &:hover .image-overlay {
              opacity: 1;
            }
          }
        }

        .sample-area {
          .sample-image {
            width: 120px;
            height: 120px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            overflow: hidden;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .sample-text {
            text-align: center;
            font-size: 12px;
            color: #1F1F1F;
            margin-top: 8px;
          }
        }
      }

      .upload-tips {
        font-size: 12px;
        color: #505050;
        line-height: 1.5;

        div {
          margin-bottom: 2px;
        }
      }
    }
  }
}

/deep/ .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;
  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 36px 60px 36px 0;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;

  .btn-confirm {
    width: 104px;
    height: 40px;
    background: #7853b2;
    border-radius: 50px;
    border: 1px solid #7853b2;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    margin-right: 12px;

    &:hover {
      background: #6b46a3;
      border-color: #6b46a3;
    }
  }

  .btn-cancel {
    width: 104px;
    height: 40px;
    background: #ffffff;
    border-radius: 50px;
    border: 1px solid #d4d4d4;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #1F1F1F;

    &:hover {
      border-color: #7853b2;
      color: #7853b2;
    }
  }
}
</style>
