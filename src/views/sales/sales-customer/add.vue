<template>
  <div class="view-wrap customer-add-page">
    <div class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" class="customer-form">
        <!-- 基础信息 -->
        <div class="form-section">
          <div class="section-title">基础信息</div>
          <div class="section-content">
            <el-form-item label="客户名称" prop="title" required>
              <el-input v-model="form.title" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="客户属地" prop="territory" required>
              <el-select v-model="form.territory" placeholder="请选择" clearable style="width: 100%">
                <el-option
                  v-for="item in customerBelongOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户区域" prop="region" required>
              <el-select v-model="form.region" placeholder="请选择客户区域" clearable style="width: 100%">
                <el-option
                  v-for="item in customerRegionOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户属性A" prop="attributeA" required>
              <el-select v-model="form.attributeA" placeholder="请选择客户属性A" clearable style="width: 100%">
                <el-option
                  v-for="item in customerAttrAOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户属性B" prop="attributeB" required>
              <el-select v-model="form.attributeB" placeholder="请选择客户属性B" clearable style="width: 100%">
                <el-option
                  v-for="item in customerAttrBOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客户直接联系人" prop="contact" required>
              <el-input v-model="form.contact" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="客户联系电话" prop="phone" required>
              <el-input v-model="form.phone" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="公司电话" prop="companyPhone">
              <el-input v-model="form.companyPhone" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="账期（月）" prop="termMonth">
              <el-input v-model="form.termMonth" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicense">
              <el-upload
                class="upload-image-card"
                list-type="picture-card"
                :action="uploadAction"
                name="file"
                limit="1"
                :file-list="form.businessLicenseList"
                :on-success="(res, file, list) => handleUploadSuccess('businessLicense', res, file, list)"
                :on-remove="(file, list) => handleLicenseRemove('businessLicense', file, list)"
                :http-request="(opt) => handleUploadRequest(opt, 'businessLicense')"
              >
                <i class="el-icon-plus" />
                <span class="upload-text">添加图片</span>
              </el-upload>
            </el-form-item>
            <el-form-item label="医疗器械相关许可证" prop="medicalLicense">
              <el-upload
                class="upload-image-card"
                list-type="picture-card"
                :action="uploadAction"
                name="file"
                :file-list="form.medicalLicenseList"
                :on-success="(res, file, list) => handleUploadSuccess('medicalLicense', res, file, list)"
                :on-remove="(file, list) => handleLicenseRemove('medicalLicense', file, list)"
                :http-request="(opt) => handleUploadRequest(opt, 'medicalLicense')"
              >
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
import { mapState } from "vuex";
import axios from "axios";
import { UPLOAD_ROOT } from "@/config/env.js";

export default {
  name: "CustomerAdd",

  computed: {
    ...mapState([
      "customerBelongOptions",
      "customerRegionOptions",
      "customerAttrAOptions",
      "customerAttrBOptions"
    ])
  },

  data() {
    return {
      uploadAction: UPLOAD_ROOT,
      editId: "",
      form: {
        title: "",
        territory: "",
        region: "",
        attributeA: "",
        attributeB: "",
        contact: "",
        phone: "",
        companyPhone: "",
        termMonth: "",
        businessLicenseList: [],
        medicalLicenseList: [],
        businessLicense: "",
        medicalLicense: "",
        accountName: "",
        accountNo: "",
        bankName: "",
        address: "",
        receiver: "",
        receiverPhone: "",
        introducer: "",
        manager: "",
        other: ""
      },
      rules: {
        title: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        territory: [{ required: true, message: "请选择客户属地", trigger: "change" }],
        region: [{ required: true, message: "请选择客户区域", trigger: "change" }],
        attributeA: [{ required: true, message: "请选择客户属性A", trigger: "change" }],
        attributeB: [{ required: true, message: "请选择客户属性B", trigger: "change" }],
        contact: [{ required: true, message: "请输入客户直接联系人", trigger: "blur" }],
        phone: [{ required: true, message: "请输入客户联系电话", trigger: "blur" }],
        accountName: [{ required: true, message: "请输入开户名", trigger: "blur" }],
        accountNo: [{ required: true, message: "请输入账号", trigger: "blur" }],
        bankName: [{ required: true, message: "请输入开户行", trigger: "blur" }],
        address: [{ required: true, message: "请输入收货地址", trigger: "blur" }],
        receiver: [{ required: true, message: "请输入收货人", trigger: "blur" }],
        receiverPhone: [{ required: true, message: "请输入收货人联系方式", trigger: "blur" }]
      }
    };
  },

  mounted() {
    const id = this.$route.query.id;
    if (id) {
      this.editId = String(id);
      this.loadDetail();
    }
  },

  methods: {
    loadDetail() {
      if (!this.editId) return;
      this.$api({
        url: "/getCustomer",
        method: "post",
        data: { id: this.editId }
      })
        .then(res => {
          if (res && res.data) this.fillFormFromDetail(res.data);
        })
        .catch(() => {
          this.$message.error("获取客户详情失败");
        });
    },
    _parseJson(val) {
      if (val == null) return {};
      if (typeof val === "object") return val;
      try {
        return typeof val === "string" ? JSON.parse(val || "{}") : {};
      } catch (e) {
        return {};
      }
    },
    fillFormFromDetail(data) {
      const payment = this._parseJson(data.paymentJson);
      const address = this._parseJson(data.addressJson);
      const other = this._parseJson(data.otherJson);
      const licenseArr = Array.isArray(data.licenseImage) ? data.licenseImage : [];
      this.form.title = data.title ?? "";
      this.form.territory = data.territory !== undefined && data.territory !== null ? data.territory : "";
      this.form.region = data.region ?? "";
      this.form.attributeA = data.attributeA ?? "";
      this.form.attributeB = data.attributeB ?? "";
      this.form.contact = data.contact ?? "";
      this.form.phone = data.phone ?? "";
      this.form.companyPhone = data.companyPhone ?? "";
      this.form.termMonth = data.paymentTerm ?? "";
      this.form.businessLicenseList = data.businessLicenseImage ? [{ url: data.businessLicenseImage }] : [];
      this.form.medicalLicenseList = licenseArr.map(u => ({ url: u }));
      this.form.businessLicense = data.businessLicenseImage ?? "";
      this.form.medicalLicense = licenseArr.join(",");
      this.form.accountName = payment.account ?? "";
      this.form.accountNo = payment.code ?? "";
      this.form.bankName = payment.bank ?? "";
      this.form.address = address.address ?? "";
      this.form.receiver = address.name ?? "";
      this.form.receiverPhone = address.phone ?? "";
      this.form.introducer = other.introducer ?? "";
      this.form.manager = other.superintendent ?? "";
      this.form.other = other.other ?? "";
    },
    handleUploadRequest(option, field) {
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
          if (field === "businessLicense") {
            this.form.businessLicense = url;
          } else {
            const arr = this.form.medicalLicense ? this.form.medicalLicense.split(",").filter(Boolean) : [];
            arr.push(url);
            this.form.medicalLicense = arr.join(",");
          }
          option.onSuccess({ url });
        })
        .catch(err => {
          this.$message.error((err.response && err.response.data && err.response.data.msg) || "上传失败");
          option.onError(err);
        });
    },
    handleUploadSuccess(field, res, file, fileList) {
      this.form[field + "List"] = fileList;
      const r = res || (file && file.response);
      const payload = r && r.data ? r.data : r;
      const url = (payload && (payload.path || payload.url)) || (r && r.path) || (file && file.url) || "";
      if (url && file) file.url = url;
    },
    handleLicenseRemove(field, file, fileList) {
      this.form[field + "List"] = fileList || [];
      if (field === "businessLicense") {
        this.form.businessLicense = "";
      } else {
        const removeUrl = (file && (file.url || (file.response && file.response.url))) || "";
        if (removeUrl) {
          const arr = (this.form.medicalLicense || "").split(",").filter(Boolean);
          const idx = arr.indexOf(removeUrl);
          if (idx > -1) arr.splice(idx, 1);
          this.form.medicalLicense = arr.join(",");
        } else {
          this.form.medicalLicense = (fileList || [])
            .map(f => f.url || (f.response && f.response.url))
            .filter(Boolean)
            .join(",");
        }
      }
    },
    buildEditCustomerParams() {
      const territory =
        this.form.territory !== undefined && this.form.territory !== null && this.form.territory !== ""
          ? String(this.form.territory)
          : "1";
      const paymentJson = JSON.stringify({
        account: this.form.accountName,
        code: this.form.accountNo,
        bank: this.form.bankName
      });
      const addressJson = JSON.stringify({
        address: this.form.address,
        name: this.form.receiver,
        phone: this.form.receiverPhone
      });
      const otherJson = JSON.stringify({
        introducer: this.form.introducer,
        superintendent: this.form.manager,
        other: this.form.other
      });
      const params = {
        title: this.form.title,
        territory,
        region: this.form.region,
        attributeA: this.form.attributeA,
        attributeB: this.form.attributeB,
        contact: this.form.contact,
        phone: this.form.phone,
        companyPhone: this.form.companyPhone,
        businessLicenseImage: this.form.businessLicense,
        licenseImage: this.form.medicalLicense,
        paymentJson,
        addressJson,
        otherJson,
        paymentTerm: this.form.termMonth
      };
      if (this.editId) params.id = this.editId;
      return params;
    },
    handleSubmit() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        const params = this.buildEditCustomerParams();
        this.$api({
          url: "/editCustomer",
          method: "post",
          data: params
        })
          .then(() => {
            this.$message.success(this.editId ? "保存成功" : "新增成功");
            this.$router.push("/sales/sales-customer/list");
          })
          .catch(err => {
            this.$message.error(err && err.msg ? err.msg : "提交失败");
          });
      });
    },
    handleCancel() {
      this.$router.push("/sales/sales-customer/list");
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
  display: flex;
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
