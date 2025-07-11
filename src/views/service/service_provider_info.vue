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
            :data="mix_upload_data"
            :name="mix_upload_name"
            :action="mix_upload_action"
            :on-success="upload_on_success"
            :before-upload="upload_before_upload"
            :disabled="!isEditing"
          >
            <img
              v-if="my_info.avatar"
              :src="vuex_config.file_url_pre + my_info.avatar"
              class="user-avatar"
            />
            <img v-else src="@img/my/avatar.png" class="user-avatar" />
          </el-upload>
        </div>
        <div class="user-info-box">
          <div class="user-name">{{ my_info.realname || "用户名" }}</div>
          <div class="user-level">
            <img src="@img/my/no-vip.png" alt="" v-if="my_info.userLevel == 0" />
            <img src="@img/my/vip-active.png" alt="" v-else />
            {{ levelName }}
          </div>
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
                <el-input v-model="my_info.nickname" clearable :disabled="!isEditing" />
              </el-form-item>
              <el-form-item label="姓名：">
                <el-input v-model="my_info.realname" clearable :disabled="!isEditing" />
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="国家：">
                <el-input v-model="my_info.country" clearable :disabled="!isEditing" />
              </el-form-item>
              <el-form-item label="公司名称：">
                <el-input
                  v-model="my_info.company_name"
                  clearable
                  :disabled="!isEditing"
                />
              </el-form-item>
              <el-form-item label="详细地址：">
                <el-input v-model="my_info.address" clearable :disabled="!isEditing" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="isEditing">
            <el-col :span="24">
              <el-form-item label="营业执照">
                <el-upload
                  class="certificate-uploader"
                  :show-file-list="false"
                  :data="mix_upload_data"
                  :name="mix_upload_name"
                  :action="mix_upload_action"
                  :on-success="upload_certificate_success"
                  :before-upload="upload_before_upload"
                >
                  <img
                    v-if="my_info.skillPhoto"
                    :src="my_info.skillPhoto"
                    class="user-avatar"
                  />
                  <div v-else class="upload-btn">
                    <i class="upload-icon">+</i>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="企业资质">
                <el-upload
                  class="certificate-uploader"
                  :show-file-list="false"
                  :data="mix_upload_data"
                  :name="mix_upload_name"
                  :action="mix_upload_action"
                  :on-success="upload_certificate_success"
                  :before-upload="upload_before_upload"
                >
                  <img
                    v-if="my_info.skillPhoto"
                    :src="my_info.skillPhoto"
                    class="user-avatar"
                  />
                  <div v-else class="upload-btn">
                    <i class="upload-icon">+</i>
                  </div>
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
              <el-button class="get-code-btn" @click="get_code(1)">获取验证码</el-button>
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
import { mapState } from "vuex";

export default {
  name: "servicePage",
  data() {
    return {
      my_info: {
        workType: [],
        requireService: [],
      },
      // 树形结构的配置
      treeProps: {
        label: "name_zh",
        children: "children",
      },
      finish_select: [],
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
    ...mapState(["vuex_user"]),
    levelName() {
      switch (this.my_info.userLevel) {
        case 1:
          return "黄金会员";
        case 2:
          return "钻石会员";
        case 3:
          return "联合会员";
        default:
          return "个人会员";
      }
    },
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
      this.$api({
        url: "editUserMobile",
        method: "post",
        data: {
          mobile: this.phoneUpdateForm.newPhone,
          code: this.phoneUpdateForm.code,
        },
      }).then((res) => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.my_info.mobile = this.phoneUpdateForm.newPhone;
          this.showPhoneUpdate = false;
          this.resetUpdateForms();
          this.$message.success("手机号更换成功");
        }
      });
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
    get_code(type) {
      if (type == 1) {
        this.phoneUpdateForm.newPhone = this.phoneUpdateForm.newPhone.trim();
      } else {
        this.emailUpdateForm.newEmail = this.emailUpdateForm.newEmail.trim();
      }
      this.$api({
        url: "sendCode",
        method: "post",
        data: {
          account:
            type == 1 ? this.phoneUpdateForm.newPhone : this.emailUpdateForm.newEmail,
          type: type,
        },
      });
    },
    confirm_email_update() {
      // 验证邮箱修改逻辑
      if (!this.emailUpdateForm.newEmail || !this.emailUpdateForm.code) {
        this.$message.error("请填写完整信息");
        return;
      }
      // 这里应该调用API验证并更新邮箱
      this.$api({
        url: "editUserEmail",
        method: "post",
        data: {
          email: this.emailUpdateForm.newEmail,
          code: this.emailUpdateForm.code,
        },
      }).then((res) => {
        let { code, msg, data } = res;
        if (code == 200) {
          this.my_info.email = this.emailUpdateForm.newEmail;
          this.showEmailUpdate = false;
          this.resetUpdateForms();
          this.$message.success("邮箱更换成功");
        }
      });
    },
    throttle_do_submit() {
      this.do_submit();
    },
    confirm_old_pass() {
      this.$refs.phone_bind_new_set_modal.init();
    },
    confirm_new() {
      this.query_user();
    },
    setView() {
      this.query_user();
      this.$api({
        url: "getFinishSelect",
        method: "get",
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.finish_select = data;
        }
      });
    },
    query_user() {
      this.$api({
        url: "getUserInfo",
        method: "get",
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.my_info = Object.assign(data, {
            workType: data.workType.split(","),
            requireService: data.requireService.split(","),
          });
          console.log(this.my_info);
          this.originalMyInfo = JSON.parse(JSON.stringify(this.my_info));
          this.$store.commit("set_baseInfo", res.data);
        }
      });
    },
    do_submit() {
      this.loading = true;
      this.my_info.workType = this.my_info.workType.join(",");
      this.my_info.requireService = this.my_info.requireService.join(",");
      this.$api({
        url: "editUserInfo",
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
        this.my_info.avatar = res.data.save_url;
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      return isLt2M;
    },
    upload_certificate_success(res, file) {
      // 证书上传成功逻辑
      let { code, data, msg } = res;
      if (code == 200) {
        this.my_info.skillPhoto = res.data.save_url;
      }
    },

    // 处理工作类型树形选择变化
    handleWorkTypeCheck(data, checked) {
      // 获取当前所有选中的节点ID
      const checkedKeys = this.$refs.workTypeTree.getCheckedKeys();
      this.my_info.workType = checkedKeys;
    },
  },
  mounted() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.setView();
  },
};
</script>

<style scoped lang="less" src="./service_provider_info.less"></style>
