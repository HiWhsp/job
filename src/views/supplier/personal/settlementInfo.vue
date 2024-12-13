<template>
  <div class="page">
    <div class="main-title">
      <span>结算信息</span>
      <el-button type="primary" @click="do_address_add()">
        <span class="add-text">新增结算账户</span>
      </el-button>
    </div>

    <div class="page-ctx">
      <div class="center">
        <div class="wrap-address">
          <div class="address-item" v-for="(item, index) in list_address" :key="index">
            <div class="top">
              <div>
                <span>结算方式：</span>
                {{ item.type == 1 ? '对公' : '个人' }}
              </div>
              <div>
                <span>开户行：</span>
                {{ item.bank_title }}
              </div>
              <div>
                <span>账号：</span>
                {{ item.bank_no }}
              </div>
              <div>
                <span>户名：</span>
                {{ item.bank_name }}
              </div>
            </div>
            <div class="bottom">
              <div class="left">
                <span v-if="item.is_default == 1" class="moren">默认结算账户</span>
              </div>
              <div class="right">
                <span class="action" v-if="item.is_default != 1"
                      @click="do_address_set_default(item)">设置为默认结算账户</span>
                <span class="action" @click="do_address_edit(item)">编辑</span>
                <span class="action" @click="do_address_delete(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="!list_address.length" description="尚未添加结算账户"></el-empty>
      </div>
    </div>

    <!--    新增/修改设备-->
    <el-dialog title="新增设备" :visible.sync="addDialogVisible" width="900px" center @close="addDialogClose">
      <div class="settlement-box">
        <el-form :model="addRuleForm" :rules="addRules" ref="ruleForm" label-width="100px">
          <el-form-item label="结算方式：" prop="type">
            <el-select v-model="addRuleForm.type" placeholder="请选择结算方式（对公户/个人银行卡）">
              <el-option label="对公" :value="1"></el-option>
              <el-option label="个人" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开户行：" prop="bank_title">
            <el-input v-model="addRuleForm.bank_title" placeholder="请填入开户行"></el-input>
          </el-form-item>
          <el-form-item label="账号：" prop="bank_no">
            <el-input v-model="addRuleForm.bank_no" placeholder="请填入账号"></el-input>
          </el-form-item>
          <el-form-item label="户名：" prop="bank_name">
            <el-input v-model="addRuleForm.bank_name" placeholder="请填入户名"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDialogVisibleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {mapState} from "vuex";

export default {
  name: "settlementInfo",
  data() {
    return {
      pagination: {
        page: 1,
        limit: 100,
      },
      addDialogVisible: false,
      list_address: [],
      addRuleForm: {},
      addRules: {
        type: [
          {required: true, message: '请选择结算方式（对公户/个人银行卡）', trigger: 'change'}
        ],
        bank_title: [
          {required: true, message: '请填入开户行', trigger: 'blur'}
        ],
        bank_no: [
          {required: true, message: '请填入账号', trigger: 'blur'}
        ],
        bank_name: [
          {required: true, message: '请填入户名', trigger: 'blur'}
        ],
      }
    };
  },
  computed: {
    ...mapState(["defaultAvatar"]),
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'store/bank_list',
        method: 'post',
        data: {
          ...this.pagination,
        },
      }).then(res => {
        if (res.code == 200) {
          let data = res.data

          data.forEach((v) => {
            v.full_addr = [v.country, v.province, v.city, v.area].filter(v => !!v).join('-');
          });

          this.list_address = data;

          let obj = data.find((v) => v.if_default) || {};
        }
      })

    },
    do_address_add() {
      this.addDialogVisible = true
    },
    do_address_edit(item) {
      this.addRuleForm = {...item};
      this.addDialogVisible = true
    },

    addDialogVisibleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api({
            url: 'store/edit_bank',
            method: 'post',
            data: {
              ...this.addRuleForm,
            },
          }).then((res) => {
            if (res.code == 200) {
              alertSucc(res.msg)
              this.addDialogVisible = false;
              this.setView();
            }
          });
        }
      });
    },
    addDialogClose() {
      this.addRuleForm = {};
    },
    do_address_delete(id) {
      this.$api({
        url: 'store/delete_bank',
        method: 'post',
        data: {
          id: id,
        },
      }).then((res) => {
        if (res.code == 200) {
          alertSucc(res.msg)
          this.setView();
        }
      });
    },
    //设置默认地址
    do_address_set_default(row) {
      const params = {
        ...row
      }
      params.is_default = 1;
      this.$api({
        url: 'store/edit_bank',
        method: 'post',
        data: {
          ...params
        },
      }).then((res) => {
        if (res.code == 200) {
          alertSucc(res.msg)
          this.setView();
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  padding: 0;
  margin: 0;
  width: 100%;

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
    border-bottom: 1px solid #E8E8E8;

    button {
      .flex();
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: @theme;
      color: #fff;
      font-size: 14px;
      border: none;

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
    padding: 32px 170px 32px;
    background: #fff;
  }
}

.settlement-box {
  padding: 0 150px;

  .el-select {
    width: 100%;
  }
}

/deep/ .el-button--primary {
  background: @theme;
  border-color: @theme;
  color: #fff;
}

// 地址列表
.wrap-address {
  text-align: left;

  .address-item {
    min-height: 190px;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    padding: 20px;
    margin-bottom: 20px;

    .top {
      padding-bottom: 20px;

      > div {
        margin-bottom: 10px;
        color: #333333;

        &:last-child {
          margin-bottom: 0;
        }

        span {
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #666666;
        }
      }
    }

    .bottom {
      .flex-between();
      border-top: 1px solid #eeeeee;
      padding-top: 20px;

      .left {
        .moren {
          display: inline-block;
          width: 104px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          // background: rgba(255, 90, 0, 0.68);
          background: @theme;
          font-size: 14px;
          color: #ffffff;
        }
      }

      .right {
        padding-right: 14px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: @theme;

        .action {
          margin-left: 75px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/address-list.less"></style>
