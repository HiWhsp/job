<script>
export default {
  name: "joinGroup",
  data() {
    return {
      keyword: '',
      list: [],
      group: {},
      status: 0
    }
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      // 获取团体信息
      this.$api({
        url: 'my_team',
        method: 'post',
      }).then(res => {
        let {code, data} = res;
        this.status = data.msg
        this.group = res.data
      })
    },
    getList() {
      this.$api({
        url: 'search_team',
        method: 'post',
        data: {
          keyword: this.keyword
        }
      }).then(res => {
        let {code, data} = res;
        if (code === 200) {
          this.list = [data] || [];
        }
      })
    },
    // 加入团队
    joinGroup(id) {
      this.$api({
        url: 'join_team',
        method: 'post',
        data: {
          id
        }
      }).then(res => {
        let {code, data} = res;
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '申请成功'
          })
        }else {
          this.$message({
            type: 'error',
            message: '申请失败'
          })
        }
        this.getInfo();
        this.list = []
      })
    }
  }
}
</script>

<template>
  <div class="section-order">
    <div class="section-title">
      <div class="label">我的团体</div>
      <div class="search flex">
        <el-input placeholder="请输入负责人手机号/邮箱/团号/完整的团体名称" v-model="keyword">
        </el-input>
        <el-button type="primary" @click="getList">搜索</el-button>
      </div>
    </div>

    <div class="order-box">
      <div class="info-add" v-for="item in list" :key="item.id">
        <div class="team-info-container">
          <div class="team-details">
            <p><span>团体编号:</span> <span>{{ item.sn }}</span></p>
            <p><span>团体名称:</span> <span>{{ item.title }}</span></p>
            <p><span>所在高校/单位:</span> <span>{{ item.unit_name }}</span></p>
            <p><span>团体负责人:</span> <span>{{ item.leader }}</span></p>
            <p><span>负责人电话:</span> <span>{{ item.tel }}</span></p>
            <p><span>团体总成员:</span> <span>{{ item.teamer_no }}</span></p>
          </div>
          <div class="team-actions">
            <button class="apply-button" @click="joinGroup(item.id)">申请加入</button>
            <button class="rights-button" @click="$router.push('/groupRights')">团队权益</button>
          </div>
        </div>
      </div>
      <div class="info" v-if="Object.keys(group).length && list.length == 0">
        <div class="team-info-container">
          <div class="title">团队信息</div>
          <div class="info-grid">
            <div class="info-item">团体名称: <span>{{ group.title }}</span></div>
            <div class="info-item">团体编号: <span>{{ group.sn }}</span></div>
            <div class="info-item">所在高校/单位: <span>{{ group.unit_name }}</span></div>
            <div class="info-item">团体负责人: <span>{{ group.leader }}</span></div>
            <div class="info-item">负责人电话: <span>{{ group.tel }}</span></div>
            <div class="info-item">团体成员数: <span>{{ group.teamer_no }}</span></div>
          </div>
        </div>

      </div>
      <div class="audit" v-if="Object.keys(group).length">
        <img src="@/assets/img/base/appointment/pay-success.png" alt="" v-if="status == '入团申请审核中...'">
        <img src="../../../assets/img/base/appointment/pay-error.png" alt="" v-if="status == '很抱歉，加入团队未成功！'">
        <p class="status-text" v-if="status == '很抱歉，加入团队未成功！'">很抱歉，加入团队未成功！</p>
        <p class="status-text" v-if="status == '入团申请审核中...'">申请已提交成功</p>
        <p class="status-detail" v-if="status == '入团申请审核中...'">请耐心等待团长审核！</p>
        <div class="btn-box">
          <div class="btn back" v-if="status == '很抱歉，加入团队未成功！'">重新申请</div>
          <!--          <div class="btn back">撤销申请</div>-->
        </div>
      </div>
      <div class="empty-info" v-else>
        <div class="empty-img">
          <img src="../../../assets/img/my/empty-img.png" alt=""/>
        </div>
        <div class="empty-text">暂无加入任何团体，快去加入团体/创建团体吧</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.section-title {
  border-bottom: 1px solid #dedede;
  .flex-between();
  height: 56px;
  padding: 0 32px;

  .label {
    font-size: 18px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    color: #333333;
  }

  .search {
    width: 400px;

    .el-input {
      border: 1px solid #00479D;
    }

    /deep/ .el-input__inner {
      border-radius: 0;
      border: none;
    }

    .el-button--primary {
      height: 42px;
      background: #00479D;
      color: #fff;
      border-radius: 0;
      border: none;
    }
  }
}

.section-order {
  background: #fff;

  .order-box {
    min-height: 620px;

    .info-add {
      margin-top: 50px;
      display: flex;
      justify-content: center;

      // Variables
      @background-color: #f5f7fa;
      @card-background: #ffffff;
      @text-color: #333;
      @button-background: #0056b3;
      @button-hover: #004080;
      @button-border: #0056b3;
      @button-text: #ffffff;
      @padding: 16px;
      @border-radius: 8px;

      .team-info-container {
        width: 600px;
        height: 297px;
        background: rgba(51, 153, 255, 0.05);
        padding: 54px 118px;

        .team-details {

          p {
            font-size: 14px;
            margin-top: 15px;

            span:first-child {
              margin-top: 0;
              display: inline-block;
              width: 110px;
              color: #000;
            }

            span {
              color: #555;
            }
          }
        }

        .team-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 80px;

          button {
            padding: 10px 20px;
            border-radius: @border-radius;
            font-size: 14px;
            cursor: pointer;
            border: 1px solid @button-border;

            &.apply-button {
              background-color: @button-background;
              color: @button-text;
              border: none;

              &:hover {
                background-color: @button-hover;
              }
            }

            &.rights-button {
              background-color: transparent;
              color: @button-background;

              &:hover {
                background-color: @background-color;
              }
            }
          }
        }
      }

    }

    .info {
      // Variables
      @background-color: #eaf3ff;
      @title-background: #0066cc;
      @title-color: #ffffff;
      @text-color: #333;
      @padding: 16px;
      @border-radius: 8px;

      .team-info-container {
        background-color: #fff;
        padding: @padding;
        width: 80%;
        margin: 30px;

        .title {
          width: 98px;
          height: 40px;
          background: rgba(51, 153, 255, 0.15);
          color: #000;
          line-height: 40px;
          text-align: center;
          font-size: 16px;
          margin-bottom: 16px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); // Two columns
          gap: 12px;

          .info-item {
            font-size: 14px;
            color: @text-color;

            span {
              margin-left: 5px;
            }
          }
        }
      }
    }

    .audit {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 50px;

      img {
        max-width: 108px;
        max-height: 108px;
      }

      .status-text {
        margin-top: 30px;
        font-weight: bold;
        font-size: 20px;
        color: #282828;
      }

      .status-detail {
        margin-top: 20px;
        font-weight: 400;
        font-size: 14px;
        color: #FF0000;
      }

      .btn-box {
        display: flex;
        align-items: center;

        .btn {
          cursor: pointer;
          width: 133px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 3px;
          border: 1px solid #00479D;
          font-weight: 400;
          font-size: 14px;
          color: #00479D;
          margin-right: 20px;
          margin-top: 50px;
        }

        .back {
          background-color: #00479D;
          color: #fff;
        }
      }
    }

    .empty-info {
      text-align: center;
      padding: 40px 0;

      // border-top: 1px solid #dedede;
      .empty-img {
        text-align: center;

        img {
          width: 190px;
        }
      }

      .empty-text {
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #999999;
      }
    }

  }
}
</style>
