<template>
  <div
    class="contract-card"
    @mouseenter="showOverlay = true"
    @mouseleave="showOverlay = false"
  >
    <div class="card-content">
      <div class="document-preview">
        <div class="document-header">
          <div class="word-icon">
            <img src="@img/index/word-icon.png" alt="" />
          </div>
          <div class="document-title">
            <p class="ellipsis-1">{{ contract.title }}</p>
            <div class="document-info">word A4 打印 内容可随意更改</div>
          </div>
        </div>
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
          <span>{{ contract.view_num || 0  }}</span>
        </div>
        <div class="stat-item">
          <i class="el-icon-star-off"></i>
          <span>{{ contract.collect_num || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="card-title ellipsis-1">{{ contract.title }}</div>
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
  methods: {
    handleView() {
      this.$router.push({
        path: "/contractDetail",
        query: {
          id: this.type == "collect" ? this.contract.articleId : this.contract.id,
        },
      });
      console.log(this.contract);
      
    },
    handleCollect() {
      const status = this.contract.is_collect == 0 ? 1 : 0;
      this.$api({
        url: "addCollect",
        method: "get",
        data: {
          status,
          articleId: this.type == "collect" ? this.contract.articleId : this.contract.id,
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
  width: 305px;
  height: 534px;
  background: #f4f5f8;
  border-radius: 15px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  .card-content {
    flex: 1;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    padding: 13px 16px;
  }

  .document-preview {
    .document-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .word-icon {
        width: 43px;
        height: 43px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .document-title {
        font-weight: bold;
        font-size: 20px;
        color: #363130;
        line-height: 28px;
        p {
          width: 220px;
        }
        .document-info {
          font-weight: 400;
          font-size: 12px;
          color: #9f9f9f;
          line-height: 16px;
        }
      }
    }

    .document-content {
      height: 365px;
      position: relative;

      // 背景层叠卡片
      &::before {
        content: "";
        position: absolute;
        top: 8px;
        left: 8px;
        right: -8px;
        bottom: -8px;
        background: #e8f0fe;
        border-radius: 8px;
        z-index: 1;
      }
      img {
        position: relative;
        width: 267px;
        height: 365px;
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
    height: 60px;
    font-size: 18px;
    color: #363130;
    font-weight: bold;
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 20px;
    line-height: 60px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
