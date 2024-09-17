<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>帮助中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="inner flex flex-between">
      <div class="detail-content">
        <div class="nav-title">{{ current }}</div>
        <div class="html-box">
          购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容
          购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容
          购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容
          购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容
          购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容
          购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容购物流程介绍内容
        </div>
      </div>
      <div class="right-box">
        <div class="nav-title">帮助中心</div>
        <div class="nav-item" v-for="(item, index) in list" :key="index">
          <p class="item-title pointer">{{ item.title }}</p>
          <div class="item pointer" :class="{'active': current === it.title}" v-for="(it, i) in item.list" :key="i"
               @click="currentChange(it)">
            <p class="text">{{ it.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "helpCenter",
  components: {},
  data() {
    return {
      current: '',
      list: [
        {
          title: "购物指南",
          list: [
            {
              title: "购物流程",
              url: "",
            },
            {
              title: "关于报价",
              url: "",
            },
          ]
        },
        {
          title: "支付方式",
          list: [
            {
              title: "微信支付",
              url: "",
            },
            {
              title: "支付宝支付",
              url: "",
            },
            {
              title: "线下转款",
              url: "",
            }
          ]
        }
      ],
    };
  },

  beforeRouteUpdate(to, from, next) {
    next({
      query: to.query,
    });
  },
  created() {
    this.current = this.list[0].list[0].title;
  },
  methods: {
    currentChange(row) {
      this.current = row.title;
    }
  },
};
</script>


<style scoped lang="less">
.page {
  text-align: center;
  font-size: 14px;

  .inner {
    width: 100%;
    margin-top: 21px;
    align-items: start;

    .right-box {
      width: 300px;
      height: 481px;
      background: #FFFFFF;
      border-radius: 4px;
      padding: 18px;
      text-align: left;

      .nav-title {
        position: relative;
        padding-left: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 20px;
        color: #000000;
      }

      .nav-title::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 6px;
        background-color: @theme;
      }

      .nav-item {
        margin-top: 22px;

        p {
          width: 264px;
          height: 45px;
          line-height: 45px;
          border-radius: 4px;
          padding-left: 14px;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 16px;
          color: #000000;
        }

        .item-title {
          background: #F2F5F9;
        }

        .item {
          margin-top: 10px;
          border-bottom: 1px solid #E5E5E5;
          border-radius: 4px;
        }

        .active p {
          background: @theme;
          color: #FFFFFF !important;
        }
      }
    }

    .detail-content {
      width: 877px;
      min-height: 1198px;
      background: #FFFFFF;
      border-radius: 4px 4px 4px 4px;
      padding: 30px;

      .nav-title {
        position: relative;
        padding-left: 14px;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 20px;
        color: #000000;
        text-align: left;
      }

      .nav-title::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 6px;
        background-color: @theme;
      }

      .html-box {
        margin-top: 40px;
        text-align: left;
      }
    }
  }
}
</style>
