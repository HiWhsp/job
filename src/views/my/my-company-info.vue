<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>会员中心</span>
        <span style="margin: 0 10px">></span>
        <span>我的首页</span>
      </div>
    </div>

    <div class="page-ctx">
      <div class="page-ctx-title">
        <span>主页信息维护</span>
      </div>
      <el-form
        :model="my_info"
        label-width="100px"
        class="user-form"
        label-position="right"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="logo">
              <el-upload
                class="certificate-uploader"
                action="#"
                :show-file-list="false"
                :on-success="upload_certificate_success"
              >
                <i class="el-icon-plus certificate-upload-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司名称">
              <el-input v-model="my_info.company_title" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="form-item-title">我属于的类型：</div>
            <el-checkbox-group v-model="my_info.services">
              <el-row :gutter="20">
                <el-col :span="6"><el-checkbox label="行业分析报告" /></el-col>
                <el-col :span="6"><el-checkbox label="寻找客户" /></el-col>
                <el-col :span="6"><el-checkbox label="已投建项目转让" /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="参加国内外线上、线下活动"
                /></el-col>
                <el-col :span="6"><el-checkbox label="国内外售后运维服务" /></el-col>
                <el-col :span="6"><el-checkbox label="寻找EPC合作伙伴" /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="寻找投融资机构（资金需求）"
                /></el-col>
                <el-col :span="6"><el-checkbox label="寻找产品" /></el-col>
                <el-col :span="6"><el-checkbox label="新能源回收利用" /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="参加融资沙龙（对接资源）"
                /></el-col>
              </el-row>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择地址">
              <el-input v-model="my_info.company_title" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="公司图片上传">
              <el-upload
                class="certificate-uploader"
                action="#"
                :show-file-list="false"
                :on-success="upload_certificate_success"
              >
                <i class="el-icon-plus certificate-upload-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业介绍">
              <el-input v-model="my_info.company_title" clearable type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="page-ctx">
      <div class="page-ctx-title">
        <span>产品介绍</span>
        <div class="add-category-section">
          <el-button type="primary" @click="addCategory">+新增分类</el-button>
        </div>
      </div>
      <!-- 产品列表 -->
      <div class="product-list">
        <div
          v-for="(category, categoryIndex) in productCategories"
          :key="categoryIndex"
          class="product-category"
        >
          <div class="category-header">
            <div class="category-title">
              <span>产品分类{{ categoryIndex + 1 }}</span>
              <el-input
                v-model="category.name"
                placeholder="请输入分类名称"
                class="category-name-input"
              />
            </div>
            <div class="category-actions">
              <el-button type="primary" size="small" @click="addProduct(categoryIndex)">
                +添加产品
              </el-button>
              <el-button
                v-if="categoryIndex > 0"
                type="danger"
                size="small"
                @click="deleteCategory(categoryIndex)"
              >
                删除分类
              </el-button>
            </div>
          </div>

          <div
            v-for="(product, productIndex) in category.products"
            :key="productIndex"
            class="product-item"
          >
            <div class="product-title">产品{{ productIndex + 1 }}</div>
            <el-form :model="product" label-width="80px" class="product-form">
              <el-form-item label="产品名称">
                <el-input v-model="product.name" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="产品编号">
                <el-input v-model="product.code" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="产品图片">
                <el-upload
                  class="product-image-uploader"
                  action="#"
                  :show-file-list="false"
                  :on-success="
                    (res) => uploadProductImage(res, categoryIndex, productIndex)
                  "
                >
                  <img v-if="product.image" :src="product.image" class="product-image" />
                  <i v-else class="el-icon-plus product-upload-icon"></i>
                </el-upload>
                <el-button
                  v-if="productIndex > 0 || category.products.length > 1"
                  type="text"
                  size="small"
                  class="delete-product-btn"
                  @click="deleteProduct(categoryIndex, productIndex)"
                >
                  删除
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>

    <div class="page-ctx">
      <div class="page-ctx-title">
        <span>联系方式</span>
      </div>
      <el-form
        :model="my_info"
        label-width="70px"
        class="user-form"
        label-position="right"
      >
        <el-form-item label="地址">
          <el-input v-model="my_info.mobile" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="my_info.mobile" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="my_info.mobile" clearable placeholder="请输入" />
        </el-form-item>
      </el-form>
    </div>

    <div class="page-ctx">
      <el-row>
        <el-col :span="24" style="margin-top: 30px">
          <div class="edit-actions">
            <el-button
              type="primary"
              class="btn-save"
              :loading="loading"
              @click="throttle_do_submit()"
              >提交</el-button
            >
            <el-button @click="cancelEdit">预览</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";
import { mapState } from "vuex";

export default {
  name: "servicePage",
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,
      my_info: {
        types: [],
        services: [],
      },
      // 产品分类数据
      productCategories: [
        {
          name: "产品分类1",
          products: [
            {
              name: "",
              code: "",
              image: "",
            },
          ],
        },
      ],
      loading: false,
      isEditing: false,
      originalMyInfo: {},
      showPhoneUpdate: false,
      showEmailUpdate: false,
      phoneUpdateForm: {
        oldPhone: "",
        newPhone: "",
        code: "",
      },
      emailUpdateForm: {
        oldEmail: "",
        newEmail: "",
        code: "",
      },
    };
  },
  computed: {
    ...mapState([""]),
  },
  methods: {
    startEdit() {
      this.isEditing = true;
      this.originalMyInfo = JSON.parse(JSON.stringify(this.my_info));
    },
    cancelEdit() {
      this.isEditing = false;
      this.my_info = JSON.parse(JSON.stringify(this.originalMyInfo));
      this.showPhoneUpdate = false;
      this.showEmailUpdate = false;
      this.resetUpdateForms();
    },
    resetUpdateForms() {
      this.phoneUpdateForm = {
        oldPhone: "",
        newPhone: "",
        code: "",
      };
      this.emailUpdateForm = {
        oldEmail: "",
        newEmail: "",
        code: "",
      };
    },
    open_phone_update() {
      this.showPhoneUpdate = true;
      this.phoneUpdateForm.oldPhone = this.my_info.mobile;
    },
    cancel_phone_update() {
      this.showPhoneUpdate = false;
      this.phoneUpdateForm = {
        oldPhone: "",
        newPhone: "",
        code: "",
      };
    },
    confirm_phone_update() {
      // 验证手机号修改逻辑
      if (!this.phoneUpdateForm.newPhone || !this.phoneUpdateForm.code) {
        this.$message.error("请填写完整信息");
        return;
      }
      // 这里应该调用API验证并更新手机号
      this.my_info.mobile = this.phoneUpdateForm.newPhone;
      this.showPhoneUpdate = false;
      this.resetUpdateForms();
      this.$message.success("手机号更换成功");
    },
    open_email_update() {
      this.showEmailUpdate = true;
      this.emailUpdateForm.oldEmail = this.my_info.email;
    },
    cancel_email_update() {
      this.showEmailUpdate = false;
      this.emailUpdateForm = {
        oldEmail: "",
        newEmail: "",
        code: "",
      };
    },
    confirm_email_update() {
      // 验证邮箱修改逻辑
      if (!this.emailUpdateForm.newEmail || !this.emailUpdateForm.code) {
        this.$message.error("请填写完整信息");
        return;
      }
      // 这里应该调用API验证并更新邮箱
      this.my_info.email = this.emailUpdateForm.newEmail;
      this.showEmailUpdate = false;
      this.resetUpdateForms();
      this.$message.success("邮箱更换成功");
    },
    throttle_do_submit() {},
    confirm_old_pass() {
      this.$refs.phone_bind_new_set_modal.init();
    },
    confirm_new() {
      this.query_user();
    },
    setView() {
      this.query_user();
    },
    query_user() {
      this.$api({
        url: "getUserInfo",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.my_info = Object.assign({ types: [], services: [] }, data);
          this.originalMyInfo = JSON.parse(JSON.stringify(this.my_info));
          this.$store.commit("set_vuex_user", res.data);
        }
      });
    },
    do_submit() {
      this.loading = true;
      this.$api({
        url: "updateUser",
        method: "post",
        data: this.my_info,
      }).then((res) => {
        let { code, msg, data } = res;
        this.loading = false;
        if (code == 200) {
          this.isEditing = false;
          this.setView();
          this.$message.success("保存成功");
        }
      });
    },
    upload_on_success(res, file) {
      let { code, data, msg } = res;
      if (code == 200) {
        this.my_info.image = res.data;
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      return isLt2M;
    },
    upload_certificate_success(res, file) {
      // 证书上传成功逻辑
    },
    // 新增分类
    addCategory() {
      this.productCategories.push({
        name: `产品分类${this.productCategories.length + 1}`,
        products: [
          {
            name: "",
            code: "",
            image: "",
          },
        ],
      });
    },
    // 删除分类（不能删除第一个分类）
    deleteCategory(categoryIndex) {
      if (categoryIndex > 0) {
        this.$confirm("确定要删除此分类吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.productCategories.splice(categoryIndex, 1);
            this.$message.success("分类删除成功");
          })
          .catch(() => {
            // 取消删除
          });
      }
    },
    // 添加产品
    addProduct(categoryIndex) {
      this.productCategories[categoryIndex].products.push({
        name: "",
        code: "",
        image: "",
      });
    },
    // 删除产品
    deleteProduct(categoryIndex, productIndex) {
      const category = this.productCategories[categoryIndex];
      // 确保每个分类至少保留一个产品
      if (category.products.length > 1) {
        this.$confirm("确定要删除此产品吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            category.products.splice(productIndex, 1);
            this.$message.success("产品删除成功");
          })
          .catch(() => {
            // 取消删除
          });
      } else {
        this.$message.warning("每个分类至少需要保留一个产品");
      }
    },
    // 产品图片上传成功
    uploadProductImage(res, categoryIndex, productIndex) {
      if (res.code === 200) {
        this.productCategories[categoryIndex].products[productIndex].image = res.data;
        this.$message.success("图片上传成功");
      } else {
        this.$message.error("图片上传失败");
      }
    },
  },
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.setView();
  },
};
</script>

<style scoped lang="less" src="./my-company-info.less"></style>
