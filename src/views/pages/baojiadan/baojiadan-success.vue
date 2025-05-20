<template>
  <div class="baojiadan-form">
    <div class="back" @click="back">
      <img src="@/assets/back.png" alt="" />
      <span>创建合计报价单</span>
    </div>
    <div class="baojiadan-form-content" ref="baojiadanForm">
      <div class="baojiadan-form-content-title">
        <img src="@/assets/imgs/success.png" alt="" />
        <span>提交成功！</span>
      </div>
      <!-- 操作按钮 -->
      <div class="btn-box">
        <el-button type="primary" @click="submit">在线预览</el-button>
        <el-button @click="reset">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // 获取baojiadanForm距离可视区顶部的距离, 根据可视区高度 减去顶部距离设置高度
    this.$nextTick(() => {
      this.$refs.baojiadanForm.style.height = `${
        window.innerHeight - this.$refs.baojiadanForm.offsetTop - 100
      }px`;
    });
  },
  methods: {
    submit() {
      // 提交逻辑
      this.$message.success("提交成功");
    },
    reset() {
      // 重置逻辑
      this.$message.info("已取消");
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

<style scoped lang="less">
.baojiadan-form {
  width: 100%;
}

.back {
  cursor: pointer;
  display: flex;
  align-items: center;

  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 20px;
  color: #000000;

  img {
    width: 28px;
    margin-right: 5px;
  }
}

.baojiadan-form-content {
  margin-top: 20px;
  background-color: #fff;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .baojiadan-form-content-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 80px;
    }
    span {
      margin-top: 28px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 20px;
      color: #000000;
    }
  }
}

.btn-box {
  margin-top: 60px;
  .el-button--primary {
    width: 180px;
    height: 48px;
    font-size: 16px;
    background: linear-gradient(
      90deg,
      #452f86 0%,
      #a92b83 31%,
      #d14f8d 67%,
      #e38179 100%
    ) !important;
    border: none;
  }
  .el-button--default {
    width: 180px;
    height: 48px;
    font-size: 16px;
  }
}

/deep/ .el-input__inner {
  background: #fafafa;
  border: 1px solid #e6e5e5;
}
</style>
