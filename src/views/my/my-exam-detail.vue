<script>
export default {
  name: "my-exam-detail",
  data() {
    return {
      id: "", // 考试id
      detail: {}, // 考试详情
      question: {
        // 试题
        judge_content: {},
        multiple_content: {},
        single_content: {},
      },
    };
  },
  mounted() {
    this.id = this.$route.query.id;
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "myQuestion",
        method: "get",
        data: {
          question_id: this.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.detail = res.data;
          this.question = res.data.question;
          // 判断题
          this.question.judge_content.list.forEach((item, index) => {
            item.selectText =
              item.correct_answer === item.my_answer
                ? 1
                : ["", undefined, null].includes(item.my_answer)
                ? 3
                : 2;
          });
          // 多选题
          this.question.multiple_content.list.forEach((item, index) => {
            item.selectText = this.multipleError(item);
          });
          // 单选题
          this.question.single_content.list.forEach((item, index) => {
            item.selectText =
              item.correct_answer === item.my_answer
                ? 1
                : ["", undefined, null].includes(item.my_answer)
                ? 3
                : 2;
          });
        }
      });
    },
    setActive(item) {
      if (item.selectText === 1) {
        return "correct";
      } else if (item.selectText === 2) {
        return "wrong";
      } else {
        return "unknown";
      }
    },
    multipleError(item) {
      let index = 0;
      // 没选
      if (["", null, undefined].includes(item.my_answer)) {
        return 3;
      }
      // 选错
      if (item.my_answer.length !== item.correct_answer.length) {
        return 2;
      }
      // 选错选项
      item.my_answer.split(",").forEach((it, i) => {
        if (!item.correct_answer.includes(it)) {
          index++;
        }
      });
      return index === 0 ? 1 : 2;
    },
    topicList(item) {
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".substring(item, item + 1);
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
          <!--          答题          -->
          <div class="idea-list">
            <div class="idea1">答对</div>
            <div class="idea2">答错</div>
            <div class="idea3">未作答</div>
          </div>
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
                  :class="setActive(item)"
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
                  :class="setActive(item)"
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
                  :class="setActive(item)"
                  class="question-content-item"
                >
                  {{ index + 1 }}
                </div>
              </div>
            </div>
          </div>

          <div class="all-score">得分：{{ detail.my_total_point }}分</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="date">总用时：2:00:00</div>
        <div class="name">{{ question.title }}</div>
        <div class="back-btn" @click="$router.push('/my-exam')">返回</div>
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
                  :class="{ selected: item.my_answer === it }"
                  class="topic-item"
                >
                  <div class="select">{{ topicList(i) }}</div>
                  <p>{{ it }}</p>
                </div>
              </div>
              <div class="Answer">
                <p class="me">正确答案：{{ item.correct_answer }}</p>
                <p :class="{ error: item.selectText != 1 }" class="your">
                  您的答案：{{ item.my_answer || "空" }}
                </p>
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
                  :class="{ selected: item.my_answer === it }"
                  class="topic-item"
                >
                  <div class="select">{{ topicList(i) }}</div>
                  <p>{{ it }}</p>
                </div>
              </div>
              <div class="Answer">
                <p class="me">正确答案：{{ item.correct_answer }}</p>
                <p :class="{ error: item.selectText != 1 }" class="your">
                  您的答案：{{ item.my_answer || "空" }}
                </p>
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
              </div>
              <div class="topic-list">
                <div
                  v-for="(it, i) in item.content"
                  :key="i"
                  :class="{ selected: item.my_answer.includes(it) }"
                  class="topic-item"
                >
                  <div class="select">{{ topicList(i) }}</div>
                  <p>{{ it }}</p>
                </div>
              </div>
              <div class="Answer">
                <p class="me">正确答案：{{ item.correct_answer }}</p>
                <p :class="{ error: item.selectText != 1 }" class="your">
                  您的答案：{{ item.my_answer || "空" }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!--        <div class="question-item">-->
        <!--          <div class="question-title">-->
        <!--            单选题（共10题，总分20分）-->
        <!--          </div>-->
        <!--          <div class="question-content">-->
        <!--            <div class="question-content-item" v-for="item in 10" :key="item">-->
        <!--              <div class="topic">-->
        <!--                <div class="type">单选题</div>-->
        <!--                <p>1.坚持依宪治国、依宪执政，就包括（ ）。</p>-->
        <!--              </div>-->
        <!--              <div class="topic-list">-->
        <!--                <div class="topic-item" v-for="item in 4" :key="item">-->
        <!--                  <div class="select" :class="{'selected': item % 2}">{{ topicList(item - 1) }}</div>-->
        <!--                  <p>坚持宪法确定的中国共产党领导地位不动摇</p>-->
        <!--                </div>-->
        <!--              </div>-->
        <!--              <div class="Answer">-->
        <!--                <p class="me">正确答案：A</p>-->
        <!--                <p class="your" :class="{'error': item % 2}">您的答案：A</p>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
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
        padding: 24px 0 0 24px;
        height: 500px;

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
            margin-right: 26px;

            &::before {
              content: "";
              display: inline-block;
              width: 12px;
              height: 12px;
              background: #23b370;
              border-radius: 2px 2px 2px 2px;
              margin-right: 5px;
            }
          }

          .idea2 {
            display: flex;
            align-items: center;
            margin-right: 26px;

            &::before {
              content: "";
              display: inline-block;
              width: 12px;
              height: 12px;
              background: #fa3c3b;
              border-radius: 2px 2px 2px 2px;
              margin-right: 5px;
            }
          }

          .idea3 {
            display: flex;
            align-items: center;

            &::before {
              content: "";
              display: inline-block;
              width: 12px;
              height: 12px;
              background: #f5f6f6;
              border-radius: 2px 2px 2px 2px;
              margin-right: 5px;
            }
          }
        }

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
                  background: #23b370;
                  color: #fff;
                }

                &.wrong {
                  background: #fa3c3b;
                  color: #fff;
                }

                &.unknown {
                  border: 1px solid #dde0e5;
                  background-color: #f5f6f6;
                  color: #999fa4;
                }
              }
            }
          }
        }

        .all-score {
          height: 39px;
          line-height: 39px;
          background: #ffffff;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #23324f;
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
          }

          .topic-list {
            .topic-item {
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

        .Answer {
          display: flex;

          .me {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 16px;
            color: #175e3d;
            margin-right: 25px;
          }

          .your {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 16px;
            color: #175e3d;

            &.error {
              color: #fa3c3b;
            }
          }
        }
      }
    }
  }
}
</style>
