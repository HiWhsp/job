<template>
  <div class="page">
    <div class="main-title">
      <span>我的消息</span>
    </div>

    <div class="page-ctx">
      <div class="mess-list">
        <div class="mess-item" v-for="(item, index) in messList" :key="index">
          <div class="title-box">
            <div class="content">
              {{ item.msg }}
            </div>
            <div class="date">
              {{ item.created_at }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="count"
        class="pagination-box"
        style="margin-top: 40px; text-align: right"
      >
        <el-pagination
          background
          layout="total, prev, pager, next"
          @current-change="setView"
          :current-page.sync="pagination.page"
          :page-size="pagination.pageNum"
          :total="count"
        ></el-pagination>
      </div>
      <el-empty v-if="!count" description="暂无消息..."></el-empty>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "myMessage",
  components: {},
  data() {
    return {
      count: 0,
      messList: [],
      pagination: {
        page: 1,
        pageNum: 10,
      },
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {},
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "myMsg",
        method: "get",
      }).then((res) => {
        this.messList = res.data;
        this.count = res.data.length;
      });
    },
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
        background: #e4e4e4;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
}

.tab-box {
  .flex-between();
  background: #ffffff;
  border-bottom: 1px solid #d9d9d9;

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
}
</style>
