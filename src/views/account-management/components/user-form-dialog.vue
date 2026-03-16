<template>
  <el-dialog
    :title="editId ? '编辑用户' : '新增用户'"
    :visible.sync="visible"
    width="520px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="user-form">
      <el-form-item label="登录账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入登录账号" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password" :required="!editId">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="编辑可不填表示不修改"
          clearable
          show-password
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="头像" prop="image">
        <el-upload
          class="upload-avatar"
          list-type="picture-card"
          :action="uploadAction"
          name="file"
          :limit="1"
          :file-list="imageFileList"
          :on-success="handleUploadSuccess"
          :on-remove="handleImageRemove"
          :http-request="handleUploadRequest"
        >
          <i class="el-icon-plus" />
          <span class="upload-text">添加图片</span>
        </el-upload>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择角色" clearable style="width: 100%">
          <el-option
            v-for="item in vuex_depart_list"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { UPLOAD_ROOT } from "@/config/env.js";

export default {
  name: "UserFormDialog",

  computed: {
    ...mapState(["vuex_depart_list"])
  },

  data() {
    return {
      visible: false,
      submitLoading: false,
      uploadAction: UPLOAD_ROOT,
      editId: "",
      form: {
        username: "",
        password: "",
        name: "",
        image: "",
        roleId: ""
      },
      imageFileList: [],
      rules: {
        username: [{ required: true, message: "请输入登录账号", trigger: "blur" }],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.editId) {
                callback();
                return;
              }
              if (!value || !String(value).trim()) {
                callback(new Error("请输入密码"));
              } else {
                callback();
              }
            }
          }
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        image: [
          {
            required: true,
            message: "请上传头像",
            trigger: "change",
            validator: (rule, value, callback) => {
              if (this.form.image) callback();
              else callback(new Error("请上传头像"));
            }
          }
        ]
      }
    };
  },

  methods: {
    open(editId) {
      this.editId = editId ? String(editId) : "";
      this.resetForm();
      this.visible = true;
      if (this.editId) {
        this.loadDetail();
      }
    },
    resetForm() {
      this.form = {
        username: "",
        password: "",
        name: "",
        image: "",
        roleId: ""
      };
      this.imageFileList = [];
      this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate());
    },
    loadDetail() {
      this.$api({
        url: "/getSysUser",
        method: "post",
        data: { id: this.editId }
      })
        .then(res => {
          if (res && res.data) {
            const d = res.data;
            this.form.username = d.username ?? "";
            this.form.password = "";
            this.form.name = d.name ?? "";
            this.form.image = d.image ?? "";
            this.form.roleId = d.roleId != null ? d.roleId : "";
            this.imageFileList = this.form.image ? [{ url: this.form.image }] : [];
          }
        })
        .catch(() => {
          this.$message.error("获取用户详情失败");
        });
    },
    handleUploadRequest(option) {
      const formData = new FormData();
      formData.append("file", option.file);
      const token = localStorage.getItem("token");
      axios
        .post(UPLOAD_ROOT, formData, {
          headers: { Authorization: "Bearer " + token },
          timeout: 60000
        })
        .then(res => {
          const data = res.data || res;
          const payload = data && data.data ? data.data : data;
          const url = (payload && (payload.path || payload.url)) || (data && data.path) || "";
          this.form.image = url;
          option.onSuccess({ url });
        })
        .catch(err => {
          this.$message.error((err.response && err.response.data && err.response.data.msg) || "上传失败");
          option.onError(err);
        });
    },
    handleUploadSuccess(res, file, fileList) {
      this.imageFileList = fileList;
      const r = res || (file && file.response);
      const payload = r && r.data ? r.data : r;
      const url = (payload && (payload.path || payload.url)) || (r && r.path) || (file && file.url) || "";
      if (url) this.form.image = url;
      if (file && url) file.url = url;
    },
    handleImageRemove() {
      this.form.image = "";
      this.imageFileList = [];
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        if (!this.form.image) {
          this.$message.warning("请上传头像");
          return;
        }
        const params = {
          username: this.form.username,
          password: this.form.password || "",
          name: this.form.name,
          image: this.form.image,
          roleId: this.form.roleId != null && this.form.roleId !== "" ? String(this.form.roleId) : ""
        };
        if (this.editId) params.id = this.editId;
        this.submitLoading = true;
        this.$api({
          url: "/editSysUser",
          method: "post",
          data: params
        })
          .then(() => {
            this.$message.success(this.editId ? "编辑成功" : "新增成功");
            this.visible = false;
            this.$emit("success");
          })
          .catch(err => {
            this.$message.error((err && err.msg) || "提交失败");
          })
          .finally(() => {
            this.submitLoading = false;
          });
      });
    },
    handleClose() {
      this.resetForm();
    }
  }
};
</script>

<style lang="less" scoped>
.user-form {
  padding: 0 10px 0 0;
}

.upload-avatar {
  display: flex;
  ::v-deep .el-upload--picture-card {
    width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  ::v-deep .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
}
.upload-text {
  line-height: 20px;
  font-size: 12px;
  color: #999;
}
</style>
