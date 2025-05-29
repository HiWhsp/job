<template>
  <div class="page">
    <div class="main-title">
      <div class="left">兑换记录</div>
    </div>

    <div class="page-ctx">
      <div class="wrap">
        <div class="inner">
          <div class="bottom-info">
            <div class="list-wrap">
              <div class="jilu-list">
                <div class="item item-title">
                  <div class="item-1">订单号</div>
                  <div class="item-2">兑换商品</div>
                  <div class="item-3">商品名称</div>
                  <div class="item-4">数量</div>
                  <div class="item-5">兑换时间</div>
                  <div class="item-6">剩余数量</div>
                </div>
                <div
                  class="item-box"
                  v-for="(item, index) in list_jilu"
                  :key="index"
                >
                  <div class="item item_other">
                    <div class="item-1">
                      <div class="text-1">
                        {{ item.orderNo }}
                      </div>
                    </div>
                    <div class="item-2">
                      <img :src="item.products[0].image" alt="" @click="to_product(item.products[0])" />
                    </div>
                    <div class="item-3">
                      {{ item.products[0].title }}
                    </div>
                    <div class="item-4">
                      {{ item.products[0].num }}
                    </div>
                    <div class="item-5">
                      {{ item.changeTime }}
                    </div>
                    <div class="item-6">
                      {{ item.hadNum }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="pagination-box" v-if="count">
                <el-pagination
                  background
                  layout="total, prev, pager, next"
                  :total="count"
                  :current-page="pagination.page"
                  :page-size="pagination.pageNum"
                  @current-change="mix_current_change"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "jifen-jilu",
  components: {},
  data() {
    return {
      list_jilu: [],

      pagination: {
        page: 1,
        pageNum: 10,
      },
      count: 0,
      info: {},
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "change_cardLogs",
          ...this.pagination,
          cardId: this.$route.query.id,
        },
      }).then((res) => {
        console.log(res);

        if (res.code == 200) {
          let data = res.data;
          this.info = data;
          this.list_jilu = data.list;
          this.count = data.count;
        }
      });
    },
    to_product(item) {
      this.$router.push({
        path: "/product-detail",
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #009f39;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 55px 32px;
    background: #fff;
  }
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}
.jilu-list {
  margin-bottom: 30px;
  border: 1px solid #e5e5e5;

  .item {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #666666;

    &:last-child {
    }
    &.item-title {
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #666666;
    }

    .item-1 {
      text-align: left;
      flex: 1;
      display: flex;
      align-items: center;

      .img-box {
        img {
          // width: 88px;
        }
      }

      .info-box {
        padding-left: 15px;
        .title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
          line-height: 24px;
        }
        .info {
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #999999;
        }
      }
    }
    .item-2 {
      width: 270px;
      img {
        cursor: pointer;
        width: 80px;
        height: 80px;
      }
    }
    .item-3 {
      width: 270px;
    }
    .item-4 {
      width: 270px;
    }
    .item-5 {
      width: 150px;
    }
    .item-6 {
      width: 150px;
    }
  }
}
</style>

<style
  scoped
  lang="less"
  src="@/assets/h5css/huodong/pointsDetail.less"
></style>
