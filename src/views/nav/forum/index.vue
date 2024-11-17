<script>
import breadcrumb from "@/components/breadcrumb/index.vue";

export default {
  name: "index",
  components: {breadcrumb},
  data() {
    return {
      keyword: '', // 搜索
      detailForm: {}, // 详情
      commentVisible: false, // 评论弹框
      detailVisible: false, // 详情弹框
      PostVisible: false, // 发帖
      listData: [{isShow: false}, {isShow: false}],
      orderByColumn: "ordering", //选择的排序方式
      sortList: [ // 排序列表
        {title: "发表排序", ziduan: "ordering", not: true},
        {title: "热度排序", ziduan: "orders", not: true},
      ],
    }
  },
  methods: {
    detailFormChick(data) {
      this.detailForm = data;
      this.detailVisible = true;
    },
    // 评论
    commentAdd(item) {
      this.commentVisible = true
    },
    // 排序
    onClickSort(item) {
      this.orderByColumn = item.ziduan;
    },
    postSubmit() {
      this.PostVisible = false
      this.$router.push('/forum-success')
    }
  }
}
</script>

<template>
  <div class="container main">
    <breadcrumb
        :list="[{path: '/', name: '首页'}, { name: '服务内容'}, {path: '/analyze', name: '分析测试'}]"></breadcrumb>
    <div class="content">
      <div class="filter">
        <div class="left">
          <p class="sort" :class="{'active': item.ziduan === orderByColumn}" v-for="(item, index) in sortList"
             :key="index"
             @click="onClickSort(item)">
            <span>{{ item.title }}</span>
            <i class="el-icon-arrow-down"></i>
          </p>
        </div>
        <div class="right">
          <div class="search-bar">
            <el-input
                v-model="keyword"
                placeholder="请输入关键词"
                class="search-input"
                clearable
            >
              <template #append>
                <el-button icon="el-icon-search" class="search-btn"></el-button>
              </template>
            </el-input>
            <el-button type="primary" class="post-btn" @click="PostVisible = true">发帖</el-button>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="post-card" :class="{'hide': item.isShow}" v-for="(item, index) in listData" :key="index">
          <div class="info-wrap">
            <div class="post-header">
              <el-avatar src="https://via.placeholder.com/50" class="avatar"></el-avatar>
              <span>郭菲菲</span>
            </div>
            <div class="post-info">
              <h3 class="post-title">这里是帖子标题文案</h3>
              <p class="post-meta ellipsis-2">
                这里是关于X射线光电子能谱仪（X-ray Photoelectron Spectroscopy）是根据光电效应原理，
                实现辐射的表面几个原子层（1-10nm厚的表面）的化学组成、价态、深度剖析及成像综合
                分析与表征技术的设备。主要应用于高分子聚合物、陶瓷、玻璃、薄膜、纳米材料、金属、生物材料。
              </p>
            </div>
            <div class="post-footer">
              <span class="post-time">2024-08-31 18:30:02</span>
              <span class="post-details"><span @click="detailFormChick(item)">详情</span> | <span
                  @click="commentAdd(item)">评论(20)</span> | <span>点赞(35)</span></span>
            </div>
            <div class="isHide" @click="item.isShow = !item.isShow">
              <i class="el-icon-arrow-down"></i>
            </div>
            <el-button type="primary" size="small" class="action-btn">科研工具</el-button>
          </div>
          <div class="comment-wrap">
            <div class="comment-item" v-for="i in 3">
              <div class="post-header">
                <el-avatar src="https://via.placeholder.com/50" class="avatar"></el-avatar>
                <span>郭菲菲</span>
              </div>
              <div class="post-info">
                <p class="post-meta ellipsis-2">
                  这里是关于X射线光电子能谱仪（X-ray Photoelectron Spectroscopy）是根据光电效应原理，
                  实现辐射的表面几个原子层（1-10nm厚的表面）的化学组成、价态、深度剖析及成像综合
                  分析与表征技术的设备。主要应用于高分子聚合物、陶瓷、玻璃、薄膜、纳米材料、金属、生物材料。
                </p>
              </div>
              <div class="post-footer">
                <span class="post-time">2024-08-31 18:30:02</span>
                <span class="post-details" @click="detailFormChick(i)">详情</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    评论-->
    <el-dialog
        title="评论"
        :visible.sync="commentVisible">
      <el-input type="textarea" rows="10"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="commentVisible = false">取 消</el-button>
        <el-button type="primary" @click="commentVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--    详情-->
    <el-dialog
        title="详情"
        :visible.sync="detailVisible">
      <div class="detailDialog">

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--    发帖-->
    <el-dialog
        title="发帖"
        :visible.sync="PostVisible">
      <div class="postDialog">
        <div class="top-box">
          <div class="type">选择分类： 学术交流区-分类名称</div>
          <div class="type-list">
            <el-popover
                v-for="i in 3"
                :key="i"
                placement="bottom-start"
                width="400"
                trigger="hover">
              <div class="type-popover">
                <div class="type-item" v-for="j in 3" :key="j">分类名称</div>
              </div>
              <div slot="reference" class="type-item" :class="{'active': i === 1}">学术交流区</div>
            </el-popover>
          </div>
        </div>
        <el-input type="text" placeholder="请输入帖子标题" class="title"></el-input>
        <el-input type="textarea" placeholder="请输入帖子内容" rows="10" class="content"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="PostVisible = false">取消</el-button>
        <el-button type="primary" @click="postSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.container {
  padding-bottom: 100px;
}

.content {
  margin-top: 90px;

  .filter {
    display: flex;
    justify-content: space-between;
    margin-bottom: 35px;

    .left {
      display: flex;

      .sort {
        display: flex;
        align-items: center;
        margin-right: 30px;
        cursor: pointer;

        span {
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          margin-right: 5px;
        }

        i {
          font-size: 20px;
          font-weight: bold;
          transition: all 0.5s ease-in-out;
        }

        &.active {
          i {
            transition: all 0.5s ease-in-out;
            transform: rotate(180deg);
          }
        }
      }
    }

    .right {
      .search-bar {
        width: 500px; /* 根据需要调整宽度 */
        display: flex;

        .search-input {
          width: 100%;

          /deep/ .el-input__inner {
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
            border: none;
          }

          /deep/ .el-input-group__append {
            background-color: #fff;
            border-top-right-radius: 50px;
            border-bottom-right-radius: 50px;
            border: none;
          }
        }

        .search-btn {
          background-color: #00479D; /* 蓝色搜索按钮背景 */
          color: #fff;
          border-radius: 50px;
        }

        .post-btn {
          margin-left: 15px;
          background-color: #00479D; /* 发帖按钮背景 */
          border-radius: 50px;
          color: white;
        }
      }
    }
  }

  .list {
    .post-card {
      margin-bottom: 30px;

      &.hide {
        .comment-wrap {
          // 慢慢收起
          transition: all 0.5s ease-in-out;
          padding: 35px 88px;
          height: 100%;
        }

        .isHide {
          transform: rotate(180deg);
          transition: all 0.5s ease-in-out;
        }
      }

      .info-wrap {
        display: flex;
        align-items: center;
        background: #fff;
        padding: 40px;
        border-radius: 8px;
        position: relative;
      }
    }

    .post-header {
      display: flex;
      flex-direction: column;
      margin-right: 40px;

      .avatar {
        flex-shrink: 0;
        margin-bottom: 12px;
      }
    }

    .post-info {
      flex: 1;

      .post-title {
        font-size: 18px;
        margin: 0 0 10px;
        color: #00479D;
      }

      .post-meta {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
    }

    .post-footer {
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 14px;
      color: #999;
      margin: 0 40px;

      .post-time {
        color: #999;
      }

      .post-details {
        color: #444;
        cursor: pointer;
      }
    }

    .isHide {
      cursor: pointer;
      font-size: 26px;
      font-weight: bold;
      transition: all 0.5s ease-in-out;
    }

    .action-btn {
      position: absolute;
      top: 0;
      right: 0;
      width: 114px;
      height: 30px;
      background: #00479D;
      border-radius: 0px 0px 0px 15px;
      border: none;
    }

    .comment-wrap {
      box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.16);
      background-color: #fff;
      padding: 0 88px;
      border-top: 1px solid #00479D;
      height: 0;
      overflow: hidden;
      transition: all 0.5s ease-in-out;

      .comment-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #EDEDED;

        .post-footer {
          align-items: center;
        }
      }
    }
  }
}

.detailDialog {
  height: 500px;
  overflow-y: auto;
}

.postDialog {
  .top-box {
    display: flex;
    justify-content: space-between;

    .type {
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }

    .type-list {
      display: flex;

      .type-item {
        padding: 5px 15px;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        border: 1px solid #00479D;
        margin-right: 15px;
        cursor: pointer;

        &.active {
          background-color: #00479D;
          color: #fff;
        }
      }
    }
  }

  .title {
    margin-top: 45px;
  }

  .content {
    margin-top: 15px;
  }
}

.type-popover {
  .type-item {
    padding: 5px 15px;
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    margin-right: 15px;
    cursor: pointer;

    &:hover {
      color: #00479D;
    }
  }
}

.el-button--primary {
  background-color: #00479D;
  border: none;
}
</style>