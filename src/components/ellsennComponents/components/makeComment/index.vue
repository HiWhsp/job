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
        <el-button type="primary" @click="handleSubmitComment">提交评论</el-button>
      </el-form-item>
    </el-form>
    <div class="comments-list">
      <div
        v-for="(comment, index) in comments"
        :key="index"
        class="comment-item"
      >
        <el-avatar :src="comment.avatar" :size="40"></el-avatar>
        <div class="comment-content">
          <p class="comment-username">{{ comment.username }}</p>
          <p class="comment-text">{{ comment.content }}</p>
          <p class="comment-meta">
            {{ comment.time }} 来自{{ comment.location }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import verticalLineTitle from '@/components/ellsennComponents/components/verticalLineTitle.vue';
const STORAGE_KEY = 'mock_comments';

export default {
  components: {
    verticalLineTitle,
  },
  props: {},
  name: 'makeComment',
  data() {
    return {
      commentForm: {
        content: '',
      },
      comments: [
        {
          avatar: 'https://placehold.co/60x60',
          username: '胡萝卜🥕',
          content: '非常好，值得购买。',
          time: '5小时前',
          location: '山东临沂市',
        },
        {
          avatar: 'https://placehold.co/60x60',
          username: '胡萝卜🥕',
          content: '评论内容评论内容评论内容评论内容评论内容',
          time: '5小时前',
          location: '山东临沂市',
        },
        {
          avatar: 'https://placehold.co/60x60',
          username: '胡萝卜🥕',
          content: '非常好，值得购买。',
          time: '5小时前',
          location: '山东临沂市',
        },
      ],
    };
  },
  created() {},
  mounted() {
    this.loadComments(); // 组件加载时获取评论列表
  },
  methods: {
    // 获取评论列表
    getComments() {
      return new Promise((resolve) => {
        const comments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        setTimeout(() => resolve(comments), 500); // 模拟网络延迟
      });
    },
    // 提交评论
    submitComment(comment) {
      return new Promise((resolve) => {
        const comments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        comments.unshift(comment); // 将新评论添加到列表开头
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
        setTimeout(() => resolve(comment), 500); // 模拟网络延迟
      });
    },
    // 提交评论
    async handleSubmitComment() {
      if (this.commentForm.content.trim() === '') {
        this.$message.error('评论内容不能为空');
        return;
      }
      const newComment = {
        avatar: 'https://placehold.co/60x60',
        username: '新用户',
        content: this.commentForm.content,
        time: '刚刚',
        location: '未知',
      };
      await this.submitComment(newComment); // 调用模拟接口提交评论
      this.commentForm.content = ''; // 清空输入框
      this.loadComments(); // 重新加载评论列表
    },
    // 加载评论列表
    async loadComments() {
      this.comments = await this.getComments(); // 调用模拟接口获取评论
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
