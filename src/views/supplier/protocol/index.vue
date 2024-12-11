<script>

export default {
  name: "message",
  data() {
    return {
      keyword: '', // 搜索
      count: 0,
      pagination: {
        page: 1,
        limit: 10
      },
      detail: {},
      listData: [],
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'article_list',
        method: 'post',
        data: {
          column_id: this.detail.id || '',
          ...this.pagination,
        },
      }).then(res => {
        if (res.code == 200) {
          this.listData = res.data;
          this.count = res.count;
        }
      })
    },
    setDetail(item) {
      this.$api({
        url: 'article_detail',
        method: 'post',
        data: {
          id: item.id || '',
        },
      }).then(res => {
        if (res.code == 200) {
          this.detail = res.data;
        }
      })
    },
    goUrl(item) {
      this.$router.push(item.url);
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="filter">
      <div class="left">平台协议</div>
      <div class="right">
        <el-button type="primary" class="search-btn" @click="detail = {}" v-if="Object.keys(detail).length">返回
        </el-button>
      </div>
    </div>

    <div class="content">
      <div class="list">
        <div class="post-card" v-for="(item, index) in listData" :key="index" v-if="!Object.keys(detail).length">
          <div class="title-box" @click="setDetail(item)">
            <div class="content">{{ item.title }}</div>
            <div class="date">{{ item.created_at }}</div>
          </div>
        </div>
      </div>
      <div class="detail" v-if="Object.keys(detail).length">
        <p class="title">{{ detail.title }}</p>
        <p class="date">{{ detail.created_at }}</p>
        <p class="desc" v-html="detail.content"></p>

        <!--        <div class="to">-->
        <!--          <div class="btn">上一篇 这里是消息标题</div>-->
        <!--          <div class="btn">下一篇 这里是消息标题</div>-->
        <!--        </div>-->
      </div>

      <div v-if="count && !Object.keys(detail).length" class="pagination-box"
           style="margin-top: 40px; text-align: center;">
        <el-pagination background layout="total, prev, pager, next" @current-change="setView"
                       :current-page.sync="pagination.page" :page-size="pagination.limit"
                       :total="count"></el-pagination>
      </div>
      <el-empty v-if="!count" description="没有查询到信息..."></el-empty>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  background-color: #fff;
  padding-bottom: 100px;
  padding-top: 0;
}

.filter {
  padding: 0 30px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  border-bottom: 1px solid #E8E8E8;

  .left {
    font-weight: 400;
    font-size: 18px;
    color: #212529;
  }

  .right {
    .search-bar {
      width: 500px; /* 根据需要调整宽度 */
      display: flex;
      align-items: center;

      .search-input {
        width: 100%;

        /deep/ .el-input__inner {
          border: 1px solid #00479D;
          border-radius: 0;
        }

        /deep/ .el-input-group__append {
          background-color: #00479D; /* 蓝色搜索按钮背景 */
          border-radius: 0;
          border: 1px solid #00479D;
        }
      }

      .search-btn {
        //background-color: #00479D; /* 蓝色搜索按钮背景 */
        color: #fff;
        border-radius: 0;
      }

      .post-btn {
        margin-left: 15px;
        background-color: #00479D; /* 发帖按钮背景 */
        border-radius: 0;
        color: white;
      }
    }
  }
}

.tab-box {
  margin-top: 24px;
  margin-bottom: 32px;
  .flex();
  justify-content: center;

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

.content {
  padding: 0 30px;

  .list {
    .post-card {
      padding: 0 200px;
      margin-bottom: 30px;

      .title-box {
        .flex-between();
        position: relative;
        cursor: pointer;

        &:hover {
          .content {
            color: @theme;

            &:before {
              background: @theme;
            }
          }
        }

        .content {
          width: 730px;
          font-size: 14px;

          &:before {
            content: "";
            display: inline-block;
            width: 10px;
            height: 10px;
            background: #E4E4E4;
            border-radius: 50%;
            margin-right: 10px;
          }
        }

        .date {
          width: 150px;
          font-weight: 400;
          font-size: 14px;
          color: #999999;
        }
      }
    }
  }

  .detail {
    padding: 0 150px;

    .title {
      font-weight: 400;
      font-size: 22px;
      color: #000000;
      margin-bottom: 25px;
    }

    .date {
      font-weight: 400;
      font-size: 16px;
      color: #6A7AA1;
      margin-bottom: 40px;
    }

    .to {
      margin-top: 100px;
      display: flex;
      justify-content: space-between;

      .btn {
        cursor: pointer;
        font-weight: 400;
        font-size: 14px;
        color: #555555;

        &:hover {
          color: @theme;
        }
      }
    }
  }
}

.el-button--primary {
  background-color: #00479D;
  border: none;
}
</style>
