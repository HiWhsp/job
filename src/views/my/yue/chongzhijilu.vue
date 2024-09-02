<template>
  <div class="page">
    <div class="main-title">
      <div class="left">充值记录</div>
      <div class="right" @click="$router.push('/yue')">
        <img src="/common/jifen-mingxi.png" alt="" />
        <span>我的余额</span>
      </div>
    </div>

    <div class="wrap">
      <div class="inner">
        <div class="bottom-info">
          <div class="list-wrap">
            <div class="jilu-list" v-if="list.length">
              <div class="item" v-for="(item, index) in list" :key="index">
                <div class="left">
                  <img src="/common/yue-icon.png" alt />
                </div>
                <div class="right">
                  <div class="text-1">
                    <div class="remark">充值</div>
                    <div class="date">{{ item.dtTime }}</div>
                  </div>
                  <div class="text-2">+{{ item.money }}</div>
                </div>
              </div>
            </div>

            <el-empty v-if="!list.length" description="暂无数据..."></el-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "yue-jilu",
  components: {},
  data() {
    return {
      list: [],
      pagination: {
        page: 1, //当前页
        pageNum: 2000, //每页数量
      }, //分页器
    };
  },
  computed: {
    ...mapState(["baseInfo"]),
  },
  watch: {
    selectTab() {
      this.setView();
    },
  },
  created() {
    this.setView();
  },

  methods: {
    setView() {
      this.$api("users_rechargeRecord", {
        ...this.pagination,
      }).then((res) => {
        let { code, data, msg} = res;
        if (code == 200) {
          this.list = data.list;
        }
      });
    },
  },
};
</script>


<style scoped lang="less">
.page {
  .main-title {
    .flex-between();
    margin-bottom: 20px;
    text-align: left;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 20px;
    color: #333333;

    .left {
    }
    .right {
      cursor: pointer;
      .flex();
      img {
        margin-right: 15px;
        width: 16px;
      }
      span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #222222;
      }
    }
  }
}
.wrap {
  .inner {
    padding: 0;
  }
}

.bottom-info {
  margin-top: 20px;
  margin-bottom: 50px;
}
.jilu-list {
  text-align: left;
  .item {
    background: #ffffff;
    padding: 15px;
    margin-bottom: 10px;
    .flex();
    .left {
      img {
        width: 45px;
      }
    }
    .right {
      flex: 2;
      padding-left: 25px;

      .flex();

      .text-1 {
        flex: 2;
        .remark {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 21px;
          color: #333333;
        }

        .date {
          margin-top: 10px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 19px;
          color: #7d7d7d;
        }
      }
      .text-2 {
        min-width: 70px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 31px;
        color: #f13f17;
      }
    }
  }
}
</style>
