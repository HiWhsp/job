<script>
export default {
  name: "detail",
  data() {
    return {
      process: 1,
      remarkDialogVisible: false, // 备注
      updateResultVisible: false, // 上传结果
      dissentDialogVisible: false, // 异议
      settlementDialogVisible: false, // 申请结算
      updateResultType: 0,
      settlementRruleForm: {}, // 结算
      settlementRules: {}, // 结算
    }
  },
  computed: {
    typeType() {
      switch (this.process) {
        case '1':
          return '待寄送'
        case '2':
          return '待接单'
        case '3':
          return '待完成'
        case '4':
          return '待上传结果订单'
        case '5':
          return '已取消'
        case '6':
          return '待审核结果订单'
        case '7':
          return '已完成订单'
        case '8':
          return '复测订单'
        case '9':
          return '待结算订单'
        case '10':
          return '样品回收订单'
        case '11':
          return '差评'
        case '12':
          return '已超期'
      }
    }
  },
  mounted() {
    this.process = this.$route.query.type
  },
  methods: {
    goUrl(item) {
      this.$router.push(item.url)
    },
    // 备注
    remarkDialog() {
      this.remarkDialogVisible = true
    },
    // 已传结果
    updateResult() {
      this.updateResultVisible = true
    },
    // 报告提交
    updateResultSubmit() {
      this.updateResultType = 1
    },
    // 查看报告
    lockRealInfo() {
      this.updateResultType = 0
    },
    // 异议
    dissentDialog() {
      this.dissentDialogVisible = true
    },
    // 查看预约单
    checkDialog() {

    },
    // 申请结算
    applySettlement() {
      this.settlementDialogVisible = true;
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="status-item">
      <div class="status">
        <span>订单详情</span>
      </div>
      <div class="info">
        <p class="order-id">订单号：5456412312312</p>
        <p class="time">{{ typeType }}</p>
      </div>
    </div>
    <div class="address-item">
      <div class="sample-delivery">
        <h3 class="section-title">基本信息</h3>
        <div class="info-wrap">
          <div class="left-content">
            <p class="detail">
              <span>项目名称：</span>氧氮氢分析仪
            </p>
            <p class="detail">
              <span>仪器型号：</span>这里是仪器型号
            </p>
            <p class="detail">
              <span>订单收入：</span>2000.00元
            </p>
          </div>
          <div class="left-content">
            <p class="detail">
              <span>对接人：</span>徐老师
            </p>
            <p class="detail">
              <span>联系方式：</span>15931263165
            </p>
            <p class="detail">
              <span>寄送地址：</span>厦门市集美区杏林湾路465号1号楼2560单元
            </p>
          </div>
          <div class="left-content">
            <p class="detail">
              <span>样品状态：</span>待寄送
            </p>
            <p class="detail">
              <span>寄样时间：</span>-
            </p>
            <p class="detail">
              <span>完成时间：</span>-
            </p>
          </div>
          <div class="btn-wrap">
            <div class="btn" @click="checkDialog">
              查看预约单
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-item">
      <div class="order-requirements">
        <h3 class="section-title">订单要求</h3>
        <!-- 实验联系人 -->
        <div class="info-row">
          <span class="label">实验有问题联系人</span>
          <div class="content">
            联系人：郭菲菲 联系方式：15931263145 地址：北京市朝阳区数码庄园 .....
          </div>
        </div>
        <!-- 样品是否回收 -->
        <div class="info-row">
          <span class="label">样品是否回收</span>
          <div class="content">不需要回收</div>
        </div>
        <!-- 实验留言 -->
        <div class="info-row">
          <span class="label">实验留言</span>
          <div class="content">
            这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容这里是实验留言内容
          </div>
        </div>
      </div>
    </div>
    <div class="orderInfo-item">
      <div class="order-info">
        <h3 class="section-title">样品信息</h3>
        <p class="sample-info">A组样品，数量：1，样品编号：1</p>

        <!-- 表格 -->
        <table class="info-table">
          <tbody>
          <tr>
            <td class="label">样品主要成分</td>
            <td class="value">氯化锂</td>
          </tr>
          <tr>
            <td class="label">样品是否含有磁性元素，如铁钴镍等</td>
            <td class="value">否</td>
          </tr>
          <tr>
            <td class="label">样品形态</td>
            <td class="value">粉末</td>
          </tr>
          <tr>
            <td class="label">测试靶材</td>
            <td class="value">铜靶</td>
          </tr>
          <tr>
            <td class="label">扫描范围选择</td>
            <td class="value">常规（10-80度）</td>
          </tr>
          <tr>
            <td class="label">具体扫描角度范围（°）</td>
            <td class="value">10~50</td>
          </tr>
          <tr>
            <td class="label">扫描速度</td>
            <td class="value">10°/min</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!--   报告情况 -->
    <div class="order-item" v-if="['6','9','10','11'].includes(process)">
      <div class="order-requirements">
        <h3 class="section-title">报告情况</h3>
        <!-- 实验联系人 -->
        <div class="info-row">
          <span class="label">报告列表</span>
          <div class="content">
            <p>1、报告文件1</p>
            <p>2、仪器及结果说明</p>
          </div>
        </div>
        <!-- 样品是否回收 -->
        <div class="info-row" v-if="process == 6">
          <span class="label">审核状态</span>
          <div class="content">
            <p class="status-2">被驳回</p>
            <p>驳回原因：这里是一段驳回原因</p>
            <p class="edit">修改</p>
          </div>
        </div>
      </div>
    </div>
    <!--   样品回收情况 -->
    <div class="order-item" v-if="['10'].includes(process)">
      <div class="order-requirements">
        <h3 class="section-title">样品回收情况</h3>
        <div class="flex" style="align-items: start">
          <div style="flex: 1;">
            <div class="info-row">
              <span class="label">寄送地址</span>
              <div class="content">
                <p>这里是地址这里是地址这里是地址这里是地址这里是地址这里是地址这里是地址这里是地址</p>
              </div>
            </div>
            <div class="info-row">
              <span class="label">物流信息</span>
              <div class="content">
                <p>-</p>
              </div>
            </div>
            <div class="info-row">
              <span class="label">完成时间</span>
              <div class="content">
                <p>-</p>
              </div>
            </div>
          </div>
          <div class="info-row" style="flex: 1;">
            <span class="label">回收状态</span>
            <div class="content">
              <p class="status-1">待寄回分部</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--   结算情况 -->
    <div class="order-item" v-if="process == 7 || process == 11">
      <div class="order-requirements">
        <h3 class="section-title">结算情况</h3>
        <div class="flex" style="align-items: start">
          <div style="flex: 1;" class="info-row">
            <span class="label">结算信息</span>
            <div class="content">
              <p>结算账户：银行卡-对公户-中国工商银行厦大支行-1234567898887777-嘉庚创新实验室</p>
              <p>结算方式：对公户</p>
              <p>开户行：中国工商银行厦大支行</p>
              <p>账号：1234567898887777</p>
              <p>户名：嘉庚创新实验室</p>
            </div>
          </div>
          <div style="flex: 1;" class="info-row">
            <span class="label">结算状态</span>
            <div class="content">
              <p class="status-1">已结算</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--   差评/异议信息 -->
    <div class="order-item" v-if="['11'].includes(process)">
      <div class="order-requirements">
        <h3 class="section-title">差评/异议信息</h3>
        <div class="flex" style="align-items: start">
          <div style="flex: 1;">
            <div class="info-row">
              <span class="label">差评/异议描述</span>
              <div class="content">
                <p>这里是一段差评/异议信息描述...</p>
              </div>
            </div>
            <div class="info-row">
              <span class="label">处理状态</span>
              <div class="content">
                <p class="status-2">未处理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    操作-->
    <div class="operation" v-if="process == 3">
      <div class="btn back">收到样品</div>
      <div class="btn" @click="remarkDialog">备注</div>
      <div class="btn">问题反馈</div>
    </div>

    <div class="operation" v-if="process == 4">
      <div class="btn back">上传结果</div>
      <div class="btn" @click="updateResult">已传结果（1）</div>
      <div class="btn">分批测已完成</div>
      <div class="btn" @click="remarkDialog">备注</div>
      <div class="btn" @click="dissentDialog">问题反馈（1）</div>
    </div>

    <div class="operation" v-if="process == 6">
      <div class="btn back" @click="remarkDialog">备注</div>
    </div>
    <div class="operation" v-if="process == 8">
      <div class="btn back" @click="remarkDialog">备注</div>
      <div class="btn" @click="remarkDialog">已传结果（1）</div>
      <div class="btn" @click="remarkDialog">复测完成</div>
      <div class="btn" @click="remarkDialog">备注</div>
      <div class="btn" @click="remarkDialog">问题反馈（0）</div>
    </div>

    <div class="operation" v-if="process == 9">
      <div class="btn back" @click="applySettlement">申请结算</div>
      <div class="btn" @click="remarkDialog">备注</div>
    </div>

    <div class="operation" v-if="process == 10">
      <div class="btn back" @click="applySettlement">寄样</div>
      <div class="btn" @click="remarkDialog">备注</div>
    </div>

    <div class="operation" v-if="process == 11">
      <div class="btn back" @click="applySettlement">已处理</div>
      <div class="btn" @click="remarkDialog">备注</div>
    </div>
    <div class="operation" v-if="process == 12">
      <div class="btn back" @click="remarkDialog">备注</div>
    </div>

    <el-dialog title="备注" :visible.sync="remarkDialogVisible">
      <div class="dialog-title">
        <p><span>平台备注：</span>这里是一段平台备注</p>
        <p class="date">2024-08-20</p>
      </div>
      <div class="dialog-title">
        <p><span>供应商备注：</span>这里是一段平台备注</p>
        <p class="date">2024-08-20</p>
      </div>
      <el-input type="textarea" rows="10" placeholder="请在这里输入您的备注"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remarkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="remarkDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="上传报告" :visible.sync="updateResultVisible" center>
      <div class="updateResult" v-if="updateResultType === 0">
        <div class="title">
          <p>订单号：4545121232</p>
          <p>项目名称：氧氮氢分析仪</p>
        </div>
        <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture">
          <div class="upload-tit">点击上传报告 +</div>
        </el-upload>
        <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture">
          <div class="upload-tit">点击上传仪器测试结果 +</div>
        </el-upload>
      </div>

      <div class="success-content" v-if="updateResultType === 1">
        <img src="@/assets/img/my/success.png" alt="">
        <p>实名认证提交成功</p>
        <p class="tip">请耐心等待管理员审核！</p>
      </div>
      <span slot="footer" class="dialog-footer" v-if="updateResultType === 1">
         <el-button @click="lockRealInfo">查看报告</el-button>
        <el-button type="primary" @click="updateResultVisible = false">继续浏览</el-button>
      </span>
      <div slot="footer" class="dialog-footer" v-if="updateResultType === 0">
        <el-button @click="updateResultVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateResultSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提交异议" :visible.sync="dissentDialogVisible">
      <el-input type="textarea" rows="10" placeholder="请输入异议内容"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dissentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dissentDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="结算信息" :visible.sync="settlementDialogVisible" width="900px" center>
      <div class="settlement-box">
        <el-form :model="settlementRruleForm" :rules="settlementRules" ref="ruleForm" label-width="100px">
          <el-form-item label="结算账户：" prop="name">
            <el-select v-model="settlementRruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式：" prop="region">
            <el-input v-model="settlementRruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="开户行：" prop="region">
            <el-input v-model="settlementRruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="账号：" prop="region">
            <el-input v-model="settlementRruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="户名：" prop="region">
            <el-input v-model="settlementRruleForm.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="settlementDialogVisible = false">确定</el-button>
        <el-button @click="settlementDialogVisible = false">变更结算信息</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;

  .status-item {
    width: 100%;
    background-color: #fff;

    .status {
      display: flex;
      justify-content: space-between;
      padding: 0 40px 0;
      height: 60px;
      line-height: 60px;
      border: 1px solid #E8E8E8;

      span {
        font-weight: 400;
        font-size: 18px;
        color: #212529;
      }
    }

    .info {
      margin: 30px 130px;
      padding: 0 35px;
      display: flex;
      justify-content: space-between;
      height: 60px;
      line-height: 60px;
      background: #DFEEFF;

      .order-id, .time {
        font-weight: bold;
        font-size: 20px;
        color: #00479D;
      }

    }
  }

  .address-item {
    margin-top: 20px;
    width: 100%;
    padding: 0 130px;

    .sample-delivery {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: #fff;

      .section-title {
        width: 100%;
        padding-left: 35px;
        height: 63px;
        line-height: 63px;
        font-size: 18px;
        color: #000000;
        border-bottom: 1px solid #E5E5E5;
      }

      .info-wrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 20px 35px;

        .btn-wrap {
          .btn {
            cursor: pointer;
            width: 100px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: #00479D;
            border: 1px solid #00479D;

            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
          }
        }
      }

      .left-content {
        flex: 2;

        .delivery-method {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .detail {
          font-size: 14px;
          color: #818181;
          margin-top: 20px;

          span {
            //font-weight: bold;
          }
        }
      }
    }
  }

  .order-item {
    margin-top: 20px;
    width: 100%;
    background: #fff;
    padding: 0 130px;

    .order-requirements {
      padding-bottom: 30px;

      .section-title {
        padding-left: 35px;
        height: 63px;
        line-height: 63px;
        font-size: 18px;
        color: #000000;
        border-bottom: 1px solid #E5E5E5;
      }

      .info-row {
        min-height: 57px;
        display: flex;
        //border-bottom: 1px solid #f5f5f5;
        margin: 0 35px;

        &:last-child {
          border-bottom: none;
        }

        .label {
          flex: 0 0 180px; // 固定宽度
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          text-align: right;
          padding-right: 40px;
          margin-top: 15px;
        }

        .content {
          margin-top: 15px;
          font-weight: 400;
          font-size: 14px;
          color: #818181;

          p {
            margin-bottom: 10px;
          }

          .status-1 {
            color: #00A527;
          }

          .status-2 {
            color: #FF0000;
          }

          .edit {
            cursor: pointer;
            font-weight: 400;
            font-size: 14px;
            color: #00479D;
          }
        }
      }
    }
  }

  .orderInfo-item {
    width: 100%;
    background: #fff;
    margin-top: 20px;
    padding: 0 130px 30px;

    .order-info {
      .section-title {
        height: 63px;
        line-height: 63px;
        padding-left: 35px;
        color: #000;
        font-size: 18px;
        border-bottom: 1px solid #eaeaea;
      }

      .sample-info {
        margin-top: 30px;
        margin-bottom: 20px;
        padding: 0 35px;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
      }

      .info-table {
        margin: 0 35px;
        border-collapse: collapse;


        tbody {
          border: 1px solid #E8E8E8;

          tr {
            border-bottom: 1px solid #f5f5f5;

            &:last-child {
              border-bottom: none;
            }

            td {
              border: 1px solid #E8E8E8;
              padding: 10px 10px 10px 25px;
              font-size: 14px;

              &.label {
                width: 40%;
                font-weight: bold;
                color: #555;
              }

              &.value {
                color: #666;
              }
            }
          }
        }
      }
    }
  }

  .real-content {
    .tip {
      height: 44px;
      line-height: 44px;
      padding-left: 15px;
      background: #FFF5E5;
      border-radius: 3px;
      color: #FF8000;
    }

    .info {
      margin-top: 20px;
      padding-left: 15px;

      p {
        margin-bottom: 15px;
      }
    }

    .report {
      margin-top: 30px;
      padding-left: 15px;

      p {
        margin-bottom: 20px;

        span {
          margin-left: 10px;
          color: #00479D;
          cursor: pointer;
        }
      }
    }
  }

  .operation {
    width: 100%;
    padding: 30px 130px 50px;
    display: flex;
    justify-content: end;

    .btn {
      cursor: pointer;
      margin-right: 10px;
      width: 100px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border: 1px solid #00479D;

      font-weight: 400;
      font-size: 14px;
      color: #00479D;
    }

    .back {
      background: #00479D;
      color: #fff;
    }
  }

  .dialog-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    p {
      font-weight: 400;
      font-size: 16px;
      color: #333333;

      span {
        font-weight: 400;
        font-size: 16px;
        color: #FF0000;
      }

      &.date {
        font-weight: 400;
        font-size: 14px;
        color: #999999;
      }
    }
  }
}

.updateResult {
  padding: 0 250px 0 70px;

  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .upload-demo {
    margin-bottom: 20px;
  }

  .upload-tit {
    font-weight: 400;
    font-size: 14px;
    color: #00479D;
  }
}

.success-content {
  .flex();
  flex-direction: column;

  img {
    width: 320px;
    height: 225px;
  }

  p {
    font-weight: bold;
    font-size: 20px;
    color: #282828;
  }

  .tip {
    margin-top: 28px;
    font-weight: 400;
    font-size: 14px;
    color: #FF0000;
  }
}

.settlement-box {
  padding: 0 150px;
}

/deep/ .el-button--primary {
  background-color: #00479D;
  color: #fff;
  border-color: #00479D;
}
</style>
