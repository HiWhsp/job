<template>
  <div class="page">
    <div class="service-img">
      <h1>在线留言</h1>
      <p>Online Message</p>
    </div>
    <pageBreadcrumb :option="nav_option" />
    <div class="inner">
      <div class="page-ctx">
        <div class="custom-order-form">
          <el-form
            ref="customForm"
            :model="formData"
            :rules="formRules"
            label-width="120px"
            class="custom-form"
          >
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item prop="name" label="姓名">
                  <el-input
                    v-model="formData.name"
                    placeholder="请输入"
                    class="form-input"
                  >
                  </el-input></el-form-item
              ></el-col>
              <el-col :span="8">
                <el-form-item prop="email" label="邮箱">
                  <el-input
                    v-model="formData.email"
                    placeholder="请输入"
                    class="form-input"
                  >
                  </el-input> </el-form-item
              ></el-col>
              <el-col :span="8">
                <el-form-item prop="phone" label="电话">
                  <el-input
                    v-model="formData.phone"
                    placeholder="请输入手机号"
                    class="form-input"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item prop="title" label="主题">
                  <el-select
                    v-model="formData.title"
                    placeholder="请选择主题"
                    class="form-input"
                  >
                    <el-option
                      v-for="(item, index) in feedType"
                      :key="index"
                      :label="item.title"
                      :value="item.title"
                      >{{ item.title }}</el-option
                    >
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="orderNo" label="订单号">
                  <el-input
                    v-model="formData.orderNo"
                    placeholder="请输入订单号"
                    class="form-input"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="附件上传">
              <div class="upload-section">
                <div
                  class="upload-area"
                  @click="triggerFileUpload"
                  @drop="handleFileDrop"
                  @dragover.prevent
                  @dragenter.prevent
                >
                  <div class="upload-icon">
                    <i class="el-icon-upload2"></i>
                  </div>
                  <el-button type="primary" class="upload-btn"
                    >点击上传</el-button
                  >
                  <p class="upload-text">或直接拖到这里</p>
                  <p class="upload-tip">
                    可添加JPG、PNG、PDF文件,大小限制10M以内
                  </p>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  style="display: none"
                  @change="handleFileSelect"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <div v-if="uploadedFiles.length > 0" class="file-list">
                  <div
                    v-for="(file, index) in uploadedFiles"
                    :key="index"
                    class="file-item"
                  >
                    <i class="el-icon-document"></i>
                    <span class="file-name">{{ file.name }}</span>
                    <span
                      v-if="file.status === 'uploading'"
                      class="upload-status"
                    >
                      上传中...
                    </span>
                    <span
                      v-else-if="file.status === 'success'"
                      class="upload-status success"
                    >
                      上传成功
                    </span>
                    <span
                      v-else-if="file.status === 'error'"
                      class="upload-status error"
                    >
                      上传失败
                    </span>
                    <i
                      class="el-icon-close"
                      @click="removeFile(index)"
                      v-if="file.status !== 'uploading'"
                    ></i>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item prop="code" label="验证码">
                  <div class="captcha-wrapper">
                    <el-input
                      v-model="formData.code"
                      placeholder="请输入验证码"
                      class="form-input captcha-input"
                      @keyup.enter="submitForm"
                      @input="clearCaptchaError"
                    >
                    </el-input>
                    <div class="captcha-container">
                      <canvas
                        ref="captchaCanvas"
                        width="120"
                        height="40"
                        aria-label="验证码"
                        class="captcha-canvas"
                        @click="refreshCaptcha"
                      ></canvas>
                    </div>
                  </div>
                  <div v-if="captchaError" class="captcha-error">
                    {{ captchaError }}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="form-actions">
              <el-button type="primary" @click="submitForm" class="submit-btn"
                >提交</el-button
              >
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
import axios from "axios";
import { mapState } from "vuex";
export default {
  components: {
    pageBreadcrumb,
  },
  computed: {
    ...mapState(["vuex_config"]),
    feedType() {
      console.log(this.vuex_config.feedType);
      return JSON.parse(this.vuex_config.feedType || "[]");
    },
  },
  data() {
    return {
      nav_option: [{ title: "在线留言", route: "/online-message" }],
      formData: {
        name: "",
        email: "",
        phone: "",
        title: "",
        orderNo: "",
        code: "",
        files: "",
      },
      formRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号格式",
            trigger: "blur",
          },
        ],
        email: [
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
      },
      uploadedFiles: [],
      currentCaptchaCode: "", // 当前验证码
      canvasContext: null, // canvas 上下文
      captchaError: "", // 验证码错误提示
    };
  },
  mounted() {
    this.initCaptcha();
  },
  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      this.processFiles(files);
    },
    handleFileDrop(event) {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      this.processFiles(files);
    },
    processFiles(files) {
      files.forEach((file) => {
        // 检查文件类型
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "application/pdf",
        ];
        if (!allowedTypes.includes(file.type)) {
          this.$message.error("只支持JPG、PNG、PDF格式的文件");
          return;
        }

        // 检查文件大小 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          this.$message.error("文件大小不能超过10MB");
          return;
        }

        // 添加到上传列表，状态为上传中
        const fileItem = {
          name: file.name,
          file: file,
          url: "",
          status: "uploading",
        };
        this.uploadedFiles.push(fileItem);

        // 调用上传接口
        this.uploadFile(fileItem);
      });
    },
    // 上传文件到服务器
    uploadFile(fileItem) {
      const formData = new FormData();
      formData.append("img", fileItem.file);
      formData.append("action", "index_localUpload");

      const userId = localStorage.getItem("userId") || "";
      const token = localStorage.getItem("token") || "";
      if (userId) formData.append("userId", userId);
      if (token) formData.append("token", token);

      const uploadUrl =
        process.env.NODE_ENV !== "production"
          ? "/api/service.php"
          : "https://xintian.dx.hdapp.com.cn/service.php";

      axios({
        url: uploadUrl,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          // axios 响应拦截器已经处理了 code != 200 的情况，这里 res 已经是 response.data
          // 如果进入 then，说明 code === 200
          if (res.data) {
            fileItem.status = "success";
            fileItem.url = res.data;
            this.$message.success(`${fileItem.name} 上传成功`);
          } else {
            fileItem.status = "error";
            this.$message.error(`${fileItem.name} 上传失败：数据格式错误`);
          }
        })
        .catch((err) => {
          fileItem.status = "error";
          console.error("上传失败:", err);
          // 响应拦截器会在 code != 200 时 reject，err 就是 response.data
          const errorMsg =
            err.msg || err.message || err.response?.data?.msg || "网络错误";
          this.$message.error(`${fileItem.name} 上传失败：${errorMsg}`);
        });
    },
    removeFile(index) {
      this.uploadedFiles.splice(index, 1);
    },
    submitForm() {
      this.$refs.customForm.validate((valid) => {
        if (valid) {
          // 验证验证码
          if (!this.validateCaptcha()) {
            this.$message.error(this.captchaError || "验证码错误");
            return;
          }

          // 检查是否有文件正在上传
          const uploadingFiles = this.uploadedFiles.filter(
            (file) => file.status === "uploading"
          );
          if (uploadingFiles.length > 0) {
            this.$message.warning("请等待文件上传完成");
            return;
          }

          // 检查是否有上传失败的文件
          const errorFiles = this.uploadedFiles.filter(
            (file) => file.status === "error"
          );
          if (errorFiles.length > 0) {
            this.$message.warning("请先处理上传失败的文件");
            return;
          }

          // 获取上传成功的文件URL列表
          const fileUrls = this.uploadedFiles
            .filter((file) => file.status === "success" && file.url)
            .map((file) => file.url);

          // 准备提交数据
          const submitData = {
            ...this.formData,
            files: fileUrls.join(","), // 文件URL用 | 分隔
          };

          // 这里可以添加提交逻辑
          console.log("表单数据:", submitData);
          this.$api({
            url: "/service.php",
            method: "post",
            data: {
              action: "serve_onlineMsg",
              ...submitData,
            },
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success("提交成功！我们会尽快与您联系");
              this.$refs.customForm.resetFields();
              this.uploadedFiles = [];
              this.formData.code = "";
              this.refreshCaptcha();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("请检查表单信息");
        }
      });
    },
    // 初始化验证码
    initCaptcha() {
      this.$nextTick(() => {
        const canvas = this.$refs.captchaCanvas;
        if (!canvas) return;
        this.canvasContext = canvas.getContext("2d");
        this.refreshCaptcha();
      });
    },
    // 生成随机数
    randInt(min, max) {
      const range = max - min + 1;
      const r = crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff;
      return Math.floor(r * range) + min;
    },
    // 生成验证码文本
    makeCode(length = 4) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
      let s = "";
      for (let i = 0; i < length; i++) {
        s += chars.charAt(this.randInt(0, chars.length - 1));
      }
      return s;
    },
    // 清空画布
    clearCanvas() {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      // 背景渐变
      const g = this.canvasContext.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      g.addColorStop(0, "#f8fafc");
      g.addColorStop(1, "#eef2f6");
      this.canvasContext.fillStyle = g;
      this.canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    },
    // 绘制噪点
    drawNoiseDots(count = 80) {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      for (let i = 0; i < count; i++) {
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = `rgba(${this.randInt(
          50,
          200
        )},${this.randInt(50, 200)},${this.randInt(50, 200)},${(
          Math.random() * 0.6
        ).toFixed(2)})`;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 1.2;
        this.canvasContext.arc(x, y, r, 0, Math.PI * 2);
        this.canvasContext.fill();
      }
    },
    // 绘制干扰线
    drawInterferenceLines(count = 4) {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      for (let i = 0; i < count; i++) {
        this.canvasContext.beginPath();
        this.canvasContext.lineWidth = this.randInt(1, 1.5);
        this.canvasContext.strokeStyle = `rgba(${this.randInt(
          30,
          150
        )},${this.randInt(30, 150)},${this.randInt(30, 150)},${(
          0.25 +
          Math.random() * 0.4
        ).toFixed(2)})`;
        const startY = Math.random() * canvas.height;
        this.canvasContext.moveTo(0, startY);
        const cpX = this.randInt(canvas.width * 0.2, canvas.width * 0.8);
        const cpY = this.randInt(0, canvas.height);
        const endY = Math.random() * canvas.height;
        const steps = 50;
        let prevX = 0,
          prevY = startY;
        for (let t = 1; t <= steps; t++) {
          const tt = t / steps;
          const x = tt * canvas.width;
          const y =
            (1 - tt) * (1 - tt) * startY +
            2 * (1 - tt) * tt * cpY +
            tt * tt * endY;
          this.canvasContext.moveTo(prevX, prevY);
          this.canvasContext.lineTo(x, y);
          prevX = x;
          prevY = y;
        }
        this.canvasContext.stroke();
      }
    },
    // 绘制文本
    drawText(code) {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      const len = code.length;
      const baseX = 5;
      const availableW = canvas.width - baseX * 2;
      const perW = availableW / len;

      for (let i = 0; i < len; i++) {
        const ch = code[i];
        const fontSize = this.randInt(18, 24);
        const rotate = Math.random() * 0.4 - 0.2;
        const color = `rgba(${this.randInt(30, 110)},${this.randInt(
          30,
          110
        )},${this.randInt(30, 110)},1)`;
        this.canvasContext.save();
        const centerX =
          baseX + perW * (i + 0.5) + (Math.random() * perW - perW / 2) * 0.15;
        const centerY = canvas.height / 2 + this.randInt(-3, 3);

        const channels = [
          { dx: this.randInt(-1, 1), dy: this.randInt(-1, 1) },
          { dx: this.randInt(-1, 1), dy: this.randInt(-1, 1) },
        ];

        this.canvasContext.translate(centerX, centerY);
        this.canvasContext.rotate(rotate);
        this.canvasContext.font = `${fontSize}px "Arial", sans-serif`;
        this.canvasContext.textBaseline = "middle";
        this.canvasContext.textAlign = "center";

        this.canvasContext.shadowColor = "rgba(0,0,0,0.12)";
        this.canvasContext.shadowBlur = 1;
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillText(ch, 0, 0);

        this.canvasContext.lineWidth = 0.5;
        this.canvasContext.strokeStyle = `rgba(0,0,0,0.06)`;
        this.canvasContext.strokeText(ch, 0, 0);

        this.canvasContext.restore();

        for (let c = 0; c < channels.length; c++) {
          const { dx, dy } = channels[c];
          this.canvasContext.save();
          this.canvasContext.translate(centerX + dx * 1, centerY + dy * 1);
          this.canvasContext.rotate(rotate + (Math.random() * 0.04 - 0.02));
          this.canvasContext.font = `${fontSize}px "Arial", sans-serif`;
          this.canvasContext.textBaseline = "middle";
          this.canvasContext.textAlign = "center";
          this.canvasContext.globalAlpha = 0.1;
          this.canvasContext.fillText(ch, 0, 0);
          this.canvasContext.restore();
        }
      }
    },
    // 绘制网格
    drawGridFine() {
      const canvas = this.$refs.captchaCanvas;
      if (!canvas || !this.canvasContext) return;
      this.canvasContext.save();
      this.canvasContext.globalAlpha = 0.03;
      for (let x = 0; x < canvas.width; x += 5) {
        this.canvasContext.fillRect(x, 0, 0.5, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += 5) {
        this.canvasContext.fillRect(0, y, canvas.width, 0.5);
      }
      this.canvasContext.restore();
    },
    // 渲染验证码
    renderCaptcha(code) {
      this.clearCanvas();
      this.drawGridFine();
      this.drawNoiseDots(30);
      this.drawInterferenceLines(1 + this.randInt(0, 1));
      this.drawText(code);
      this.drawNoiseDots(15);
    },
    // 生成并渲染验证码
    generateAndRender(length = 4) {
      this.currentCaptchaCode = this.makeCode(length);
      this.renderCaptcha(this.currentCaptchaCode);
      this.formData.code = "";
      this.captchaError = "";
    },
    // 刷新验证码
    refreshCaptcha() {
      this.generateAndRender(4);
    },
    // 验证验证码
    validateCaptcha() {
      const input = this.formData.code.trim();
      if (!input) {
        this.captchaError = "请输入验证码";
        return false;
      }
      if (input.toLowerCase() !== this.currentCaptchaCode.toLowerCase()) {
        this.captchaError = "验证码错误";
        return false;
      }
      this.captchaError = "";
      return true;
    },
    // 清除验证码错误提示
    clearCaptchaError() {
      if (this.captchaError) {
        this.captchaError = "";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  background: #f5f5f5;
  text-align: left;
  min-height: 100vh;

  .inner {
    padding-top: 0px;
    padding-bottom: 100px;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }
}

.service-img {
  background-image: url("../../assets/img/banner/online-message.png");
  height: 560px;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 56px;
    color: #fff;
  }
  p {
    font-size: 24px;
    color: #fff;
  }
}

.custom-order-form {
  margin-top: 80px;

  .custom-form {
    .form-row {
      display: flex;
      gap: 40px;
      margin-bottom: 30px;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px;
      }
    }

    .form-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-input {
      width: 100%;

      .el-input__inner {
        height: 50px;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        font-size: 14px;
        padding: 0 15px;
        transition: all 0.3s ease;

        &:focus {
          border-color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        }
      }

      .el-select {
        width: 100%;

        .el-input__inner {
          height: 50px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          font-size: 14px;
          padding: 0 15px;
        }
      }

      .el-cascader {
        width: 100%;

        .el-input__inner {
          height: 50px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          font-size: 14px;
          padding: 0 15px;
        }
      }
    }

    // Element UI 表单标签样式
    .el-form-item__label {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      line-height: 50px;
      padding: 0;
      text-align: left;

      &::before {
        content: "";
        display: none;
      }
    }

    .el-form-item {
      margin-bottom: 20px;

      .el-form-item__content {
        line-height: 50px;
      }
    }

    .upload-section {
      .upload-area {
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        padding: 40px 20px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: #fafafa;

        &:hover {
          border-color: #409eff;
          background: #f0f9ff;
        }

        .upload-icon {
          font-size: 48px;
          color: #c0c4cc;
          margin-bottom: 20px;

          i {
            font-size: 48px;
          }
        }

        .upload-btn {
          margin-bottom: 15px;
          padding: 10px 30px;
          border-radius: 6px;
          background: #96a5c3;
          border-color: #96a5c3;
        }

        .upload-text {
          font-size: 14px;
          color: #666;
          margin: 0 0 10px 0;
        }

        .upload-tip {
          font-size: 12px;
          color: #999;
          margin: 0;
        }
      }

      .file-list {
        margin-top: 15px;

        .file-item {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          background: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 8px;
          border: 1px solid #e9ecef;

          .el-icon-document {
            color: #409eff;
            margin-right: 10px;
            font-size: 16px;
          }

          .file-name {
            flex: 1;
            font-size: 14px;
            color: #333;
            margin-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .el-icon-close {
            color: #f56c6c;
            cursor: pointer;
            font-size: 16px;

            &:hover {
              color: #f56c6c;
            }
          }

          .upload-status {
            margin-left: 10px;
            margin-right: 10px;
            font-size: 12px;
            color: #409eff;

            &.success {
              color: #67c23a;
            }

            &.error {
              color: #f56c6c;
            }

            i {
              margin-right: 4px;
            }
          }
        }
      }
    }

    .form-actions {
      text-align: center;
      margin-top: 40px;
      margin-left: 120px;

      .submit-btn {
        padding: 15px 50px;
        font-size: 16px;
        border-radius: 6px;
        background: #2e4c87;
        border: none;
        font-weight: 500;
        min-width: 120px;

        &:hover {
          background: #2e4c87;
        }
      }
    }

    // 验证码样式
    .captcha-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;

      .captcha-input {
        flex: 1;
      }

      .captcha-container {
        flex-shrink: 0;
        height: 40px;
      }

      .captcha-canvas {
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        background: #fff;
        transition: all 0.3s ease;

        &:hover {
          border-color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
        }
      }
    }

    .captcha-error {
      color: #f56c6c;
      font-size: 12px;
      line-height: 1.5;
      margin-top: 5px;
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}

.bread-box {
  background: #ffffff;
  padding: 16px 0;
  border-bottom: 1px solid #e4e4e4;

  .bread-inner {
    margin: 0 auto;
    a {
      display: inline-flex;
      align-items: center;

      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;

      img {
        margin-right: 10px;
      }
    }

    .link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .route-link {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #999999;
    }

    .arrow {
      margin: 0 6px;
      color: #aeaeae;
    }

    > *:last-child {
      font-family: OPPOSans, OPPOSans;
      font-size: 15px;
      color: #000000;
    }

    .search-item {
      color: #aeaeae;
    }
    .search-keyword {
      color: #2e4c87;
    }
  }
}
</style>
