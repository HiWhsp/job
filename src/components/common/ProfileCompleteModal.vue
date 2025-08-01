<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="850px"
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
        <el-form-item label="选择角色：" prop="userType" required>
          <el-select v-model="form.userType" placeholder="个人/企业" style="width: 100%">
            <el-option label="个人" value="1"></el-option>
            <el-option label="企业" value="2"></el-option>
          </el-select>
        </el-form-item>

        <!-- 姓名 -->
        <el-form-item label="姓名：" prop="realname" required>
          <el-input v-model="form.realname" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <!-- 公司 -->
        <el-form-item
          label="公司："
          prop="company_name"
          v-if="form.userType == 2"
          required
        >
          <el-input v-model="form.company_name" placeholder="请输入公司名称"></el-input>
        </el-form-item>

        <!-- 职务 -->
        <el-form-item label="职务：" prop="position" v-if="form.userType == 2" required>
          <el-input v-model="form.position" placeholder="请输入职务"></el-input>
        </el-form-item>
        <el-form-item label="地区：" required>
          <area_select ref="area_select" @change="changeSelectAddress" />
        </el-form-item>
        <!-- 地址 -->
        <el-form-item label="详细地址：" prop="address" required>
          <el-input v-model="form.address" placeholder="请输入地址"></el-input>
        </el-form-item>

        <!-- 我需求的类型 -->
        <div class="form-item-title">我属于的类型</div>
        <el-form-item label="选择类型：" required>
          <div class="requirement-type-section">
            <div class="tree-container">
              <el-tree
                ref="workTypeTree"
                :data="finish_select.belongTypeList || []"
                :props="treeProps"
                node-key="id"
                show-checkbox
                check-strictly
                :default-checked-keys="form.belongType"
                @check="handleWorkTypeCheck"
                class="work-type-tree"
              >
              </el-tree>
            </div>
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
import area_select from "@/components/address/area_select.vue";
export default {
  name: "ProfileCompleteModal",
  components: {
    area_select,
  },
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
        provinceName: "",
        cityName: "",
        areaName: "",
        provinceId: "",
        cityId: "",
        areaId: "",
      },

      // 树形结构的配置
      treeProps: {
        label: "name_zh",
        children: "children",
      },

      rules: {
        userType: [{ required: true, message: "请选择角色", trigger: "change" }],
        realname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        company_name: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
        position: [{ required: true, message: "请输入职务", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
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
        const newData = data;
        // belongTypeList的数据是{1:"从事光伏、风电、柴油发电相关方", 2:"从事储能、充电桩相关方", 3:"从事柴冲、柴发相关方", 4:"从事其他相关方" ....}
        // 需要转换为[{id:1, name:"从事光伏、风电、柴油发电相关方", children:[]}, {id:2, name:"从事储能、充电桩相关方", children:[]}, {id:3, name:"从事柴冲、柴发相关方", children:[]}, {id:4, name:"从事其他相关方", children:[]}]
        newData.belongTypeList = Object.keys(data.belongTypeList).map((key) => {
          return {
            id: key,
            name_zh: data.belongTypeList[key],
            children: [],
          };
        });
        this.finish_select = newData;
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
          // 校验数据
          if (this.form.workType.length == 0) {
            this.$message.error("请选择我属于的类型");
            return;
          }
          if (this.form.requireService.length == 0) {
            this.$message.error("请选择我希望平台得到的服务");
          }
          if (this.form.provinceId == "") {
            this.$message.error("请选择地区");
            return;
          }
          if (this.form.address == "") {
            this.$message.error("请输入详细地址");
            return;
          }

          // 构建提交数据
          const submitData = {
            ...this.form,
            username: this.form.realname,
            belongType: this.form.workType.join(","),
            requireService: this.form.requireService.join(","),
            workType: undefined,
          };
          this.submitLoading = true;

          // 实际API调用示例
          this.$api({
            url: "finishUserInfo",
            method: "post",
            data: submitData,
          })
            .then((res) => {
              this.submitLoading = false;
              if (res.code === 200) {
                this.$message.success("信息完善成功");
                this.hide();
                this.$emit("submit-success", submitData);
              } else {
                this.$message.error(res.msg || "提交失败");
              }
            })
            .catch(() => {
              this.submitLoading = false;
            });
        }
      });
    },
    //更新当前父组件数据
    changeSelectAddress(data) {
      this.$log("更新省市区数据", data);
      // debugger
      this.form.provinceName = data.sheng.name;
      this.form.cityName = data.shi.name;
      this.form.areaName = data.qu.name;
      this.form.provinceId = data.sheng.id;
      this.form.cityId = data.shi.id;
      this.form.areaId = data.qu.id;
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
      font-size: 18px;
      font-weight: bold;
      line-height: 18px;
      letter-spacing: normal;
      color: #666666;
      margin-bottom: 22px;
    }

    /deep/ .el-form-item__label {
      font-weight: 500;
      color: #333;
      font-size: 18px;
    }

    /deep/ .el-form-item.is-required .el-form-item__label:before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }

    /deep/ .el-input__inner,
    /deep/ .el-select .el-input__inner {
      height: 40px;
      line-height: 40px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      font-size: 18px;

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
  /deep/ .el-tree-node__label {
    font-size: 17px;
    color: #333;
  }
}

.service-checkboxes {
  /deep/ .el-checkbox {
    margin-right: 10px;
    margin-bottom: 10px;
    flex: 0 0 auto;
    min-width: 180px;
  }

  /deep/ .el-checkbox__label {
    font-size: 18px;
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
