<template>
    <div class="page">
        <div class="top-img">
        </div>
        <div class="page-ctx">
            <div class="yue-box">
                <div class="text-box">
                    <div class="text-2">
                        {{ baseInfo.jifen || 0 }}
                        <!-- <span class="currency">元</span> -->
                    </div>
                    <div class="text-1">当前积分</div>
                    <div class="text-3 pointer">
                        <span @click="go_url">积分明细</span>
                        <span>|</span>
                        <span @click="role">积分规则</span>
                    </div>
                </div>
            </div>
            <div class="wrap">
                <div class="inner">
                    <div class="bottom-info">
                        <div class="list-wrap" v-if="list_goods.length">
                            <div class="good-list">
                                <div class="item pointer" v-for="(item, index) in list_goods" :key="index">
                                    <div class="img-box cover">
                                        <img :src="item.image" alt/>
                                    </div>
                                    <div class="info">
                                        <div class="title">{{ item.title }}</div>
                                        <div class="duihuan-info" @click.stop="onClick_duihuan(item)">
                                            <div class="jifen">
                                                <b>{{ item.jifen }}</b>
                                                <span>积分·兑换</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pagination-box" style="margin-top: 40px">
                                <el-pagination
                                        background
                                        layout="total, prev, pager, next"
                                        @current-change="changePage"
                                        :current-page.sync="pagination.page"
                                        :page-size="pagination.pageNum"
                                        :total="count"
                                ></el-pagination>
                            </div>
                        </div>
                        <div v-else>
                            <div class="product-empty" v-if="!list_goods.length">
                                <el-empty description="没有查询到积分商品信息..."></el-empty>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog
                title="积分规则"
                :visible.sync="roleVisible"
                width="30%">
            <div class="text-box">
                <div class="item" v-for="(item, index) in roleList" :key="index"><span>{{ index + 1 }}.</span>
                    {{ item.description }}
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="roleVisible = false">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>
<script>
import {mapState} from "vuex";
import modalJIfenDuihuan from "@/components/jifen/modalJIfenDuihuan.vue";

export default {
    name: "pointsMall",
    components: {
        modalJIfenDuihuan
    },
    data() {
        return {
            roleVisible: false,
            selectTab: {title: "全部", status: "0"},
            count: 0,
            pagination: {
                page: 1,
                pageNum: 10,
            },
            list_goods: [],
            roleList: []
        };
    },
    computed: {
        ...mapState(["baseInfo"]),

        list_tab() {
            return [
                {title: "全部", status: "0"},
                {title: "收入", status: "1"},
                {title: "支出", status: "2"},
            ];
        },
    },
    watch: {
        selectTab() {
            this.setView();
        },
    },
    created() {
        this.$store.dispatch("query_user");
        this.setView();
        this.getRole();
    },

    mounted() {
    },

    methods: {
        setView() {
            //积分商品
            this.$api("jiFen_plist", {
                ...this.pagination,
            }).then((res) => {
                let {code, data, pages, message} = res;
                this.list_goods = data.list;
                this.count = data.count;
            });
        },

        openInvite() {
            this.$refs.modalInviteUser.init();
        },

        //积分兑换
        onClick_duihuan(item) {
            //console.log("积分兑换");
            this.$router.push('/pointsMallDetail?id=' + item.inventoryId);
        },
        go_url() {
            this.$router.push("/pointsDetail");
        },
        getRole() {
            this.$api("news_lists", {
                channelId: 44,
            }).then((res) => {
                this.roleList = res.data.list
            });
        },
        role() {
            this.roleVisible = true;
        }
    },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding: 0;
  width: 100%;
  background-color: #FCF8F4;
  padding-bottom: 48px;

  .top-img {
    background: url("~@/static/prod/pointsMall.png") no-repeat;
    height: 545px;
  }

  .page-ctx {
    position: relative;
    width: 1200px;
    margin: -182px auto 0;

    padding-top: 28px;
    .flex();
    flex-direction: column;
    background: linear-gradient(to bottom, transparent -5%, white);
  }
}

.yue-box {
  width: 1140px;
  height: 104px;
  border-radius: 8px;
  position: relative;
  background-color: #FEE7D1;
  padding-left: 40px;
  flex-direction: column;
  .flex-center();
  align-items: flex-start;

  .text-box {
    text-align: left;

    .text-1 {
      font-size: 16px;
      font-weight: 400;
      line-height: 40px;
      color: #3D4248;
    }

    .text-2 {
      margin-top: 10px;

      font-size: 40px;
      font-weight: bold;
      line-height: 40px;
      color: #FC1D18;

      .currency {
        font-size: 18px;
      }
    }

    .text-3 {
      position: absolute;
      right: 24px;
      bottom: 20px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 16px;
      color: #3D4248;

      span:nth-child(2) {
        margin: 0 10px;
      }
    }
  }
}

.wrap {
  width: 100%;
  padding: 27px;
  background: linear-gradient(to bottom, transparent -90%, white);
}

.bottom-info {
  margin-bottom: 50px;
}

.good-list {
  .flex();
  flex-wrap: wrap;
  margin-top: 20px;

  .item {
    width: 217px;
    height: 292px;
    background: #FFFFFF;
    box-shadow: 0px 0 6px 1px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    .flex();
    flex-direction: column;
    margin-bottom: 34px;
    margin-right: 14px;

    &:nth-child(5n) {
      margin-right: 0;
    }

    .img-box {
      img {
        margin-top: 15px;
        width: 160px;
        height: 160px;
      }
    }

    .info {
      text-align: left;
      padding: 5px 15px 15px;
      .flex();
      flex-direction: column;


      .title {
        .ellipsis-1();
        width: 100%;
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 16px;
        color: #3D4248;
      }

      .duihuan-info {
        margin-top: 20px;
        .flex();
        justify-content: center;
        align-items: center;
        width: 189px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        background: #FFF1EB;
        border-radius: 21px 21px 21px 21px;
        border: 1px solid #FFBAA3;

        .jifen {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #FF6821;

          b {
            color: #FF6821;
            font-weight: normal;
          }
        }
      }


      button {
        font-family: Roboto, Roboto;
        font-weight: 400;
        font-size: 14px;
        color: #FF6821;
      }
    }
  }
}

.text-box {
  .item {
    margin-bottom: 10px;

    span {
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }
  }
}
</style>

