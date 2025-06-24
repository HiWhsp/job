<script>
export default {
  name: "my-exam-submit",
  data() {
    return {
      id: "", // 考试id
      question_id: "", // 试题id
      show_modal: false, // 交卷弹窗
      modalType: null, // 交卷弹窗类型 1:没做完 2:考试时间到 3:没及格 4:及格
      detail: {}, // 考试详情
      question: {
        // 试题
        judge_content: {},
        multiple_content: {},
        single_content: {},
      },
      timeObj: {
        // 倒计时
        targetTimestamp: 0, // 目标时间戳
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      },
      timer: null,
      timer1: null,
      overTime: 3,
      switchCount: 0,
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timer1);
  },
  mounted() {
    this.id = this.$route.query.id;
    this.question_id = this.$route.query.question_id;
    document.addEventListener("visibilitychange", this.handleBeforeUnload);
    this.setView();
  },
  methods: {
    handleBeforeUnload() {
      if (document.hidden) {
        if (!this.$route.path.includes("my-exam-submit")) {
          return;
        }
        this.$api({
          url: "recordQuestionSwitchWindow",
          method: "post",
          data: {
            id: this.id,
            question_id: this.question_id,
          },
        })
          .then((res) => {
            if (res.code == 200) {
              this.switchCount++;
              this.$message.error(
                `已切换了 ${this.switchCount} 次标签页, 超过次数限制将自动交卷`
              );
            }
          })
          .catch((err) => {
            setTimeout(() => {
              this.endQuestion();
            }, 1000);
          });
      }
    },
    setView() {
      this.$api({
        url: "myQuestion",
        method: "get",
        data: {
          id: this.id,
          question_id: this.question_id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.detail = res.data;
          this.question = res.data.question;
          // 考试结束时间
          this.timeObj.targetTimestamp =
            Math.floor(Date.now() / 1000) + res.data.question.test_time * 60;
          // 判断是否已停止考试
          this.updateCountdown();
          // 判断题
          this.question.judge_content.list.forEach((item, index) => {
            item.checked = false;
            item.selectText = "";
          });
          // 多选题
          this.question.multiple_content.list.forEach((item, index) => {
            item.checked = false;
            item.selectText = "";
          });
          // 单选题
          this.question.single_content.list.forEach((item, index) => {
            item.checked = false;
            item.selectText = "";
          });
        }
      });
    },
    // 交卷
    overSubmit() {
      this.$api({
        url: "myQuestion",
        method: "get",
        data: {
          id: this.id,
          question_id: this.question_id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.detail = res.data;
          this.question = res.data.question;

          // 未做完
          if (this.detail.has_no_answered_num !== 0) {
            this.modalType = 1;
            this.show_modal = true;
          } else {
            this.$alert("确定交卷吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              callback: (action) => {
                if (action === "confirm") {
                  this.endQuestion();
                }
              },
            });
          }
        }
      });
    },
    endQuestion() {
      this.$api({
        url: "endQuestion",
        method: "post",
        data: {
          id: this.id,
          question_id: this.question_id,
          my_total_point: this.detail.my_total_point,
        },
      }).then((res) => {
        if (res.code == 200) {
          (this.detail.my_total_point / this.question.total_point) * 100 >= 60
            ? (this.modalType = 4)
            : (this.modalType = 3);
          this.show_modal = true;
        }
      });
    },
    /**
     * 选项点击
     * @param item 点击的选项
     * @param question 当前题
     * @param type 题型 single(单选)/multiple(多选)/judge(判断)
     */
    topicClick(item, question, type) {
      const str = item;
      if (type === "single") {
        question.selectText === str
          ? (question.selectText = "")
          : (question.selectText = item);
        this.addMyQuestionBank(question);
      } else if (type === "multiple") {
        const textList = question.selectText ? question.selectText.split(",") : [];
        textList.includes(item)
          ? textList.splice(textList.indexOf(item), 1)
          : textList.push(item);
        question.selectText = textList.join(",");
        this.addMyQuestionBank(question);
      } else if (type === "judge") {
        question.selectText === str
          ? (question.selectText = "")
          : (question.selectText = item);
        this.addMyQuestionBank(question);
      }
      question.checked = question.selectText !== "";
      this.$forceUpdate();
    },
    // 提交试题答案
    addMyQuestionBank(question, type) {
      this.$api({
        url: "addMyQuestionBank",
        method: "post",
        data: {
          id: this.id,
          question_id: this.question_id,
          question_bank_id: question.id,
          my_answer: question.selectText,
        },
      }).then((res) => {
        this.$api({
          url: "myQuestion",
          method: "get",
          data: {
            id: this.id,
            question_id: this.question_id,
          },
        }).then((res) => {
          if (res.code == 200) {
            this.detail = res.data;
            if (type === "multiple") {
              this.$message.success("已确认多选答案");
            }
          }
        });
      });
    },
    // 选项标识
    topicList(item) {
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".substring(item, item + 1);
    },
    // 倒计时
    updateCountdown() {
      const now = Math.floor(Date.now() / 1000);
      let timeDiff = this.timeObj.targetTimestamp - now;
      if (timeDiff <= 0) {
        this.timeObj.days = "0";
        this.timeObj.hours = "0";
        this.timeObj.minutes = "0";
        this.timeObj.seconds = "0";
        clearInterval(this.timer);
        this.modalType = 2;
        this.show_modal = true;
        this.timer1Fun();
        return;
      } else if (this.timer == null) {
        this.timer = setInterval(this.updateCountdown, 1000);
        return;
      }

      timeDiff -= this.timeObj.days * 24 * 60 * 60;
      this.timeObj.hours = Math.floor(timeDiff / (60 * 60));
      timeDiff -= this.timeObj.hours * 60 * 60;
      this.timeObj.minutes = Math.floor(timeDiff / 60);
      this.timeObj.seconds = timeDiff % 60;
    },
    timer1Fun() {
      this.timer1 = setInterval(() => {
        this.overTime--;
        if (this.overTime == 0) {
          clearInterval(this.timer1);
          this.endQuestion();
          // this.$router.push('/my-exam');
        }
      }, 1000);
    },
    formatNumber(num) {
      // Pad with leading zero if number is less than 10
      return num < 10 ? `0${num}` : num;
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="left">
      <div class="profile">
        <div class="title">考生信息</div>
        <div class="profile-info">
          <img :src="baseInfo.image" alt="" />
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
      <div class="answer">
        <div class="title">答题卡</div>
        <div class="answer-content">
          <!--          题型-->
          <div class="question-list">
            <div class="question-item">
              <div class="question-title">
                单选题（共{{ question.single_content.total_num }}题，总分{{
                  question.single_content.total_point
                }}分）
              </div>
              <div class="question-content">
                <div
                  v-for="(item, index) in question.single_content.list"
                  :key="index"
                  :class="{ correct: item.checked, unknown: !item.checked }"
                  class="question-content-item"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </div>
            <div class="question-item">
              <div class="question-title">
                判断题（共{{ question.judge_content.total_num }}题，总分{{
                  question.judge_content.total_point
                }}分）
              </div>
              <div class="question-content">
                <div
                  v-for="(item, index) in question.judge_content.list"
                  :key="index"
                  :class="{ correct: item.checked, unknown: !item.checked }"
                  class="question-content-item"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </div>
            <div class="question-item">
              <div class="question-title">
                多选题（共{{ question.multiple_content.total_num }}题，总分{{
                  question.multiple_content.total_point
                }}分）
              </div>
              <div class="question-content">
                <div
                  v-for="(item, index) in question.multiple_content.list"
                  :key="index"
                  :class="{ correct: item.checked, unknown: !item.checked }"
                  class="question-content-item"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </div>
          </div>
          <div class="all-score">
            总分：{{ question.total_point }}分
            <div class="idea-list">
              <div class="idea1">
                已答（<span>{{ detail.has_answered_num }}</span
                >）
              </div>
              <div class="idea2">
                未答（<span>{{ detail.has_no_answered_num }}</span
                >）
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="date">
          剩余时间：{{ formatNumber(timeObj.hours) }}:{{
            formatNumber(timeObj.minutes)
          }}:{{ formatNumber(timeObj.seconds) }}
        </div>
        <div class="name">{{ question.title }}</div>
        <div class="back-btn" @click="overSubmit">交卷</div>
      </div>
      <!--          题型-->
      <div class="question-list">
        <!--        单选-->
        <div class="question-item">
          <div class="question-title">
            单选题（共{{ question.single_content.total_num }}题，总分{{
              question.single_content.total_point
            }}分）
          </div>
          <div class="question-content">
            <div
              v-for="(item, index) in question.single_content.list"
              :key="index"
              class="question-content-item"
            >
              <div class="topic">
                <div class="type">单选题</div>
                <p>{{ index + 1 }}.{{ item.title }}</p>
              </div>
              <div class="topic-list">
                <div
                  v-for="(it, i) in item.content"
                  :key="i"
                  :class="{ selected: item.selectText === it }"
                  class="topic-item"
                  @click="topicClick(it, item, 'single')"
                >
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
            判断题（共{{ question.judge_content.total_num }}题，总分{{
              question.judge_content.total_point
            }}分）
          </div>
          <div class="question-content">
            <div
              v-for="(item, index) in question.judge_content.list"
              :key="index"
              class="question-content-item"
            >
              <div class="topic">
                <div class="type">判断题</div>
                <p>{{ index + 1 }}.{{ item.title }}</p>
              </div>
              <div class="topic-list">
                <div
                  v-for="(it, i) in item.content"
                  :key="i"
                  :class="{ selected: item.selectText === it }"
                  class="topic-item"
                  @click="topicClick(it, item, 'judge')"
                >
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
            多选题（共{{ question.multiple_content.total_num }}题，总分{{
              question.multiple_content.total_point
            }}分）
          </div>
          <div class="question-content">
            <div
              v-for="(item, index) in question.multiple_content.list"
              :key="index"
              class="question-content-item"
            >
              <div class="topic">
                <div class="type">多选题</div>
                <p>{{ index + 1 }}.{{ item.title }}</p>
                <!-- <div
                  v-if="item.selectText"
                  class="add-submit"
                  @click="addMyQuestionBank(item, 'multiple')"
                >
                  确定
                </div> -->
              </div>
              <div class="topic-list">
                <div
                  v-for="(it, i) in item.content"
                  :key="i"
                  :class="{
                    selected: item.selectText ? item.selectText.includes(it) : '',
                  }"
                  class="topic-item"
                  @click="topicClick(it, item, 'multiple')"
                >
                  <div :class="{ selected: item % 2 }" class="select">
                    {{ topicList(i) }}
                  </div>
                  <p>{{ it }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="show_modal"
      center="center"
      title="提示"
      width="580px"
    >
      <template v-if="modalType === 1">
        <div class="modal-inner">
          <div class="text-box">
            还有<span>{{ detail.has_no_answered_num }}</span
            >题未做，确定交卷吗？
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button class="btn-ripple btn-1" @click="show_modal = false">继续答题</button>
          <button class="btn-ripple btn-2" @click="endQuestion">确认交卷</button>
        </div>
      </template>
      <template v-else-if="modalType === 2">
        <div class="modal-inner">
          <div class="text-box">考试时间已结束，系统将自动交卷</div>
          <div class="date">{{ overTime }}秒后跳转...</div>
        </div>
      </template>
      <template v-else-if="modalType === 3">
        <div class="modal-inner">
          <div class="text-box">很遗憾，考试不及格！您的分数为：</div>
          <div :class="{ wrong: true }" class="score">{{ detail.my_total_point }}分</div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button
            class="btn-ripple btn-1"
            @click="$router.push(`/my-exam-detail?id=${id}&question_id=${question_id}`)"
          >
            查看答题情况
          </button>
        </div>
      </template>
      <template v-else-if="modalType === 4">
        <div class="modal-inner">
          <div class="text-box">恭喜您，考试及格！您的分数为：</div>
          <div class="score">{{ detail.my_total_point }}分</div>
        </div>
        <div slot="footer" class="dialog-footer">
          <button
            class="btn-ripple btn-1"
            @click="$router.push('/my-exam-detail?id=' + id)"
          >
            查看答题情况
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.container {
  padding: 25px 37px 0;
  background: #f5f6f6;
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
      background: #fafafa;
      border-bottom: 1px solid #dedede;
      text-align: center;
      line-height: 60px;
      font-family: Source Han Sans, Source Han Sans;
      font-weight: 700;
      font-size: 20px;
      color: #23324f;
    }

    .profile {
      width: 100%;
      background-color: #fff;
      border: 1px solid #dedede;

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
            color: #1f253b;
          }

          .level,
          .phone {
            display: flex;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #6f6f6f;

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
      border: 1px solid #dedede;
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
              color: #23324f;
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
                  border: 1px solid #dde0e5;
                  background-color: #fff;
                  color: #999fa4;
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
          background: #ffffff;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #23324f;

          .idea-list {
            display: flex;
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 12px;
            color: #9698a2;
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
                color: #ff0101;
              }

              &::before {
                content: "";
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
                color: #ff0101;
              }

              &::before {
                content: "";
                display: inline-block;
                width: 12px;
                height: 12px;
                background: #fff;
                border-radius: 2px 2px 2px 2px;
                margin-right: 5px;
                border: 1px solid #dde0e5;
              }
            }
          }
        }
      }
    }
  }

  .content {
    border: 1px solid #dedede;
    margin-left: 36px;
    flex: 1;
    background-color: #fff;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 88px;
      background: #ffffff;
      padding: 0 38px;
      border-bottom: 1px solid #dedede;

      .date {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 20px;
        color: #ff0d0d;
      }

      .name {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 700;
        font-size: 24px;
        color: #23324f;
      }

      .back-btn {
        cursor: pointer;
        width: 120px;
        height: 40px;
        line-height: 40px;
        background: linear-gradient(138deg, #175e3d 0%, #257c54 100%);
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
          background: #fafafa;
          border-top: 1px solid #dedede;
          border-bottom: 1px solid #dedede;

          font-family: Source Han Sans, Source Han Sans;
          font-weight: 500;
          font-size: 18px;
          color: #23324f;
        }
      }

      .question-content {
        padding: 32px 38px;

        .question-content-item {
          padding-bottom: 20px;
          border-bottom: 1px solid #dedede;
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
              background: #f1f8ff;
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
              color: #23324f;
            }

            .add-submit {
              margin-left: 10px;
              cursor: pointer;
              width: 50px;
              height: 26px;
              line-height: 26px;
              background: linear-gradient(138deg, #175e3d 0%, #257c54 100%);
              border-radius: 155px;
              text-align: center;
              color: #fff;
              font-size: 14px;
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
                border: 1px solid #a6acc0;
                border-radius: 50%;
                font-family: Microsoft YaHei, Microsoft YaHei;
                font-weight: 400;
                font-size: 16px;
                color: #636e92;
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
                color: #23324f;
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
    color: #23324f;

    span {
      color: #ff0d0d;
    }

    .date {
      margin-top: 20px;
      color: @theme;
    }

    .score {
      font-family: Source Han Sans, Source Han Sans;
      font-weight: 700;
      font-size: 36px;
      color: #175e3d;

      &.wrong {
        color: #de1b1b;
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
    color: #ffffff;
  }

  .btn-2 {
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 400;
    font-size: 18px;
    color: @theme;
    background-color: #e6f1ec;
    margin-left: 30px;
  }
}
</style>
