<template>
  <div class="baojiadan-form">
    <div class="back" @click="back">
      <img src="@/assets/back.png" alt=""/>
      <span>创建未税销售合同</span>
    </div>
    <div class="baojiadan-form-content" ref="baojiadanForm">
      <!-- 合同信息 -->
      <el-form :model="form" label-width="130px" class="section1">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="未税销售合同编号：">
              <el-input
                  v-model="form.contractNo"
                  placeholder="请输入未税销售合同编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订日期">
              <el-date-picker
                  v-model="form.signDate"
                  type="date"
                  placeholder="请选择签订日期"
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
              prop="name"
              label="项目名称"
              width="160"
              align="center"
          >
            <template slot-scope="scope">
              <el-input
                  v-model="scope.row.name"
                  placeholder="请输入项目名称"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="品名" width="160" align="center">
            <template slot-scope="scope">
              <el-input
                  v-model="scope.row.name"
                  placeholder="请输入品名"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="型号、规格" align="center">
            <template slot-scope="scope">
              <el-input
                  v-model="scope.row.desc"
                  placeholder="请输入型号、规格"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="单位" align="center">
            <template slot-scope="scope">
              <el-input
                  v-model="scope.row.remark"
                  placeholder="请输入单位"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="qty" label="数量" width="160" align="center">
            <template slot-scope="scope">
              <el-input-number
                  v-model="scope.row.qty"
                  :min="1"
                  @change="calcTotal"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="含税单价" width="160" align="center">
            <template slot-scope="scope">
              <el-input-number
                  v-model="scope.row.price"
                  :min="0"
                  @change="calcTotal"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="含税总金额" width="160" align="center">
            <template slot-scope="scope">
              <el-input-number
                  v-model="scope.row.price"
                  :min="0"
                  @change="calcTotal"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="备注" width="160" align="center">
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
              </el-button
              >
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
        <el-form :model="form" label-width="160px">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="质量要求和技术标准：">
                <el-input
                    type="textarea"
                    v-model="form.priceClause"
                    placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="保修说明：">
                <el-input
                    v-model="form.priceClause"
                    placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="相关费用：">
                <el-radio-group v-model="form.status">
                  <el-radio v-for="(item, index) in status_options" :key="index" :label="item.value">
                    {{ item.title }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="需方收货人信息：">
                <el-input
                    v-model="form.priceClause"
                    placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="货款清算及结算方式：">
                <el-radio-group v-model="form.status">
                  <el-radio v-for="(item, index) in type_options" :key="index" :label="item.value" v-if="item.title !== '自定义'">
                    {{ item.title }}
                  </el-radio>
                  <el-radio :label="3" v-else>
                    <el-input></el-input>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 需方信息 -->
      <div class="section">
        <div class="title">需方信息</div>
        <el-form :model="form" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="需方单位名称：">
                <el-input v-model="form.customerName"></el-input>
              </el-form-item>
              <el-form-item label="法定代表人：">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="电话：">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="开户银行：">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="法定代表人：">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位地址：">
                <el-input v-model="form.contact"></el-input>
              </el-form-item>
              <el-form-item label="委托代理人：">
                <el-input v-model="form.contact"></el-input>
              </el-form-item>
              <el-form-item label="邮编：">
                <el-input v-model="form.contact"></el-input>
              </el-form-item>
              <el-form-item label="账号：">
                <el-input v-model="form.contact"></el-input>
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
      form: {
        contractNo: "",
        signDate: "",
        products: [
          {name: "", desc: "", unit: "", price: 0, qty: 1, remark: ""},
        ],
        priceClause: "",
        validity: "",
        transport: "",
        payment: "",
        delivery: "",
        minOrder: "",
        package: "",
        customerName: "",
        contact: "",
        mobile: "",
      },
      status_options: [
        {
          value: 1,
          title: "由供方自主决定产品包装，且自行承担货物运输费用和保险费。",
        },
        {
          value: 2,
          title: '全部运费由需方承担。'
        }
      ],
      type_options: [
        {
          value: 1,
          title: "收到全部货款后发货。"
        },
        {
          value: 2,
          title: "自收到产品之日起2日内，需方通过银行转账方式向供方一次性支付所有货款"
        },
        {
          value: 3,
          title: "自定义"
        }
      ]
    };
  },
  computed: {
    totalAmount() {
      return this.form.products
          .reduce((sum, item) => sum + item.price * item.qty, 0)
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
  },
  methods: {
    addProduct() {
      this.form.products.push({
        name: "",
        desc: "",
        unit: "",
        price: 0,
        qty: 1,
        remark: "",
      });
    },
    removeProduct(index) {
      this.form.products.splice(index, 1);
    },
    calcTotal() {
      // 触发合计更新
    },
    submit() {
      // 提交逻辑
      this.$message.success("提交成功");
    },
    reset() {
      // 重置逻辑
      this.$message.info("已取消");
    },
    back() {
      this.$router.back();
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
    background: linear-gradient(90deg,
    #452f86 0%,
    #a92b83 31%,
    #d14f8d 67%,
    #e38179 100%) !important;
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
