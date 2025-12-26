<template>
  <div class="page-footer">
    <div class="footer-content w-1600">
      <!-- 左侧联系信息 -->
      <div class="contact-section">
        <div class="contact-phone">
          <img src="@img/footer/phone.png" alt="" />
          <span class="phone-number-large">{{
            vuex_config.bottom_lawer_contact || vuex_config.mobile
          }}</span>
        </div>
        <div class="contact-details">
          <div class="contact-item">
            <img src="@img/footer/icon1.png" alt="" />
            <span
              >手机: 联系电话:
              {{
                vuex_config.bottom_lawer_contact || vuex_config.site_tel
              }}</span
            >
          </div>
          <div class="contact-item">
            <i class="el-icon-message contact-icon"></i>
            <span
              >邮箱:
              {{ vuex_config.bottom_lawer_email || vuex_config.email }}</span
            >
          </div>
          <div class="contact-item">
            <img src="@img/footer/icon2.png" alt="" />
            <span
              >地址:{{
                vuex_config.site_address || vuex_config.site_address
              }}</span
            >
          </div>
        </div>
      </div>

      <!-- 导航链接区域 -->
      <div class="nav-sections">
        <!-- 使用帮助 -->
        <div class="nav-section">
          <h3 class="nav-title">使用帮助</h3>
          <div class="nav-links">
            <router-link to="/member/login" class="nav-link"
              >会员登录</router-link
            >
            <router-link to="/member/register" class="nav-link"
              >会员注册</router-link
            >
            <router-link to="/payment/wechat" class="nav-link"
              >微信支付</router-link
            >
          </div>
        </div>

        <!-- 文档中心 -->
        <div class="nav-section">
          <h3 class="nav-title">文档中心</h3>
          <div class="nav-links">
            <router-link
              class="nav-link"
              v-for="(item, index) in vuex_document_tree"
              :key="index"
              :to="`/contractList?type=${item.id}`"
              >{{ item.title }}</router-link
            >
          </div>
        </div>

        <!-- 新闻资讯 -->
        <div class="nav-section">
          <h3 class="nav-title">新闻资讯</h3>
          <div class="nav-links">
            <router-link
              class="nav-link"
              v-for="(item, index) in vuex_category_tree"
              :key="index"
              :to="`/news?type=${item.id}`"
              >{{ item.title }}</router-link
            >
          </div>
        </div>

        <!-- 关于我们 -->
        <div class="nav-section">
          <h3 class="nav-title">关于我们</h3>
          <div class="nav-links">
            <router-link to="/about" class="nav-link">公司简介</router-link>
            <router-link to="/contact" class="nav-link">联系我们</router-link>
          </div>
        </div>
      </div>

      <!-- 右侧二维码 -->
      <div class="qr-codes">
        <div class="qr-item">
          <div class="qr-code">
            <!-- <img src="@/assets/img/footer/wechat-qr.png" alt="微信公众号" /> -->
          </div>
          <span class="qr-label">微信公众号</span>
        </div>
        <div class="qr-item">
          <div class="qr-code">
            <!-- <img src="@/assets/img/footer/miniprogram-qr.png" alt="小程序" /> -->
          </div>
          <span class="qr-label">小程序</span>
        </div>
      </div>
    </div>

    <!-- 底部版权信息 -->
    <div class="footer-bottom w-1600">
      <div class="copyright">
        <span
          >Copyright © {{ new Date().getFullYear() }}
          {{ vuex_config.site_name }} 版权所有</span
        >
        <span class="beian"
          >备案号:{{ vuex_config.beian || vuex_config.icp }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "PageFooter",
  computed: {
    ...mapState(["vuex_config", "vuex_document_tree", "vuex_category_tree"]),
  },
};
</script>

<style lang="less" scoped>
.page-footer {
  background: #fff;
  color: #333;
  padding-top: 60px;
  padding-bottom: 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 40px;
  border-bottom: 1px solid #e8e8e8;
}

// 左侧联系信息
.contact-section {
  flex: 0 0 280px;

  .contact-phone {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;

    img {
      width: 32px;
      height: 27px;
    }
    .phone-number-large {
      font-size: 24px;
      font-weight: bold;
      color: #0081ff;
    }
  }

  .contact-details {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
      img {
        width: 16px;
        height: 18px;
      }
      .contact-icon {
        font-size: 18px;
      }
    }
  }
}

// 导航链接区域
.nav-sections {
  flex: 1;
  display: flex;
  justify-content: space-around;
  gap: 40px;
  padding: 0 40px;

  .nav-section {
    flex: 1;

    .nav-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin: 0 0 20px 0;
      padding-bottom: 8px;
      &::after {
        content: "";
        display: block;
        width: 28px;
        height: 3px;
        background: #0081ff;
        margin-top: 10px;
      }
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .nav-link {
        font-size: 14px;
        color: #666;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: #0081ff;
        }
      }
    }
  }
}

// 右侧二维码
.qr-codes {
  flex: 0 0 200px;
  display: flex;
  gap: 20px;

  .qr-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;

    .qr-code {
      width: 100px;
      height: 100px;
      background: #f5f5f5;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .qr-label {
      font-size: 12px;
      color: #666;
    }
  }
}

// 底部版权信息
.footer-bottom {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .copyright {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 12px;
    color: #999;

    .beian {
      color: #999;
    }
  }
}

// 响应式设计
@media (max-width: 1400px) {
  .nav-sections {
    gap: 30px;
    padding: 0 20px;
  }
}

@media (max-width: 1200px) {
  .footer-content {
    flex-wrap: wrap;
    gap: 40px;
  }

  .contact-section {
    flex: 0 0 100%;
  }

  .nav-sections {
    flex: 0 0 100%;
    justify-content: flex-start;
  }

  .qr-codes {
    flex: 0 0 100%;
    justify-content: center;
  }
}
</style>
<style scoped lang="less" src="./style/h5-page-footer.less"></style>
