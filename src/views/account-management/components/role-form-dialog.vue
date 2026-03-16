<template>
  <el-dialog
    :title="editId ? '编辑角色' : '新增角色'"
    :visible.sync="visible"
    width="480px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="角色名称" prop="keyword">
        <el-input v-model="form.keyword" placeholder="请输入角色名称" clearable />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "RoleFormDialog",

  data() {
    return {
      visible: false,
      submitLoading: false,
      editId: "",
      form: {
        keyword: ""
      },
      rules: {
        keyword: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
      }
    };
  },

  methods: {
    open(editId, roleName) {
      this.editId = editId ? String(editId) : "";
      this.form.keyword = roleName || "";
      this.visible = true;
      this.$nextTick(() => this.$refs.formRef && this.$refs.formRef.clearValidate());
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        const params = {
          keyword: this.form.keyword.trim()
        };
        if (this.editId) params.id = this.editId;
        this.submitLoading = true;
        this.$api({
          url: "/editSysUserRole",
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
      this.form.keyword = "";
      this.editId = "";
    }
  }
};
</script>
