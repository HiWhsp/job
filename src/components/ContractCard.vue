<template>
  <div class="contract-card">
    <div class="card-content">
      <div class="document-preview">
        <div class="document-content">
          <img :src="contract.thumb" alt="" />
        </div>
      </div>
    </div>
    <!-- 悬浮遮罩层 -->
    <div class="overlay" v-show="showOverlay">
      <div class="overlay-buttons">
        <button class="view-btn btn-hover" @click="handleView">
          <i class="el-icon-view"></i>
          点击查看
        </button>
        <button class="collect-btn" @click="handleCollect">
          <i
            class="el-icon-star-off"
            :class="{ 'is-collected': contract.is_collect }"
          ></i>
          {{ contract.is_collect ? "取消收藏" : "收藏" }}
        </button>
      </div>
      <div class="overlay-stats">
        <div class="stat-item">
          <i class="el-icon-view"></i>
          <span>{{ contract.view_num || 0 }}</span>
        </div>
        <div class="stat-item">
          <i class="el-icon-star-off"></i>
          <span>{{ contract.collect_num || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="card-title ellipsis-2">
      仁寿县关于进一步支持科技创新的若干政策
    </div>
    <div class="card-info">
      <span>免费下载</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContractCard",
  props: {
    contract: {
      type: Object,
      required: true,
      default: () => ({
        title: "生产经营合同",
        viewCount: 123,
        collectCount: 123,
      }),
    },
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showOverlay: false,
    };
  },
  computed: {
    displayTitle() {
      if (!this.contract.title) return "";
      // 使用字段截取，只展示括号左边的内容
      const leftBracketIndex =
        this.contract.title.indexOf("（") || this.contract.title.indexOf("(");
      return leftBracketIndex !== -1
        ? this.contract.title.substring(0, leftBracketIndex)
        : this.contract.title;
    },
  },
  methods: {
    handleView() {
      window.open(
        `/contractDetail?id=${
          this.type == "collect" ? this.contract.articleId : this.contract.id
        }`,
        "_blank"
      );
      console.log(this.contract);
    },
    handleCollect() {
      const status = this.contract.is_collect == 0 ? 1 : 0;
      this.$api({
        url: "addCollect",
        method: "get",
        data: {
          status,
          articleId:
            this.type == "collect" ? this.contract.articleId : this.contract.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.contract.is_collect = status;
          this.$message.success(res.msg);
          this.$emit("collect");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.contract-card {
  position: relative;
  width: 250px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  .card-content {
    flex: 1;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .document-preview {
    .document-content {
      height: 350px;
      position: relative;
      img {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 2;
      }
    }
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    z-index: 10;

    .overlay-buttons {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 140px;
      margin-top: 140px;

      .view-btn,
      .collect-btn {
        width: 202px;
        height: 59px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 18px;
        background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);

        i {
          font-size: 18px;
        }
        .is-collected {
          color: #f74747;
        }
      }

      .view-btn {
        background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
        color: white;

        &:hover {
          background: #106ebe;
        }
      }

      .collect-btn {
        background: white;
        color: #333;

        &:hover {
          background: #f5f5f5;
        }
      }
    }

    .overlay-stats {
      display: flex;
      gap: 16px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 4px;
        color: white;
        font-size: 18px;

        i {
          font-size: 18px;
        }
      }
    }
  }

  .card-title {
    text-align: left;
    height: 45px;
    font-size: 16px;
    color: #333;
    line-height: 24px;
    margin-top: 10px;
  }
  .card-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #0081FF;
    margin-top: 10px;
  }
}
</style>
