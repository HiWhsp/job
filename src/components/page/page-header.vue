<template>
  <div class="page-header">
    <div class="header-container w-1600 flex-center">
      <!-- 左侧Logo和品牌名 -->
      <div class="header-left">
        <div class="logo">
          <div class="logo-emblem">
            <img src="@img/common/logo.png" alt="" />
          </div>
        </div>
      </div>

      <!-- 中间导航菜单 -->
      <div class="header-center">
        <!-- 默认导航 -->
        <nav class="navigation">
          <ul class="nav-list">
            <li class="nav-item" :class="{ active: $route.path === '/' }">
              <span class="nav-link" @click="handleNavClick('/')">首页</span>
            </li>

            <el-dropdown @command="handleDocumentCommand">
              <li
                class="nav-item"
                :class="{ active: $route.path === '/contractList' }"
              >
                <router-link to="/contractList" class="nav-link"
                  >文档中心</router-link
                >
              </li>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in vuex_document_tree"
                  :key="index"
                  :command="item.id"
                  >{{ item.title }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown @command="handleNewsCommand">
              <li class="nav-item" :class="{ active: $route.path === '/news' }">
                <router-link to="/news" class="nav-link">新闻资讯</router-link>
              </li>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in vuex_category_tree"
                  :key="index"
                  :command="item.id"
                  >{{ item.title }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown @command="handleAboutCommand">
              <li
                class="nav-item"
                :class="{ active: $route.path === '/about' }"
              >
                <router-link to="/about" class="nav-link">关于我们</router-link>
              </li>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="about">公司简介</el-dropdown-item>
                <el-dropdown-item command="contact">联系我们</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </ul>
        </nav>
        <div class="search-container">
          <el-input
            placeholder="请输入文档关键词"
            v-model="searchText"
            class="search-input"
            size="small"
          >
            <el-button
              class="btn-hover"
              slot="append"
              icon="el-icon-search"
              @click="handleSearch"
            ></el-button>
          </el-input>
        </div>
      </div>

      <!-- 右侧用户操作和联系信息 -->
      <div class="header-right">
        <button
          class="login-btn"
          v-if="!isLogin && !vuex_user.id"
          @click="goUrl('/login')"
        >
          <i class="user-icon"><img src="@img/common/avatar.png" alt="" /></i>
          <span>会员登陆 | 注册</span>
        </button>
        <button class="login-btn" v-else>
          <i class="user-icon"><img src="@img/common/avatar.png" alt="" /></i>
          <span @click="goUrl('/my/orders')">会员中心 |</span>
          <span @click="logout">退出</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "page-header",
  data() {
    return {
      isLogin: false,
      searchText: "",
    };
  },
  computed: {
    ...mapState(["vuex_document_tree", "vuex_category_tree"]),
  },
  mounted() {
    if (["/login", "/register", "/retrieve"].includes(location.pathname)) {
      this.isLogin = true;
    }
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleSearch() {
      // 这里可以添加搜索逻辑
      this.$router.push({
        path: "/contractList",
        query: {
          category: "",
          search: this.searchText,
          hash: Math.random().toString(36).substring(2, 15),
        },
      });
      this.searchText = "";
    },
    handleNewsCommand(command) {
      this.$router.push({
        path: "/news",
        query: {
          type: command,
        },
      });
    },
    handleDocumentCommand(command) {
      this.$router.push({
        path: "/contractList",
        query: {
          type: command,
        },
      });
    },
    handleAboutCommand(command) {
      this.$router.push({
        path: `/${command}`,
      });
    },
    goHome() {
      this.$router.push("/");
      this.isLogin = false;
    },
    handleNavClick(path) {
      if (path === "/" && location.pathname === "/") {
        this.searchText = "";
        window.location.reload();
        return;
      }
      this.$router.push(path);
    },
    goUrl(path) {
      this.$router.push(path);
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("vuex_user");
      this.$store.commit("set_vuex_user", {});
      this.$router.push("/");
      location.reload();
    },
  },
};
</script>

<style lang="less" scoped>
.page-header {
  background: #fff;
  height: 114px;
  box-shadow: 0px 3px 8px 1px rgba(0, 0, 0, 0.07);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-container {
  height: 100%;
  justify-content: space-between;
  padding: 8px 0;
}

// 左侧Logo和品牌名
.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  .logo-emblem {
    width: 384px;
    height: 69px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

// 中间导航菜单
.header-center {
  display: flex;
  align-items: center;
  width: 860px;
  .navigation {
    margin-right: 60px;
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 90px;
    }

    .nav-item {
      width: 80px;
      text-align: center;
      .nav-link {
        color: #333;
        text-decoration: none;
        font-size: 18px;
        font-weight: 500;
        padding: 10px 0;
        transition: color 0.3s ease;
        position: relative;
        cursor: pointer;

        &:hover {
          color: #0081ff;
        }
      }
      &.active {
        .nav-link {
          color: #0081ff;
          font-weight: bold;
          &::after {
            content: "";
            position: absolute;
            bottom: -35px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: #0081ff;
          }
        }
      }
    }
  }
  .search-container {
    width: 254px;
    height: 40px;
    border-radius: 23px 23px 23px 23px;
    border: 1px solid #c2c5ca;
    .search-input {
      width: 100%;
      height: 100%;
      /deep/ .el-input__inner {
        border-right: none;
        border: none;
        height: 100%;
        border-radius: 23px 23px 23px 23px;
      }

      /deep/ .el-input-group__append {
        background: #fff;
        border-radius: 0 8px 8px 0;
        border: none;
        color: #0081ff;
        border-radius: 0 23px 23px 0;
        .el-icon-search {
          font-size: 26px;
          color: #0081ff;
        }
      }
    }
  }
}

// 右侧用户操作和联系信息
.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.login-btn {
  background: #fff;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  .user-icon {
    width: 22px;
    height: 24px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  background: #ecf3ff;
  border-radius: 25px;
  width: 135px;
  height: 36px;

  font-weight: bold;
  font-size: 12px;
  color: #4e57d9;
  img {
    width: 36px;
    height: 36px;
  }
}

.user-info-content {
  .list {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dbdbdb;
    .user-info-item {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      font-weight: 400;
      font-size: 14px;
      color: #363130;
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
  .logout {
    padding-top: 10px;
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;
    color: #acacac;
    text-align: center;
  }
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.phone-icon {
  width: 24px;
  height: 24px;
  margin-right: 7px;

  img {
    width: 100%;
    height: 100%;
  }
}

.contact-text {
  .contact-label {
    color: #d32f2f;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.2;
  }

  .phone-number {
    color: #d32f2f;
    font-size: 32px;
    font-weight: bold;
    line-height: 1.2;
  }
}
</style>
