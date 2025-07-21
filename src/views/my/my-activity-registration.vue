<template>
  <div class="page">
    <div class="main-title">
      <span>我的活动报名</span>
    </div>

    <div class="page-ctx">
      <div class="mess-list">
        <div class="activityCard" v-for="(item, index) in messList" :key="index">
          <div>
            <img class="topImg" :src="item.thumb" alt="" />
          </div>
          <div class="cardContent">
            <div class="activeTitle">{{ item.title }}</div>
            <div class="activeTime">
              <img class="activeIcon" src="@img/ellsenn/time.png" alt="" />
              <div>活动时间：{{ item.start_time }}至{{ item.end_time }}</div>
            </div>
            <div class="activeLocation">
              <img class="activeIcon" src="@img/ellsenn/location.png" alt="" />
              <div class="activeLocationText">
                活动地点：{{ item.location }}
                <img src="@/assets/home/icon1.png" alt="" />
              </div>
            </div>
            <div class="activeBtn">
              <div class="activeBtnLeft">实付：¥{{ item.price }}</div>
              <div class="activeBtnCenter">
                {{ item.status == 2 ? "已完成报名" : "已核销" }}
              </div>
              <div class="activeBtnRight" @click="handleViewCode(item)">查看核销码</div>
            </div>
          </div>
        </div>
      </div>
      <el-pagination
        style="margin-top: 20px; text-align: center"
        v-if="total > 0"
        :total="total"
        layout="prev, pager, next"
        :current-page="pagination.page"
        @current-change="handleCurrentChange"
      />
      <el-empty description="暂无数据" v-if="messList.length === 0" />
    </div>

    <el-dialog
      :visible="dialogVisible"
      title="核销码"
      width="30%"
      @close="dialogVisible = false"
    >
      <img :src="dialogImageUrl" alt="核销码" style="width: 100%; height: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      messList: [
        {
          url: require("@img/ellsenn/i.png"),
          title: "2025年全球AI/AR智能眼镜智能制造高峰论坛",
          location: "北京XXXX万豪酒店",
          time: "2025-01-01 至 2025-04-03",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
      },
      total: 0,
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "getActivityOrder",
        method: "get",
        data: this.pagination,
      }).then((res) => {
        if (res.code == 200) {
          this.messList = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    handleCurrentChange(page) {
      this.pagination.page = page;
      this.setView();
    },
    handleViewCode(item) {
      // 查看核销码 弹框展示图片
      this.dialogVisible = true;
      this.dialogImageUrl = item.hexiaoma;
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
    font-family: OPPPSans;
    font-weight: bold;
    color: #000;
  }

  .page-ctx {
    min-height: 400px;
    margin-top: 14px;
    padding: 32px 32px 40px 32px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;
  }
}

.mess-list {
  .activityCard {
    height: 156px;
    box-sizing: border-box;
    padding-bottom: 26px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dbdee4;
    margin-bottom: 20px;
    .topImg {
      width: 205px;
      height: 128px;
    }
    .cardContent {
      flex: 1;
      margin-left: 20px;
    }
    .activeTitle {
      font-family: OPPPSans;
      font-size: 18px;
      color: #111111;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 这里是超出几行省略 */
      overflow: hidden;
    }
    .activeTime {
      margin: 26px 0px 11px 0px;
      display: flex;
      flex-direction: row;
      align-items: center;
      font-family: OPPPSans;
      font-size: 13px;
      color: #666666;
    }
    .activeLocation {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-family: OPPPSans;
      font-size: 13px;
      color: #666666;

      .activeLocationText {
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
          margin-left: 5px;
          width: 16px;
        }
      }
    }

    .activeBtn {
      cursor: pointer;
      margin-top: 25px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: end;
      font-family: OPPPSans;
      font-size: 14px;
      color: #666666;
      gap: 30px;

      .activeBtnLeft {
        color: #e65c06;
      }
      .activeBtnCenter {
        color: #666;
      }
      .activeBtnRight {
        color: #005aac;
      }
    }
    .activeIcon {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
  }
}
</style>
