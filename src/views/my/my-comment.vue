<template>
  <div class="page">
    <div class="main-title">
      <span>我的评论</span>
    </div>

    <div class="page-ctx">
      <div class="mess-list">
        <div class="mess-item" v-for="(item, index) in messList" :key="index">
          <div class="user-info">
            <div class="user-avatar">
              <img :src="item.image || '/static/default-avatar.png'" alt="用户头像" />
            </div>
            <div class="user-details">
              <div class="user-meta">
                <div class="user-meta-left">
                  <span class="user-id">{{ item.name || "15810593012" }}</span>
                  <span class="comment-time">{{ item.time }}</span>
                </div>
                <div class="delete-btn" @click="deleteComment(item)">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path
                      fill="#999"
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </div>
              </div>
              <div class="comment-content">
                {{ item.content }}
              </div>
              <div class="related-paper" v-if="item.title">
                <span class="paper-label"
                  >评论{{ item.type == 1 ? "报告" : "资讯/测评" }}：</span
                >
                <span class="paper-title">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        style="margin-top: 20px; text-align: center"
        v-if="total > 0"
        :total="total"
        layout="prev, pager, next"
        :current-page="pagination.page"
        @current-change="handleCurrentChange"
      />
      <el-empty description="暂无数据" v-if="messList.length === 0" />
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
      messList: [],
      pagination: {
        page: 1,
        limit: 10,
      },
      total: 0,
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
      this.$api({
        url: "myComment",
        method: "get",
        data: this.pagination,
      }).then((res) => {
        if (res.code == 200) {
          this.messList = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.setView();
    },
    deleteComment(item) {
      this.$confirm("确定删除该评论吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 删除评论逻辑
        this.$api({
          url: "delComment",
          method: "get",
          data: { id: item.id },
        }).then((res) => {
          if (res.code == 200) {
            this.setView();
          }
        });
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
    font-family: OPPPSans;
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
    padding-bottom: 30px;

    &:last-child {
      border-bottom: none;
    }

    .user-info {
      display: flex;
      align-items: flex-start;
      gap: 12px;

      .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        background: #f5f5f5;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-details {
        flex: 1;

        .user-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
          .user-meta-left {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .user-id {
              font-size: 16px;
              color: #111;
              font-weight: 500;
            }

            .comment-time {
              font-size: 12px;
              color: #999;
              flex: 1;
            }
          }

          .delete-btn {
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;

            &:hover {
              background-color: #f5f5f5;
            }

            svg {
              display: block;
            }
          }
        }

        .comment-content {
          font-size: 14px;
          color: #333;
          line-height: 1.5;
          margin-bottom: 25px;
        }

        .related-paper {
          background: #f7f9fa;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          line-height: 1.4;

          .paper-label {
            color: #666;
          }

          .paper-title {
            color: #333;
          }
        }
      }
    }
  }
}
</style>
