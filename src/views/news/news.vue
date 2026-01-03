<template>
  <div class="page">
    <!-- <pageTop :config="pageConfig" /> -->
    <!-- <news_banner /> -->

    <div class="inner">
      <div class="page-ctx w-1400">
        <div class="ctx-news">
          <div class="ctx-left">
            <!-- <div class="search-box">
            <img class="img-search" src="@img/keyword-search.png" alt="" />
            <input
              v-model="keyword"
              type="text"
              placeholder="请输入要搜索的关键词"
              @keyup.enter="setView"
            />
            <button class="btn-ripple" @click="setView">搜索</button>
          </div> -->

            <!-- Tab切换模块 -->
            <div class="tab-container">
              <el-tabs
                v-model="activeTabName"
                @tab-click="handleTabClick"
                class="custom-tabs"
                active-color="#7853B2"
              >
                <el-tab-pane
                  v-for="(tab, index) in tabList"
                  :key="tab.id"
                  :label="tab.title"
                  :name="tab.id+''"
                >
                </el-tab-pane>
              </el-tabs>
            </div>

            <div class="news-wrap" v-if="count">
              <div
                class="news-list"
                :class="{ 'card-layout': activeTab == 1 }"
              >
                <div
                  v-for="(item, index) in list_news"
                  :key="index"
                  class="news-item"
                  :class="{ 'card-item': activeTab == 1 }"
                >
                  <!-- 索引为0时的简洁布局 -->
                  <template v-if="activeTab == 0">
                    <div class="yellow-bar"></div>
                    <div class="item-content">
                      <div class="company-title" @click="handle_detial(item)">{{ item.title }}</div>
                      <div class="item-description">
                        {{ item.content }}
                      </div>
                    </div>
                    <div class="view-details">
                      <div class="detail-link" @click="handle_detial(item)">查看详情 ></div>
                      <!-- <router-link
                        :to="`/news-detail?id=${item.id}`"
                        class="detail-link"
                      >
                        查看详情 >
                      </router-link> -->
                    </div>
                  </template>

                  <!-- 索引为1时的卡片布局 -->
                  <template v-else>
                    <!-- 左侧图片 -->
                    <div class="card-image">
                      <el-image :src="item.thumb" fit="cover"></el-image>
                    </div>

                    <!-- 中间内容区域 -->
                    <div class="card-content">
                      <div class="card-title" @click="handle_detial(item)">{{ item.title }}</div>
                      <div class="card-description">
                        {{ item.content }}
                      </div>
                    </div>

                    <!-- 右侧操作按钮 -->
                    <div class="card-action">
                      <div class="detail-link" @click="handle_detial(item)">查看详情 ></div>

                      <!-- <router-link
                        :to="`/news-detail?id=${item.id}`"
                        class="card-link"
                      >
                        查看详情 >
                      </router-link> -->
                    </div>
                  </template>
                </div>
              </div>
              <div class="pagination-box">
                 <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pagination.page"
                  :page-sizes="[10,100, 200, 300, 400]"
                  :page-size="pagination.pageNum"
                  layout="total, prev, pager, next, jumper"
                  :total="count">
                </el-pagination>
              </div>
            </div>
            <div class="empty-box" v-else>
              <el-empty description="没有查询到相关信息..."></el-empty>
            </div>
          </div>

          <div class="ctx-right" >
            <!-- 更多服务标题 -->
            <div class="more-services-title">
              <!-- <span class="marker"></span> -->
              <img src="@img/other/news-tit.png" class="marker-img" alt="" />
              更多服务
            </div>

            <!-- 相邻分类 -->
            <div
              v-for="(category, categoryIndex) in otherCategories_list"
              :key="categoryIndex"
              class="category-section"
            >
              <!-- <div class="right-title flex">
                <span class="marker"></span>
                {{ category.name || category.title }}
              </div> -->

              <!-- 显示对应tab索引的名称 -->
              <div class="tab-info">
                <div class="tab-name flex">
                  <img :src="category.thumb" alt="" class="ico">
                  {{ category.title }}
                </div>
                <!-- <div class="tab-index">
                  Tab索引: {{ activeTab }}
                </div> -->
              </div>

              <!-- 分类下的内容列表 -->
              <div class="category-content" >
                <div
                  class="content-item"
                  v-for="(item, index) in category.new_list"
                  :key="item.id || index"
                >
                  <div class="item-title"  @click="handle_detial(item)">{{ item.title }}</div>
                  <div class="item-desc">{{ item.content }}</div>
                  <!-- <div class="item-date">{{ item.dtTime?.substr(0, 10) }}</div> -->
                </div>

                <!-- 如果没有数据，显示加载中或空状态 -->
                <div
                  v-if="otherCategories_list.length === 0"
                  class="loading-item"
                >
                  <!-- <div class="item-title">加载中...</div> -->
                  <div class="item-desc">暂无数据...</div>
                </div>
              </div>
            </div>

            <!-- 如果没有相邻分类，显示提示 -->
            <div
              v-if="otherCategories.length === 0"
              class="no-categories"
              style="
                background: #fff;
                padding: 20px;
                text-align: center;
                color: #999;
              "
            >
              暂无相邻分类数据
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import news_banner from "./components/news_banner.vue";
// import news_right from "./components/news_right.vue";

import { mapState } from "vuex";

export default {
  name: "news",
  components: {
    news_banner,
    // news_right,
  },
  data() {
    return {
      cid: this.$route.query.id,//当前主页分类id
      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,//总数
      activeTab: 0,//样式展示 0无图 1有图
      activeTabName: "0", // el-tabs需要的字符串类型

      list_news: [],//新闻列表
      tabList: [],//分类列表
      otherCategories_list:[],
    };
  },
  computed: {
    ...mapState(["vuex_news_cates"]),
    // 获取相邻的两个分类（不包含当前分类）
    otherCategories() {
      console.log("vuex_news_cates:", this.vuex_news_cates);
      console.log("this.cid:", this.cid, "type:", typeof this.cid);

      if (!this.vuex_news_cates || !this.cid) {
        console.log("数据不完整，返回空数组");
        return [];
      }
      const currentIndex =[]
      this.vuex_news_cates.forEach((e)=>{
        if(e.id!=this.$route.query.id){
          currentIndex.push({
            ...e,
            new_list:[],
          })
        }
      })
      currentIndex.forEach((e,i)=>{
        this.getCategoryListData(e.id,i)

      })
      this.otherCategories_list=currentIndex
      return currentIndex
    },
  },
  watch: {
    $route(to, from) {
      this.get_tab_list()
       
    },
  },
  created() {
    // this.query_suggest();
     
    this.get_tab_list()
  },

  methods: {
    //跳转详情
    handle_detial(item){
      this.$router.push({
        path:'/news-detail',
        query:{
          id:item.id
        },
      })
    },
    //获取顶部列表
    get_tab_list(){
       this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_channel",
          channelId: this.$route.query.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          console.log("获取分类", res.data);
          this.tab = res.data;
          this.tabList = res.data; // 将API数据赋值给tabList
          if(res.data.length){
            this.activeTabName =res.data[0].id+''; // 同步activeTabName
          }
          this.get_lsit();
        }
      });
    },
    handleCurrentChange(val){
      this.pagination.page=val
      this.get_lsit();

    },
    handleSizeChange(val){
      this.pagination.pageNum=val
      this.get_lsit();
    },
    //获取新闻列表
    get_lsit(){
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: this.activeTabName, // 使用当前选中tab的id
          keyword: "",
          ...this.pagination,
          isIndex: 0, //类型：0-全部 1-推荐
          contentLen: "100", //
          orderType: 0, //排序情况：0-自然排序 1-最新
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;

          this.list_news = data.list;
          this.count = data.count;
        }
      });
    },
    
    // el-tabs点击事件处理
    handleTabClick(tab) {
      console.log('tab',tab)

     
      this.activeTab = tab.index;
      this.pagination.page = 1; // 重置页码
       console.log('activeTabName',this.activeTabName)
      console.log('activeTab',this.activeTab)
      this.get_lsit(); // 重新获取数据
    },
    getCategoryListData(id,index){
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "news_lists",
          channelId: id, // 使用当前选中tab的id
          keyword: "",
          pageNum:3,
          isIndex: 0, //类型：0-全部 1-推荐
          contentLen: "100", //
          orderType: 0, //排序情况：0-自然排序 1-最新
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;

          // this.list_news = data.list;
          // this.count = data.count;
          console.log('otherCategories_list',this.otherCategories_list)
          this.otherCategories_list[index].new_list=data.list
        }
      });
    },








 
    
   

 
    
 

     

    
    

     
     
     

    
  },
};
</script>

<style scoped lang="less">
.page {
  .inner {
    background: #f3f3f3;
    padding: 24px 0;
  }
}

.page-ctx {
  margin: 0 auto;
  padding-top: 0;
  padding-bottom: 20px;
  text-align: left;
}
/deep/.is-top {
  margin: 0 !important;
  line-height: 60px;
  &::after{
    background: none;
  }
}
.ctx-news {
  display: flex;
  align-items: flex-start;

  .ctx-left {
    flex: 1;
    overflow: hidden;
    margin-right: 24px;

    // Tab切换样式
    .tab-container {
      background: #ffffff;
      border-radius: 4px 4px 0 0;

      .custom-tabs {
        padding: 20px 60px 0;
        .el-tabs__header {
          margin: 0 !important;
          border-bottom: 1px solid #e8e8e8;
        }

        .el-tabs__nav-wrap {
          padding: 0;
        }

        .el-tabs__nav {
          display: flex;
          width: 100%;
        }

        // 确保覆盖Element UI的默认样式
        .el-tabs__item.is-active {
          color: #7853b2 !important;
        }

        .el-tabs__item:hover {
          color: #7853b2 !important;
        }

        .el-tabs__item {
          flex: 1;
          text-align: center;
          font-size: 16px;
          color: #1F1F1F !important;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          padding: 16px 24px;
          height: auto;
          line-height: 1.4;

          &:hover {
            color: #7853b2 !important;
            background: #f8f8f8;
          }

          &.is-active {
            color: #7853b2 !important;
            border-bottom-color: #7853b2 !important;
            background: #ffffff;
            font-weight: bold;
          }
        }

        .el-tabs__active-bar {
          background-color: #7853b2 !important;
          height: 3px;
        }

        .el-tabs__content {
          display: none; // 隐藏内容区域，因为我们不需要显示tab内容
        }
      }
    }

    .cate-title {
      font-weight: normal;
      font-size: 32px;
      color: #333333;
    }

    .news-list {
      background: #ffffff;
      border-radius: 0 0 4px 4px;
      padding: 0;

      // 卡片布局样式
      &.card-layout {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .news-item {
        display: flex;
        align-items: flex-start;
        padding: 20px;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        transition: background-color 0.3s ease;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          // background-color: #f8f8f8;
          .company-title {
            color: #5b339a;
          }
        }

        // 卡片项样式
        &.card-item {
          flex-direction: row;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          background: #ffffff;
          border-radius: 8px;
          // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 12px;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            background-color: #ffffff;
          }
        }

        .yellow-bar {
          width: 6px;
          height: 20px;
          background: #FCB000;
          margin-right: 10px;
          flex-shrink: 0;
          border-radius: 3px;
        }

        .item-content {
          flex: 1;

          .company-title {
            font-size: 20px;
            font-weight: bold;
            color: #1F1F1F;
            margin-bottom: 8px;
            line-height: 1.4;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #7853b2;
            }
          }

          .item-description {
            font-size: 14px;
            color: #1F1F1F;
            line-height: 1.6;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .view-details {
          text-align: right;
          a {
            color: #7853b2;
          }
          .detail-link {
            color: #7853b2;

            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;

            &:hover {
              color: #ffffff;
              background-color: #7853b2;
              text-decoration: none;
            }
          }
        }
        // 卡片图片
        .card-image {
          width: 200px;
          height: 140px;
          flex-shrink: 0;
          margin-right: 20px;
          border-radius: 4px;
          overflow: hidden;

          .el-image {
            width: 100%;
            height: 100%;
          }
        }

        // 卡片内容
        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-right: 20px;

          .card-title {
            font-size: 20px;
            font-weight: bold;
            color: #282828;
            margin-bottom: 20px;
            line-height: 1.4;
            cursor: pointer;
            transition: color 0.3s ease;

            &:hover {
              color: #7853b2;
            }
          }

          .card-description {
            font-size: 14px;
            color: #777777;
            line-height: 24px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 50px;
          }
        }

        // 卡片操作按钮
        .card-action {
          flex-shrink: 0;
          display: flex;
          align-items: center;

          .card-link {
            color: #7853b2;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.3s ease;
            padding: 8px 16px;
            // border: 1px solid #7853b2;
            border-radius: 4px;
            display: inline-block;

            &:hover {
              color: #ffffff;
              background-color: #7853b2;
              text-decoration: none;
            }
          }
        }
      }
    }
  }

  .ctx-right {
    width: 300px;
    flex-shrink: 0;

    .more-services-title {
      display: flex;
      align-items: center;
      padding: 26px;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      background: #fff;
      border-bottom: 1px solid #d5d8de;
      .marker-img {
        margin-right: 10px;
        width: 20px;
      }
      .marker {
        width: 4px;
        height: 18px;
        background: #7853b2;
        margin-right: 8px;
      }
    }

    .category-section {
      background: #ffffff;
      border-radius: 4px;
      // margin-bottom: 20px;
      padding: 20px;

      .right-title {
        align-items: center;
        margin-bottom: 15px;
        font-size: 16px;
        font-weight: bold;
        color: #333333;

        .marker {
          width: 4px;
          height: 16px;
          background: #7853b2;
          margin-right: 8px;
        }
      }

      .tab-info {
        // padding: 12px;
        border-radius: 4px;
        margin-bottom: 24px;

        .tab-name {
          font-weight: bold;
          color: #1F1F1F;
          font-size: 16px; 
          .ico{
            width: 30px;
            margin-right: 10px;
          }
        }

        .tab-index {
          font-size: 12px;
          color: #505050;
        }
      }

      .category-content {
        .content-item {
          // padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;

          margin-bottom: 10px;
          &:last-child {
            border-bottom: none;
          }

          .item-title {
            font-size: 16px;
            color: #1F1F1F;
            margin-bottom: 5px; 
             display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
          }

          .item-desc {
            font-size: 14px;
            color: #999;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 5px;
          }

          .item-date {
            font-size: 11px;
            color: #505050;
          }
        }

        .loading-item {
          padding: 12px 0;
          text-align: center;
          color: #505050;
          font-style: italic;
        }
      }
    }
  }
}

.pagination-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 0 0 4px 4px;
  gap: 20px;

  .pagination-info {
    font-size: 14px;
    color: #1F1F1F;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;

    .page-arrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      color: #1F1F1F;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(.disabled) {
        border-color: #7853b2;
        color: #7853b2;
      }

      &.disabled {
        color: #ccc;
        cursor: not-allowed;
        border-color: #f0f0f0;
      }
    }

    .page-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      color: #1F1F1F;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(.dots) {
        border-color: #7853b2;
        color: #7853b2;
      }

      &.active {
        background: #7853b2;
        border-color: #7853b2;
        color: #ffffff;
      }

      &.dots {
        border: none;
        cursor: default;
        color: #505050;
        font-size: 14px;
        padding: 0 4px;
      }
    }
  }

  .goto-page {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #1F1F1F;

    .page-input {
      width: 50px;
      height: 32px;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      outline: none;

      &:focus {
        border-color: #7853b2;
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/news.less"></style>
<style scoped lang="less" src="@/assets/h5css/mobile/news.less"></style>

<!-- 全局样式覆盖Element UI的tab颜色 -->
<style lang="less">
.custom-tabs {
  border-bottom: 1px solid #d5d8de;
  padding: 23px 63px;
  .el-tabs__item {
    color: #1F1F1F !important;
    font-size: 16px;
    font-weight: bold;

    &:hover {
      color: #7853b2 !important;
    }

    &.is-active {
      color: #7853b2 !important;
    }
  }

  .el-tabs__active-bar {
    background-color: #7853b2 !important;
  }
}

/* 使用深度选择器确保样式穿透 */
.custom-tabs ::v-deep .el-tabs__item {
  color: #1F1F1F !important;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    color: #7853b2 !important;
  }

  &.is-active {
    color: #7853b2 !important;
  }
}

.custom-tabs ::v-deep .el-tabs__active-bar {
  background-color: #7853b2 !important;
}
</style>