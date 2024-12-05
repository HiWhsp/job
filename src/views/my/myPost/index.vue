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
      listData: [],
      selectTab: {title: "待审核", status: "1"},
      list_tab: [
        {title: "待审核", status: "1"},
        {title: "已通过", status: "2"},
        {title: "被驳回", status: "3"},
      ],
      commentParams: {}, // 评论
      categoryParams: {}, // 板块表单
      categoryList: [], // 板块列表
      categoryItem: {}, // 选择的板块
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
    //   获取板块列表
    this.$api({
      url: 'bbs_category',
      method: 'post'
    }).then(res => {
      if (res.code === 200) {
        this.categoryList = res.data;
        this.count = res.data.total;
      }
    });
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.$api({
        url: 'bbs_my_list',
        method: 'post',
        data: {
          status: this.selectTab.status,
          keywords: this.keyword,
          ...this.pagination
        }
      }).then(res => {
        let {code, data} = res;
        if (code === 200) {
          this.listData = data.data;
          this.count = data.total;
          this.listData.forEach((item, index) => {
            this.$set(this.listData[index], 'isShow', false)
          })
        }
      })
    },
    detailFormChick(data) {
      this.$api({
        url: 'bbs_detail',
        method: 'post',
        data: {
          id: data.id
        }
      }).then(res => {
        this.detailForm = res.data;
        this.detailVisible = true;
      })
    },
    // 评论
    commentAdd(item) {
      console.log(item)
      this.commentParams.parentId = item.id;
      this.commentParams.replyUserId = item.user_id;
      this.commentVisible = true
    },
    // 发帖
    postSubmit() {
      if (!this.categoryItem.children || !this.categoryItem.children.id) {
        this.$message.error('请选择分类')
        return
      }
      if (!this.categoryParams.title) {
        this.$message.error('请输入标题')
        return
      }
      if (!this.categoryParams.content) {
        this.$message.error('请输入内容')
        return
      }
      this.$api({
        url: 'bbs_do_publish',
        method: 'post',
        data: {
          cate_id: this.categoryItem.children.id,
          ...this.categoryParams
        }
      }).then(res => {
        if (res.code === 200) {
          this.PostVisible = false
          this.$router.push('/forum-success')
        }
      })
    },
    // 编辑帖子提交
    editSubmit() {
      // if (!this.categoryItem.children || !this.categoryItem.children.id) {
      //   this.$message.error('请选择分类')
      //   return
      // }
      if (!this.categoryParams.title) {
        this.$message.error('请输入标题')
        return
      }
      if (!this.categoryParams.content) {
        this.$message.error('请输入内容')
        return
      }
      this.$api({
        url: 'bbs_do_publish',
        method: 'post',
        data: {
          cate_id: 1303,
          title: this.categoryParams.title,
          content: this.categoryParams.content,
          id: this.categoryParams.id
        }
      }).then(res => {
        if (res.code === 200) {
          this.editVisible = false;
          this.$message.success('编辑成功');
        }
      })
    },
    // 点击板块
    categoryItemClick(origin, target) {
      const obj = {...origin}
      this.categoryItem = Object.assign(obj, {children: target})
    },
    // 关闭
    categoryClose() {
      this.categoryItem = {}
      this.categoryParams = {}
    },
    // 查看评论
    showComment(item) {
      this.$api({
        url: 'bbs_reply_list',
        method: 'post',
        data: {
          id: item.id,
          ...this.pagination
        }
      }).then(res => {
        if (res.code === 200) {
          this.commentList = res.data.data
          this.listData.forEach((i, index) => {
            if (i.id === item.id) {
              this.$set(this.listData[index], 'isShow', !item.isShow)
            } else {
              this.$set(this.listData[index], 'isShow', false)
            }
          })
        }
      })
    },
    // 编辑帖子
    editClick(item) {
      this.$api({
        url: 'bbs_my_detail',
        method: 'post',
        data: {
          id: item.id
        }
      }).then(res => {
        if (res.code === 200) {
          this.categoryParams = res.data
          this.editVisible = true
        }
      })
    },
    // 添加评论
    commentAddSubmit() {
      if (!this.commentParams.content) {
        this.$message.error('请输入内容')
        return
      }
      this.$api({
        url: 'bbs_do_reply',
        method: 'post',
        data: {
          ...this.commentParams
        }
      }).then(res => {
        if (res.code === 200) {
          this.commentVisible = false
          this.getList()
        }
      })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="filter">
      <div class="left">我的帖子</div>
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
          <el-button type="primary" class="post-btn" @click="PostVisible = true">发帖</el-button>
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
                <h3 class="post-title">{{ item.title }}</h3>
                <p class="post-meta ellipsis-2">{{ item.description }}</p>
              </div>
              <div class="post-footer">
                <span class="post-details">
                  <span @click="detailFormChick(item)">详情</span><span>评论({{
                    item.comment_no
                  }})</span><span>点赞({{ item.like_no }})</span>
                </span>
                <span class="post-time">{{ item.created_at }}</span>
              </div>
            </div>
            <div class="right status">
              <p :class="{'success': item.status == '2', 'error': item.status == '3'}">
                {{ item.status == '2' ? '已通过' : item.status == '3' ? '被驳回' : '待审核' }}</p>
              <p class="pointer" v-if="item.status == '3'" @click="editClick(item)">修改</p>
              <div class="isHide" @click="showComment(item)">
                <i class="el-icon-arrow-down"></i>
              </div>
            </div>
            <el-button type="primary" size="small" class="action-btn">科研工具</el-button>
          </div>
          <div class="comment-wrap">
            <div class="comment-item" v-for="(i, ix) in commentList" :key="ix">
              <div class="post-header">
                <el-avatar src="https://via.placeholder.com/50" class="avatar"></el-avatar>
                <span>{{ i.user.name }}</span>
              </div>
              <div class="post-info">
                <p class="post-meta ellipsis-2">{{ i.content }}</p>
              </div>
              <div class="post-footer">
                <span class="post-time">{{ i.created_at }}</span>
                <span class="post-details" @click="detailFormChick(i)">详情</span>
              </div>
            </div>
            <el-empty v-if="!commentList.length" description="暂无记录..."></el-empty>
          </div>
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
          @current-change="changePage"
      >
      </el-pagination>
    </div>
    <el-empty v-else description="暂无记录..."></el-empty>

    <!--    评论-->
    <el-dialog
        title="评论"
        :visible.sync="commentVisible">
      <el-input type="textarea" rows="10" v-model="commentParams.content"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="commentVisible = false">取 消</el-button>
        <el-button type="primary" @click="commentAddSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--    详情-->
    <el-dialog
        title="详情"
        :visible.sync="detailVisible">
      <div class="detailDialog" v-html="detailForm.detail ? detailForm.detail.detail : ''">

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--    发帖-->
    <el-dialog
        title="发帖"
        :visible.sync="PostVisible"
        @close="categoryClose">
      <div class="postDialog">
        <div class="top-box">
          <div class="type">选择分类：
            {{ categoryItem.title ? categoryItem.title + '-' + categoryItem.children.title : '无' }}
          </div>
          <div class="type-list">
            <el-popover
                v-for="(item, index) in categoryList"
                :key="index"
                placement="bottom-start"
                width="400"
                trigger="hover">
              <div class="type-popover">
                <div class="type-item active" v-for="it in item.children" :key="it.id"
                     @click="categoryItemClick(item, it)">
                  {{ it.title }}
                </div>
              </div>
              <div slot="reference" class="type-item active">{{ item.title }}</div>
            </el-popover>
          </div>
        </div>
        <el-input type="text" placeholder="请输入帖子标题" class="title" v-model="categoryParams.title"></el-input>
        <el-input type="textarea" placeholder="请输入帖子内容" rows="10" class="content"
                  v-model="categoryParams.content"></el-input>
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
            <span>{{ categoryParams.audit_remark || '无' }}</span>
          </p>
          <p>
            <span>帖子分类：</span>
            <span>学术交流区-分类名称</span>
          </p>
        </div>
        <el-input type="text" placeholder="请输入帖子标题" class="title" v-model="categoryParams.title"></el-input>
        <el-input type="textarea" placeholder="请输入帖子内容" rows="10" class="content"
                  v-model="categoryParams.content"></el-input>
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
