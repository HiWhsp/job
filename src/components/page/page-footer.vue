<template>
  <div class="page-footer">
    <div class="footer-content w-1600">
      <!-- 左侧公司信息 -->
      <div class="company-info">
        <div class="logo-section">
          <div class="company-details">
            <div class="logo-section">
              <div class="logo">
                <img src="@/assets/img/common/logo.png" alt="logo" />
              </div>
              <div class="right-logo">
                <h2 class="company-name">法律文书网</h2>
                <p class="slogan">海量合同文书 高效下载</p>
              </div>
            </div>

            <div class="contact-info">
              <div class="contact-item">
                <span class="contact-label">律师咨询电话 (同微信)</span>
                <div class="phone-section">
                  <img
                    class="phone-icon"
                    src="@/assets/img/index/footer-phone.png"
                    alt="phone"
                  />
                  <span class="phone-number">18696628883</span>
                </div>
              </div>
              <div class="contact-item">
                <div class="email-section">
                  <img
                    class="email-icon"
                    src="@/assets/img/index/footer-email.png"
                    alt="email"
                  />
                  <span class="email">851432731@qq.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧特色功能 -->
      <div class="features-section">
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon price-icon">🏷️</div>
            <span class="feature-text">价格优惠</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon quality-icon">💎</div>
            <span class="feature-text">海量精品</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon service-icon">🔧</div>
            <span class="feature-text">高质服务</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon efficiency-icon">👍</div>
            <span class="feature-text">提升效率</span>
          </div>
        </div>

        <!-- 导航链接 -->
        <div class="nav-links">
          <a href="#" class="nav-link">关于我们</a>
          <span class="separator">|</span>
          <a href="#" class="nav-link">业务范围</a>
          <span class="separator">|</span>
          <a href="#" class="nav-link">联系我们</a>
          <span class="separator">|</span>
          <a href="#" class="nav-link">帮助中心</a>
          <span class="separator">|</span>
          <a href="#" class="nav-link">平台协议</a>
        </div>
      </div>
    </div>

    <!-- 底部版权信息 -->
    <div class="footer-bottom w-1600">
      <div class="copyright">
        <span>copyright © 2025 重庆法焰科技有限公司</span>
        <span class="address">地址:重庆市南岸区南坪东路9号2025-S013</span>
      </div>
      <div class="infringement-notice">本站内容如有侵权,请联系18696628883</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageFooter",
};
</script>

<style lang="less" scoped>
.page-footer {
  background: url("../../assets/img/index/footer-bg.png") no-repeat center
    center;
  background-size: 100% 100%;
  color: #fff;
  height: 415px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.footer-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  padding: 43px 0 58px 0;
}

.company-info {
  height: 100%;
}

.company-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
  .logo {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right-logo {
    .company-name {
      font-size: 36px;
      font-weight: bold;
      color: #b8b8b8;
      margin-bottom: 8px;
    }

    .slogan {
      color: #b8b8b8;
      font-size: 16px;
    }
  }
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  .contact-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact-label {
    font-weight: 400;
    font-size: 22px;
    color: #9d9d9d;
  }

  .phone-section,
  .email-section {
    display: flex;
    align-items: center;
    gap: 8px;
    .phone-icon {
      width: 35px;
      height: 35px;
    }
    .email-icon {
      width: 19px;
      height: 19px;
    }
  }

  .phone-number {
    font-weight: 600;
    font-size: 40px;
    color: #9d9d9d;
  }

  .email {
    color: #9d9d9d;
    font-size: 14px;
  }
}

.features-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-text {
  color: #fff;
  font-size: 14px;
  text-align: center;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.nav-link {
  color: #999;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;

  &:hover {
    color: #fff;
  }
}

.separator {
  color: #666;
  font-size: 14px;
}

.footer-bottom {
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.copyright {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #999;
  font-size: 12px;
}

.address {
  color: #666;
}

.infringement-notice {
  color: #999;
  font-size: 12px;
}
</style>
