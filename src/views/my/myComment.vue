<script>

export default {
  name: "index",
  data() {
    return {
      keyword: '', // 搜索
      detailForm: {}, // 详情
      detailVisible: false, // 详情弹框
      editVisible: false, // 编辑
      listData: [],
      selectTab: {title: "待审核", status: "1"},
      selectItem: {isShow: false},
      list_tab: [
        {title: "待审核", status: "1"},
        {title: "已通过", status: "2"},
        {title: "被驳回", status: "3"},
      ],
      commentList: [], // 评论列表
      pagination: {
        page: 1,
        limit: 5,
      },
      count: 0,
    }
  },
  watch: {
    selectTab() {
      this.getList()
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.$api({
        url: 'bbs_my_reply',
        method: 'post',
        data: {
          ...this.pagination,
          status: this.selectTab.status,
        }
      }).then(res => {
        let {code, data} = res;
        if (code === 200) {
          this.listData = data.data;
          this.count = data.total;
        }
      })
    },
    lockDetail(item) {
      this.$api({
        url: 'bbs_detail',
        method: 'post',
        data: {
          id: item.postId
        }
      }).then(res => {
        let {code, data} = res;
        if (code === 200) {
          this.detailForm = data
          this.detailVisible = true
        }
      })
    },
    editSubmit() {
      this.editVisible = false
    },
    // 查看评论
    showComment() {
      this.$api({
        url: 'bbs_reply_list',
        method: 'post',
        data: {
          id: this.detailForm.id,
          ...this.pagination
        }
      }).then(res => {
        if (res.code === 200) {
          this.commentList = res.data.data
          this.selectItem.isShow = !this.selectItem.isShow
        }
      })
    },
  }
}
</script>

<template>
  <div class="container">
    <div class="filter">
      <div class="left">我的评论</div>
      <div class="right">
        <div class="search-bar">
          <el-input
              v-model="keyword"
              placeholder="请输入仪器名/订单号"
              class="search-input"
              clearable
          >
            <template #append>
              <el-button class="search-btn">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <div class="tab-box">
      <div
          class="tab-item"
          v-for="(item, index) in list_tab"
          :key="index"
          @click="selectTab = item"
          :class="item.title === selectTab.title ? 'active' : ''"
      >
        {{ item.title }}
      </div>
    </div>

    <div class="content">
      <div class="list">
        <div class="post-card" :class="{'hide': item.isShow}" v-for="(item, index) in listData" :key="index">
          <div class="info-wrap">
            <div class="left">
              <div class="post-info">
                <p class="post-meta ellipsis-2">{{ item.content }}</p>
              </div>
              <div class="post-footer">
                <span class="post-details">
                  <span @click="lockDetail(item)">查看原帖</span>
                </span>
                <span class="post-time">{{ item.created_at }}</span>
              </div>
            </div>
            <div class="right status">
              <p :class="{'success': item.status == '2', 'error': item.status == '3'}">
                {{ item.status == '2' ? '已通过' : item.status == '3' ? '被驳回' : '' }}</p>
              <p class="pointer" v-if="item.status == '3'" @click="editVisible = true">修改</p>
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
    </div>

    <!--    详情-->
    <el-dialog
        title="帖子详情"
        :visible.sync="detailVisible">
      <div class="detailDialog" :class="{'hide': selectItem.isShow}">
        <div class="edit-box">
          <p><span>帖子分类：</span><span>学术交流区-分类名称</span></p>
        </div>
        <div class="title">{{ detailForm.title }}</div>
        <div class="content">{{ detailForm.description }}</div>

        <div class="info">
          <span>{{ detailForm.created_at }}</span>
          <div class="item">
            <span>详情</span>
            <span>评论({{ detailForm.comment_no }})</span>
            <span>点赞({{ detailForm.like_no }})</span>
          </div>
        </div>
        <div class="icon-wrap" @click="showComment">
          <i class="el-icon-arrow-down isHide"></i>
        </div>
        <div class="comment-wrap">
          <div class="comment-item" v-for="(it, i) in commentList" :key="i">
            <div class="post-header">
              <el-avatar :src="it.user.avatar" class="avatar"></el-avatar>
              <span>{{  it.user.name }}</span>
            </div>
            <div class="post-info">
              <p class="post-meta ellipsis-2">{{ it.content }}</p>
              <div class="post-footer">
                <span class="post-time">{{ it.created_at }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
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
        </div>
        <el-input type="textarea" placeholder="这里是评论内容" rows="10" class="content"></el-input>
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
  }
}

.detailDialog {
  height: 500px;
  overflow-y: auto;
  padding-right: 20px;

  .icon-wrap {
    text-align: right;
  }

  .title {
    margin-top: 30px;
  }

  .content {
    margin-top: 20px;
    padding: 0;
  }

  .info {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    font-size: 16px;

    span {
      color: #999999;
    }

    .item {
      span {
        cursor: pointer;
        color: #333333;
        margin-left: 10px;
      }
    }
  }

  .isHide {
    margin-top: 10px;
    cursor: pointer;
    font-size: 26px;
    font-weight: bold;
    transition: all 0.5s ease-in-out;
  }

  .comment-wrap {
    height: 0;
    transition: all 0.5s ease-in-out;
    .comment-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #EDEDED;

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
        display: flex;
        font-size: 14px;
        color: #999;
        margin-top: 20px;

        .post-time {
          color: #999;
          margin-right: 20px;
        }

        .post-details {
          color: #444;
          cursor: pointer;
        }
      }
    }
  }

  &.hide {
    .comment-wrap {
      // 慢慢收起
      height: 100%;
    }

    .isHide {
      transform: rotate(180deg);
      transition: all 0.5s ease-in-out;
    }
  }
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
