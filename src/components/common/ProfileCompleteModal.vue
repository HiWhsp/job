<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="800px"
    class="profile-complete-modal"
    @close="handleClose"
  >
    <div slot="title" class="dialog-title">完善信息</div>

    <div class="profile-complete-container">
      <el-form
        :model="form"
        :rules="rules"
        ref="profileForm"
        class="profile-form"
        label-width="120px"
      >
        <!-- 选择角色 -->
        <el-form-item label="选择角色：" prop="userType">
          <el-select
            v-model="form.userType"
            placeholder="个人/企业"
            style="width: 100%"
          >
            <el-option label="个人" value="1"></el-option>
            <el-option label="企业" value="2"></el-option>
          </el-select>
        </el-form-item>

        <!-- 姓名 -->
        <el-form-item label="姓名：" prop="realname">
          <el-input v-model="form.realname" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <!-- 公司 -->
        <el-form-item label="公司：" prop="company_name">
          <el-input
            v-model="form.company_name"
            placeholder="请输入公司名称"
          ></el-input>
        </el-form-item>

        <!-- 职务 -->
        <el-form-item label="职务：" prop="position">
          <el-input v-model="form.position" placeholder="请输入职务"></el-input>
        </el-form-item>

        <!-- 我需求的类型 -->
        <div class="form-item-title">我属于的类型</div>
        <el-form-item label="选择类型：">
          <div class="requirement-type-section">
            <el-select
              v-model="form.workType"
              placeholder="太阳能光伏组件"
              multiple
              style="width: 100%"
            >
              <el-option-group
                v-for="group in finish_select.typeListTree || []"
                :key="group.id"
                :label="group.name_zh"
                :id="group.id"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.id"
                  :label="item.name_zh"
                  :value="item.id"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </div>
        </el-form-item>

        <!-- 我希望平台得到的服务 -->
        <div class="form-item-title">我希望平台得到的服务</div>
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
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
        提交
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

      rules: {
        userType: [
          { required: true, message: "请选择角色", trigger: "change" },
        ],
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        company_name: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        position: [{ required: true, message: "请输入职务", trigger: "blur" }],
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

        this.selectedRequirementType = "";
      });
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
            workType: this.form.workType.join(","),
            requireService: this.form.requireService.join(","),
          }

          // 实际API调用示例
          this.$api({
            url: 'finishUserInfo',
            method: 'post',
            data: submitData
          }).then((res) => {
            this.submitLoading = false;
            if (res.code === 200) {
              this.$message.success('信息完善成功');
              this.hide();
              this.$emit('submit-success', submitData);
            } else {
              this.$message.error(res.msg || '提交失败');
            }
          }).catch(() => {
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
  .tree-selection {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 15px;
    background: #fafafa;

    .tree-item {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      .sub-items {
        margin-left: 20px;
        margin-top: 8px;

        .sub-sub-items {
          margin-left: 20px;
          margin-top: 8px;
        }
      }

      /deep/ .el-checkbox {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      /deep/ .el-checkbox__label {
        font-size: 14px;
        color: #333;
      }

      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #33ae60;
        border-color: #33ae60;
      }
    }
  }
}

.service-checkboxes {
  .checkbox-row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
    gap: 0 30px;

    &:last-child {
      margin-bottom: 0;
    }

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
