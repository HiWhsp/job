<template>
  <div class="page">
    <div class="main-title">
      <div class="left">我的充值</div>
    </div>

    <div class="value-info flex">
      <div class="value-item">
        <div class="value">¥{{info.yue||0}}</div>
        <div class="text-box">
          <div class="text">充值余额</div>
          <div class="btn fit-text" @click="$router.push('/balance')">
            去充值
          </div>
        </div>
      </div>
      <div class="value-item">
        <div class="value">{{info.count||0}}</div>
        <div class="text-box">
          <div class="text">使用订单</div>
        </div>
      </div>
    </div>

    <div class="page-ctx">
      <div class="wrap">
        <div class="inner">
          <div class="tab-box">
            <div
              class="tab-item"
              v-for="(item, index) in tab_list"
              :key="index"
              @click="tab_select = item"
              :class="item.title == tab_select.title ? 'active' : ''"
            >
              {{ item.title }}
            </div>
          </div>

          <div class="bottom-info">
            <div class="list-wrap">
              <div class="jilu-list">
                <div class="item item-title">
                  <div class="item-1">{{tab_select.status=="0"?"订单号/售后单号":"充值单号"}}</div>
                  <div class="item-2">{{tab_select.status=="0"?"下单/售后时间":"充值时间"}}</div>
                  <div class="item-3">{{tab_select.status=="0"?"金额":"实际支付金额"}}</div>
                  <!-- <div class="item-4" v-if="tab_select.status=='0'">操作</div> -->
                  <!-- <div class="item-5" v-if="tab_select.status=='1'">赠送金额</div>
                  <div class="item-4" v-if="tab_select.status=='1'">充值金额</div> -->
                </div>
                <div
                  class="item-box"
                  v-for="(item, index) in list_jilu"
                  :key="index"
                  @click="$router.push(`/order-detail?order_id=${order.id}`)"
                >
                  <div class="item item_other">
                    <div class="item-1">
                      <div class="text-1">{{ item.remark }}</div>
                    </div>
                    <div
                      class="item-2"
                    >
                      {{ item.createdTime }}
                    </div>
                    <div class="item-3">{{ item.price }}</div>
                    <!-- <div class="item-4">{{ item.createdTime }}</div> -->
                  </div>
                </div>
              </div>

              <div class="pagination-box" v-if="count">
                <el-pagination
                  background
                  layout="total, prev, pager, next"
                  :total="count"
                  :current-page="pagination.page"
                  :page-size="pagination.pageNum"
                  @current-change="mix_current_change"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "jifen-jilu",
  components: {},
  data() {
    return {
      tab_select: { title: "使用记录", status: "0" },
      tab_list: [
        { title: "使用记录", status: "0" },
        { title: "充值记录", status: "1" },
      ],
      list_jilu: [],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      info: {},
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {
    tab_select() {
      this.setView();
    },
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "money_lists",
          ...this.pagination,
          type: this.tab_select.status, //类型：0全部 1收入 2 支出
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.info = data;
          this.list_jilu = data.list;
          this.count = data.count;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #009f39;
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

.value-info {
  margin-top: 20px;

  background: #ffffff;
  .value-item {
    height: 185px;
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    
    &::before {
      content: "";
      right: 0;
      top: 43px;
      position: absolute;
      width: 1px;
      height: 96px;
      border-radius: 0px 0px 0px 0px;
      background: #d5d8de;
    }

    .value {
      font-family: Poppins, Poppins;
      font-weight: 400;
      font-size: 32px;
      color: #f74747;
    }
    .text-box {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .text {
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
      }
      .btn {
        margin-left: 16px;
        width: 84px;
        height: 31px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #ffaa2a;
        font-family: Poppins, Poppins;
        font-weight: 400;
        font-size: 16px;
        color: #ffaa2a;
      }
    }
  }
}

.tab-box {
  margin-top: 24px;
  flex: 2;
  // border-bottom: 1px solid #eee;

  display: flex;
  align-items: center;
  .tab-item {
    position: relative;
    cursor: pointer;
    padding-bottom: 10px;
    border-bottom: 3px solid transparent;
    margin-right: 55px;
    font-size: 14px;
    font-family: Poppins, Poppins;
    font-weight: 400;
    color: #333333;


    &.active {
      border-bottom: 3px solid #009f39;
      font-weight: bold;
      color: #009f39;
    }
  }
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    font-family: Poppins, Poppins;
    font-weight: 400;
    color: #1F1F1F;

    &:last-child {
    }
    &.item-title {
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
      font-family: Poppins, Poppins;
      font-weight: bold;
      color: #1F1F1F;
    }

    .item-1 {
      text-align: left;
      flex: 1;
      display: flex;
      align-items: center;

      .img-box {
        img {
          // width: 88px;
        }
      }

      .info-box {
        padding-left: 15px;
        .title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          font-size: 14px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          color: #333333;
          line-height: 24px;
        }
        .info {
          font-size: 14px;
          font-family: Poppins, Poppins;
          font-weight: 400;
          color: #505050;
        }
      }
    }
    .item-2 {
      width: 270px;
      &.val {
        font-size: 18px;
        font-family: Poppins, Poppins;
        font-weight: bold;
        // color: #fc5a00;
      }
    }

    .item-3 {
      width: 270px;
    }
    .item-4 {
      width: 150px;
    }
    .item-5 {
      width: 270px;
    }
    .item-6 {
      width: 270px;
    }
  }
}

.plus {
  color: #009f39;
  font-weight: bold;
}
.minus {
  color: #52c41a;
  font-weight: bold;
}
</style>

<style scoped lang="less" src="@/assets/h5css/huodong/pointsDetail.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
