<template>
  <div class="view-wrap customer-add-page">
    <div class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" class="customer-form">
        <!-- 基础信息 -->
        <div class="form-section">
          <div class="section-title">基础信息</div>
          <div class="section-content">
            <el-form-item label="客户名称" prop="name" required>
              <el-input v-model="form.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="客户属地" prop="territory" required>
              <el-radio-group v-model="form.territory">
                <el-radio label="国内">国内</el-radio>
                <el-radio label="国外">国外</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="客户区域" prop="region" required>
              <el-select v-model="form.region" placeholder="请选择省" clearable style="width: 100%">
                <el-option label="北京市" value="北京" />
                <el-option label="浙江省" value="浙江" />
                <el-option label="上海市" value="上海" />
                <el-option label="广东省" value="广东" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户属性A" prop="attrA" required>
              <el-select v-model="form.attrA" placeholder="请选择" clearable style="width: 100%">
                <el-option label="企业" value="企业" />
                <el-option label="个人" value="个人" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户属性B" prop="attrB" required>
              <el-select v-model="form.attrB" placeholder="请选择" clearable style="width: 100%">
                <el-option label="类型A" value="A" />
                <el-option label="类型B" value="B" />
              </el-select>
            </el-form-item>
            <el-form-item label="客户直接联系人" prop="contactPerson" required>
              <el-input v-model="form.contactPerson" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="客户联系电话" prop="contactPhone" required>
              <el-input v-model="form.contactPhone" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="公司电话" prop="companyPhone">
              <el-input v-model="form.companyPhone" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="账期（月）" prop="termMonth">
              <el-input v-model="form.termMonth" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicense">
              <el-upload class="upload-image-card" action="#" list-type="picture-card" :auto-upload="false"
                :file-list="form.businessLicenseList"
                :on-change="(file, list) => handleLicenseChange('businessLicense', list)"
                :on-remove="() => handleLicenseRemove('businessLicense')">
                <i class="el-icon-plus" />
                <span class="upload-text">添加图片</span>
              </el-upload>
            </el-form-item>
            <el-form-item label="医疗器械相关许可证" prop="medicalLicense">
              <el-upload class="upload-image-card" action="#" list-type="picture-card" :auto-upload="false"
                :file-list="form.medicalLicenseList"
                :on-change="(file, list) => handleLicenseChange('medicalLicense', list)"
                :on-remove="() => handleLicenseRemove('medicalLicense')">
                <i class="el-icon-plus" />
                <span class="upload-text">添加图片</span>
              </el-upload>
            </el-form-item>
            <p class="form-note form-note--red">备注: 2类、3类医疗器械产品必须上传营业执照和许可证</p>
          </div>
        </div>

        <!-- 对公收款信息 -->
        <div class="form-section">
          <div class="section-title">对公收款信息</div>
          <div class="section-content">
            <el-form-item label="户名" prop="accountName" required>
              <el-input v-model="form.accountName" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="账号" prop="accountNo" required>
              <el-input v-model="form.accountNo" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="开户行" prop="bankName" required>
              <el-input v-model="form.bankName" placeholder="请输入" clearable />
            </el-form-item>
          </div>
        </div>

        <!-- 客户收货信息 -->
        <div class="form-section">
          <div class="section-title">客户收货信息</div>
          <div class="section-content">
            <el-form-item label="收货地址" prop="address" required>
              <el-input v-model="form.address" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="收货人" prop="receiver" required>
              <el-input v-model="form.receiver" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="收货人联系方式" prop="receiverPhone" required>
              <el-input v-model="form.receiverPhone" placeholder="请输入" clearable />
            </el-form-item>
          </div>
        </div>

        <!-- 其他信息 -->
        <div class="form-section">
          <div class="section-title">其他信息</div>
          <div class="section-content">
            <el-form-item label="客户引入人" prop="introducer">
              <el-input v-model="form.introducer" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="客户负责人" prop="manager">
              <el-input v-model="form.manager" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="其他" prop="other">
              <el-input v-model="form.other" placeholder="请输入" clearable />
            </el-form-item>
          </div>
        </div>

        <!-- 底部按钮 -->
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
  name: 'CustomerAdd',

  data() {
    return {
      form: {
        name: '',
        territory: '国内',
        region: '',
        attrA: '',
        attrB: '',
        contactPerson: '',
        contactPhone: '',
        companyPhone: '',
        termMonth: '',
        businessLicenseList: [],
        medicalLicenseList: [],
        accountName: '',
        accountNo: '',
        bankName: '',
        address: '',
        receiver: '',
        receiverPhone: '',
        introducer: '',
        manager: '',
        other: ''
      },
      rules: {
        name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        territory: [{ required: true, message: '请选择客户属地', trigger: 'change' }],
        region: [{ required: true, message: '请选择客户区域', trigger: 'change' }],
        attrA: [{ required: true, message: '请选择客户属性A', trigger: 'change' }],
        attrB: [{ required: true, message: '请选择客户属性B', trigger: 'change' }],
        contactPerson: [{ required: true, message: '请输入客户直接联系人', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '请输入客户联系电话', trigger: 'blur' }],
        accountName: [{ required: true, message: '请输入开户名', trigger: 'blur' }],
        accountNo: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        bankName: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        receiver: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
        receiverPhone: [{ required: true, message: '请输入收货人联系方式', trigger: 'blur' }]
      }
    };
  },

  methods: {
    handleLicenseChange(field, fileList) {
      this.form[field + 'List'] = fileList;
    },
    handleLicenseRemove(field) {
      this.form[field + 'List'] = [];
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        // TODO: 调用新增接口
        this.$message.success('提交成功');
        this.$router.push('/manager/customer');
      });
    },
    handleCancel() {
      this.$router.push('/manager/customer');
    }
  }
};
</script>

<style lang="less" scoped>
.customer-add-page {
  background: #f8f8f8;
  min-height: 100%;
}

.form-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px 32px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.customer-form {
  // width: 1000px;
}

.form-section {
  margin-bottom: 32px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.section-title {
  position: relative;
  padding-left: 14px;
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #2373C8;
  text-align: left;
  border-bottom: 2px solid #F1F1F1;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 2px;
    width: 8px;
    height: 21px;
    background: #2373C8;
    border-radius: 2px;
  }
}

.section-content {
  width: 1000px;
  margin-left: 226px;

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item__label {
    color: #606266;
  }

  .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label::before {
    color: #f56c6c;
  }

  .el-input__inner,
  .el-select .el-input__inner {
    border-radius: 4px;
  }

  .el-radio-group {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}

.upload-image-card {
  ::v-deep .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 120px;
    border: 1px solid #F5F5F5;
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

.form-note {
  margin: -8px 0 20px 140px;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;

  &--red {
    color: #FF6F00;
  }
}

.form-footer {
  width: 1000px;
  margin-left: 226px;
  margin-top: 48px;

  .el-button {
    width: 180px;
    height: 45px;
    background: #2373C8;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF;
    margin-right: 16px;
  }
  .el-button--default {
    background: #FFFFFF;
    border: 1px solid #9D9D9D;
    color: #4A4A4A;
  }
}
</style>
