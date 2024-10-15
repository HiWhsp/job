<template>
  <div class="page">

    <div class="main">
      <div class="left">
        <div class="left-title">
          <span>资料下载</span>
        </div>
        <div class="left-blank"></div>
        <div class="left-content">
          <div
            class="left-content-item"
            :class="{ active: activeLeftIndex === index }"
            v-for="(item, index) in leftContentList"
            :key="item.id"
            @click="onLeftContentClick(index)"
          >
            <div>{{ item.name }}</div>
            <div class="icon"></div>
          </div>
        </div>
        <div class="left-bottom-blank"></div>
      </div>
      <div class="right">
        <div
          class="list-item"
          v-for="(item, index) in rightContentList"
          :key="index"
        >
          <div class="list-item-title">
            <div class="title-img-wrap">
              <img src="@/assets/img/service/file.png" alt="file" />
            </div>
            <div class="text">下载文件信息</div>
          </div>
          <div class="list-item-content">
            <div class="content-img-wrap">
              <img src="@/assets/img/service/download.png" alt="download" />
            </div>
            <div class="content-item-value">立即下载</div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <el-pagination
        @current-change="changePage"
        :current-page.sync="pagination.page"
        :page-size="pagination.pageNum"
        layout="total, prev, pager, next, jumper"
        :total="count"
        size="large"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "service-support",
  data() {
    return {
      activeLeftIndex: 0,
      leftContentList: [
        {
          name: "资料下载分类1",
        },
        {
          name: "资料下载分类2",
        },
        {
          name: "资料下载分类3",
        },
        {
          name: "资料下载分类4",
        },
      ],
      rightContentList: [
        {
          id: 1,
          name: "资料下载分类1",
        },
        {
          id: 2,
          name: "资料下载分类2",
        },
      ],
      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 100,
    };
  },
  methods: {
    onTabClick(index) {
      this.activeIndex = index;
    },
    onLeftContentClick(index) {
      this.activeLeftIndex = index;
    },
    changePage(page) {
      this.pagination.page = page;
    },
  },
};
</script>

<style scoped lang="less">
.main {
  margin: 63px 260px 65px;
  display: flex;
  gap: 28px;
  .left {
    width: 270px;
    background: #ffffff;
    border-radius: 20px 0px 20px 0px;
    overflow: hidden;
    box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
    .left-title {
      height: 73px;
      padding: 21px 0 0 46px;
      background: #27417c;
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
      line-height: 25px;
    }
    .left-blank {
      height: 10px;
      background: #fff;
    }
    .left-content {
      background: #27417c;
      .left-content-item {
        height: 46px;
        padding: 11px 0 0 23px;
        font-size: 18px;
        line-height: 30px;
        background: #fff;
        cursor: pointer;
        border-bottom: 1px solid #707070;
        &.active {
          font-weight: bold;
          color: #ffffff;
          background: #27417c;
        }
      }
    }
    .left-bottom-blank {
      height: 34px;
      background: #fff;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    gap: 20px;
    .list-item {
      width: 1102px;
      height: 109px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 53px;
      padding-right: 69px;
      background: #ffffff;
      box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.11);
      border-radius: 8px 8px 8px 8px;
      border: 1px solid #dfdfdf;
      .list-item-title {
        display: flex;
        align-items: center;
        gap: 27px;
        .title-img-wrap {
          width: 46px;
          height: 53px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          font-size: 18px;
          color: #333333;
          line-height: 32px;
        }
      }
      .list-item-content {
        display: flex;
        align-items: center;
        gap: 20px;
        .content-img-wrap {
          width: 21px;
          height: 19px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .content-item-value {
          width: 100%;
          height: 24px;
          font-size: 18px;
          color: #7d7d7d;
        }
      }
    }
  }
}

.pagination {
  text-align: center;
  margin-bottom: 65px;
}
</style>

