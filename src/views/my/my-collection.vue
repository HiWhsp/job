<template>
  <div class="page">
    <div class="main-title">
      <span>我的收藏</span>
    </div>

    <div class="page-ctx">
      <div class="mess-list">
        <div class="mess-item" v-for="(item, index) in messList" :key="index">
          <div class="title-box">
            <div class="title">
              {{ item.feed_type }}
            </div>
            <div class="date">
              <img src="@/assets/img/ellsenn/share/collect-active.png" alt="" />
              取消收藏
            </div>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      messList: [
        {
          feed_type: "留言",
          dtTime: "2025-06-08 10:00:00",
          content: "这是一条留言",
        },
        {
          feed_type: "留言",
          dtTime: "2025-06-08 10:00:00",
          content: "这是一条留言",
        },
      ],
      pagination: {
        page: 1,
        page_num: 10,
      },
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api("index_getFeedback", {
        ...this.pagination,
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
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #000;
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 14px;
    padding: 32px 32px 40px 32px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;
  }
}

.mess-list {
  .mess-item {
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    margin-bottom: 20px;
    .title-box {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-weight: 500;
        font-size: 16px;
        color: #000;
      }

      .date {
        font-weight: 400;
        font-size: 14px;
        color: #7b8599;
        cursor: pointer;
      }
    }

    .content {
      color: #999999;
      font-size: 12px;
      margin-top: 15px;
    }
  }
}
</style>
