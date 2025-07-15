<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="800px"
    class="profile-complete-modal"
    @close="handleClose"
  >
    <div slot="title" class="dialog-title">Complete Profile</div>

    <div class="profile-complete-container">
      <el-form
        :model="form"
        :rules="rules"
        ref="profileForm"
        class="profile-form"
        label-width="120px"
      >
        <!-- 选择角色 -->
        <el-form-item label="Select Role：" prop="userType">
          <el-select v-model="form.userType" placeholder="Personal/Enterprise" style="width: 100%">
            <el-option label="Personal" value="1"></el-option>
            <el-option label="Enterprise" value="2"></el-option>
          </el-select>
        </el-form-item>

        <!-- 姓名 -->
        <el-form-item label="Name：" prop="realname">
          <el-input v-model="form.realname" placeholder="Please enter name"></el-input>
        </el-form-item>

        <!-- 公司 -->
        <el-form-item label="Company：" prop="company_name" v-if="form.userType == 2">
          <el-input v-model="form.company_name" placeholder="Please enter company name"></el-input>
        </el-form-item>

        <!-- 职务 -->
        <el-form-item label="Position：" prop="position" v-if="form.userType == 2">
          <el-input v-model="form.position" placeholder="Please enter position"></el-input>
        </el-form-item>

        <!-- 我需求的类型 -->
        <div class="form-item-title">My Category</div>
        <el-form-item label="Select Type：">
          <div class="requirement-type-section">
            <div class="tree-container">
              <el-tree
                ref="workTypeTree"
                :data="finish_select.typeListTree || []"
                :props="treeProps"
                node-key="id"
                show-checkbox
                check-strictly
                :default-checked-keys="form.workType"
                @check="handleWorkTypeCheck"
                class="work-type-tree"
              >
              </el-tree>
            </div>
          </div>
        </el-form-item>

        <!-- 我希望平台得到的服务 -->
        <div class="form-item-title">Services I Hope to Get from Platform</div>
        <el-form-item>
          <div class="service-checkboxes">
            <el-checkbox-group v-model="form.requireService">
              <el-checkbox
                v-for="item in finish_select.requireList || []"
                :key="item.id"
                :label="item.id"
                :value="item.id"
                >{{ item.title }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
        Submit
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ProfileCompleteModal",
  data() {
    return {
      visible: false,
      submitLoading: false,
      selectedRequirementType: "",
      finish_select: [],
      form: {
        userType: "", // 1个人 2企业
        realname: "", // 姓名
        position: "", // 职务
        company_name: "", // 公司名称
        workType: [], //我属于的类型
        requireService: [], //我希望平台得到的服务
      },

      // 树形结构的配置
      treeProps: {
        label: "name_zh",
        children: "children",
      },

      rules: {
        userType: [{ required: true, message: "Please select role", trigger: "change" }],
        realname: [{ required: true, message: "Please enter name", trigger: "blur" }],
        company_name: [{ required: true, message: "Please enter company name", trigger: "blur" }],
        position: [{ required: true, message: "Please enter position", trigger: "blur" }],
      },
    };
  },
  mounted() {
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
  methods: {
    show() {
      this.visible = true;
      this.resetForm();
    },

    hide() {
      this.visible = false;
    },

    handleClose() {
      this.hide();
      this.$emit("close");
    },

    handleCancel() {
      this.hide();
    },

    resetForm() {
      this.$nextTick(() => {
        if (this.$refs.profileForm) {
          this.$refs.profileForm.resetFields();
        }

        this.form = {
          userType: "",
          realname: "",
          company_name: "",
          position: "",
          workType: [],
          requireService: [],
        };

        // 重置树形组件的选中状态
        if (this.$refs.workTypeTree) {
          this.$refs.workTypeTree.setCheckedKeys([]);
        }

        this.selectedRequirementType = "";
      });
    },

    // 处理工作类型树形选择变化
    handleWorkTypeCheck(data, checked) {
      // 获取当前所有选中的节点ID
      const checkedKeys = this.$refs.workTypeTree.getCheckedKeys();
      this.form.workType = checkedKeys;
    },

    handleRequirementTypeChange(value) {
      // 根据选择的类型自动勾选相关项
      if (value === "solar_pv") {
        this.form.requirements.solar = true;
        this.form.requirements.pv_applications = true;
        this.form.requirements.pv_components = true;
      }
    },

    handleSubmit() {
      this.$refs.profileForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true;

          // 构建提交数据
          const submitData = {
            ...this.form,
            username: this.form.realname,
            workType: this.form.workType.join(","),
            requireService: this.form.requireService.join(","),
          };

          // 实际API调用示例
          this.$api({
            url: "finishUserInfo",
            method: "post",
            data: submitData,
          })
            .then((res) => {
              this.submitLoading = false;
              if (res.code === 200) {
                this.$message.success("Profile completed successfully");
                this.hide();
                this.$emit("submit-success", submitData);
              } else {
                this.$message.error(res.msg || "Submission failed");
              }
            })
            .catch(() => {
              this.submitLoading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.profile-complete-modal {
  /deep/ .el-dialog__header {
    text-align: center;
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
    background: #f7f7f7;
  }

  /deep/ .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  /deep/ .el-dialog__footer {
    text-align: center;
    padding: 20px 40px 30px;
    border-top: 1px solid #eee;
  }
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: left;
}

.profile-complete-container {
  .profile-form {
    .el-form-item {
      margin-bottom: 25px;
    }

    .form-item-title {
      font-family: Microsoft YaHei;
      font-size: 14px;
      font-weight: bold;
      line-height: 14px;
      letter-spacing: normal;
      color: #666666;
      margin-bottom: 22px;
    }

    /deep/ .el-form-item__label {
      font-weight: 500;
      color: #333;
    }

    /deep/ .el-input__inner,
    /deep/ .el-select .el-input__inner {
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;

      &:focus {
        border-color: #33ae60;
      }
    }

    /deep/ .el-select-dropdown__item.selected {
      color: #33ae60;
      font-weight: 600;
    }
  }
}

.requirement-type-section {
  margin-top: 8px;
  /deep/ .el-checkbox__label {
    font-size: 14px;
    color: #333;
  }

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #33ae60;
    border-color: #33ae60;
  }
}

.service-checkboxes {
  /deep/ .el-checkbox {
    margin-right: 0;
    margin-bottom: 10px;
    flex: 0 0 auto;
    min-width: 180px;
  }

  /deep/ .el-checkbox__label {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
  }

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #33ae60;
    border-color: #33ae60;
  }
  /deep/ .el-checkbox.is-checked .el-checkbox__label {
    color: #33ae60;
  }
}

.dialog-footer {
  .el-button {
    min-width: 100px;
    height: 40px;
    font-size: 16px;
    border-radius: 4px;
  }

  .el-button--primary {
    background-color: #33ae60;
    border-color: #33ae60;

    &:hover {
      background-color: #2d9a54;
      border-color: #2d9a54;
    }
  }
}
</style>
