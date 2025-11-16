<template>
  <div class="page">
    <pageBreadcrumb :option="nav_option" />
    <div class="inner w-1400">
      <div class="download-container">
        <!-- 选项卡区域 -->
        <el-tabs v-model="activeTab" class="download-tabs" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="item in tabList"
            :key="item.id + ''"
            :label="item.title"
            :name="item.id + ''"
          >
            <div class="file-list" v-if="fileList.length > 0">
              <div
                v-for="(file, index) in fileList"
                :key="index"
                class="file-item"
              >
                <div class="file-icon">
                  <img src="@img/common/pdf.png" alt="" />
                </div>
                <div class="file-info">
                  <div class="file-name ellipsis-1">{{ file.title }}</div>
                  <div class="file-meta">{{ file.createTime || '--' }} | {{ file.fileType }}</div>
                </div>
                <div class="file-actions">
                  <el-button
                    type="text"
                    @click="downloadFile(file)"
                    class="download-btn"
                  >
                    <img src="@img/common/down.png" alt="" />
                  </el-button>
                </div>
              </div>
            </div>
            <el-empty v-else description="暂无数据" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
export default {
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      nav_option: [{ title: "下载中心", route: "/download" }],
      activeTab: 0,
      tabList: [],
      fileList: [],
      pagination: {
        page: 1,
        pageNum: 10,
        total: 0,
      },
    };
  },
  mounted() {
    this.query_tab_list();
  },
  methods: {
    query_tab_list() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_otherChannels",
          channelType: 1,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.tabList = res.data;
          this.activeTab = this.tabList[0].id + '';
          this.query_file_list();
        }
      });
    },
    query_file_list() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_downloadList",
          channelId: this.activeTab,
          page: this.pagination.page,
          pageNum: this.pagination.pageNum,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.fileList = res.data.list;
          this.pagination.total = res.data.count;
        }
      });
    },
    handleTabClick(tab, event) {
      this.activeTab = tab.name;
      this.pagination.page = 1;
      this.query_file_list();
    },
    downloadFile(file) {
      window.open(file.file, '_blank');
    },
  },
};
</script>

<style lang="less" scoped>
.bread-box {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
}

.page {
  background: #f5f5f5;
  min-height: 100vh;

  .inner {
    padding-top: 0px;
    padding-bottom: 100px;
  }
}

.download-container {
  margin-top: 32px;
}

.download-tabs {
  .el-tabs__header {
    margin: 0;
    background: #f8f9fa;
    border-bottom: 1px solid #e4e4e4;
  }

  .el-tabs__nav-wrap {
    padding: 0 20px;
  }

  /deep/ .el-tabs__item {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #666;
    padding: 0 20px;

    &.is-active {
      color: #0048bf;
      font-weight: 500;
    }
  }

  /deep/ .el-tabs__active-bar {
    background-color: #0048bf;
    height: 3px;
  }

  .el-tabs__content {
    padding: 0;
  }
}

.file-list {
  padding: 25px 30px;
  background: #fff;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 90px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #dddddd;
  cursor: pointer;

  .file-icon {
    width: 48px;
    height: 48px;
    margin-right: 7px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .file-info {
    flex: 1;
    min-width: 0;

    .file-name {
      font-size: 16px;
      color: #333;
      margin-bottom: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-meta {
      font-size: 14px;
      color: #999;
    }
  }

  .file-actions {
    flex-shrink: 0;

    .download-btn {
      img {
        width: 24px;
        height: 21px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .download-container {
    margin: 10px;
  }

  .file-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 0;

    .file-icon {
      margin-bottom: 10px;
    }

    .file-info {
      width: 100%;
      margin-bottom: 10px;
    }

    .file-actions {
      width: 100%;
      text-align: right;
    }
  }
}
</style>
