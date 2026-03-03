<template>
  <div class="view-wrap product-add-page">
    <div class="form-card">
      <div class="page-title">新增产品</div>
      <el-form ref="formRef" :model="form" label-width="140px" class="product-form">
        <el-form-item label="产品名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="产品编码" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择"
            clearable
          >
            <el-option label="树脂盘" value="1" />
            <el-option label="硅橡胶" value="2" />
            <el-option label="其他产品" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册证编码" prop="registerCode">
          <el-input
            v-model="form.registerCode"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="注册证附件" prop="registerCertList">
          <el-upload
            class="upload-image-card"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="form.registerCertList"
            :on-change="(file, list) => handleUploadChange('registerCertList', list)"
            :on-remove="() => handleUploadRemove('registerCertList')"
          >
            <i class="el-icon-plus" />
            <span class="upload-text">添加图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="生产许可证" prop="licenseList">
          <el-upload
            class="upload-image-card"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :file-list="form.licenseList"
            :on-change="(file, list) => handleUploadChange('licenseList', list)"
            :on-remove="() => handleUploadRemove('licenseList')"
          >
            <i class="el-icon-plus" />
            <span class="upload-text">添加图片</span>
          </el-upload>
        </el-form-item>
        <el-form-item label="产品效期" prop="expiry">
          <el-input
            v-model="form.expiry"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input
            v-model="form.unit"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="产品详情" prop="detail">
          <tiny-rich-editor id="product-detail-editor" v-model="form.detail" :height="400" />
        </el-form-item>

        <!-- 产品规格 -->
        <div class="spec-section">
          <div class="spec-section-title">产品规格</div>

          <div class="spec-setting">
            <div class="spec-setting-title">规格设置</div>

            <!-- 表头 -->
            <div class="spec-setting-table">
              <div class="spec-setting-header">
                <div class="spec-col spec-col-name">规格名称</div>
                <div class="spec-col spec-col-values">规格值</div>
              </div>

              <!-- 已有规格组：一行一个规格名称，对应自己的一组规格值 -->
              <div
                v-for="(group, gIndex) in specGroups"
                :key="'spec-row-' + gIndex"
                class="spec-setting-row"
              >
                <div class="spec-col spec-col-name">
                  <div class="spec-tags-wrap">
                    <el-tag
                      closable
                      type="primary"
                      size="small"
                      class="spec-tag"
                      @close.stop="handleRemoveSpecGroup(gIndex)"
                    >
                      {{ group.name }}
                    </el-tag>
                  </div>
                </div>
                <div class="spec-col spec-col-values">
                  <div class="spec-tags-wrap">
                    <el-tag
                      v-for="(v, vIndex) in group.values"
                      :key="'g-' + gIndex + '-v-' + vIndex"
                      closable
                      type="primary"
                      size="small"
                      class="spec-tag"
                      @close="removeGroupValue(gIndex, vIndex)"
                    >
                      {{ v }}
                    </el-tag>
                    <el-input
                      v-model="group.valueInput"
                      placeholder="输入规格值后回车添加"
                      size="small"
                      class="spec-input-inline"
                      maxlength="30"
                      @keyup.enter.native="addValueForGroup(gIndex)"
                    />
                    <el-button
                      type="primary"
                      size="small"
                      class="btn-add-spec"
                      @click="addValueForGroup(gIndex)"
                    >
                      +新增
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 新增规格行 -->
              <div class="spec-setting-row spec-setting-row-new">
                <div class="spec-col spec-col-name">
                  <el-input
                    v-model="currentSpecName"
                    placeholder="请输入规格名称"
                    size="small"
                    class="spec-input-inline"
                    maxlength="20"
                  />
                </div>
                <div class="spec-col spec-col-values">
                  <div class="spec-tags-wrap">
                    <el-tag
                      v-for="(v, idx) in currentSpecValues"
                      :key="'new-val-' + idx"
                      closable
                      type="primary"
                      size="small"
                      class="spec-tag"
                      @close="removeCurrentValue(idx)"
                    >
                      {{ v }}
                    </el-tag>
                    <el-input
                      v-model="currentSpecValueInput"
                      placeholder="输入规格值后回车添加"
                      size="small"
                      class="spec-input-inline"
                      maxlength="30"
                      @keyup.enter.native="addSpecValue"
                    />
                    <el-button
                      type="primary"
                      size="small"
                      class="btn-add-spec"
                      @click="confirmAddSpec"
                    >
                      +新增
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="spec-list-block">
            <div class="spec-setting-title">规格列表</div>
            <el-table :data="specList" border class="spec-table">
              <el-table-column label="规格值" min-width="200">
                <template slot-scope="{ row }">
                  <el-input v-model="row.specValue" readonly size="small" />
                </template>
              </el-table-column>
              <el-table-column label="编码" min-width="180">
                <template slot-scope="{ row }">
                  <el-input v-model="row.code" placeholder="请输入编码" size="small" clearable />
                </template>
              </el-table-column>
              <el-table-column label="库存" min-width="160">
                <template slot-scope="{ row }">
                  <el-input v-model="row.stock" placeholder="库存" size="small" clearable />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductAdd",

  data() {
    return {
      form: {
        name: "",
        code: "",
        categoryId: "",
        registerCode: "",
        registerCertList: [],
        licenseList: [],
        expiry: "",
        unit: "",
        detail: ""
      },
      // 产品规格：已确认的规格组 [{ name, values, valueInput }]
      specGroups: [],
      // 新增规格名称 / 规格值（底部“新增”行）
      currentSpecName: "",
      currentSpecValueInput: "",
      currentSpecValues: [],
      // 规格列表（笛卡尔积生成），每项 { specValue, code, stock }
      specList: []
    };
  },

  methods: {
    addSpecValue() {
      const val = (this.currentSpecValueInput || "").trim();
      if (!val) return;
      if (this.currentSpecValues.indexOf(val) === -1) {
        this.currentSpecValues.push(val);
      }
      this.currentSpecValueInput = "";
    },
    // 为已有规格组添加规格值
    addValueForGroup(gIndex) {
      const group = this.specGroups[gIndex];
      if (!group) return;
      const val = (group.valueInput || "").trim();
      if (!val) return;
      if (!group.values) group.values = [];
      if (group.values.indexOf(val) === -1) {
        group.values.push(val);
      }
      group.valueInput = "";
      this.$set(this.specGroups, gIndex, { ...group });
      this.buildSpecList();
    },
    // 删除前弹确认
    handleRemoveSpecGroup(idx) {
      this.$confirm("确认删除该规格，该操作将会重新生成规格数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeSpecGroup(idx);
        })
        .catch(() => {});
    },
    removeSpecGroup(idx) {
      this.specGroups.splice(idx, 1);
      // 如果删除的是当前“新增行”里同名的规格，不做特殊处理，只重新生成列表
      this.buildSpecList();
    },
    removeCurrentValue(idx) {
      this.currentSpecValues.splice(idx, 1);
    },
    confirmAddSpec() {
      const name = (this.currentSpecName || "").trim();
      if (!name) {
        this.$message.warning("请输入规格名称");
        return;
      }
      if (!this.currentSpecValues.length) {
        this.$message.warning("请至少添加一个规格值");
        return;
      }
      const values = [...this.currentSpecValues];
      const existIndex = this.specGroups.findIndex((g) => g.name === name);
      if (existIndex > -1) {
        this.$message.warning("已存在同名规格，请更换规格名称");
        return;
      }
      // 新增一个规格
      this.specGroups.push({
        name,
        values,
        valueInput: ""
      });
      // 重置“新增行”
      this.currentSpecName = "";
      this.currentSpecValues = [];
      this.currentSpecValueInput = "";
      this.buildSpecList();
    },
    // 根据 specGroups 笛卡尔积生成规格列表
    buildSpecList() {
      if (!this.specGroups.length) {
        this.specList = [];
        return;
      }
      const combos = this.cartesian(
        this.specGroups.map((g) => g.values.map((v) => ({ name: g.name, value: v })))
      );
      const existingKeys = new Set(this.specList.map((r) => r.specValue));
      const newList = combos.map((combo) => {
        const specValue = combo.map((c) => c.value).join(",");
        const existing = this.specList.find((r) => r.specValue === specValue);
        return {
          specValue,
          code: existing ? existing.code : "",
          stock: existing ? existing.stock : ""
        };
      });
      this.specList = newList;
    },
    cartesian(arrays) {
      if (arrays.length === 0) return [[]];
      const [first, ...rest] = arrays;
      const restCart = this.cartesian(rest);
      const result = [];
      first.forEach((item) => {
        restCart.forEach((r) => {
          result.push([item, ...r]);
        });
      });
      return result;
    },
    handleUploadChange(field, fileList) {
      this.form[field] = fileList;
    },
    handleUploadRemove(field) {
      this.form[field] = [];
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        // 提交时带上产品规格 specList，可一并传给后端
        const payload = {
          ...this.form,
          specList: this.specList
        };
        // TODO: 调用新增产品接口，如 this.$api.xxx(payload)
        this.$message.success("提交成功");
        this.$router.push("/manager/product/list");
      });
    },
    handleCancel() {
      this.$router.push("/manager/product/list");
    }
  }
};
</script>

<style lang="less" scoped>
.product-add-page {
  background: #f8f8f8;
  min-height: 100%;
}

.form-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px 32px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 12px;
}

.product-form {
  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item__label {
    color: #606266;
  }

  .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label::before {
    color: #f56c6c;
  }
  :deep(.el-input),
  :deep(.el-input__inner),
  :deep(.el-select .el-input__inner) {
    border-radius: 4px;
    width: 800px;
  }

  :deep(.el-form-item__content) {
    text-align: left;
  }
}

.upload-image-card {
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 120px;
    background-color: #f5f5f5;
    border: 1px solid #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .el-icon-plus {
      font-size: 28px;
      color: #909399;
      margin-bottom: 4px;
    }
  }

  ::v-deep .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
    border-radius: 4px;
  }
}

.upload-text {
  font-size: 14px;
  color: #878787;
  line-height: 20px;
}

/* 产品规格 */
.spec-section {
  margin-top: 32px;
  margin-bottom: 24px;
  padding-top: 24px;
  border-top: 1px solid #f1f1f1;
}

.spec-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.spec-setting-title {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 12px;
}

.spec-setting {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.spec-setting-table {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #fff;
}

.spec-setting-header {
  display: flex;
  border-bottom: 1px solid #ebeef5;
  background-color: #f9fafc;
  height: 40px;
  align-items: center;
}

.spec-setting-row {
  display: flex;
  min-height: 60px;
  border-top: 1px solid #ebeef5;
  align-items: flex-start;
}

.spec-setting-row:first-of-type {
  border-top: none;
}

.spec-setting-row-new {
  background: #fafafa;
}

.spec-col {
  padding: 10px 16px;
  display: flex;
  align-items: center;
}

.spec-col-name {
  width: 160px;
  border-right: 1px solid #ebeef5;
}

.spec-col-values {
  flex: 1;
}

.spec-tags-wrap {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  vertical-align: top;
}

.spec-tag {
  margin-right: 0;
}

.spec-input-inline {
  width: 220px;

  :deep(.el-input__inner) {
    border-radius: 4px;
  }
}

.btn-add-spec {
  margin-top: 12px;
  background: linear-gradient(90deg, #157de9 0%, #3697fd 100%);
  border: none;
}

.spec-list-block {
  .spec-setting-title {
    margin-bottom: 12px;
  }
}

.spec-table {
  :deep(.el-input__inner) {
    border-radius: 4px;
  }
}

.form-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f1f1;

  .el-button {
    min-width: 100px;
    padding: 10px 24px;
  }

  .el-button--primary {
    background: linear-gradient(90deg, #157de9 0%, #3697fd 100%);
    border: none;
  }
}
</style>
