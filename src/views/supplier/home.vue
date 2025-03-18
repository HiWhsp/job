<template>
  <div class="page">
    <div class="section-box">
      <div class="section-1">
        <div class="left">
          <div class="img-box">
            <div>
              <img src="@/assets/img/my/avatar.png" alt/>
            </div>
            <div class="name">
              {{ baseInfo.name || "无" }}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="text-1">{{ baseInfo.phone || "****" }}</div>
          <div class="text-2">
            <span>{{ "普通会员" }}</span>
          </div>
        </div>
      </div>

      <div class="section-2">
        <div class="list">
          <div class="item" @click="$router.push('/transit-order')">
            <div class="val">
              <span>{{ user_index.top4_jinriyy || "0" }}</span>
            </div>
            <div class="label">今日寄样</div>
          </div>
          <div class="item" @click="$router.push('/waitUploadResult-order')">
            <div class="val">
              <span>{{ user_index.top4_daishiyan || "0" }}</span>
            </div>
            <div class="label">待实验</div>
          </div>
          <div class="item" @click="$router.push('/overdue-order')">
            <div class="val">
              <span>{{ user_index.top4_jjcq || "0" }}</span>
            </div>
            <div class="label">即将超期</div>
          </div>
          <div class="item" @click="$router.push('/sampleRecovery-order')">
            <div class="val">
              <span>{{ user_index.top4_daihuishou || "0" }}</span>
            </div>
            <div class="label">待回收</div>
          </div>
        </div>
      </div>
    </div>

    <div class="money-box">
      <div class="item">
        <div class="info">
          <span class="tit">待结算金额</span>
          <span class="val">{{ user_index.c4_daijisuan }}</span>
        </div>
        <div class="box">
          <p class="pointer" @click="$router.push('/waitSettlement-order')">申请结算</p>
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="tit">已结算金额</span>
          <span class="val">{{ user_index.c4_yijiesuan }}</span>
        </div>
        <div class="box">
          <p class="pointer" @click="$router.push('/finish-order')">查看详情</p>
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="tit">可结算订单</span>
          <span class="val">{{ user_index.c4_kejieorder }}</span>
        </div>
        <div class="box">
          <p class="pointer" @click="$router.push('/waitSettlement-order')">申请结算</p>
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="tit">当月好评率</span>
          <span class="val">{{ user_index.c4_haoping }}%</span>
        </div>
        <div class="box flex">
          <p>当月差评率 <span>{{ user_index.c4_chaping }}%</span></p>
          <p class="pointer" style="margin-left: 10px;"><span>查看详情</span></p>
        </div>
      </div>
    </div>

    <div class="section-order">
      <div class="section-title">
        <div class="label">消息中心</div>
        <router-link to="/message-list" class="action">
          <span>查看更多</span>
          <img src="@/assets/img/supplier/more.png" alt/>
        </router-link>
      </div>

      <div class="order-box">
        <div class="empty-info" v-if="!list_order.length">
          <div class="empty-img">
            <img src="@/assets/img/my/empty-img.png" alt=""/>
          </div>
          <div class="empty-text">暂无消息</div>
        </div>
        <div class="order-info" v-else>
          <div class="info-item" v-for="(item, index) in list_order" :key="index">
            <span>{{ item.title }}</span>
            <span class="date">{{ item.created_at }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      pagination: {
        page: "1",
        limit: "8",
      },
      count: 0,
      my_info: {},
      user_index: {}, //用户首页数据
      list_order: [], // 消息
    };
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.query_userIndex();
      this.query_order();
    },
    // 供应商主页数据
    query_userIndex() {
      this.$api({
        url: 'store/my_index',
        method: 'post',
        data: {},
      }).then(res => {
        if (res.code === 200) {
          this.user_index = res.data;
        }
      })
    },
    // 消息查询
    query_order() {
      this.$api({
        url: 'store/message_list',
        method: 'post',
        data: {
          status: 0,
          ...this.pagination
        },
      }).then(res => {
        if (res.code === 200) {
          this.list_order = res.data;
        }
      })
    }
  },
};
</script>

<style scoped lang="less">

.section-box {
  .flex();
}

.section-1 {
  .flex-center();
  position: relative;
  background: #ffffff url("~@/assets/img/supplier/user-bg.png");
  background-size: 100% 100%;
  padding: 0 15px;
  width: 256px;
  height: 210px;

  .left {
    height: calc(100% - 48px);

    .img-box {
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .name {
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .right {
    .flex-between();
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    background: #ffffff;
    text-align: left;
    padding: 0 15px;
    border: 1px solid @theme;
    border-radius: 0 0 11px 11px;

    .text-1 {
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #333333;
    }

    .text-2 {
      .flex();

      img {
        width: 24px;
        margin-right: 5px;
      }

      span {
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}

.section-2 {
  flex: 1;

  .list {
    .flex-between();
    height: 185px;
    background: #ffffff;
    border: 1px solid #eee9e4;

    .item {
      text-align: center;
      width: 25%;
      padding: 10px 0;
      border-right: 1px solid #d5d8de;
      // margin-left: 40px;
      // margin-right: 40px;
      font-size: 16px;
      cursor: pointer;

      &:last-child {
        border-right: none;
      }

      .label {
        margin-top: 20px;
        font-size: 16px;
        font-family: Roboto, Roboto;
        font-weight: normal;
        color: #333333;
      }

      .val {
        span {
          // margin-left: 5px;
          font-size: 32px;
          font-family: Roboto, Roboto;
          font-weight: normal;
          color: @theme;
        }
      }
    }
  }
}

.money-box {
  display: flex;
  justify-content: space-between;
  margin-top: 35px;
  margin-bottom: 30px;

  .item {
    width: 340px;
    height: 130px;
    background: #FFFFFF;
    border-radius: 7px 7px 7px 7px;
    border: 1px solid #D6D6D6;

    .info {
      padding-left: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid #D6D6D6;
      height: 100px;

      .tit {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }

      .val {
        margin-top: 5px;
        font-weight: bold;
        font-size: 23px;
        color: #00479D;
      }
    }

    .box {
      padding-left: 30px;
      line-height: 30px;
      height: 30px;
    }
  }
}

.page {
  width: 100%;
  margin: 0;
  padding: 50px 130px;
}

.section-title {
  border-bottom: 1px solid #dedede;
  .flex-between();
  height: 56px;
  padding: 0 32px;

  .label {
    font-size: 18px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    color: #333333;
  }

  .action {
    .flex();
    font-size: 14px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    color: @theme;
    cursor: pointer;

    img {
      width: 14px;
      margin-left: 10px;
    }
  }
}

.section-order {
  margin: 25px 0;
  background: #fff;
  border: 1px solid #D6D6D6;
  border-radius: 8px;

  .order-box {
    padding: 0 105px;

    .empty-info {
      text-align: center;
      padding: 40px 0;

      // border-top: 1px solid #dedede;
      .empty-img {
        text-align: center;

        img {
          width: 190px;
        }
      }

      .empty-text {
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #999999;
      }

      .empty-action {
        font-size: 14px;
        color: @theme;
      }
    }
  }

  .order-info {
    padding: 20px 0;

    .info-item {
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #D6D6D6;
      display: flex;
      justify-content: space-between;

      span {
        width: 500px;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        cursor: pointer;

        &:hover {
          color: @theme;
        }
      }

      .date {
        width: 128px;
        font-weight: 400;
        font-size: 14px;
        color: #7E7E7E;
      }
    }
  }
}

.suggest-goods {
  background: #fff;

  .list-wrap {
    padding: 40px 30px;
  }

  /deep/ .product-list {
    .product-item {
      // margin-right: 23px;

      &:nth-child(4n) {
        // margin-right: 0;
      }

      &:nth-child(5) {
        // margin-top: 50px;
      }
    }
  }
}
</style>
