<template>
  <div class="page">
    <div class="main-title">
      <span>全部考试</span>
    </div>
    <div class="page-ctx">
      <div class="tab-list">
        <div v-for="(item, index) in tabList" :key="index" :class="tabSelect.value == item.value ? 'active' : ''"
             class="tab-item" @click="do_toggle_tab(item)">
          {{ item.title }}
          <span v-if="item.num" class="number">{{ item.num }}</span>
        </div>
      </div>
      <div class="catalog-list" v-for="item in list" :key="item">
        <div class="title">
          <p>考试名称考试名称考试名称考试名称考试名称</p>
          <div class="start">进行中</div>
        </div>
        <div class="catalog-wrap">
          <div class="item">
            <span>考试次数：</span><span>5次</span>
          </div>
          <div class="item">
            <span>已考次数：</span><span>5次</span>
          </div>
          <div class="item">
            <span>剩余次数：</span><span>5次</span>
          </div>
          <div class="item">
            <span>考试总分：</span><span>5次</span>
          </div>
          <div class="item">
            <span>考试时长：</span><span>5次</span>
          </div>
        </div>
        <div class="action">
          <p>考试起止时间：2021-04-27 08:00 到 2021-04-30 08:00</p>
<!--          <el-button type="primary">开始考试</el-button>-->
          <el-button type="primary" @click="$router.push('my-exam-detail')">查看答题情况</el-button>
        </div>
        <div class="relevance">
          <p>关联课程：<span>师德师风建设，强化职业道德  --  第一节  标题名称标题名称标题名称标题名称</span></p>
          <p>完成度：100%</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: "my-exam",
  data() {
    return {
      tabSelect: {
        title: '全部',
        value: 0,
      },
      list: [1,2]
    };
  },
  computed: {
    tabList() {
      //orderStatus
      //订单状态：-1取消 1待支付 2待发货 3待收货 4已支付 5已完成(确认收货)
      let user_index = {} || this.user_index;
      let tabList = [
        {value: 0, title: "全部"},
        {value: 1, title: "已做的", num: user_index.order_num_1 || 0},
        {value: 2, title: "未做的", num: user_index.order_num_2 || 0},
        {value: 3, title: "进行中", num: user_index.order_num_3 || 0},
        {value: 5, title: "已结束", num: user_index.order_num_5 || 0},
      ];
      return tabList;
    },
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
    },
    do_toggle_tab(item) {
      this.tabSelect = item;
      this.pagination.page = 1;
      this.query_order();
    },
  },
};
</script>

<style scoped lang="less">
.user-avatar {
  object-fit: cover;
}

.page {
  text-align: left;
  padding-bottom: 80px;
  padding-top: 0;

  .main-title {
    .flex-between();
    padding: 0 30px;
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
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 14px;
    background: #fff;
    padding-bottom: 50px;

    .tab-list {
      .flex();
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: #7d7d7d;
      padding: 0 30px;
      border-bottom: 1px solid #e5e5e5;

      .tab-item {
        position: relative;
        // min-width: 96px;
        height: 48px;
        line-height: 48px;
        cursor: pointer;
        margin-right: 40px;

        .number {
          color: @theme;
        }

        &.active {
          // background: @theme;
          // color: #fff;
          font-weight: bold;
          color: @theme;

          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: @theme;
          }
        }
      }
    }

    .catalog-list {
      padding: 30px 30px 0;

      .title {
        display: flex;

        p {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 18px;
          color: #000825;
          margin-right: 8px;
        }

        .start {
          width: 60px;
          height: 25px;
          text-align: center;
          line-height: 25px;
          background-image: url('../../static/common/start.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;

          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 12px;
          color: #FFFFFF;
        }
      }

      .catalog-wrap {
        display: flex;
        flex-wrap: wrap;

        .item {
          width: 240px;
          line-height: 30px;

          span {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #000825;
          }

          span:last-child {
            color: #175E3D;
          }
        }
      }

      .action {
        display: flex;
        align-items: end;
        justify-content: space-between;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 14px;
        color: #666666;

        .el-button {
          width: 158px;
          height: 41px;
          background: #175E3D;
          border-radius: 223px 223px 223px 223px;
          border: none;
          padding: 0;
          line-height: 41px;
        }
      }

      .relevance {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        height: 38px;
        line-height: 38px;
        padding: 0 10px;
        background: #F5F6F6;
        border-radius: 6px;

        p {
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #9D9E9D;
          span {
            color: #23324F;
          }
        }
      }
    }
  }
}
</style>

