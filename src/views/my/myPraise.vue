<script>

export default {
  name: "index",
  data() {
    return {
      keyword: '', // 搜索
      detailForm: {}, // 详情
      commentVisible: false, // 评论弹框
      detailVisible: false, // 详情弹框
      PostVisible: false, // 发帖
      editVisible: false, // 编辑
      listData: [{isShow: false, status: '1'}, {isShow: false, status: '2'}],
      pagination: {
        page: 1,
        limit: 5,
      },
      count: 0,
    }
  },
  watch: {
    selectTab() {
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.$api({
        url: 'bbs_my_like',
        method: 'post',
        data: {
          keyword: this.keyword,
          ...this.pagination
        }
      }).then(res => {
        let {code, data} = res;
        if (code === 200) {
          this.listData = data.data;
          this.count = data.total;
        }
      })
    },
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
    },
    editSubmit() {
      this.editVisible = false
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="filter">
      <div class="left">我的点赞</div>
      <div class="right">
        <div class="search-bar">
          <el-input
              v-model="keyword"
              placeholder="请输入仪器名/订单号"
              class="search-input"
              clearable
          >
            <template #append>
              <el-button class="search-btn" @click="getList">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="list">
        <div class="post-card" :class="{'hide': item.isShow}" v-for="(item, index) in listData" :key="index">
          <div class="info-wrap">
            <div class="left">
              <div class="post-info">
                <h3 class="post-title">{{ item.posts.title }}</h3>
                <p class="post-meta ellipsis-2">{{ item.posts.description }}</p>
              </div>
              <div class="post-footer">
                <span class="post-details">
                  <span @click="detailFormChick(item)">详情</span><span
                    @click="commentAdd(item)">评论({{ item.posts.comment_no }})</span><span>点赞({{
                    item.posts.like_no
                  }})</span>
                </span>
                <span class="post-time">{{ item.created_at }}</span>
              </div>
            </div>
            <div class="right">
              <p class="pointer">取消点赞</p>
            </div>
            <el-button type="primary" size="small" class="action-btn">科研工具</el-button>
          </div>
        </div>
      </div>

      <div class="pagination-box" v-if="count">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :total="count"
            :current-page.sync="pagination.page"
            :page-size.sync="pagination.limit"
            @current-change="getList"
        >
        </el-pagination>
      </div>
      <el-empty v-else description="暂无记录..."></el-empty>
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

    <!--    修改-->
    <el-dialog
        title="修改"
        :visible.sync="editVisible">
      <div class="postDialog">
        <div class="edit-box">
          <p>
            <span class="red">驳回原因：</span>
            <span>这里是一段驳回原因</span>
          </p>
          <p>
            <span>帖子分类：</span>
            <span>学术交流区-分类名称</span>
          </p>
        </div>
        <el-input type="text" placeholder="请输入帖子标题" class="title"></el-input>
        <el-input type="textarea" placeholder="请输入帖子内容" rows="10" class="content"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="editSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.container {
  background-color: #fff;
  padding-bottom: 100px;
  padding-top: 0;
}

.filter {
  padding: 0 30px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  border-bottom: 1px solid #E8E8E8;

  .left {
    font-weight: 400;
    font-size: 18px;
    color: #212529;
  }

  .right {
    .search-bar {
      width: 500px; /* 根据需要调整宽度 */
      display: flex;
      align-items: center;

      .search-input {
        width: 100%;

        /deep/ .el-input__inner {
          border: 1px solid #00479D;
          border-radius: 0;
        }

        /deep/ .el-input-group__append {
          background-color: #00479D; /* 蓝色搜索按钮背景 */
          border-radius: 0;
          border: 1px solid #00479D;
        }
      }

      .search-btn {
        //background-color: #00479D; /* 蓝色搜索按钮背景 */
        color: #fff;
        border-radius: 0;
      }

      .post-btn {
        margin-left: 15px;
        background-color: #00479D; /* 发帖按钮背景 */
        border-radius: 0;
        color: white;
      }
    }
  }
}

.tab-box {
  margin-top: 24px;
  margin-bottom: 32px;
  .flex();
  justify-content: center;

  .tab-item {
    cursor: pointer;
    padding-bottom: 10px;
    border-bottom: 3px solid transparent;
    margin-right: 55px;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;

    &.active {
      border-bottom: 3px solid @theme;
      font-weight: bold;
      color: @theme;
    }
  }
}

.content {
  padding: 0 30px;

  .list {
    .post-card {
      margin-bottom: 30px;
      border: 1px solid #B7B7B7;

      &.hide {
        .comment-wrap {
          // 慢慢收起
          transition: all 0.5s ease-in-out;
          border-top: 1px solid #00479D;
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

        .left {
          flex: 1;
        }

        .post-info {

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
          margin-top: 24px;
          display: flex;
          font-size: 14px;
          color: #999;

          .post-time {
            color: #999;
          }

          .post-details {
            color: #444;
            cursor: pointer;

            span {
              margin-right: 20px;
            }
          }
        }

        .right {
          margin-left: 80px;
          text-align: center;
          color: #00479D;

          .success {
            color: #00A527;
          }

          .error {
            color: red;
          }

          p:nth-child(2) {
            margin-top: 8px;
          }
        }
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

    .isHide {
      margin-top: 10px;
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
          display: flex;
          flex-direction: column;
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
    padding: 0;
    margin-top: 15px;
  }

  .edit-box {
    p {
      font-weight: 400;
      font-size: 16px;
      color: #333333;
      margin-bottom: 15px;

      span {
        margin-right: 10px;
      }

      .red {
        color: red;
      }
    }
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
