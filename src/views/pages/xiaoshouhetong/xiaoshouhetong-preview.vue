<template>
  <div class="baojiadan-form">
    <div class="back">
      <div class="back-left">
        <!--        <img src="@/assets/back.png" alt="" />-->
        <span @click="type = 1" :class="type === 1 ? 'active' : ''">预览销售合同</span>
        <span @click="type = 2" :class="type === 2 ? 'active' : ''">预览回签</span>
      </div>
      <el-button type="primary" @click="submit">点击下载</el-button>
    </div>
    <div class="baojiadan-form-content" ref="baojiadanForm">
      <!-- 内嵌pdf -->
      <iframe :src="pdfUrl" width="100%" height="100%" v-if="pdfUrl"></iframe>
      <el-empty v-else description="暂无数据"></el-empty>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 1,
      pdfUrl: "",
      detail: {},
    };
  },
  watch: {
    type: {
      immediate: true,
      handler(newVal) {
        if (newVal === 1) {
          this.pdfUrl = this.detail.pdfUrl;
        } else {
          this.pdfUrl = this.detail.signBackPdfUrl;
        }
      },
    },
  },
  mounted() {
    // 获取baojiadanForm距离可视区顶部的距离, 根据可视区高度 减去顶部距离设置高度
    this.$nextTick(() => {
      this.$refs.baojiadanForm.style.height = `${
        window.innerHeight - this.$refs.baojiadanForm.offsetTop - 100
      }px`;
    });
    this.id = this.$route.query.id;
    this.getBaojiadan();
  },
  methods: {
    getBaojiadan() {
      this.$api({
        url: "getContractDetail",
        method: "post",
        data: {
          id: this.id,
        },
      }).then((res) => {
        if (res.code === 200) {
          this.pdfUrl = res.data.pdfUrl;
          this.detail = res.data;
        }
      });
    },
    submit() {
      // 下载pdf
      const a = document.createElement("a");
      a.href = this.pdfUrl;
      a.download = this.detail.quotationNo + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    back() {
      this.$router.push("/xiaoshouhetong-list");
    },
  },
};
</script>

<style scoped lang="less">
.baojiadan-form {
  width: 100%;
}

.back {
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 20px;
  color: #000000;

  img {
    width: 28px;
    margin-right: 5px;
  }

  .back-left {
    cursor: pointer;
    display: flex;
    align-items: center;

    span {
      display: inline-block;
      margin-right: 50px;
      position: relative;

      &.active {
        color: #d04e89;

        &::after {
          position: absolute;
          bottom: -10px;
          content: "";
          display: block;
          width: 100%;
          height: 2px;
          background: #d04e89;
        }
      }
    }
  }

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
