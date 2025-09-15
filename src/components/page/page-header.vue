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
        <div class="brand-name">法律文书网</div>
      </div>

      <!-- 中间导航菜单 -->
      <div class="header-center" v-if="!isLogin">
        <!-- 默认导航 -->
        <nav class="navigation" v-if="!isScrolled">
          <ul class="nav-list">
            <li class="nav-item active">
              <router-link to="/" class="nav-link">首页</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link">关于我们</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/business" class="nav-link"
                >业务范围</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link">联系我们</router-link>
            </li>
          </ul>
        </nav>

        <!-- 滚动后的导航 -->
        <div class="scrolled-navigation" v-if="isScrolled">
          <el-dropdown trigger="hover" class="nav-dropdown">
            <span class="nav-link">
              {{ $route.name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" @click.native="handleNavClick">
              <el-dropdown-item @click.native="handleNavClick('/')"
                >首页</el-dropdown-item
              >
              <el-dropdown-item @click.native="handleNavClick('/about')"
                >关于我们</el-dropdown-item
              >
              <el-dropdown-item @click.native="handleNavClick('/business')"
                >业务范围</el-dropdown-item
              >
              <el-dropdown-item @click.native="handleNavClick('/contact')"
                >联系我们</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown trigger="hover" class="nav-dropdown" @click.native="handleNavClick('/contractList/?ids=' + item.id)">
            <span class="nav-link">
              分类 <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in vuex_category_tree"
                :key="item.id"
                @click.native="handleNavClick('/contractList/?ids=' + item.id)"
                >{{ item.title }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>

          <div class="search-container">
            <el-input
              placeholder="请输入搜索内容"
              v-model="searchText"
              class="search-input"
              size="small"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              ></el-button>
            </el-input>
          </div>
        </div>
      </div>
      <div v-if="isLogin"></div>

      <!-- 右侧用户操作和联系信息 -->
      <div class="header-right">
        <button class="login-btn" v-if="!isLogin && !vuex_user.id" @click="goUrl('/login')">
          <i class="user-icon"><img src="@img/common/avatar.png" alt="" /></i>
          <span>登录/注册</span>
        </button>
        <el-popover placement="bottom" width="250" trigger="hover">
          <div class="user-info-content">
            <div class="list">
              <div class="user-info-item" @click="goUrl('/my?tab=1')">
                <img src="@img/common/order.png" alt="" />
                <span>我的订单</span>
              </div>
              <div class="user-info-item" @click="goUrl('/my?tab=2')">
                <img src="@img/common/my-down.png" alt="" />
                <span>我的下载</span>
              </div>
              <div class="user-info-item" @click="goUrl('/my?tab=3')">
                <img src="@img/common/my-collect.png" alt="" />
                <span>我的收藏</span>
              </div>
            </div>
            <div class="logout">
              <span @click="logout">退出登录</span>
            </div>
          </div>
          <div class="user-info" v-if="vuex_user.id" slot="reference">
            <img src="@img/common/avatar.png" alt="" />
            <span>{{ vuex_user.mobile || "13333333333" }}</span>
          </div>
        </el-popover>
        <button class="login-btn" v-if="isLogin && !vuex_user.id" @click="goHome">
          <span>返回首页</span>
        </button>
        <div class="contact-info">
          <div class="contact-text">
            <div class="contact-label flex-center">
              <div class="phone-icon">
                <img src="@img/index/phone.png" alt="" />
              </div>
              律师咨询电话(同微信)
            </div>
            <div class="phone-number">{{ vuex_config.bottom_lawer_contact || "18696628883" }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "page-header",
  data() {
    return {
      isScrolled: false,
      isLogin: false,
      searchText: "",
    };
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
    handleScroll() {
      this.isScrolled = window.scrollY > 100;
    },
    handleSearch() {
      console.log("搜索内容:", this.searchText);
      // 这里可以添加搜索逻辑
    },
    goHome() {
      this.$router.push("/");
      this.isLogin = false;
    },
    handleNavClick(path) {
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
    },
  },
};
</script>

<style lang="less" scoped>
.page-header {
  background: #fff;
  height: 80px;
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
    width: 65px;
    height: 65px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.brand-name {
  color: #d32f2f;
  font-size: 32px;
  font-weight: bold;
}

// 中间导航菜单
.header-center {
  .navigation {
    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 90px;
    }

    .nav-item {
      .nav-link {
        color: #424242;
        text-decoration: none;
        font-size: 18px;
        font-weight: 500;
        padding: 10px 0;
        transition: color 0.3s ease;
        position: relative;

        &:hover {
          color: #363130;
        }
      }
      &.active {
        .nav-link {
          font-weight: bold;
        }
      }
    }
  }

  // 滚动后的导航样式
  .scrolled-navigation {
    display: flex;
    align-items: center;
    gap: 30px;

    .nav-dropdown {
      .nav-link {
        color: #363130;
        font-size: 18px;
        font-weight: 500;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          color: #4e57d9;
          background-color: #f5f7fa;
        }
      }
    }

    .search-container {
      .search-input {
        width: 534px;
        height: 50px;

        /deep/ .el-input__inner {
          border-radius: 8px 0 0 8px;
          border-right: none;
          border: 1px solid #ced1db;
          height: 100%;
        }

        /deep/ .el-input-group__append {
          border-radius: 0 8px 8px 0;
          background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
          border: none;
          color: white;

          &:hover {
            background: linear-gradient(90deg, #4e57d9 0%, #519dff 100%);
          }
          .el-icon-search {
            font-size: 26px;
            color: white;
          }
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
  border: 1px solid #4e57d9;
  border-radius: 25px;
  padding: 12px 24px;
  color: #4e57d9;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .user-icon {
    width: 18px;
    height: 18px;
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
