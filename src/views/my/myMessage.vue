<template>
  <div class="page">
    <div class="main-title">
      <span>我的消息</span>
    </div>

    <div class="page-ctx">
      <div class="tab-box">
        <div class="tab-list">
          <div v-for="(item, index) in tabList" :key="index" class="tab-item"
               :class="tabSelect.value == item.value ? 'active' : ''" @click="do_toggle_tab(item)">
            {{ item.title }}
            <span class="number" v-if="item.num">{{ item.num }}</span>
          </div>
        </div>
        <div class="search-box">
          <button class="lock btn" @click="do_mark_read()">全部标记已读</button>
          <button class="clear btn">清空</button>
        </div>
      </div>

      <div class="mess-list">
        <div class="mess-item" v-for="(item, index) in messList" :key="index">
          <div class="title-box">
            <div class="content">
              {{ item.content }}
            </div>
            <div class="date">
              {{ item.dtTime }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="count" class="pagination-box" style="margin-top: 40px; text-align: right;">
        <el-pagination background layout="total, prev, pager, next" @current-change="setView"
                       :current-page.sync="pagination.page" :page-size="pagination.pageNum"
                       :total="count"></el-pagination>
      </div>
      <el-empty v-if="!count" description="没有查询到订单信息..."></el-empty>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "myMessage",
  components: {},
  data() {
    return {
      count: 0,
      tabSelect: {
        title: '未读',
        value: 1,
      },
      messList: [],
      pagination: {
        page: 1,
        pageNum: 10
      },
      tabList: [
        {value: 1, title: "未读"},
        {value: 0, title: "全部"}
      ]
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api("users_msgRecord", {
        ...this.pagination,
        scene: this.tabSelect.value
      }).then((res) => {
        this.messList = res.data.list
        this.count = res.data.count;
      });
    },

    do_toggle_tab(item) {
      this.tabSelect = item;
      this.pagination.page = 1;
      this.setView();
    },
    // 标记已读
    do_mark_read() {
      if (this.messList.length == 0) {
        alertErr("没有可标记的消息")
        return
      }
      this.$api("users_msgRead", {
        ids: this.messList.map(v => v.id).join(",")
      }).then(res => {
        if (res.code == 200) {
          alertSucc(res.msg)
          this.setView();
        }
      })
    }
  },
};
</script>

<style scoped lang="less">
.page {
  padding-bottom: 80px;
  padding-top: 0;

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
      background: @theme;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 14px;
    padding: 8px 32px 40px 32px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 40px;
  }
}

.mess-list {
  .mess-item {
    border-bottom: 1px solid #ddd;
    padding: 25px 0;

    .title-box {
      .flex-between();
      position: relative;

      .content {
        width: 730px;
        font-size: 14px;
      }

      .date {
        width: 150px;
        font-weight: 400;
        font-size: 14px;
        color: #999999;
      }

      &:before {
        content: "";
        display: inline-block;
        width: 5px;
        height: 5px;
        background: #E4E4E4;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
}

.tab-box {
  .flex-between();
  background: #ffffff;
  border-bottom: 1px solid #D9D9D9;

  .tab-list {
    .flex();
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: #7d7d7d;

    .tab-item {
      position: relative;
      width: 84px;
      height: 48px;
      line-height: 48px;
      cursor: pointer;
      margin-right: 40px;
      text-align: center;

      .number {
        color: @theme;
      }

      &.active {
        font-weight: bold;
        color: @theme;

        &::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background: @theme;
        }
      }
    }
  }

  .search-box {
    .flex();
    align-items: center;
    justify-content: end;
    min-width: 260px;
    height: 32px;

    button {
      width: 133px;
      height: 40px;
      border-radius: 4px 4px 4px 4px;
      background: #ffffff;
      color: #333;
      border: 1px solid #EFEFEF;
    }

    .lock {
      background: #F4A116;
      color: #fff;
      border: 1px solid #F4A116;
    }

    .clear {
      margin-left: 10px;
      width: 74px;
      height: 40px;
      border-radius: 2px 2px 2px 2px;
    }
  }
}
</style>
