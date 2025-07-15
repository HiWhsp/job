<template>
  <div class="feedback-center">
    <!-- 顶部横幅 -->
    <div class="header-banner">
      <div class="banner-content">
        <h1 class="title">Feedback</h1>
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
            :class="{ active: activeMenu.id === item.id }"
            v-for="item in feddBackTypeList"
            :key="item.id"
            @click="setActiveMenu(item)"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <div class="content-section">
          <h2 class="section-title">{{ activeMenu.title }}</h2>

          <div class="form-container">
            <div class="form-group">
              <label class="form-label">Issue Type:</label>
              <el-select
                class="form-input"
                v-model="feedbackForm.type"
                placeholder="Please select"
              >
                <el-option
                  v-for="(item, index) in feddBackModuleList"
                  :key="index"
                  :label="item"
                  :value="index"
                />
              </el-select>
            </div>

            <div class="form-group">
              <label class="form-label">Description:</label>
              <el-input
                class="form-input"
                type="textarea"
                v-model="feedbackForm.description"
                placeholder="Please describe"
                rows="8"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Information:</label>
              <el-input
                type="text"
                class="form-input"
                v-model="feedbackForm.contact"
                placeholder="Please enter contact information"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Images:</label>
              <div class="upload-container">
                <el-upload
                  class="avatar-uploader"
                  accept="image/*"
                  :show-file-list="false"
                  :data="mix_upload_data"
                  :name="mix_upload_name"
                  :action="mix_upload_action"
                  :on-success="upload_on_success"
                  :before-upload="upload_before_upload"
                >
                  <img
                    v-if="feedbackForm.images.length > 0"
                    :src="feedbackForm.images[0]"
                    class="user-avatar"
                  />
                  <div v-else class="upload-btn">
                    <i class="upload-icon">+</i>
                  </div>
                </el-upload>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn-submit" @click="submitFeedback">Submit</button>
              <button class="btn-cancel" @click="cancelFeedback">Cancel</button>
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
      activeMenu: {}, // 默认选中功能建议
      feddBackTypeList: [],
      feddBackModuleList: [],
      feedbackForm: {
        type: "",
        description: "",
        contact: "",
        images: [],
      },
    };
  },
  mounted() {
    console.log(process.env.NODE_ENV);

    this.$api({
      url: "someList",
      method: "get",
    }).then((res) => {
      this.feddBackTypeList = res.data.feddBackType;
      this.activeMenu = this.feddBackTypeList[0];
      this.feddBackModuleList = res.data.feddBackModule;
    });
  },
  methods: {
    setActiveMenu(menu) {
      this.activeMenu = menu;
    },
    submitFeedback() {
      this.$api({
        url: "addFeedBack",
        method: "post",
        data: {
          type_id: this.activeMenu.id,
          module: this.feedbackForm.type,
          content: this.feedbackForm.description,
          mobile: this.feedbackForm.contact,
          images: this.feedbackForm.images.join(","),
        },
      }).then((res) => {
        this.$message.success("Submitted successfully");
        this.cancelFeedback();
      });
    },
    cancelFeedback() {
      // 取消/重置表单
      this.feedbackForm = {
        type: "",
        description: "",
        contact: "",
        images: [],
      };
      this.activeMenu = this.feddBackTypeList[0];
    },
    upload_on_success(res, file) {
      let { code, data, msg } = res;
      if (code == 200) {
        this.feedbackForm.images.push(res.data.save_url);
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      return isLt2M;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./feedback.less";
</style>
