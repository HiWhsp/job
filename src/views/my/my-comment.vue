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
              <img
                :src="item.avatar || '/static/default-avatar.png'"
                alt="用户头像"
              />
            </div>
            <div class="user-details">
              <div class="user-meta">
                <div class="user-meta-left">
                  <span class="user-id">{{
                    item.userId || "15810593012"
                  }}</span>
                  <span class="comment-time">{{ item.dtTime }}</span>
                </div>
                <div class="delete-btn" @click="deleteComment(index)">
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
              <div class="related-paper" v-if="item.paperTitle">
                <span class="paper-label">评论文章：</span>
                <span class="paper-title">{{ item.paperTitle }}</span>
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
  name: "servicePage",
  components: {},
  data() {
    return {
      messList: [
        {
          feed_type: "留言",
          dtTime: "2025-05-10 09:37:26",
          content: "我们不应该将技术机器成功，而是把它看作一个机会",
          userId: "15810593012",
          avatar: "",
          paperTitle:
            "2025年全球关中国建筑信的技术挑战现状及未来展望（精装市场来源、循企活的及高点企业）",
        },
        {
          feed_type: "留言",
          dtTime: "2025-05-10 09:37:26",
          content: "我们不应该将技术机器成功，而是把它看作一个机会",
          userId: "15810593012",
          avatar: "",
          paperTitle:
            "2025年全球关中国建筑信的技术挑战现状及未来展望（精装市场来源、循企活的及高点企业）",
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
    deleteComment(index) {
      // 删除评论逻辑
      this.messList.splice(index, 1);
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
          background: #F7F9FA;
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
