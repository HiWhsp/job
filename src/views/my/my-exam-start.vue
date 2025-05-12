<script>
export default {
  name: "my-exam-start",
  data() {
    return {
      id: '',
      checkbox: false
    }
  },
  mounted() {
    this.id = this.$route.query.id;
  },
  methods: {
    submit() {
      if (!this.checkbox) {
        this.$message({
          message: '请阅读并同意考试须知',
          type: 'warning'
        })
        return
      }
      this.$api({
        url: 'startQuestion',
        method: 'post',
        data: {
          question_id: this.id
        }
      }).then(res => {
        if (res.code == 200) {
          this.$router.push('my-exam-submit?id=' + this.id);
        }else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="left">
      <div class="profile">
        <div class="title">考生信息</div>
        <div class="profile-info">
          <img alt="" src="@/static/prod/avatar.png">
          <div class="info">
            <div class="name">{{ baseInfo.name }}</div>
            <div class="level">
              <p><span>角</span><span>色</span></p>
              <span>:</span>
              <p>{{ baseInfo.identity_name }}</p>
            </div>
            <div class="phone">
              <p>手机号</p>
              <span>:</span>
              <p>{{ baseInfo.mobile }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="name">考试须知</div>
        <div class="criterion"></div>
        <div class="protocol">
          <el-checkbox v-model="checkbox" type="checkbox"></el-checkbox>
          <p>我已阅读并同意<span>《考试须知》</span></p>
        </div>
        <div class="submit-btn">
          <el-button type="primary" @click="submit">开始考试</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  height: calc(100vh - 80px);
  padding: 25px 37px 0;
  background: #F5F6F6;
  display: flex;
  align-items: start;

  .left {
    width: 362px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .title {
      height: 60px;
      background: #FAFAFA;
      border-bottom: 1px solid #DEDEDE;
      text-align: center;
      line-height: 60px;
      font-family: Source Han Sans, Source Han Sans;
      font-weight: 700;
      font-size: 20px;
      color: #23324F;
    }

    .profile {
      width: 100%;
      background-color: #fff;
      border: 1px solid #DEDEDE;

      .profile-info {
        padding: 34px;
        display: flex;

        img {
          width: 78px;
          height: 78px;
        }

        .info {
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .name {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 700;
            font-size: 18px;
            color: #1F253B;
          }

          .level, .phone {
            display: flex;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #6F6F6F;

            p {
              width: 36px;
              display: flex;
              justify-content: space-between;

              span {
                margin: 0;
              }
            }

            span {
              display: inline-block;
              margin: 0 5px;
            }
          }
        }
      }
    }
  }

  .content {
    height: 780px;
    border: 1px solid #DEDEDE;
    margin-left: 36px;
    flex: 1;
    background-color: #fff;
    padding: 45px 60px;

    .title {
      .name {
        font-family: Source Han Sans, Source Han Sans;
        font-weight: 700;
        font-size: 30px;
        color: #23324F;
        text-align: center;
      }

      .criterion {
        padding: 26px 0;
        font-family: Source Han Sans, Source Han Sans;
        font-weight: 400;
        font-size: 18px;
        color: #23324F;
        height: 550px;
        overflow-y: auto
      }

      .protocol {
        margin-top: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        font-family: Source Han Sans, Source Han Sans;
        font-weight: 400;
        font-size: 14px;
        color: #23324F;

        p {
          margin-left: 5px;

          span {
            color: @theme;
          }
        }
      }

      .submit-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 45px;

        .el-button {
          width: 134px;
          background: linear-gradient(138deg, #175E3D 0%, #257C54 100%);
          border-radius: 4px 4px 4px 4px;
          border: none;
        }
      }
    }
  }
}
</style>
