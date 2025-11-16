<template>
  <div class="page">
    <pageBreadcrumb :option="nav_option" />
    <div class="inner">
      <div class="page-ctx w-1400">
        <div class="help-container">
          <!-- 左侧导航 -->
          <div class="help-sidebar">
            <div class="sidebar-title">帮助中心</div>
            <div class="sidebar-nav">
              <div
                class="nav-item"
                :class="{ active: activeTab === item.id }"
                @click="handleTabClick(item)"
                v-for="item in tabList"
                :key="item.id"
              >
                {{ item.title }}
              </div>
            </div>
          </div>

          <!-- 右侧内容 -->
          <div class="help-content">
            <div class="content-title">
              <div class="title-bar"></div>
              {{ activeContent.title }}
            </div>

            <div class="content-body">
              <!-- 购物须知内容 -->
              <div class="content-section" v-html="activeContent.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import pageBreadcrumb from "@/components/page/page-breadcrumb.vue";
export default {
  name: "help",
  components: {
    pageBreadcrumb,
  },
  data() {
    return {
      nav_option: [{ title: "帮助中心", route: "/help" }],
      activeTab: null, // 默认激活
      tabList: [],
      activeContent: "",
    };
  },
  mounted() {
    // this.query_tab_list();
    this.query_content();
  },
  methods: {
    query_tab_list() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_otherChannels",
          channelType: 2,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.tabList = res.data;
          // this.activeTab = this.tabList[0].id;
        }
      });
    },
    query_content() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "index_helpList",
          // channelId: this.activeTab,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.tabList = res.data.list;
          this.activeTab = this.tabList[0].id;
          this.activeContent = this.tabList[0];
        }
      });
    },
    handleTabClick(item) {
      this.activeTab = item.id;
      this.activeContent = item;
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background-color: #f5f5f5;

  .inner {
    min-height: 700px;
    padding-top: 24px;
    padding-bottom: 30px;
  }
}

.bread-box {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
}

.page-ctx {
  margin: 0 auto;
}

.help-container {
  display: flex;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  gap: 20px;
}

.help-sidebar {
  width: 260px;
  background: #fff;

  .sidebar-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    height: 58px;
    line-height: 58px;
    text-align: center;
  }

  .sidebar-nav {
    padding: 0;

    .nav-item {
      padding: 16px 20px;
      cursor: pointer;
      color: #333;
      font-size: 14px;
      transition: all 0.3s ease;
      position: relative;
      border-left: 4px solid transparent;

      &:hover {
        background-color: #f8f9fa;
      }

      &.active {
        background-color: #e3f2fd;
        color: #2e4c87;
        border-left: 4px solid #2e4c87;
        font-weight: 500;
      }
    }
  }
}

.help-content {
  flex: 1;
  padding: 0;
  background: #fff;

  .content-title {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    color: #000;
    padding: 24px 0 20px;
    border-bottom: 1px solid #e4e4e4;
    margin: 0 40px;

    .title-bar {
      width: 4px;
      height: 20px;
      background-color: #2e4c87;
      margin-right: 12px;
    }
  }

  .content-body {
    padding: 20px 40px;

    .content-section {
      .section-item {
        margin-bottom: 32px;

        &:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 12px;
        }

        .section-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          padding-left: 0;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .help-container {
    flex-direction: column;
  }

  .help-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e4e4e4;

    .sidebar-nav {
      display: flex;
      overflow-x: auto;

      .nav-item {
        white-space: nowrap;
        min-width: 120px;
        text-align: center;
        border-left: none;
        border-bottom: 3px solid transparent;

        &.active {
          border-left: none;
          border-bottom-color: #1976d2;
        }
      }
    }
  }

  .help-content {
    .content-body {
      padding: 20px;
    }
  }
}
</style>
