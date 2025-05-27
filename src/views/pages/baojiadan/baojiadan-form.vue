<template>
  <div class="baojiadan-form">
    <div class="back" @click="back">
      <img src="@/assets/back.png" alt="" />
      <span>创建合计报价单</span>
    </div>
    <div class="baojiadan-form-content" ref="baojiadanForm">
      <!-- 合同信息 -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="section1"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合计报价单编号" prop="quotationNo">
              <el-input
                v-model="form.quotationNo"
                placeholder="请输入合计报价单编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订日期" prop="signDate">
              <el-date-picker
                v-model="form.signDate"
                type="date"
                placeholder="请选择签订日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 产品列表 -->
      <div class="section">
        <el-button type="primary" @click="addProduct">添加产品</el-button>
        <el-table :data="form.products" style="margin-top: 12px">
          <el-table-column
            type="index"
            label="项目名称"
            width="160"
            align="center"
          ></el-table-column>
          <el-table-column prop="title" label="品名" width="160" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.title"
                placeholder="请输入品名"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="specNo" label="描述" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.specNo"
                placeholder="请输入描述"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="160" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.unit"
                placeholder="请输入单位"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="160" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.price"
                :min="0"
                @change="calcTotal"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" width="160" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.num"
                :min="1"
                @change="calcTotal"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalPrice"
            label="合计"
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <span>￥{{ scope.row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remark"
                placeholder="请输入备注"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="removeProduct(scope.$index)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="total-amount">
          合计：<b>￥{{ totalAmount }}</b>
        </div>
      </div>

      <!-- 合同条款 -->
      <div class="section">
        <div class="title">合同条款</div>
        <el-form :model="form.termJson" :rules="rules" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="以上报价含增值税：" prop="tax">
                <el-input
                  v-model="form.termJson.tax"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="价格条款：" prop="priceTerms">
                <el-input
                  v-model="form.termJson.priceTerms"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="报价有效期" prop="validityTime">
                <el-input
                  v-model="form.termJson.validityTime"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="运输方式" prop="transport">
                <el-input
                  v-model="form.termJson.transport"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款方式" prop="payType">
                <el-input
                  v-model="form.termJson.payType"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="交货时间" prop="deliveryTime">
                <el-input
                  v-model="form.termJson.deliveryTime"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="最小订货量" prop="min">
                <el-input
                  v-model="form.termJson.min"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item label="包装方式" prop="pack">
                <el-input
                  v-model="form.termJson.pack"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 需方信息 -->
      <div class="section">
        <div class="title">需方信息</div>
        <el-form :model="form" ref="form1" :rules="rules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="客户名称" prop="customerCompany">
                <el-input v-model="form.customerCompany"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="customerPhone">
                <el-input v-model="form.customerPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="customerName">
                <el-input v-model="form.customerName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 操作按钮 -->
      <div class="btn-box">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      form: {
        quotationNo: "", // 合计报价单
        signDate: "", // 签订日期
        customerCompany: "", // 需求方名称
        customerPhone: "", // 需求方手机
        customerName: "", // 需求方联系人
        products: [
          {
            title: "",
            name: "",
            desc: "",
            unit: "",
            price: 0,
            num: 1,
            remark: "",
            totalPrice: 0,
          },
        ], // 产品
        termJson: {
          tax: "均含13%增值税",
          priceTerms: "送货到客户指定仓库",
          validityTime: "15天",
          transport: "汽运",
          payType: "现款",
          deliveryTime: "签完合同以后两周内交货",
          min: "片",
          pack: "纸箱",
        }, // 合同条款
      },
      rules: {
        quotationNo: [{ required: true, message: "请输入合计报价单编号" }],
        signDate: [{ required: true, message: "请选择签订日期" }],
        customerCompany: [{ required: true, message: "请输入客户名称" }],
        customerPhone: [{ required: true, message: "请输入手机" }],
        customerName: [{ required: true, message: "请输入联系人" }],
      },
    };
  },
  computed: {
    totalAmount() {
      if (this.form.products.length > 0) {
        return this.form.products
          .reduce((sum, item) => sum + item.price * item.num, 0)
          .toFixed(2);
      }
      return 0;
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    // 获取baojiadanForm距离可视区顶部的距离, 根据可视区高度 减去顶部距离设置高度
    this.$nextTick(() => {
      this.$refs.baojiadanForm.style.height = `${
        window.innerHeight - this.$refs.baojiadanForm.offsetTop - 100
      }px`;
    });
    // 如果id存在, 则获取详情
    if (this.id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$api({
        url: "getQuotationDetail",
        method: "post",
        data: {
          id: this.id,
        },
      })
        .then((res) => {
          loading.close();
          if (res.code === 200) {
            this.form.products = res.data.productJson;
            this.form.termJson = res.data.termJson;
            this.form.quotationNo = res.data.quotationNo;
            this.form.signDate = res.data.signDate;
            this.form.customerCompany = res.data.customerCompany;
            this.form.customerPhone = res.data.customerPhone;
            this.form.customerName = res.data.customerName;
          }
        })
        .catch(() => {
          loading.close();
        });
    }
  },
  methods: {
    addProduct() {
      this.form.products.push({
        title: "",
        name: "",
        desc: "",
        unit: "",
        price: 0,
        num: 1,
        remark: "",
        totalPrice: 0,
      });
    },
    removeProduct(index) {
      this.form.products.splice(index, 1);
    },
    calcTotal() {
      // 触发合计更新
      this.form.products.forEach((item) => {
        item.totalPrice = item.price * item.num;
      });
    },
    submit() {
      // 提交逻辑
      // 校验
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.form1.validate((valid1) => {
            if (valid1) {
              // 校验产品
              this.form.products.forEach((item) => {
                if (
                  item.title === "" ||
                  item.specNo === "" ||
                  item.unit === "" ||
                  item.price === 0 ||
                  item.num === 0
                ) {
                  this.$message.error("请输入完整的产品信息");
                  return false;
                }
              });
              // 校验合同条款
              if (
                this.form.termJson.tax === "" ||
                this.form.termJson.priceTerms === "" ||
                this.form.termJson.validityTime === "" ||
                this.form.termJson.transport === "" ||
                this.form.termJson.payType === "" ||
                this.form.termJson.deliveryTime === "" ||
                this.form.termJson.min === "" ||
                this.form.termJson.pack === ""
              ) {
                this.$message.error("请输入完整的合同信息");
                return false;
              }
              const loading = this.$loading({
                lock: true,
                text: "Loading",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
              });
              // 提交
              this.$api({
                url: "createQuotation",
                method: "post",
                data: {
                  quotationNo: this.form.quotationNo,
                  signDate: this.form.signDate,
                  customerCompany: this.form.customerCompany,
                  customerPhone: this.form.customerPhone,
                  customerName: this.form.customerName,
                  productJson: JSON.stringify(this.form.products),
                  termJson: JSON.stringify(this.form.termJson),
                  id: this.id,
                  type: 1,
                },
              }).then((res) => {
                loading.close();
                if (res.code === 200) {
                  this.$message.success("提交成功");
                  this.$router.push("/baojiadan-success");
                }
              });
            }
          });
        }
      });
    },
    reset() {
      // 重置逻辑
      this.$message.info("已取消");
    },
    back() {
      this.$router.push("/baojiadan-list");
    },
  },
};
</script>

<style scoped lang="less">
.baojiadan-form {
  width: 100%;
}

.back {
  cursor: pointer;
  display: flex;
  align-items: center;

  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 20px;
  color: #000000;

  img {
    width: 28px;
    margin-right: 5px;
  }
}

.baojiadan-form-content {
  margin-top: 20px;
  background-color: #fff;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  overflow-y: auto;
}

.section {
  margin-bottom: 30px;

  .title {
    font-family: PingFang SC, PingFang SC;
    font-weight: 500;
    font-size: 18px;
    color: #2b2c32;
    margin-bottom: 36px;
    display: flex;
    align-items: center;

    &::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 18px;
      background-color: #d04e89;
      margin-right: 10px;
    }
  }

  .el-row {
    margin-left: 30px !important;
  }

  .total-amount {
    text-align: right;
    background-color: #e5e5e5;
    height: 56px;
    line-height: 56px;
    padding-right: 100px;

    font-family: Arial, Arial;
    font-weight: bold;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);
  }

  .el-button--primary {
    background: #d04e89 !important;
    border: 1px solid #d04e89;
  }
}

.section1 {
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 1px solid #d8d8d8;
}

.btn-box {
  .el-button--primary {
    width: 180px;
    height: 48px;
    font-size: 16px;
    background: linear-gradient(
      90deg,
      #452f86 0%,
      #a92b83 31%,
      #d14f8d 67%,
      #e38179 100%
    ) !important;
    border: none;
  }

  .el-button--default {
    width: 180px;
    height: 48px;
    font-size: 16px;
  }
}

/deep/ .el-input__inner {
  background: #fafafa;
  border: 1px solid #e6e5e5;
}
</style>
