<template>
    <div class="page">
        <div class="one-wrap">
            <div class="left">
                <div class="time">{{ topDetail.dtTime }}</div>
                <div class="title ellipsis-1">{{ topDetail.title }}</div>
                <div class="sub-title">{{ topDetail.description }}</div>
                <div class="desc-wrap">
                    <div class="desc-item">
                        <div class="icon-wrap">
                            <img src="@/assets/img/chat-us/icon2.png" alt=""/>
                        </div>
                        展位号：W3-3410
                    </div>
                    <div class="desc-item">
                        <div class="icon-wrap">
                            <img src="@/assets/img/chat-us/icon3.png" alt=""/>
                        </div>
                        展会地址：慕尼黑上海光博会在上海新国际博览中心
                    </div>
                </div>
                <div class="detail-wrap pointer" @click="toDetail(topDetail)">
                    了解详情
                    <div class="icon-right">
                        <img src="@/assets/img/chat-us/right-to.png" alt=""/>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="img-wrap">
                    <img :src="topDetail.thumb" alt=""/>
                </div>
            </div>
        </div>

        <div class="list-wrap">
            <div class="list-item" v-for="(item, index) in list" :key="index">
                <div class="top" @click="toDetail(item)">
                    <div class="list-img-wrap">
                        <img :src="item.thumb" alt=""/>
                    </div>
                    <div class="title ellipsis-1">{{ item.title}}</div>
                    <div class="sub-title">{{ item.description }}</div>
                </div>
                <div class="desc-wrap">
                    <div class="desc-item">
                        <div class="icon-wrap">
                            <img src="@/assets/img/chat-us/icon2.png" alt=""/>
                        </div>
                        展位号：W3-3410
                    </div>
                    <div class="desc-item">
                        <div class="icon-wrap">
                            <img src="@/assets/img/chat-us/icon3.png" alt=""/>
                        </div>
                        展会地址：慕尼黑上海光博会在上海新国际博览中心
                    </div>
                </div>
            </div>
        </div>
        <el-empty v-if="!count" description="没有查询到信息..."></el-empty>
        <!--分页器-->
        <div class="pagination-box" v-if="count">
            <el-pagination background layout="total, prev, pager, next, jumper" :total="count"
                           :current-page="pagination.page"
                           :page-size="pagination.pageNum" @current-change="changePage"></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentPage: 0,
            count: 0,
            pagination: {
                page: 1,
                pageNum: 9,
            },
            list: [],
            topDetail: {}
        };
    },
    mounted() {
        this.setView();
    },
    methods: {
        setView() {
            this.$api({
                url: '/service.php',
                method: 'get',
                data: {
                    action: 'news_lists',
                    channelId: 9
                },
            }).then((res) => {
                if (res.code == 200) {
                    this.list = res.data.list;
                    this.topDetail = res.data.list[0]
                    this.count = res.data.count
                }
            })
        },
        // 翻页
        changePage() {
            this.setView();
        },
        toDetail(item) {
            this.$router.push(`/exhibition-information-detail?id=${item.id}`);
        },
    },
};
</script>

<style lang="less" scoped>
.page {
  padding: 67px 260px 55px;
  background: #f4f4f6;
}

.one-wrap {
  display: flex;
  gap: 61px;
  border-radius: 10px 10px 10px 10px;

  .left {
    flex: 1;
    padding: 44px 0 0 26px;

    .time {
      margin-bottom: 11px;
      font-size: 18px;
      color: #333333;
    }

    .title {
      width: 641px;
      height: 47px;
      margin-bottom: 24px;
      font-weight: bold;
      font-size: 36px;
      color: #333333;
    }

    .sub-title {
      margin-bottom: 17px;
      font-size: 16px;
      color: #707070;
      line-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .desc-wrap {
      display: flex;
      flex-direction: column;
      gap: 13px;
      padding: 23px 0 30px 30px;
      background: #dbe2f2;
      border-radius: 10px 10px 10px 10px;

      .desc-item {
        display: flex;
        gap: 12px;
        align-items: baseline;
        font-size: 18px;
        color: #333333;
        line-height: 28px;

        .icon-wrap {
          width: 16px;
          height: 17px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .detail-wrap {
      margin-top: 49px;
      display: flex;
      align-items: center;
      gap: 13px;
      font-size: 18px;
      color: #757575;
      line-height: 25px;

      .icon-right {
        width: 20px;
        height: 18px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .right {
    padding: 25px 20px 27px 0;
    flex-shrink: 0;
    flex-grow: 0;

    .img-wrap {
      width: 619px;
      height: 415px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.list-wrap {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 29px;

  .list-item {
    width: 447px;
    height: 515px;
    background: #ffffff;
    border-radius: 8px 8px 8px 8px;

    .top {
      padding: 15px 12px 27px 15px;
      border-bottom: 1px solid #707070;
      cursor: pointer;

      .list-img-wrap {
        width: 420px;
        height: 280px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        margin-top: 17px;
        font-weight: bold;
        font-size: 24px;
        color: #27417c;
        line-height: 28px;
      }

      .sub-title {
        margin-top: 20px;
        font-size: 16px;
        color: #707070;
        line-height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }

    .desc-wrap {
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding: 24px 0 24px 17px;
      border-radius: 10px 10px 10px 10px;

      .desc-item {
        display: flex;
        gap: 12px;
        align-items: center;
        font-size: 14px;
        color: #808080;

        .icon-wrap {
          width: 16px;
          height: 17px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.center {
  margin-top: 61px;
  text-align: center;
}
</style>
