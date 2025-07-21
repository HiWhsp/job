<template>
  <div class="protocol-page">
    <div class="protocol-container">
      <!-- 页面标题 -->
      <div class="protocol-header">
        <h1>{{ type }}</h1>
        <!-- <div class="protocol-info">
          <span>最后更新时间：{{ updateTime }}</span>
          <span>生效时间：{{ effectiveTime }}</span>
        </div> -->
      </div>

      <!-- 协议内容 -->
      <div class="protocol-content" v-html="userAgreement"></div>

      <!-- 底部按钮 -->
      <!-- <div class="protocol-footer">
        <el-button type="primary" size="large" @click="handleAgree">
          我已阅读并同意此协议
        </el-button>
        <el-button size="large" @click="handleBack"> 返回 </el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Protocol",
  data() {
    return {
      updateTime: "2024年1月1日",
      effectiveTime: "2024年1月1日",
      type: "",
      userAgreement: "",
    };
  },
  watch: {
    vuex_config: {
      handler(newVal) {
        if (this.type == "用户协议") {
          this.userAgreement = newVal.user_xieyi || "";
        } else {
          this.userAgreement = newVal.private_xieyi || "";
        }
      },
      deep: true,
    },
    type(newVal) {
      if (newVal == "用户协议") {
        this.userAgreement = this.vuex_config.user_xieyi || "";
      } else {
        this.userAgreement = this.vuex_config.private_xieyi || "";
      }
    },
  },
  mounted() {
    this.type = this.$route.query.type;
    if (this.type == "用户协议") {
      this.userAgreement = newVal.user_xieyi || "";
    } else {
      this.userAgreement = newVal.private_xieyi || "";
    }
  },
  methods: {
    handleAgree() {
      // 处理同意协议的逻辑
      this.$message.success("您已同意用户服务协议");
      // 可以根据来源页面进行不同的跳转
      const from = this.$route.query.from;
      if (from === "register") {
        this.$router.push("/register");
      } else {
        this.$router.push("/");
      }
    },
    handleBack() {
      // 返回上一页
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.protocol-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px 0;
}

.protocol-container {
  max-width: 1400px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.protocol-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 40px;
  text-align: center;

  h1 {
    font-size: 32px;
    margin: 0 0 16px 0;
    font-weight: 600;
  }

  .protocol-info {
    display: flex;
    justify-content: center;
    gap: 40px;
    font-size: 14px;
    opacity: 0.9;

    span {
      padding: 0 16px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.1);
      line-height: 32px;
    }
  }
}

.protocol-content {
  padding: 40px;
  line-height: 1.8;
  color: #333;

  .section {
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    h2 {
      font-size: 24px;
      color: #2c3e50;
      margin: 0 0 20px 0;
      padding-bottom: 12px;
      border-bottom: 2px solid #e1e8ed;
      font-weight: 600;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: #667eea;
      }
    }

    .subsection {
      margin-bottom: 24px;

      h3 {
        font-size: 18px;
        color: #34495e;
        margin: 0 0 12px 0;
        font-weight: 600;
      }

      p {
        margin: 0 0 16px 0;
        text-align: justify;
        font-size: 15px;
        line-height: 1.8;
      }

      ul {
        margin: 16px 0;
        padding-left: 24px;

        li {
          margin-bottom: 8px;
          font-size: 15px;
          line-height: 1.6;
          position: relative;

          &::marker {
            color: #667eea;
          }
        }
      }
    }
  }
}

.protocol-footer {
  padding: 32px 40px;
  text-align: center;
  background: #fafafa;
  border-top: 1px solid #e1e8ed;

  .el-button {
    margin: 0 12px;
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 500;
    min-width: 160px;

    &.el-button--primary {
      background: #667eea;
      border-color: #667eea;

      &:hover {
        background: #5a6fd8;
        border-color: #5a6fd8;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .protocol-page {
    padding: 10px;
  }

  .protocol-container {
    border-radius: 0;
    box-shadow: none;
  }

  .protocol-header {
    padding: 24px 20px;

    h1 {
      font-size: 24px;
    }

    .protocol-info {
      flex-direction: column;
      gap: 12px;

      span {
        padding: 0 12px;
        line-height: 28px;
      }
    }
  }

  .protocol-content {
    padding: 24px 20px;

    .section {
      h2 {
        font-size: 20px;
      }

      .subsection {
        h3 {
          font-size: 16px;
        }

        p,
        li {
          font-size: 14px;
        }
      }
    }
  }

  .protocol-footer {
    padding: 24px 20px;

    .el-button {
      display: block;
      width: 100%;
      margin: 8px 0;
    }
  }
}

// 打印样式
@media print {
  .protocol-page {
    background: #fff;
    padding: 0;
  }

  .protocol-container {
    box-shadow: none;
    border-radius: 0;
  }

  .protocol-header {
    background: #fff !important;
    color: #333 !important;

    .protocol-info span {
      background: #f0f0f0 !important;
    }
  }

  .protocol-footer {
    display: none;
  }
}
</style>
