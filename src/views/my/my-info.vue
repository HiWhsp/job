<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-title">
        <span>我的个人中心</span>
      </div>
    </div>
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
        >
          <img v-if="my_info.image" :src="my_info.image" class="user-avatar" />
          <img v-else src="@img/my/avatar.png" class="user-avatar" />
        </el-upload>
      </div>
      <div class="user-info-box">
        <div class="user-name">{{ my_info.name || "用户名" }}</div>
        <div class="user-level">
          <img src="@img/my/no-vip.png" alt="" /> 个人会员
        </div>
      </div>
      <div class="user-logout-box">
        <el-button @click="$emit('logout')">退出登录</el-button>
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
              <el-input v-model="my_info.name" clearable />
            </el-form-item>
            <el-form-item label="姓名：">
              <el-input v-model="my_info.real_name" clearable />
            </el-form-item>
            <el-form-item label="公司：">
              <el-input v-model="my_info.company_title" clearable />
            </el-form-item>
            <el-form-item label="职位：">
              <el-input v-model="my_info.position" clearable />
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="my_info.mobile" disabled style="width: 70%" />
              <el-button
                type="text"
                class="change-phone-btn"
                @click="open_phone_update"
                >更换手机号</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="120">
          <el-col :span="12">
            <el-form-item label="邮箱：">
              <el-input v-model="my_info.email" clearable />
            </el-form-item>
            <el-form-item label="地址：">
              <el-input v-model="my_info.address" clearable />
            </el-form-item>
            <el-form-item label="简介：">
              <el-input
                type="textarea"
                :rows="3"
                v-model="my_info.info"
                clearable
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
            <el-checkbox-group v-model="my_info.services">
              <el-row :gutter="20">
                <el-col :span="6"><el-checkbox label="行业分析报告" /></el-col>
                <el-col :span="6"><el-checkbox label="寻找客户" /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="已投建项目转让"
                /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="参加国内外线上、线下活动"
                /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="国内外售后运维服务"
                /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="寻找EPC合作伙伴"
                /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="寻找投融资机构（资金需求）"
                /></el-col>
                <el-col :span="6"><el-checkbox label="寻找产品" /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="新能源回收利用"
                /></el-col>
                <el-col :span="6"
                  ><el-checkbox label="参加融资沙龙（对接资源）"
                /></el-col>
              </el-row>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row>
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
          <el-col :span="24" style=" margin-top: 30px">
            <el-button
              type="primary"
              class="btn-save"
              :loading="loading"
              @click="throttle_do_submit()"
              >编辑</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>

    <phone_bind_old_check_modal
      ref="phone_bind_old_check_modal"
      data-title="校验"
      @confirm="confirm_old_pass"
    />
    <phone_bind_new_set_modal
      ref="phone_bind_new_set_modal"
      data-title="绑定"
      @confirm="confirm_new"
    />
  </div>
</template>

<script>
import { UPLOAD_ACTION, UPLOAD_NAME } from "@/config/env.js";
import phone_bind_old_check_modal from "@/components/account/phone_bind_old_check_modal.vue";
import phone_bind_new_set_modal from "@/components/account/phone_bind_new_set_modal.vue";
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {
    phone_bind_old_check_modal,
    phone_bind_new_set_modal,
  },
  data() {
    return {
      UPLOAD_ACTION,
      UPLOAD_NAME,
      my_info: {
        types: [],
        services: [],
      },
      loading: false,
    };
  },
  computed: {
    ...mapState([""]),
  },
  methods: {
    throttle_do_submit() {},
    open_phone_update() {
      this.$refs.phone_bind_old_check_modal.init();
    },
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
          this.setView();
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
