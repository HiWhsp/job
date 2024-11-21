<script>
export default {
  name: "afterSales"
}
</script>

<template>
  <div class="content">
    <div class="after-sale-service">
      <h3 class="section-title">订单售后服务</h3>

      <!-- 表单 -->
      <form class="service-form">
        <!-- 售后服务标题 -->
        <div class="form-item">
          <label for="service-title" class="form-label">售后服务标题：</label>
          <el-input
              type="text"
              id="service-title"
              placeholder="请输入"
          />
        </div>

        <!-- 售后服务描述 -->
        <div class="form-item">
          <label for="service-description" class="form-label">售后服务描述：</label>
          <el-input type="textarea"
                    rows="10"
                    id="service-description"
                    placeholder="请输入"
          ></el-input>
        </div>

        <!-- 提交按钮 -->
        <div class="form-item">
          <el-button type="primary" class="submit-btn">提交</el-button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="less">
.after-sale-service {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  //padding: 20px;

  .section-title {
    padding: 20px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 10px;
  }

  .service-form {
    padding: 0 190px 0 35px;

    .form-item {
      margin-bottom: 20px;

      .form-label {
        font-size: 14px;
        color: #555;
        margin-bottom: 15px;
        display: block;
      }

      .form-input,
      .form-textarea {
        width: 100%;
        padding: 10px;
        font-size: 14px;
        color: #333;
        border: 1px solid #dcdcdc;
        border-radius: 4px;

        &:focus {
          outline: none;
          border-color: #1890ff;
          box-shadow: 0 0 5px rgba(24, 144, 255, 0.3);
        }
      }

      .form-textarea {
        height: 80px;
        resize: none;
      }
    }

    .submit-btn {
      width: 100px;
      height: 40px;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      background-color: @theme;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #1677d1;
      }
    }
  }
}
</style>
