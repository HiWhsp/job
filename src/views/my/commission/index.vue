<template>
  <div class="page">

    <div class="main-title">
      <div class="left">我的佣金</div>
      <div class="money">
        <img src="@/assets/img/my/order/preSave.png" alt="">
        <span>{{ baseInfo.rebate }}</span>
      </div>
      <div class="flex">
        <div class="btn" @click="commissionVisible = true">立即提现</div>
      </div>
    </div>

    <div class="page-ctx">
      <div class="wrap">
        <div class="inner">
          <div class="flex">
            <div class="tab-box">
              <div
                  class="tab-item"
                  v-for="(item, index) in list_tab"
                  :key="index"
                  @click="selectTab = item"
                  :class="item.title == selectTab.title ? 'active' : ''"
              >
                {{ item.title }}
              </div>
            </div>
            <div class="my-you" @click="goUrl({url: '/invite'})">我的好友 ></div>
          </div>

          <div class="bottom-info">
            <div class="list-wrap" v-if="count">
              <div class="jilu-list">
                <div class="item item-title">
                  <div class="item-1">来源/用途</div>
                  <div class="item-2">时间</div>
                  <div class="item-3">数额</div>
                  <div class="item-4">剩余积分</div>
                </div>

                <div class="item-box" v-for="(item, index) in list_jilu" :key="index">
                  <div class="item item_other">
                    <div class="item-1">
                      <div class="text-1">{{ item.title }}</div>
                    </div>
                    <div class="item-3">{{ item.created_at }}</div>
                    <div class="item-2 val"
                         :class="{ plus: item.type == 1, minus: item.type == 2 }">
                      {{ item.type == 1 ? "+" : "" }}{{ item.money }}
                    </div>
                    <div class="item-4">
                      {{ item.before_money }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="pagination-box" v-if="count">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :total="count"
                    :current-page.sync="pagination.page"
                    :page-size.sync="pagination.limit"
                    @current-change="changePage"
                >
                </el-pagination>
              </div>
            </div>
            <el-empty v-else description="暂无记录..."></el-empty>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="佣金提现" :visible.sync="commissionVisible" center width="950px" @close="isReal = false">
      <div class="real-content" v-if="!isReal">
        <div class="tip">
          提示：请确认自己的收款人姓名和支付宝账号无误并已通过支付宝实名认证。未实名认证将导致您的提现不到账，请知悉。
        </div>
        <el-form :model="realForm" :rules="realRules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="realForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="支付宝账号：" prop="name">
            <el-input v-model="realForm.account" placeholder="请输入支付宝账号"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="real-content" v-else>
        <div class="flex" style="flex-direction: column; justify-content: center">
          <img src="@/assets/img/base/appointment/pay-success.png" alt="">
          <h3>佣金提现提交成功</h3>
          <span class="text">请耐心等待管理员审核！</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!isReal">
        <el-button @click="commissionVisible = false">取消</el-button>
        <el-button type="primary" @click="commissionVisibleSubmit">提交</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if="isReal">
        <el-button type="primary" @click="commissionVisible = false">继续浏览</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import {mapState} from "vuex";

export default {
  name: "index",
  data() {
    return {
      isReal: false,
      selectTab: {title: "全部明细", status: "0"},
      commissionVisible: false,
      realForm: {},
      realRules: {
        name: [
          {required: true, message: '请输入支付宝姓名', trigger: 'blur'},
        ],
        account: [
          {required: true, message: '请输入支付宝账号', trigger: 'blur'},
        ],
      },

      //type   1-收入  2-支出
      list_tab: [
        {title: "全部明细", status: "0"},
        {title: "收入记录", status: "1"},
        {title: "提现记录", status: "2"},
      ],
      list_jilu: [],

      pagination: {
        page: 1,
        limit: 10,
      },
      count: 0,
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {
    selectTab() {
      this.setView();
    },
  },
  created() {
    this.$store.dispatch("query_user");
    this.setView();
  },

  methods: {
    setView() {
      this.$api({
        url: 'rebate_detail_list',
        method: 'post',
        data: {
          ...this.pagination,
          type: this.selectTab.status, //类型：0-全部   1-收入  2-支出
        }
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          this.list_jilu = data;
          this.count = count;
        }
      });
    },
    goUrl(item) {
      this.$router.push(item.url);
    },
    commissionVisibleSubmit() {
      if(this.baseInfo.rebate == 0) {
        alertSucc("您的佣金为0，无法提现!");
        return
      }
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$api({
            url: 'rebate_withdraw',
            method: 'post',
            data: {
              ...this.realForm
            }
          }).then(res => {
            alertSucc(res.msg);
            this.isReal = true;
            this.$refs.ruleForm.resetFields();
          })
        } else {
          return false;
        }
      });
    }
  },
};
</script>

<style scoped lang="less">
.plus {
  color: #FC5A00;
  font-weight: bold;
}

.minus {
  color: #52c41a;
  font-weight: bold;
}

.page {
  text-align: left;
  width: 100%;
  padding: 0;

  .main-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 360px;
    background: url(~@/assets/img/my/order/preSave-bg.png) no-repeat 100% 100%;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    line-height: 40px;
    color: #fff;

    .left {
      font-weight: bold;
      font-size: 16px;
      color: #333333;
    }

    .money {
      .flex();

      span {
        font-weight: bold;
        font-size: 34px;
        color: #292929;
      }

      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
    }

    .desc {
      font-weight: 400;
      font-size: 16px;
      color: #00479D;
    }

    .btn {
      margin-top: 25px;
      cursor: pointer;
      width: 112px;
      height: 43px;
      line-height: 43px;
      text-align: center;
      background: linear-gradient(180deg, #FFFFFF 0%, #E5E5E5 100%);
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #CCCCCC;

      font-weight: 400;
      font-size: 16px;
      color: #282828;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 10px 30px;
    background: #fff;
  }
}

.yue-box {
  position: relative;
  width: 100%;
  height: 142px;
  //background: url(~@/static/order/jifen-bg.png) no-repeat center / cover;
  background-size: 100% 100%;
  flex-direction: column;
  .flex-center();
  justify-content: center;
  align-items: center;

  .text-box {
    text-align: center;

    .text-1 {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 40px;
      color: #ffffff;
    }

    .text-2 {
      margin-top: 10px;

      font-size: 40px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 40px;
      color: #ffffff;

      .currency {
        font-size: 18px;
      }
    }

    .text-3 {
      position: absolute;
      right: 24px;
      bottom: 20px;

      button {
        border-radius: 20px;
        width: 128px;
        height: 34px;
        line-height: 34px;
        background: rgba(255, 255, 255, 0.78);
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;

        color: #666;
      }
    }
  }
}

.tab-box {
  margin-top: 24px;
  flex: 2;
  // border-bottom: 1px solid #eee;

  .flex();

  .tab-item {
    cursor: pointer;
    padding-bottom: 10px;
    border-bottom: 3px solid transparent;
    margin-right: 55px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    &.active {
      border-bottom: 3px solid @theme;
      font-weight: bold;
      color: @theme;
    }
  }
}

.my-you {
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  color: #333333;
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}

.jilu-list {
  margin-bottom: 30px;
  border: 1px solid #e5e5e5;

  .item {
    text-align: center;
    .flex-between();
    padding: 20px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #666666;

    &:last-child {
    }

    &.item-title {
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #666666;
    }

    .item-1 {
      text-align: left;
      flex: 1;
      .flex();

      .img-box {
        img {
          // width: 88px;
        }
      }

      .info-box {
        padding-left: 15px;

        .title {
          .ellipsis-2();
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
          line-height: 24px;
        }

        .info {
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #999999;
        }
      }
    }

    .item-2 {
      width: 150px;

      &.val {
        font-size: 18px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        // color: #fc5a00;
      }
    }

    .item-3 {
      width: 200px;
    }

    .item-4 {
      width: 150px;
    }
  }
}

.real-content {
  .tip {
    padding-left: 46px;
    height: 42px;
    line-height: 42px;
    background: #FFF7F7;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .tit {
    margin-top: 20px;
    padding-left: 46px;
    font-weight: 400;
    font-size: 14px;
    color: #999999;
  }

  .demo-ruleForm {
    margin-top: 40px;
    padding: 0 180px;
  }

  .upload-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 100px;
    background: #FFFFFF;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #DEDEDE;
  }

  img {
    width: 320px;
    height: 225px;
  }

  h3 {
    font-weight: bold;
    font-size: 20px;
    color: #282828;
  }

  .text {
    margin-top: 28px;
    font-weight: 400;
    font-size: 14px;
    color: #FF0000;
  }
}

.real-info {
  display: flex;
  flex-direction: column;
  align-items: center;

  .item {
    display: flex;
    align-items: start;
    margin-bottom: 30px;

    .label {
      width: 220px;
      text-align: right;
    }

    .value {
      padding-left: 20px;
      width: 350px;
    }
  }
}

.el-button--primary {
  background-color: #00479D;
  border: none;
}
</style>

