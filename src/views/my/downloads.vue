<template>
  <div class="downloads-page">
    <h2 class="page-title">下载记录</h2>
    <div class="download-list">
      <div
        class="download-item"
        v-for="(item, index) in downloadList"
        :key="index"
      >
        <div class="item-content">
          <div class="item-title">{{ item.document.title }}</div>
          <div class="item-meta">
            <span class="file-size">{{ formatFileSize(item.fileSize) }}</span>
            <span class="upload-date">{{ item.document.created_at }}上传</span>
          </div>
        </div>
        <button class="download-btn" @click="handleRedownload(item)">
          <i class="el-icon-download"></i>
          {{ item.ifMulti == 1 ? "重复下载" : "首次下载" }}
        </button>
      </div>

      <el-empty
        v-if="downloadList.length === 0"
        description="暂无下载记录"
      ></el-empty>
    </div>

    <!-- 分页 -->
    <div class="pagination-section" v-if="downloadList.length > 0">
      <div class="pagination-wrapper">
        <div class="pagination-info">共{{ totalDownloads }}条</div>
        <el-pagination
          :total="totalDownloads"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
          layout="prev, pager, next"
          :page-count="pageCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyDownloads",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalDownloads: 295,
      jumpPage: 1,
      downloadList: [],
    };
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalDownloads / this.pageSize);
    },
  },
  mounted() {
    this.getDownloadList();
  },
  methods: {
    async getDownloadList() {
      try {
        const res = await this.$api({
          url: "pcDownloadList",
          method: "get",
          data: {
            page: this.currentPage,
            limit: this.pageSize,
          },
        });
        if (res.code === 200 && res.data) {
          this.downloadList = res.data.list;
          this.totalDownloads = res.data.count || 0;
        }
      } catch (error) {
        console.error("获取下载记录失败:", error);
        this.$message.error("获取下载记录失败");
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.getDownloadList();
    },
    handleRedownload(item) {
      // 处理重新下载逻辑
      this.$api({
        url: "pcDownloadTwice",
        method: "get",
        data: { id: item.id },
      }).then((res) => {
        if (res.code === 200) {
          // 触发下载
          window.open(item.document.url);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 格式化文件大小
    formatFileSize(bytes) {
      if (!bytes) return "";
      if (bytes < 1024) return bytes + "B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + "KB";
      return (bytes / (1024 * 1024)).toFixed(2) + "MB";
    },
  },
};
</script>

<style lang="less" scoped>
.downloads-page {
  border-radius: 8px;
  padding: 0;

  .page-title {
    background: #fff;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    height: 56px;
    line-height: 56px;
    padding: 0 30px;
    margin: 0;
    border-radius: 8px 8px 0 0;
  }

  .download-list {
    padding: 0;
    background: #fff;
    margin-top: 20px;

    .download-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      margin: 0 30px;
      border-bottom: 1px solid #e8e8e8;

      &:last-child {
        border-bottom: none;
      }

      .item-content {
        flex: 1;

        .item-title {
          font-size: 16px;
          color: #333;
          margin-bottom: 8px;
          line-height: 24px;
        }

        .item-meta {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #999;

          .file-size {
            color: #999;
          }

          .upload-date {
            color: #999;
          }
        }
      }

      .download-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border: 1px solid #d9d9d9;
        border-radius: 24px;
        background: #fff;
        color: #666;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;

        i {
          font-size: 14px;
        }

        &:hover {
          border-color: #0081ff;
          color: #fff;
          background: #0081ff;
        }
      }
    }
  }

  // 分页
  .pagination-section {
    padding: 30px;
    background: #fff;
    border-top: 1px solid #e8e8e8;

    .pagination-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .pagination-info {
      font-size: 14px;
      color: #666;
      margin-right: 10px;
    }

    /deep/ .el-pagination {
      .el-pager li {
        min-width: 32px;
        height: 32px;
        line-height: 32px;
        margin: 0 4px;
        border-radius: 4px;
      }

      .btn-prev,
      .btn-next {
        min-width: 32px;
        height: 32px;
        line-height: 32px;
      }
    }

    .pagination-jump {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: 20px;
      font-size: 14px;

      .jump-label {
        color: #666;
      }

      .jump-input {
        width: 50px;

        /deep/ .el-input__inner {
          height: 32px;
          line-height: 32px;
          text-align: center;
          padding: 0 4px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
