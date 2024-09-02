<template>
  <div class="page">
    <!-- 余额支付弹窗 -->
    <balance_password_set_modal ref="balance_password_set_modal" />

    <div class="main-title">
      <div class="left">余额明细</div>
    </div>

    <div class="page-ctx">
      <div class="yue-box">
        <div class="text-box">
          <div class="text-1">我的余额</div>
          <div class="text-2">
            {{ baseInfo.yue || 0 }}
            <span class="currency">元</span>
          </div>
          <div class="text-3">
            <!-- <button @click="$router.push('/chongzhijilu')">充值记录</button> -->
            <button @click="setYuePass">设置密码</button>
          </div>
        </div>
      </div>

      <div class="record-box">
        <div class="tab-box">
          <div
            class="tab-item"
            v-for="(item, index) in list_tab"
            :key="index"
            @click="tabToggle(item)"
            :class="status == item.status ? 'active' : ''"
          >
            {{ item.title }}
          </div>
        </div>

        <div class="data-box" v-if="yue_mingxi_list.length">
          <div class="mingxi-list">
            <div
              class="mingxi-item"
              v-for="(item, index) in yue_mingxi_list"
              :key="index"
            >
              <div class="mingxi-marker">
                <!-- <img src="@img/yue-plus.png" alt=""> -->
                <img src="@img/yue-minus.png" alt="" />
              </div>
              <div class="mingxi-ctx">
                <div class="mingxi-title">{{ item.remark }}</div>
                <div class="mingxi-desc">{{ item.orderInfo }}</div>
                <div class="mingxi-date">时间：{{ item.dtTime }}</div>
              </div>
              <div class="mingxi-value" :class="item.type == 2 ? 'plus' : 'minus'">
                <!-- <span class="plus">2400.00</span> -->
                <span>{{ item.type == 2 ? "+" : "" }}{{ item.money }}</span>
                元
              </div>
            </div>
          </div>
          <div class="pagination-box" style="margin-top: 40px">
            <el-pagination
              background
              layout="total, prev, pager, next"
              @current-change="changePage"
              :current-page.sync="pagination.page"
              :page-size="pagination.pageNum"
              :total="count"
            ></el-pagination>
          </div>
        </div>

        <div class="product-empty" v-if="!yue_mingxi_list.length">
          <el-empty description="没有查询到相关信息..."></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import balance_password_set_modal from "@/components/payment/balance_password_set_modal.vue";

import { mapState } from "vuex";
export default {
  name: "User",
  components: {
    balance_password_set_modal,
  },
  data() {
    return {
      list_tab: [
        { title: "全部", status: "0" },
        { title: "收入", status: "2" },
        { title: "支出", status: "1" },
      ],
      status: 0,

      yue_mingxi_list: [],
      count: 0,
      pagination: {
        page: 1, //当前页
        pageNum: 10, //每页数量
      }, //分页器
    };
  },
  computed: {
    ...mapState(["baseInfo", "webConfig"]),
  },
  watch: {
    status() {
      this.setView();
    },
  },
  created() {
    this.$store.dispatch("query_user");
    this.setView();
  },

  methods: {
    tabToggle(item) {
      this.status = +item.status;
    },
    setView() {
      this.$api("users_moneyRecord", {
        type: this.status, //类型(0所有   1消费   2收入    3提现)
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          this.yue_mingxi_list = data;
          this.count = res.count;
        }
      });
    },

    setYuePass() {
      this.$refs.balance_password_set_modal.init(this.baseInfo);
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
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
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #4CA5E4;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 55px 32px;
    background: #fff;
  }
}

.yue-box {
  position: relative;
  width: 100%;
  height: 142px;
  background: url(~@img/yue-bg.png) no-repeat center / cover;
  background-size: 100% 100%;
  padding-left: 40px;
  padding-left: 40px;
  flex-direction: column;
  .flex-center();
  align-items: flex-start;

  .text-box {
    text-align: left;
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
    margin-right: 60px;

    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    &.active {
      border-bottom: 3px solid #4CA5E4;
      font-weight: bold;
      color: #4CA5E4;
    }
  }
}

.mingxi-list {
  margin-top: 24px;
  border: 1px solid #e5e5e5;
  .mingxi-item {
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;

    &:last-child {
      border-bottom: none;
    }
    .mingxi-marker {
      img {
        width: 32px;
      }
    }
    .mingxi-ctx {
      flex: 1;
      padding: 0 32px;
      .mingxi-title {
        font-size: 14px;
        color: #333333;
      }

      .mingxi-desc {
        margin: 10px 0;
        font-size: 14px;
        color: #999999;
      }
      .mingxi-date {
        font-size: 14px;
        color: #999999;
      }
    }
    .mingxi-value {
      span {
        font-size: 24px;
      }
      &.plus {
        color: #4CA5E4;
      }

      &.minus {
        color: #8cc63f;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/yueMingxi.less"></style>
