<template>
  <div class="container">
    <div class="main">
      <div class="logo">
        <img src="@/assets/img/base/logo.jpg" alt="">
      </div>
      <div class="search">
        <div class="search-btn">
          <el-input placeholder="请输入关键词">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <div class="info">
        <div class="language">
          <span>中文</span>
          <i class="col"></i>
          <span>English</span>
        </div>
        <div class="operate pointer">
          <div class="btn-wrap">
            <div class="btn">阳光预付</div>
            <div class="btn">线上咨询</div>
          </div>
          <div class="login">
            <div class="login-btn pointer" @click="goUrl({url: '/login'})">登录</div>
            <i class="col"></i>
            <div class="register-btn pointer" @click="goUrl({url: '/register'})">注册</div>
            <i class="col"></i>
            <div class="login-btn pointer" @click="goUrl({url: '/login'})">登录</div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-content">
      <div class="nav-list">
        <div class="nav-item" v-for="(item, index) in navList" :key="index">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      navList: [{
        title: '首页',
        path: ''
      }, {
        title: '分析测试',
        path: ''
      }, {
        title: '智算服务',
        path: ''
      }, {
        title: '微纳加工',
        path: ''
      }, {
        title: '培训服务',
        path: ''
      }, {
        title: '专家队伍',
        path: ''
      }, {
        title: '论坛',
        path: ''
      }, {
        title: '公司信息',
        path: ''
      }]
    }
  },
  mounted() {
    // 监听页面滚动
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    goUrl() {
    },
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      // console.log(scrollTop);
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 175px;
  background-color: #fff;

  .main {
    width: 1400px;
    height: 125px;
    margin: 0 auto;
    padding: 24px 0;
    .flex();
    justify-content: space-between;

    .logo {
      width: 419px;
      height: 77px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .search {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: end;

      .search-btn {
        width: 411px;
        height: 41px;
      }

      .el-input {
        width: 100%;
        border: none;

        /deep/ .el-input-group__append {
          background-color: #eee;
          border: none;
          border-top-right-radius: 50px;
          border-bottom-right-radius: 50px;
          color: #fff;
          font-size: 18px;
        }

        /deep/ .el-input__inner {
          border-top-left-radius: 50px;
          border-bottom-left-radius: 50px;
          background-color: #eee;
          border: none;
        }

        /deep/ .el-button {
          width: 60px;
          height: 41px;
          background: #00479D;
          border-radius: 50px;
        }
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      align-items: end;
      justify-content: space-between;

      .language {
        .flex();

        span {
          cursor: pointer;
          font-family: Microsoft YaHei, Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #222222;
        }

        .col {
          display: inline-block;
          width: 1px;
          height: 14px;
          background-color: #707070;
          margin: 0 15px;
        }
      }

      .operate {
        .flex();
        margin-top: 20px;

        .btn-wrap {
          .flex();

          .btn {
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 50px;
            background-color: @theme;
            color: #fff;
            margin-right: 15px;
          }
        }

        .login {
          .flex();

          .login-btn {
            font-family: Microsoft YaHei, Microsoft YaHei;
            font-weight: 400;
            font-size: 14px;
            color: #222222;
          }

          .col {
            width: 1px;
            height: 16px;
            border: 1px solid #707070;
            margin: 0 7px;
          }
        }
      }
    }
  }

  .nav-content {
    width: 100%;
    height: 50px;
    background-color: #404040;

    .nav-list {
      width: 1400px;
      margin: 0 auto;
      height: 100%;
      .flex();

      .nav-item {
        cursor: pointer;
        width: 175px;
        height: 100%;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        border-right: 1px solid #707070;

        &:hover {
          color: #fff;
          background-color: @theme;
        }

        &:first-child {
          border-left: 1px solid #707070;
          border-right: 1px solid #707070;
        }
      }
    }
  }
}
</style>
