<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>我的个人中心</span>
        <span v-if="showPhoneUpdate || showEmailUpdate" style="margin: 0 10px">></span>
        <span>{{
          showPhoneUpdate ? "更换手机号" : showEmailUpdate ? "更换邮箱" : ""
        }}</span>
      </div>
    </div>

    <!-- 默认展示所有信息 -->
    <template v-if="!showPhoneUpdate && !showEmailUpdate">
      <!-- 顶部卡片区 -->
      <div class="user-card">
        <div class="user-avatar-box">
          <el-upload
            class="avatar-uploader"
            accept="image/*"
            :show-file-list="false"
            :name="UPLOAD_NAME"
            :action="UPLOAD_ACTION"
            :data="mix_upload_data"
            :on-success="upload_on_success"
            :before-upload="upload_before_upload"
            :disabled="!isEditing"
          >
            <img v-if="my_info.image" :src="my_info.image" class="user-avatar" />
            <img v-else src="@img/my/avatar.png" class="user-avatar" />
          </el-upload>
        </div>
        <div class="user-info-box">
          <div class="user-name">{{ my_info.name || "用户名" }}</div>
          <div class="user-level"><img src="@img/my/no-vip.png" alt="" /> 个人会员</div>
        </div>
        <div class="user-logout-box">
          <el-button @click="logout">退出登录</el-button>
        </div>
      </div>

      <div class="page-ctx">
        <el-form
          :model="my_info"
          label-width="90px"
          class="user-form"
          label-position="right"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="昵称：">
                <el-input v-model="my_info.name" clearable :disabled="!isEditing" />
              </el-form-item>
              <el-form-item label="姓名：">
                <el-input v-model="my_info.real_name" clearable :disabled="!isEditing" />
              </el-form-item>
              <el-form-item label="公司：">
                <el-input
                  v-model="my_info.company_title"
                  clearable
                  :disabled="!isEditing"
                />
              </el-form-item>
              <el-form-item label="职位：">
                <el-input v-model="my_info.position" clearable :disabled="!isEditing" />
              </el-form-item>
              <el-form-item label="手机号：">
                <el-input v-model="my_info.mobile" disabled style="width: 70%" />
                <el-button
                  type="text"
                  class="change-phone-btn"
                  @click="open_phone_update"
                  v-if="isEditing"
                  >更换手机号</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱：">
                <el-input v-model="my_info.email" clearable disabled style="width: 70%" />
                <el-button
                  type="text"
                  class="change-phone-btn"
                  @click="open_email_update"
                  v-if="isEditing"
                  >更换邮箱</el-button
                >
              </el-form-item>
              <el-form-item label="地址：">
                <el-input v-model="my_info.address" clearable :disabled="!isEditing" />
              </el-form-item>
              <el-form-item label="简介：">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="my_info.info"
                  clearable
                  :disabled="!isEditing"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="form-item-title">我属于的类型</div>

              <el-form-item label="选择类型：">
                <el-select
                  v-model="my_info.types"
                  multiple
                  placeholder="请选择类型"
                  style="width: 400px"
                  :disabled="!isEditing"
                >
                  <el-option label="太阳能光伏组件" value="太阳能光伏组件" />
                  <el-option label="太阳能光伏逆变器" value="太阳能光伏逆变器" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="form-item-title">我希望平台得到的服务</div>
              <el-checkbox-group v-model="my_info.services" :disabled="!isEditing">
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
          <el-row v-if="isEditing">
            <el-col :span="24">
              <el-form-item label="技能证书">
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
            <el-col :span="24" style="margin-top: 30px">
              <el-button
                v-if="!isEditing"
                type="primary"
                class="btn-save"
                @click="startEdit"
                >编辑</el-button
              >
              <div v-else class="edit-actions">
                <el-button @click="cancelEdit">取消</el-button>
                <el-button
                  type="primary"
                  class="btn-save"
                  :loading="loading"
                  @click="throttle_do_submit()"
                  >保存</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>

    <!-- 手机号修改表单 -->
    <template v-if="showPhoneUpdate">
      <div class="page-ctx">
        <div class="phone-update-form">
          <div class="update-form-item">
            <label>旧手机号：</label>
            <div class="input-box">
              <el-input
                v-model="phoneUpdateForm.oldPhone"
                placeholder="请输入当前手机号"
                class="form-input"
              />
            </div>
          </div>
          <div class="update-form-item">
            <label>新手机号：</label>
            <div class="input-box">
              <el-input
                v-model="phoneUpdateForm.newPhone"
                placeholder="请输入新手机号"
                class="form-input"
              />
            </div>
          </div>
          <div class="update-form-item">
            <label>验证码：</label>
            <div class="input-box">
              <el-input
                v-model="phoneUpdateForm.code"
                placeholder="请输入验证码"
                class="form-input-code"
              />
              <el-button class="get-code-btn">获取验证码</el-button>
            </div>
          </div>
          <div class="update-form-actions">
            <el-button type="primary" @click="confirm_phone_update">确认</el-button>
            <el-button @click="cancel_phone_update">取消</el-button>
          </div>
        </div>
      </div>
    </template>

    <!-- 邮箱修改表单 -->
    <template v-if="showEmailUpdate">
      <div class="page-ctx">
        <div class="email-update-form">
          <div class="update-form-item">
            <label>旧邮箱：</label>
            <div class="input-box">
              <el-input
                v-model="emailUpdateForm.oldEmail"
                placeholder="请输入当前邮箱"
                class="form-input"
              />
            </div>
          </div>
          <div class="update-form-item">
            <label>新邮箱：</label>
            <div class="input-box">
              <el-input
                v-model="emailUpdateForm.newEmail"
                placeholder="请输入新邮箱"
                class="form-input"
              />
            </div>
          </div>
          <div class="update-form-item">
            <label>验证码：</label>
            <div class="input-box">
              <el-input
                v-model="emailUpdateForm.code"
                placeholder="请输入验证码"
                class="form-input-code"
              />
              <el-button class="get-code-btn">获取验证码</el-button>
            </div>
          </div>
          <div class="update-form-actions">
            <el-button type="primary" @click="confirm_email_update">确认</el-button>
            <el-button @click="cancel_email_update">取消</el-button>
          </div>
        </div>
      </div>
    </template>
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
    logout() {
      this.$store.commit("clear_loginInfo");
      this.$router.push("/");
    },
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
  },
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.setView();
  },
};
</script>

<style scoped lang="less" src="./my-info.less"></style>
