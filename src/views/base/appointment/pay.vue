<script>
export default {
  name: "pay",
  data() {
    return {
      radioList: []
    };
  }
}
</script>

<template>
  <div class="container main">
    <div class="title">下单：原子力显微镜</div>
    <div class="content">
      <div class="item">
        <p class="label">是否曾与工作人员联系？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[0]">
              <el-radio :label="3">是</el-radio>
              <el-radio :label="6">否</el-radio>
            </el-radio-group>
          </div>
          <div class="info"></div>
        </div>
      </div>
      <div class="item">
        <p class="label">是否需要回收样品？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[1]">
              <el-radio :label="3">不回收</el-radio>
              <el-radio :label="6">回收</el-radio>
            </el-radio-group>
          </div>
          <div class="info"></div>
        </div>
      </div>
      <div class="item">
        <p class="label">实验有问题联系谁？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[0]">
              <el-radio :label="3">本人</el-radio>
              <el-radio :label="6">其他人 <span>（请填写实验人员联系方式，以便沟通实验信息）</span></el-radio>
            </el-radio-group>
          </div>
          <div class="info"></div>
        </div>
      </div>
      <div class="item">
        <p class="label">是否与之前的测试同设备？</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[0]">
              <el-radio :label="3">不需要/之前未在平台做过该测试</el-radio>
              <el-radio :label="6">需要</el-radio>
            </el-radio-group>
          </div>
          <div class="info"></div>
        </div>
      </div>
      <div class="item">
        <p class="label">加急服务</p>
        <div class="val">
          <div class="sel">
            <el-radio-group v-model="radioList[0]">
              <el-radio :label="3">3个工作日完成，1.5倍费用</el-radio>
              <el-radio :label="6">24小时完成，2倍费用</el-radio>
            </el-radio-group>
          </div>
          <div class="info"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 25px 0 70px;

  .title {
    height: 89px;
    line-height: 89px;
    background: #00479D;
    border-radius: 4px;
    font-weight: bold;
    font-size: 24px;
    color: #FFFFFF;
    padding-left: 35px;
  }

  .content {
    margin-top: 20px;
    background-color: #fff;
    padding: 54px 90px;

    .item {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .label {
        width: 220px;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
        text-align: right;
        margin-right: 100px;
      }

      .sel {
        .el-radio {
          min-width: 150px;

          /deep/ .el-radio__label {
            font-weight: 400;
            font-size: 16px;
            color: #333333;
          }
        }

        span {
          font-weight: 400;
          font-size: 14px;
          color: #818181;
        }
      }
    }
  }
}
</style>
