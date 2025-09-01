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
      <div class="header-center">
        <nav class="navigation">
          <ul class="nav-list">
            <li class="nav-item active">
              <a href="#" class="nav-link">首页</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">关于我们</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">业务范围</a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">联系我们</a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- 右侧用户操作和联系信息 -->
      <div class="header-right">
        <button class="login-btn">
          <i class="user-icon"><img src="@img/common/avatar.png" alt="" /></i>
          <span>登录/注册</span>
        </button>
        <div class="contact-info">
          <div class="contact-text">
            <div class="contact-label flex-center">
              <div class="phone-icon">
                <img src="@img/index/phone.png" alt="" />
              </div>
              律师咨询电话(同微信)
            </div>
            <div class="phone-number">18696628883</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "page-header",
};
</script>

<style lang="less" scoped>
.page-header {
  background: #fff;
  height: 80px;
  box-shadow: 0px 3px 8px 1px rgba(0, 0, 0, 0.07);
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
