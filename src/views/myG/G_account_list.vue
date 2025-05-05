<template>
  <div class="page">
    <div class="main-title">
      <span>收款账户管理</span>
      <button v-if="!list_address.length" @click="do_address_add()">
        <i class="el-icon-circle-plus"></i>
        <span class="add-text">添加收款账户</span>
      </button>
    </div>

    <div class="page-ctx">
      <div class="center">
        <div class="wrap-address">
          <div v-for="(item, index) in list_address" :key="index" class="address-item">
            <div class="left">
              <p>收款单位名称：<span>{{ item.company_name }}</span></p>
              <p>收款单位号码：<span>{{ item.account }}</span></p>
              <p>开户银行：<span>{{ item.bank }}</span></p>
              <p>单位地址：<span>{{ item.address }}</span></p>
              <p>电话：<span>{{ item.mobile }}</span></p>
            </div>
            <div class="right">
              <span class="action" @click="do_address_edit(item)">编辑</span>
              <span class="action" @click="do_address_delete(item.id)">删除</span>
            </div>
          </div>
        </div>

        <el-empty v-if="!list_address.length" description="尚未添加地址"></el-empty>
      </div>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" title="添加收款账户" width="500px">
      <el-form ref="ruleForm" :model="form" :rules="rules" class="demo-ruleForm" label-position="right"
               label-width="120px">
        <el-form-item label="收款单位名称" prop="company_name">
          <el-input v-model="form.company_name" placeholder="请输入收款单位名称"></el-input>
        </el-form-item>
        <el-form-item label="收款单位号码" prop="account">
          <el-input v-model="form.account" placeholder="请输入收款单位号码"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bank">
          <el-input v-model="form.bank" placeholder="请输入开户银行"></el-input>
        </el-form-item>
        <el-form-item label="单位地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入单位地址"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {mapState} from "vuex";

export default {
  name: "servicePage",
  data() {
    return {
      pagination: {
        page: 1,
        pageNum: 100,
      },
      list_address: [],
      form: {},
      rules: {
        company_name: [
          {required: true, message: '请输入收款单位名称', trigger: 'blur'},
        ],
        account: [
          {required: true, message: '请输入收款单位号码', trigger: 'blur'},
        ],
        bank: [
          {required: true, message: '请输入开户银行', trigger: 'blur'},
        ],
        address: [
          {required: true, message: '请输入单位地址', trigger: 'blur'},
        ],
        mobile: [
          {required: true, message: '请输入电话', trigger: 'blur'},
        ],
      },
      dialogFormVisible: false
    };
  },
  computed: {
    ...mapState(["defaultAvatar"]),
  },
  mounted() {
    setTimeout(() => {
      this.setView();
    }, 500)
  },
  methods: {
    setView() {
      this.$api({
        url: 'supplyAccountList',
        method: 'post',
        data: {
          supply_user_id: this.baseInfo.id
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data.account_list

          this.list_address = data;
        }
      })

    },
    do_address_add() {
      this.dialogFormVisible = true;
    },
    do_address_edit(item) {
      this.form = item;
      this.dialogFormVisible = true;
    },
    do_address_delete(id) {
      this.$api({
        url: 'delAccount',
        method: 'post',
        data: {
          id: id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.setView();
        }
      });
    },
    clear() {
      this.form = {}
      this.dialogFormVisible = false;
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api({
            url: 'addAccount',
            method: 'post',
            data: {
              ...this.form,
              type: 1
            }
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('提交成功');
              this.dialogFormVisible = false;
              this.setView()
            }
          })
        } else {
          return false
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
.page {
  padding: 0;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      .flex();
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: @theme;
      color: #fff;
      background: #fff;
      color: @theme;
      font-size: 14px;
      // font-weight: bold;

      img {
        width: 20px;
      }

      .el-icon-circle-plus {
        font-size: 18px;
      }

      .add-text {
        margin-left: 5px;
      }
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 55px 32px;
    background: #fff;
  }
}

// 地址列表
.wrap-address {
  text-align: left;

  .address-item {
    border: 1px solid #F8E9D2;
    padding: 17px 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #FFFDF1;

    .left {
      p {
        font-weight: 400;
        font-size: 16px;
        color: #000000;
        margin-bottom: 10px;

        span {
          font-weight: 500;
          font-size: 16px;
          color: #000000;
        }
      }
    }

    .right {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: @theme;

      .action {
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/user/address-list.less"></style>
