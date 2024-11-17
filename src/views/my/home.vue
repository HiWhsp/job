<script>
export default {
  name: "home"
}
</script>

<template>
  <div class="content">
    <div class="user-card">
      <!-- 顶部用户信息 -->
      <div class="user-header">
        <div class="user-info">
          <el-avatar
              src="https://via.placeholder.com/100"
              size="large"
              class="avatar"
          ></el-avatar>
          <div class="info-text">
            <p class="name">郭菲菲</p>
            <p class="phone">15200007777</p>
          </div>
        </div>
        <el-button type="primary" class="membership-btn">实名认证</el-button>
      </div>

      <!-- 底部财务信息 -->
      <div class="user-finance">
        <div class="finance-item">
          <p class="amount">500.00元</p>
          <p class="description">欠款金额</p>
          <p class="extra">剩余可用额度：1000.00元</p>
        </div>
        <div class="finance-item">
          <p class="amount">800.00元</p>
          <p class="description">可开票金额</p>
          <p class="extra">已开票待还款：500.00元</p>
        </div>
        <div class="finance-item">
          <p class="amount">777.00元</p>
          <p class="description">账户余额</p>
          <p class="extra">预付款：500.00元+赠送金200.00元</p>
        </div>
        <div class="finance-item">
          <p class="amount">800.00元</p>
          <p class="description">我的零钱包</p>
          <p class="extra">累计金额：5000.00元</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="less">
.user-card {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  font-family: Arial, sans-serif;

  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to right, #4a90e2, #007aff);
    border-radius: 8px;
    padding: 20px;
    color: #fff;

    .user-info {
      display: flex;
      align-items: center;

      .avatar {
        border: 2px solid #fff;
        margin-right: 15px;
      }

      .info-text {
        .name {
          font-size: 18px;
          font-weight: bold;
        }

        .phone {
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }

    .membership-btn {
      background: #fff;
      color: #007aff;
      border: none;
      font-weight: bold;
      border-radius: 5px;
    }
  }

  .user-finance {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;

    .finance-item {
      text-align: center;
      flex: 1;

      .amount {
        font-size: 20px;
        font-weight: bold;
        color: #333;
      }

      .description {
        font-size: 14px;
        color: #666;
      }

      .extra {
        font-size: 12px;
        color: #007aff;
        margin-top: 5px;
      }

      &:not(:last-child) {
        border-right: 1px solid #f0f0f0;
        padding-right: 10px;
      }
    }
  }
}
</style>