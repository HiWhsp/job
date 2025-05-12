<script>
export default {
  name: "my-exam-submit",
  data() {
    return {
      id: '',
      show_modal: false,
      detail: {},
      question: {
        judge_content: {},
        multiple_content: {},
        single_content: {}
      }
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'myQuestion',
        method: 'get',
        data: {
          question_id: this.id
        }
      }).then(res => {
        if (res.code == 200) {
          this.detail = res.data;
          this.question = res.data.question;
          // 判断题
          this.question.judge_content.list.forEach((item, index) => {
            item.checked = false;
            item.selectText = '';
          })
          // 多选题
          this.question.multiple_content.list.forEach((item, index) => {
            item.checked = false;
            item.selectText = '';
          })
          // 单选题
          this.question.single_content.list.forEach((item, index) => {
            item.checked = false;
            item.selectText = '';
          })
        }
      })
    },
    /**
     * 选项点击
     * @param item 点击的选项
     * @param question 当前题
     * @param type 题型 single(单选)/multiple(多选)/judge(判断)
     */
    topicClick(item, question, type) {
      if (type === 'single') {
        question.checked = !question.checked;
        question.selectText = item;
      } else if (type === 'multiple') {
        const textList = question.selectText.split(',');
        textList.includes(item) ? textList.splice(textList.indexOf(item), 1) : textList.push(item);
        question.selectText = textList.join(',');
        question.checked = question.selectText !== '';
      } else if (type === 'judge') {
        question.checked = !question.checked;
        question.selectText = item;
      }
      this.selectTopicNum();
      this.$forceUpdate()
    },
    // 选项标识
    topicList(item) {
      return 'ABCD'.substring(item, item + 1)
    },
    // 已选题数
    selectTopicNum() {
      let num = 0;
      num += this.question.single_content.list.filter(item => item.checked).length;
      num += this.question.multiple_content.list.filter(item => item.checked).length;
      num += this.question.judge_content.list.filter(item => item.checked).length;
      return num
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
            <div class="name">张洪玲</div>
            <div class="level">
              <p><span>角</span><span>色</span></p>
              <span>:</span>
              <p>教师</p>
            </div>
            <div class="phone">
              <p>手机号</p>
              <span>:</span>
              <p>15810593012</p>
            </div>
          </div>
        </div>
      </div>
      <div class="answer">
        <div class="title">答题卡</div>
        <div class="answer-content">
          <!--          题型-->
          <div class="question-list">
            <div class="question-item">
              <div class="question-title">
                单选题（共{{ question.single_content.total_num }}题，总分{{ question.single_content.total_point }}分）
              </div>
              <div class="question-content">
                <div class="question-content-item" :class="{'correct': item.checked, 'unknown': !item.checked}"
                     v-for="(item, index) in question.single_content.list" :key="index">
                  {{ index + 1 }}
                </div>
              </div>
            </div>
            <div class="question-item">
              <div class="question-title">
                判断题（共{{ question.judge_content.total_num }}题，总分{{ question.judge_content.total_point }}分）
              </div>
              <div class="question-content">
                <div class="question-content-item" :class="{'correct': item.checked, 'unknown': !item.checked}"
                     v-for="(item, index) in question.judge_content.list" :key="index">
                  {{ index + 1 }}
                </div>
              </div>
            </div>
            <div class="question-item">
              <div class="question-title">
                多选题（共{{ question.multiple_content.total_num }}题，总分{{ question.multiple_content.total_point }}分）
              </div>
              <div class="question-content">
                <div class="question-content-item" :class="{'correct': item.checked, 'unknown': !item.checked}"
                     v-for="(item, index) in question.multiple_content.list" :key="index">
                  {{ index + 1 }}
                </div>
              </div>
            </div>
          </div>
          <div class="all-score">
            总分：{{ question.total_point }}分
            <div class="idea-list">
              <div class="idea1">已答（<span>{{ selectTopicNum() }}</span>）</div>
              <div class="idea2">未答（<span>{{ detail.total_num - selectTopicNum() }}</span>）</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="date">剩余时间：2:00:00</div>
        <div class="name">{{ question.title }}</div>
        <div class="back-btn">交卷</div>
      </div>
      <!--          题型-->
      <div class="question-list">
        <!--        单选-->
        <div class="question-item">
          <div class="question-title">
            单选题（共{{ question.single_content.total_num }}题，总分{{ question.single_content.total_point }}分）
          </div>
          <div class="question-content">
            <div class="question-content-item" v-for="(item, index) in question.single_content.list" :key="index">
              <div class="topic">
                <div class="type">单选题</div>
                <p>{{ index + 1 }}.{{ item.title }}</p>
              </div>
              <div class="topic-list">
                <div class="topic-item" v-for="(it, i) in item.content" :key="i"
                     @click="topicClick(it, item, 'single')" :class="{'selected': item.selectText === it}">
                  <div class="select">{{ topicList(i) }}</div>
                  <p>{{ it }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--        判断-->
        <div class="question-item">
          <div class="question-title">
            判断题（共{{ question.judge_content.total_num }}题，总分{{ question.judge_content.total_point }}分）
          </div>
          <div class="question-content">
            <div class="question-content-item" v-for="(item, index) in question.judge_content.list" :key="index">
              <div class="topic">
                <div class="type">判断题</div>
                <p>{{ index + 1 }}.{{ item.title }}</p>
              </div>
              <div class="topic-list">
                <div class="topic-item" v-for="(it, i) in item.content" :key="i"
                     @click="topicClick(it, item, 'judge')" :class="{'selected': item.selectText === it}">
                  <div class="select">{{ topicList(i) }}</div>
                  <p>{{ it }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--        多选-->
        <div class="question-item">
          <div class="question-title">
            多选题（共{{ question.multiple_content.total_num }}题，总分{{ question.multiple_content.total_point }}分）
          </div>
          <div class="question-content">
            <div class="question-content-item" v-for="(item, index) in question.multiple_content.list" :key="index">
              <div class="topic">
                <div class="type">多选题</div>
                <p>{{ index + 1 }}.{{ item.title }}</p>
              </div>
              <div class="topic-list">
                <div class="topic-item" v-for="(it, i) in item.content" :key="i"
                     @click="topicClick(it, item, 'multiple')" :class="{'selected': item.selectText.includes(it)}">
                  <div class="select" :class="{'selected': item % 2}">{{ topicList(i) }}</div>
                  <p>{{ it }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    <el-dialog title="提示" width="580px" align="center" :close-on-click-modal="false" :visible.sync="show_modal">-->
    <!--      <div class="modal-inner">-->
    <!--        <div class="text-box">-->
    <!--          还有<span>39</span>题未做，确定交卷吗？-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <button class="btn-ripple btn-1" @click="show_modal = false">继续答题</button>-->
    <!--        <button class="btn-ripple btn-2" @click="show_modal = false">确认交卷</button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->

    <!--    <el-dialog title="提示" width="580px" align="center" :show-close="false" :close-on-click-modal="false" :visible.sync="show_modal">-->
    <!--      <div class="modal-inner">-->
    <!--        <div class="text-box">-->
    <!--          考试时间已结束，系统将自动交卷-->
    <!--        </div>-->
    <!--        <div class="date">3秒后跳转...</div>-->
    <!--      </div>-->
    <!--    </el-dialog>-->

    <!--    <el-dialog title="提示" width="580px" align="center" :show-close="false" :close-on-click-modal="false"-->
    <!--               :visible.sync="show_modal">-->
    <!--      <div class="modal-inner">-->
    <!--        <div class="text-box">-->
    <!--          {{ 1 === 1 ? '很遗憾，考试不及格！您的分数为：' : '恭喜您，考试及格！您的分数为：' }}-->
    <!--        </div>-->
    <!--        <div class="score" :class="{'wrong': true}">100分</div>-->
    <!--      </div>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <button class="btn-ripple btn-1" @click="show_modal = false">查看答题情况</button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<style scoped lang="less">
.container {
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

    .answer {
      width: 100%;
      margin-top: 22px;
      border: 1px solid #DEDEDE;
      background-color: #fff;

      .answer-content {
        display: flex;
        flex-direction: column;
        padding: 14px 0 0 24px;
        height: 500px;

        .question-list {
          flex: 1;
          overflow-y: auto;

          .question-item {
            .question-title {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #23324F;
              margin: 10px 0;
            }

            .question-content {
              display: flex;
              flex-wrap: wrap;

              .question-content-item {
                cursor: pointer;
                width: 34px;
                height: 34px;
                border-radius: 6px 6px 6px 6px;
                text-align: center;
                line-height: 34px;
                margin: 0 20px 16px 0;

                &:nth-child(6n) {
                  margin-right: 0;
                }

                &.correct {
                  background: @theme;
                  color: #fff;
                }

                &.unknown {
                  border: 1px solid #DDE0E5;
                  background-color: #fff;
                  color: #999FA4;
                }
              }
            }
          }
        }

        .all-score {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 39px;
          line-height: 39px;
          background: #FFFFFF;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #23324F;

          .idea-list {
            display: flex;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #9698A2;
            padding-bottom: 5px;

            .idea1 {
              display: flex;
              align-items: center;
              margin-right: 20px;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #737383;

              span {
                color: #FF0101;
              }

              &::before {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                background: #fff;
                border-radius: 2px 2px 2px 2px;
                margin-right: 5px;
                border: 1px solid @theme;
              }
            }

            .idea2 {
              display: flex;
              align-items: center;
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 14px;
              color: #737383;

              span {
                color: #FF0101;
              }

              &::before {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                background: #fff;
                border-radius: 2px 2px 2px 2px;
                margin-right: 5px;
                border: 1px solid #DDE0E5;
              }
            }
          }
        }
      }
    }
  }

  .content {
    border: 1px solid #DEDEDE;
    margin-left: 36px;
    flex: 1;
    background-color: #fff;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88px;
      background: #FFFFFF;
      padding: 0 38px;
      border-bottom: 1px solid #DEDEDE;

      .date {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 20px;
        color: #FF0D0D;
      }

      .name {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 700;
        font-size: 24px;
        color: #23324F;
      }

      .back-btn {
        cursor: pointer;
        width: 120px;
        height: 40px;
        line-height: 40px;
        background: linear-gradient(138deg, #175E3D 0%, #257C54 100%);
        border-radius: 155px;
        text-align: center;
        color: #fff;
        font-size: 18px;
      }
    }

    .question-list {
      height: 700px;
      overflow-y: auto;

      .question-item {
        .question-title {
          padding: 0 38px;
          height: 62px;
          line-height: 62px;
          background: #FAFAFA;
          border-top: 1px solid #DEDEDE;
          border-bottom: 1px solid #DEDEDE;

          font-family: Source Han Sans, Source Han Sans;
          font-weight: 500;
          font-size: 18px;
          color: #23324F;
        }
      }

      .question-content {
        padding: 32px 38px;

        .question-content-item {
          padding-bottom: 20px;
          border-bottom: 1px solid #DEDEDE;
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
            border-bottom: none;
            padding-bottom: 0;
          }

          .topic {
            display: flex;
            align-items: center;

            .type {
              width: 57px;
              height: 26px;
              background: #F1F8FF;
              border-radius: 4px;
              color: @theme;
              text-align: center;
              line-height: 26px;
              font-size: 14px;
              margin-right: 6px;
            }

            p {
              font-family: Microsoft YaHei, Microsoft YaHei;
              font-weight: 400;
              font-size: 16px;
              color: #23324F;
            }
          }

          .topic-list {
            .topic-item {
              cursor: pointer;
              display: flex;
              align-items: center;
              margin: 10px 0;

              .select {
                width: 30px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                background-color: #fff;
                border: 1px solid #A6ACC0;
                border-radius: 50%;
                font-family: Microsoft YaHei, Microsoft YaHei;
                font-weight: 400;
                font-size: 16px;
                color: #636E92;
                margin-right: 5px;
              }

              &.selected {
                .select {
                  color: @theme;
                  border-color: @theme;
                }

                p {
                  color: @theme;
                }
              }

              p {
                font-family: Microsoft YaHei, Microsoft YaHei;
                font-weight: 400;
                font-size: 16px;
                color: #23324F;
              }
            }
          }
        }
      }
    }
  }

  .modal-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 22px;
    color: #23324F;

    span {
      color: #FF0D0D;
    }

    .date {
      margin-top: 20px;
      color: @theme;
    }

    .score {
      font-family: Source Han Sans, Source Han Sans;
      font-weight: 700;
      font-size: 36px;
      color: #175E3D;

      &.wrong {
        color: #DE1B1B;
      }
    }
  }

  .dialog-footer {
    text-align: center;
  }

  .btn-ripple {
    width: 134px;
    height: 38px;
    background: @theme;
    border-radius: 4px;
  }

  .btn-1 {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 18px;
    color: #FFFFFF;
    margin-right: 30px;
  }

  .btn-2 {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 18px;
    color: @theme;
    background-color: #E6F1EC;
  }
}
</style>
