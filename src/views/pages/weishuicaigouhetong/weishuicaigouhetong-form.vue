<template>
  <div class="baojiadan-form">
    <div class="back" @click="back">
      <img src="@/assets/back.png" alt="" />
      <span>创建未税采购合同</span>
    </div>
    <div class="baojiadan-form-content" ref="baojiadanForm">
      <!-- 合同信息 -->
      <el-form
        ref="form"
        :model="form.companyInfo"
        :rules="rules"
        label-width="150px"
        class="section1"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="未税采购合同编号：" prop="contractNo">
              <el-input
                v-model="form.companyInfo.contractNo"
                placeholder="请输入未税采购合同编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订日期" prop="signDate">
              <el-date-picker
                v-model="form.companyInfo.signDate"
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
        <div class="add-product">
          <el-button type="primary" @click="openDialog">添加产品</el-button>
        </div>
        <!-- 产品选择弹框 -->
        <el-dialog title="选择产品" :visible.sync="dialogVisible" width="60%">
          <div style="margin-bottom: 16px">
            <el-input
              v-model="keyword"
              placeholder="关键词搜索"
              style="width: 200px; margin-right: 10px"
              clearable
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>
          <el-table
            :data="filteredProductList"
            style="width: 100%; margin-bottom: 16px"
            @selection-change="handleSelectionChange"
            ref="productTable"
            :row-key="(row) => row.id"
            border
            highlight-current-row
            @row-click="toggleRowSelection"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="title" label="商品名称" align="center" />
            <el-table-column prop="specNo" label="商品规格" align="center" />
            <el-table-column prop="price" label="商品价格" align="center" />
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleDialogConfirm">确认</el-button>
          </span>
        </el-dialog>
        <el-table :data="form.products" style="margin-top: 12px">
          <el-table-column
            type="index"
            label="项目名称"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column prop="title" label="品名" width="260" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.title" placeholder="请输入品名"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="specNo" label="型号、规格" width="260" align="center">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.specNo"
                placeholder="请输入型号、规格"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位" width="260" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.unit" placeholder="请输入单位"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.num"
                :min="1"
                @change="calcTotal"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="未税单价" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.price"
                :min="0"
                @change="calcTotal"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="未税总金额" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.totalPrice" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="removeProduct(scope.$index)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="total-amount">
          <p>
            未税合计：<b>￥{{ totalAmount }}</b>
          </p>
        </div>
      </div>

      <!-- 合同条款 -->
      <div class="section">
        <div class="title">合同条款</div>
        <el-form ref="form1" :model="form.termJson" :rules="rules" label-width="170px">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="质量要求和技术标准：" prop="standard">
                <el-input
                  type="textarea"
                  rows="3"
                  v-model="form.termJson.standard"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="保修说明：" prop="warranty">
                <el-input
                  type="textarea"
                  v-model="form.termJson.warranty"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="相关费用：" prop="relatedCosts">
                <el-radio-group v-model="form.termJson.relatedCosts">
                  <el-radio
                    v-for="(item, index) in status_options"
                    :key="index"
                    :label="item.value"
                    :value="item.value"
                  >
                    {{ item.title }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="需方收货人信息：" prop="shouHuo">
                <el-input v-model="form.termJson.shouHuo" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="货款清算及结算方式：" prop="payment">
                <el-radio-group v-model="form.termJson.payment">
                  <el-radio
                    v-for="(item, index) in type_options"
                    :key="index"
                    :label="item.value"
                    :value="item.value"
                  >
                    {{ item.title }}
                  </el-radio>
                  <el-radio :label="3" :value="3">
                    <el-input v-model="form.termJson.paymentDesc"></el-input>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 需方信息 -->
      <div class="section">
        <div class="title">供方信息</div>
        <el-form ref="form2" :model="form.companyInfo" :rules="rules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="供方单位名称：" prop="company">
                <el-input v-model="form.companyInfo.company"></el-input>
              </el-form-item>
              <el-form-item label="法定代表人：" prop="fdName">
                <el-input v-model="form.companyInfo.fdName"></el-input>
              </el-form-item>
              <el-form-item label="电话：" prop="phone">
                <el-input v-model="form.companyInfo.phone"></el-input>
              </el-form-item>
              <el-form-item label="开户银行：" prop="bank">
                <el-input v-model="form.companyInfo.bank"></el-input>
              </el-form-item>
              <el-form-item label="税号：" prop="taxCode">
                <el-input v-model="form.companyInfo.taxCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位地址：" prop="address">
                <el-input v-model="form.companyInfo.address"></el-input>
              </el-form-item>
              <el-form-item label="委托代理人：" prop="wtName">
                <el-input v-model="form.companyInfo.wtName"></el-input>
              </el-form-item>
              <el-form-item label="邮编：" prop="zipCode">
                <el-input v-model="form.companyInfo.zipCode"></el-input>
              </el-form-item>
              <el-form-item label="账号：" prop="bankCode">
                <el-input v-model="form.companyInfo.bankCode"></el-input>
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
import log from "@/plugins/log";
export default {
  data() {
    return {
      id: "",
      productId: "",
      productList: [],
      dialogVisible: false,
      keyword: "",
      filteredProductList: [],
      selectedProducts: [],
      form: {
        products: [
          // { title: "", desc: "", unit: "", price: 0, num: 1, remark: "" },
        ],
        termJson: {
          standard:
            "品质验收标准以合同规定的型号，规格，配置为标准，按产品原生产厂家的标准及方式进行验收，即按照IIS A标准，不适用其他任何的验收条款和方式。需方应认真检查包装、数量及产品、随机附件是否完好，确认并签收。需方可在收到货物之日起2日内提出产品数量异议；在收到货物之日起7日内就产品质量提出书面异议。验收完成，此后因此产品发生的任何问题，与供方无关。",
          warranty: "自需方收到产品之日起一年内为保修期。",
          relatedCosts: 1,
          shouHuo: "",
          payment: 1,
          paymentDesc: "",
        },
        companyInfo: {
          contractNo: "",
          signDate: "",
          company: "",
          fdName: "",
          phone: "",
          bank: "",
          taxCode: "",
          address: "",
          wtName: "",
          zipCode: "",
          bankCode: "",
        },
      },
      status_options: [
        {
          value: 1,
          title: "由供方自主决定产品包装，且自行承担货物运输费用和保险费。",
        },
        {
          value: 2,
          title: "全部运费由需方承担。",
        },
      ],
      type_options: [
        {
          value: 1,
          title: "收到全部货款后发货。",
        },
        {
          value: 2,
          title: "自收到产品之日起2日内，需方通过银行转账方式向供方一次性支付所有货款",
        },
      ],
      rules: {
        contractNo: [{ required: true, message: "请输入销售合同编号" }],
        signDate: [{ required: true, message: "请选择签订日期" }],
        company: [{ required: true, message: "请输入需方单位名称" }],
        standard: [{ required: true, message: "请输入质量要求和技术标准" }],
        warranty: [{ required: true, message: "请输入保修说明" }],
        relatedCosts: [{ required: true, message: "请选择相关费用" }],
        // shouHuo: [{ required: true, message: "请输入需方收货人信息" }],
        payment: [{ required: true, message: "请选择货款清算及结算方式" }],
        paymentDesc: [{ required: true, message: "请输入货款清算及结算方式描述" }],
        fdName: [{ required: true, message: "请输入法定代表人" }],
        phone: [{ required: true, message: "请输入电话" }],
        bank: [{ required: true, message: "请输入开户银行" }],
        taxCode: [{ required: true, message: "请输入税号" }],
        address: [{ required: true, message: "请输入单位地址" }],
        wtName: [{ required: true, message: "请输入委托代理人" }],
        zipCode: [{ required: true, message: "请输入邮编" }],
        bankCode: [{ required: true, message: "请输入账号" }],
      },
    };
  },
  computed: {
    totalAmount() {
      return this.form.products
        .reduce((sum, item) => sum + item.price * item.num, 0)
        .toFixed(2);
    },
  },
  mounted() {
    // 获取baojiadanForm距离可视区顶部的距离, 根据可视区高度 减去顶部距离设置高度
    this.$nextTick(() => {
      this.$refs.baojiadanForm.style.height = `${
        window.innerHeight - this.$refs.baojiadanForm.offsetTop - 100
      }px`;
    });

    this.id = this.$route.query.id;
    if (this.id) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$api({
        url: "getContractDetail",
        method: "post",
        data: { id: this.id },
      })
        .then((res) => {
          loading.close();
          if (res.code === 200) {
            this.form = {
              products: res.data.productJson,
              termJson: {
                standard: res.data.standard,
                warranty: res.data.warranty,
                relatedCosts: res.data.relatedCosts,
                shouHuo: res.data.shouHuo,
                payment: res.data.payment,
                paymentDesc: res.data.payment == 3 ? res.data.paymentDesc : "",
              },
              companyInfo: {
                contractNo: res.data.contractNo,
                signDate: res.data.signDate,
                company: res.data.company,
                fdName: res.data.fdName,
                phone: res.data.phone,
                bank: res.data.bank,
                taxCode: res.data.taxCode,
                address: res.data.address,
                wtName: res.data.wtName,
                zipCode: res.data.zipCode,
                bankCode: res.data.bankCode,
              },
            };
          }
        })
        .catch((err) => {
          loading.close();
          this.$message.error("获取数据失败");
        });
    } else {
      this.form.companyInfo.signDate = log.parseTime(new Date(), "{y}-{m}-{d}");
    }
    // 获取商品列表
    this.getProductList();
  },
  methods: {
    getProductList() {
      // 获取商品列表
      this.$api({
        url: "getProductList",
        method: "get",
        data: {
          keyword: this.keyword,
        },
      }).then((res) => {
        if (res.code === 200) {
          this.productList = res.data.list;
          this.filteredProductList = res.data.list; // 初始化弹框商品列表
        }
      });
    },
    openDialog() {
      this.selectedProducts = [];
      this.$nextTick(() => {
        if (this.$refs.productTable) {
          this.$refs.productTable.clearSelection();
        }
      });
      this.dialogVisible = true;
      this.filteredProductList = this.productList;
    },
    handleSearch() {
      this.getProductList();
    },
    handleSelectionChange(val) {
      this.selectedProducts = val;
    },
    toggleRowSelection(row) {
      this.$refs.productTable.toggleRowSelection(row);
    },
    handleDialogConfirm() {
      if (this.selectedProducts.length === 0) {
        this.$message.error("请选择产品");
        return;
      }
      this.selectedProducts.forEach((item) => {
        this.productId = item.id;
        this.addProduct();
      });
      this.selectedProducts = [];
      this.dialogVisible = false;
    },
    addProduct() {
      if (this.productId) {
        const product = this.productList.find((item) => item.id === this.productId);
        this.form.products.push({
          title: product.title,
          specNo: product.specNo,
          unit: product.unit,
          price: product.price,
          num: 1,
          totalPrice: product.price,
          remark: "",
        });
        this.productId = "";
        this.calcTotal();
      } else {
        this.$message.error("请选择产品");
      }
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 依次校验form1和form2
          this.$refs.form1.validate((valid1) => {
            if (valid1) {
              this.$refs.form2.validate((valid2) => {
                if (valid2) {
                  if (this.form.termJson.payment == 3) {
                    if (this.form.termJson.paymentDesc == "") {
                      this.$message.error("请输入货款清算及结算方式描述");
                      return;
                    }
                  }
                  // 检查产品列表
                  this.form.products.forEach((item) => {
                    if (
                      !item.title ||
                      !item.specNo ||
                      !item.unit ||
                      item.num === 0 ||
                      item.price === 0
                    ) {
                      this.$message.error("请检查产品列表输入内容");
                      return;
                    }
                    const loading = this.$loading({
                      lock: true,
                      text: "Loading",
                      spinner: "el-icon-loading",
                      background: "rgba(0, 0, 0, 0.7)",
                    });
                    this.$api({
                      url: "createContract",
                      method: "post",
                      data: {
                        id: this.id,
                        type: 4,
                        ...this.form.companyInfo,
                        ...this.form.termJson,
                        paymentDesc:
                          this.form.termJson.payment == 3
                            ? this.form.termJson.paymentDesc
                            : "",
                        productJson: JSON.stringify(this.form.products),
                      },
                    }).then((res) => {
                      if (res.code === 200) {
                        this.$router.push({
                          path: "/weishuicaigouhetong-success",
                          query: {
                            id: res.data.id,
                          },
                        });
                      } else {
                        this.$message.error("创建失败");
                      }
                      loading.close();
                    });
                  });
                } else {
                  this.$message.error("请检查供方信息输入内容");
                }
              });
            } else {
              this.$message.error("请检查合同条款输入内容");
            }
          });
        } else {
          this.$message.error("请检查合同信息输入内容");
        }
      });
    },
    reset() {
      // 重置逻辑
      this.$message.info("已取消");
    },
    back() {
      this.$router.push("/weishuicaigouhetong-list");
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
    background-color: #e5e5e5;
    height: 56px;
    line-height: 56px;
    padding-right: 100px;
    display: flex;
    justify-content: end;

    font-family: Arial, Arial;
    font-weight: bold;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.85);

    p {
      margin-left: 150px;
    }
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
