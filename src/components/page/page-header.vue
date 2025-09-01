<template>
  <div class="page-header">
    <div class="header-container w-1600 flex-center">
      <!-- 左侧Logo和品牌名 -->
      <div class="header-left">
        <div class="logo">
          <div class="logo-emblem">
            <span class="logo-text">法焰</span>
          </div>
        </div>
        <div class="brand-name">法律文书网</div>
      </div>

      <!-- 中间导航菜单 -->
      <div class="header-center">
        <nav class="navigation">
          <ul class="nav-list">
            <li class="nav-item">
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
          <i class="user-icon">👤</i>
          <span>登录/注册</span>
        </button>
        <div class="contact-info">
          <div class="phone-icon">📞</div>
          <div class="contact-text">
            <div class="contact-label">律师咨询电话(同微信)</div>
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
  }
</script>

<style lang="less" scoped>
.page-header {
  background: #fff;
  height: 80px;
  box-shadow: 0px 3px 8px 1px rgba(0,0,0,0.07);
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
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #ff9800, #ff5722);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .logo-text {
      color: #fff;
      font-weight: bold;
      font-size: 16px;
    }
  }
}

.brand-name {
  color: #d32f2f;
  font-size: 24px;
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
      gap: 40px;
    }

    .nav-item {
      .nav-link {
        color: #424242;
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        padding: 10px 0;
        transition: color 0.3s ease;
        position: relative;

        &:hover {
          color: #d32f2f;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #d32f2f;
          transition: width 0.3s ease;
        }

        &:hover::after {
          width: 100%;
        }
      }
    }
  }
}

// 右侧用户操作和联系信息
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.login-btn {
  background: linear-gradient(135deg, #e1bee7, #ce93d8);
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  color: #fff;
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
    font-size: 16px;
  }
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.phone-icon {
  font-size: 24px;
  color: #d32f2f;
}

.contact-text {
  .contact-label {
    color: #d32f2f;
    font-size: 12px;
    line-height: 1.2;
  }

  .phone-number {
    color: #d32f2f;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.2;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 20px;
  }

  .header-center .navigation .nav-list {
    gap: 20px;
  }

  .header-right {
    flex-direction: column;
    gap: 15px;
  }
}
</style>