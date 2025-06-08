<template>
  <div class="page">
    <div class="main-title">
      <span>我的活动报名</span>
    </div>

    <div class="page-ctx">
      <div class="mess-list">
        <div
          class="activityCard"
          v-for="(item, index) in messList"
          :key="index"
        >
          <div>
            <img class="topImg" :src="item.url" alt="" />
          </div>
          <div class="cardContent">
            <div class="activeTitle">{{ item.title }}</div>
            <div class="activeTime">
              <img class="activeIcon" src="@img/ellsenn/time.png" alt="" />
              <div>活动时间：{{ item.time }}</div>
            </div>
            <div class="activeLocation">
              <img class="activeIcon" src="@img/ellsenn/location.png" alt="" />
              <div class="activeLocationText">
                活动地点：{{ item.location }}
                <img src="@/assets/home/icon1.png" alt="" />
              </div>
            </div>
            <div class="activeBtn">
              <div class="activeBtnLeft">实付：¥88</div>
              <div class="activeBtnCenter">已完成报名</div>
              <div class="activeBtnRight">查看核销码</div>
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
  name: "servicePage",
  components: {},
  data() {
    return {
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
        page_num: 10,
      },
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
      this.$api("index_getFeedback", {
        ...this.pagination,
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
    border-bottom: 1px solid #DBDEE4;
    .topImg {
      width: 205px;
      height: 128px;
    }
    .cardContent {
      flex: 1;
      margin-left: 20px;
    }
    .activeTitle {
      font-family: Microsoft YaHei;
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
      font-family: Microsoft YaHei;
      font-size: 13px;
      color: #666666;
    }
    .activeLocation {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-family: Microsoft YaHei;
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
      font-family: Microsoft YaHei;
      font-size: 14px;
      color: #666666;
      gap: 30px;

      .activeBtnLeft {
        color: #E65C06;
      }
      .activeBtnCenter {
        color: #666;
      }
      .activeBtnRight {
        color: #005AAC;
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
