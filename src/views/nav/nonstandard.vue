<script>
export default {
  name: "nonstandard",
  data() {
    return {
      formLabelAlign: {}
    }
  }

}
</script>

<template>
  <div class="page">
    <div class="nav-bar">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-wrap">
      <div class="title flex flex-center">
        <img src="../../static/home/19655.png" alt="">
        <p>DIY定制组件</p>
        <img src="../../static/home/19656.png" alt="">
      </div>
      <div class="form-content">
        <el-form :label-position="'top'" label-width="100px" :model="formLabelAlign">
          <div class="item flex flex-between">
            <el-form-item label="定制类型">
              <el-select v-model="formLabelAlign.name"></el-select>
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="formLabelAlign.region"></el-select>
            </el-form-item>
            <el-form-item label="型号">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
          </div>
          <div class="item flex flex-between">
            <el-form-item label="品牌">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item label="定制数量">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item label="尺寸或封装">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
          </div>
          <div class="item flex flex-between">
            <el-form-item label="交付时间">
              <el-date-picker v-model="formLabelAlign.type" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="期望单价">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item label="应用场景">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
          </div>
          <div class="item flex flex-between">
            <el-form-item label="应用场景">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <el-form-item label="应用场景">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
            <div style="width: 324px; opacity: 0;"></div>
          </div>
          <div class="item">
            <el-form-item label="备注">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formLabelAlign.type">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="btn">
        提交定制
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.content-wrap {
  width: 1200px;
  min-height: 764px;
  background: #FFFFFF;
  border-radius: 8px 8px 8px 8px;
  padding: 24px 60px 54px;
  margin-top: 20px;

  .title {
    height: 37px;

    img {
      width: 31px;
      height: 22px;
    }

    p {
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 36px;
      color: #333333;
      font-style: normal;
      text-transform: none;
      margin: 0 25px;
    }
  }

  .form-content {
    margin-top: 55px;

    .item {
      .el-form-item {
        margin-bottom: 0;
      }

      /deep/ .el-form-item__label {
        padding: 0;
      }

      /deep/ .el-form-item__content {
        width: 324px;
      }

      /deep/ .el-input__inner {
        width: 324px;
      }

    }
  }

  .btn {
    margin-top: 35px;
    width: 191px;
    height: 46px;
    background: @theme;
    font-family: Roboto, Roboto;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    line-height: 46px;
    text-align: center;
    font-style: normal;
    text-transform: none;
    border-radius: 4px 4px 4px 4px;
  }
}
</style>
