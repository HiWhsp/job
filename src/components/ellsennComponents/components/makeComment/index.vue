<template>
  <div class="makeComment">
    <verticalLineTitle tabTitle="发布评论"></verticalLineTitle>
    <el-form :model="commentForm" ref="commentFormRef">
      <el-form-item>
        <el-input
          type="textarea"
          v-model="commentForm.content"
          placeholder="请输入您的评论内容"
          :rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmitComment"
          >提交评论</el-button
        >
      </el-form-item>
    </el-form>
    <div class="comments-list">
      <div
        v-for="(comment, index) in comments"
        :key="index"
        class="comment-item"
      >
        <el-avatar :src="comment.image" :size="40"></el-avatar>
        <div class="comment-content">
          <p class="comment-username">{{ comment.name }}</p>
          <p class="comment-text">{{ comment.content }}</p>
          <p class="comment-meta">
            {{ comment.time }} 来自{{ comment.address }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import verticalLineTitle from "@/components/ellsennComponents/components/verticalLineTitle.vue";
const STORAGE_KEY = "mock_comments";

export default {
  components: {
    verticalLineTitle,
  },
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    type: {
      type: String | Number,
      default: "",
    },
  },
  name: "makeComment",
  data() {
    return {
      commentForm: {
        content: "",
      },
      comments: [],
    };
  },
  watch: {
    id: {
      handler(newVal) {
        this.loadComments();
      },
    },
  },
  mounted() {},
  methods: {
    // 提交评论
    async handleSubmitComment() {
      if (this.commentForm.content.trim() === "") {
        this.$message.error("评论内容不能为空");
        return;
      }
      await this.$api({
        url: "saveComment",
        method: "post",
        data: {
          pid: this.id,
          type: this.type,
          content: this.commentForm.content,
        },
      });
      this.commentForm.content = ""; // 清空输入框
      this.loadComments(); // 重新加载评论列表
    },

    // 加载评论列表
    async loadComments() {
      this.$api({
        url: "commentList",
        method: "get",
        data: {
          pid: this.id,
          type: this.type,
        },
      }).then((res) => {
        this.comments = res.data.list;
      });
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
