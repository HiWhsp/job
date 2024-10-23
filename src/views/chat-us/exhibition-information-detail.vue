<template>
    <div>
        <div class="title-wrap">
            <breadcrumb :list="['首页', '展会详情']"></breadcrumb>
            <div class="title">
                {{ info.title }}
            </div>
            <div class="time-wrap">
                <div class="time">发布时间：{{ info.dtTime }}</div>
                <div>来源：华锐科仪</div>
            </div>
        </div>
        <div class="content-wrap">
            <div class="content" v-html="info.content">

            </div>
        </div>
        <div class="step-wrap">
            <div class="last" @click="to_prev(last_news)">上一条：{{ next_news.title  || '无' }}</div>
            <div class="next" @click="to_next(next_news)">下一条：{{ last_news.title || '无' }}</div>
        </div>

        <div class="wrap">
            <div class="related-news">相关展会</div>
            <div class="sub-related-news">用激光工具改变生活</div>

            <div class="list-wrap">
                <div class="card-item pointer" v-for="(item, index) in cardList" :key="index"
                     @click="toNewsDetail(item)">
                    <div class="card-img-wrap">
                        <img :src="item.thumb" alt="" class="card-img"/>
                    </div>
                    <div class="card-text ellipsis-1">{{ item.title }}</div>
                    <div class="card-bottom">
                        <div class="bottom-left">
                            <div class="time-img-wrap">
                                <img class="time" src="@/assets/img/productDetail/time.png" alt=""/>
                            </div>
                            <div class="time-text">{{ item.dtTime }}</div>
                        </div>
                        <div class="bottom-right">
                            <div class="arrow-text" :class="{ active: index === 0 }">
                                了解详情
                            </div>
                            <div class="arrow-wrap">
                                <img
                                        class="arrow"
                                        src="@/assets/img/productDetail/arrow.png"
                                        alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom-btn-wrap">
                <div class="pic-readmore" @click="toUrl('/company-news')">
                    <div class="readmore">查看更多</div>
                    <div class="arrow">
                        <img src="@/static/home/pic/right_arrow.png"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumb";
import card1 from "@/assets/img/productDetail/card1.png";
import card2 from "@/assets/img/productDetail/card2.png";
import card3 from "@/assets/img/productDetail/card3.png";

export default {
    components: {
        breadcrumb,
    },
    data() {
        return {
            id: this.$route.query.id,
            info: {},
            last_news: {},
            next_news: {},
        };
    },
    watch: {
        '$route'() {

            this.setView()
        }
    },
    created() {
        this.setView()
        this.cardList = [];
    },
    methods: {
        setView() {
            this.id = this.$route.query.id || ''
            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "news_detail",
                    id: this.id
                },
            }).then(res => {
                if (res.code == 200) {
                    this.info = res.data.info;
                    this.last_news = res.data.last_news || {};
                    this.next_news = res.data.next_news || {};
                }
            })

            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "news_lists",
                    channelId: 9,
                    page: 1,
                    pageSize: 3,
                },
            }).then(res => {
                if (res.code == 200) {
                    this.cardList = res.data.list.slice(0, 3);
                }
            })
        },

        to_prev(item) {
            if (item.id) {
                this.$router.push({
                    path: 'exhibition-information-detail',
                    query: {
                        id: item.id
                    }
                })
            }
        },
        to_next(item) {
            if (item.id) {
                this.$router.push({
                    path: 'exhibition-information-detail',
                    query: {
                        id: item.id
                    }
                })
            }
        },
        toNewsDetail(item) {
            this.$router.push({
                path: 'exhibition-information-detail',
                query: {
                    id: item.id
                }
            })
        },
        toUrl(url) {
            this.$router.push({
                path: url
            })
        }
    },
};
</script>

<style lang="less" scoped>
.title-wrap {
  padding: 0 260px 57px;
  background: #f4f4f6;

  .title {
    margin-top: 42px;
    font-size: 32px;
    color: #333333;
  }

  .time-wrap {
    margin-top: 22px;
    display: flex;

    .time {
      margin-right: 19px;
      font-size: 14px;
      color: #333333;
    }
  }
}

.content-wrap {
  background: #fff;
  padding: 48px 260px 0;

  .content {
    padding-bottom: 53px;
    border-bottom: 1px solid #c9c9c9;
  }
}

.step-wrap {
  margin: 45px 260px 0;
  padding-bottom: 72px;
  font-size: 14px;
  color: #000000;
  line-height: 28px;

  .last {
    cursor: pointer;
    margin-bottom: 26px;
  }

  .next {
    cursor: pointer;
  }
}

.wrap {
  padding: 64px 260px;
  background: #f4f4f6;
}

.related-news {
  margin-top: 55px;
  text-align: center;
  font-weight: bold;
  font-size: 36px;
  color: #333333;
}

.sub-related-news {
  margin-top: 14px;
  font-size: 16px;
  color: #52565a;
  text-align: center;
}

.list-wrap {
  display: flex;
  gap: 44px;
  margin-top: 26px;

  .card-item {
    width: 416px;
    height: 417px;
    background: #ffffff;
    border-radius: 10px 0px 10px 10px;
    border: 1px solid #e4e4e4;

    .card-img-wrap {
      width: 416px;
      height: 279px;

      .card-img {
        width: 100%;
        height: 100%;
      }
    }

    .card-text {
      height: 80px;
      font-weight: 400;
      font-size: 18px;
      color: #333333;
      line-height: 36px;
      padding: 28px 12px 28px 20px;
    }

    .card-bottom {
      height: 58px;
      display: flex;
      align-items: center;
      border-top: 1px solid #e5e5e5;
      justify-content: space-between;
      padding: 0 20px;

      .bottom-left {
        height: 100%;
        display: flex;
        align-items: center;

        .time-img-wrap {
          width: 15px;
          height: 15px;
          margin-right: 9px;

          .time {
            width: 100%;
            height: 100%;
          }
        }

        .time-text {
          font-size: 16px;
          color: #757575;
          line-height: 37px;
        }
      }

      .bottom-right {
        height: 100%;
        display: flex;
        align-items: center;
        cursor: pointer;

        .arrow-text {
          margin-right: 14px;
          font-size: 18px;
          color: #757575;
          line-height: 25px;

          &.active {
            color: #27417c;
          }
        }

        .arrow-wrap {
          width: 20px;
          height: 16px;

          .arrow {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.bottom-btn-wrap {
  display: flex;
  justify-content: center;
  margin: 33px 0 0 0;

  .pic-readmore {
    height: 56px;
    width: 187px;
    font-weight: lighter;
    color: white;
    font-size: 18px;
    background-color: #27417c;
    display: flex;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 20px;
    cursor: pointer;

    .readmore {
      height: 24px;
      width: 72px;
      margin-right: 14px;
      margin: 16px 14px 16px 41px;
    }

    .arrow {
      height: 16.35px;
      width: 20.33px;
      margin: 20px 0px 20px 0px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
