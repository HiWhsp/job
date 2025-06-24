<template>
  <div class="feedback-center">
    <!-- 顶部横幅 -->
    <div class="header-banner">
      <div class="banner-content">
        <h1 class="title">意见反馈</h1>
        <p class="subtitle">FEEDBACK</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧导航菜单 -->
      <div class="sidebar">
        <ul class="nav-menu">
          <li
            class="nav-item"
            :class="{ active: activeMenu === 'function' }"
            @click="setActiveMenu('function')"
          >
            功能建议
          </li>
          <li
            class="nav-item"
            :class="{ active: activeMenu === 'other' }"
            @click="setActiveMenu('other')"
          >
            其他建议
          </li>
        </ul>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <div class="content-section">
          <h2 class="section-title">功能建议</h2>

          <div class="form-container">
            <div class="form-group">
              <label class="form-label">问题类型：</label>
              <select class="form-select" v-model="feedbackForm.type">
                <option value="">请选择</option>
                <option value="function">功能建议</option>
                <option value="bug">问题反馈</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">问题描述：</label>
              <textarea
                class="form-textarea"
                v-model="feedbackForm.description"
                placeholder="请描述"
                rows="8"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">联系方式：</label>
              <input
                type="text"
                class="form-input"
                v-model="feedbackForm.contact"
                placeholder="请输入联系方式"
              />
            </div>

            <div class="form-group">
              <label class="form-label">上传图片：</label>
              <div class="upload-container">
                <div class="upload-btn">
                  <i class="upload-icon">+</i>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn-submit" @click="submitFeedback">提交</button>
              <button class="btn-cancel" @click="cancelFeedback">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeedbackCenter",
  data() {
    return {
      activeMenu: "function", // 默认选中功能建议
      feedbackForm: {
        type: "",
        description: "",
        contact: "",
        images: [],
      },
    };
  },
  methods: {
    setActiveMenu(menu) {
      this.activeMenu = menu;
    },
    submitFeedback() {
      // 提交反馈逻辑
      console.log("提交反馈:", this.feedbackForm);
    },
    cancelFeedback() {
      // 取消/重置表单
      this.feedbackForm = {
        type: "",
        description: "",
        contact: "",
        images: [],
      };
    },
  },
};
</script>

<style lang="less" scoped>
@import "./feedback.less";
</style>
